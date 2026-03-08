import type { DiseaseState, Subcategory, DrugMonograph, NavStateKey } from "./types";
import React from "react";
import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { DISEASE_STATES } from "./data";
import { NAV_STATES, makeStyles, getLineStyle, aeCard, aeLabel, applyThemeVars } from "./styles/constants";
import { usePersistedState } from "./utils/persistence";
import {
  Section, Toast, CopyBtn, AllergyModal, AllergyWarning, checkAllergyMatch,
  CompareView, EmpiricTierView, CrossRefBadges, AuditView,
  DisclaimerModal,                    // ← NEW
} from "./components";

const ALL_MONOGRAPHS = (() => { const seen = new Set(); const list = []; DISEASE_STATES.forEach(ds => { ds.drugMonographs?.forEach(dm => { if (!seen.has(dm.id)) { seen.add(dm.id); list.push({ ...dm, parentDisease: ds }); } }); }); return list.sort((a, b) => a.name.localeCompare(b.name)); })();
const TOTAL_SUBCATEGORIES = DISEASE_STATES.reduce((n, ds) => n + (ds.subcategories?.length || 0), 0);
const MONOGRAPH_XREF = (() => { const map = {}; DISEASE_STATES.forEach(ds => { ds.drugMonographs?.forEach(dm => { if (!map[dm.id]) map[dm.id] = []; map[dm.id].push(ds); }); }); return map; })();
const findMonograph = (drugId) => { for (const ds of DISEASE_STATES) { const m = ds.drugMonographs?.find(dm => dm.id === drugId); if (m) return { monograph: m, disease: ds }; } return null; };

const SEARCH_INDEX = (() => {
  const entries = [];
  DISEASE_STATES.forEach(ds => {
    entries.push({ type: "disease", data: ds, text: [ds.name, ds.overview?.definition, ds.category].filter(Boolean).join(" ").toLowerCase() });
    ds.subcategories?.forEach(sc => {
      const texts = [sc.name, sc.definition, ...(sc.pearls || [])];
      sc.empiricTherapy?.forEach(t => { texts.push(t.line); t.options.forEach(o => { texts.push(o.notes || ""); texts.push(o.regimen || ""); }); });
      sc.organismSpecific?.forEach(o => { texts.push(o.organism); texts.push(o.notes || ""); texts.push(o.preferred || ""); });
      entries.push({ type: "subcategory", data: sc, disease: ds, text: texts.filter(Boolean).join(" ").toLowerCase(),
        matchClassify: (q) => { if ((sc.name || "").toLowerCase().includes(q) || (sc.definition || "").toLowerCase().includes(q)) return "name"; if (sc.pearls?.some(p => p.toLowerCase().includes(q))) return "pearl"; return "empiric"; }
      });
      sc.organismSpecific?.forEach(org => { entries.push({ type: "organism", data: org, subcategory: sc, disease: ds, text: [org.organism, org.notes, org.preferred, org.alternative].filter(Boolean).join(" ").toLowerCase() }); });
    });
    ds.drugMonographs?.forEach(dm => {
      const texts = [dm.name, dm.brandNames, dm.drugClass, dm.spectrum, dm.mechanismOfAction, ...(dm.pharmacistPearls || []), ...(dm.drugInteractions || [])];
      entries.push({ type: "drug", data: dm, disease: ds, text: texts.filter(Boolean).join(" ").toLowerCase() });
    });
  });
  return entries;
})();

const RENAL_RANGES = [{ label: "Normal (>50)", min: 50, max: Infinity }, { label: "30–50", min: 30, max: 50 }, { label: "10–29", min: 10, max: 29 }, { label: "<10 / HD", min: 0, max: 10 }];

function stateToHash(navState, disease, subcategory, monograph) {
  if (navState === "audit") return "#/audit";
  if (navState === NAV_STATES.COMPARE) return "#/compare";
  if (navState === NAV_STATES.MONOGRAPH && monograph && disease) return `#/${disease.id}/drug/${monograph.id}`;
  if (navState === NAV_STATES.SUBCATEGORY && subcategory && disease) return `#/${disease.id}/${subcategory.id}`;
  if (navState === NAV_STATES.DISEASE_OVERVIEW && disease) return `#/${disease.id}`;
  return "#/";
}
function hashToState(hash) {
  const parts = (hash || "").replace("#/", "").split("/").filter(Boolean);
  if (parts.length === 0) return { nav: NAV_STATES.HOME };
  if (parts[0] === "compare") return { nav: NAV_STATES.COMPARE };
  if (parts[0] === "audit") return { nav: "audit" };
  const disease = DISEASE_STATES.find(ds => ds.id === parts[0]);
  if (!disease) return { nav: NAV_STATES.HOME };
  if (parts.length === 1) return { nav: NAV_STATES.DISEASE_OVERVIEW, disease };
  if (parts[1] === "drug" && parts[2]) { const monograph = disease.drugMonographs?.find(dm => dm.id === parts[2]); if (monograph) return { nav: NAV_STATES.MONOGRAPH, disease, monograph }; }
  const subcategory = disease.subcategories?.find(sc => sc.id === parts[1]);
  if (subcategory) return { nav: NAV_STATES.SUBCATEGORY, disease, subcategory };
  return { nav: NAV_STATES.DISEASE_OVERVIEW, disease };
}
async function copyToClipboard(text) { try { await navigator.clipboard.writeText(text); return true; } catch { const ta = document.createElement("textarea"); ta.value = text; ta.style.cssText = "position:fixed;opacity:0"; document.body.appendChild(ta); ta.select(); const ok = document.execCommand("copy"); document.body.removeChild(ta); return ok; } }

export default function PharmRef() {
  const [navState, setNavState] = useState(NAV_STATES.HOME);
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedMonograph, setSelectedMonograph] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [expandedSections, setExpandedSections] = useState({});
  const [showTopBtn, setShowTopBtn] = useState(false);
  const searchRef = useRef(null);
  const isHashNav = useRef(false);
  const [theme, setTheme] = usePersistedState("theme", "dark");
  const [favorites, setFavorites] = usePersistedState("favorites", []);
  const [recents, setRecents] = usePersistedState("recents", []);
  const [allergies, setAllergies] = usePersistedState("allergies", []);
  const [renalFilter, setRenalFilter] = usePersistedState("renalFilter", null);
  const [readingMode, setReadingMode] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);
  const [searchActiveIdx, setSearchActiveIdx] = useState(-1);
  const [focusSection, setFocusSection] = useState(null);
  const [showAllergyModal, setShowAllergyModal] = useState(false);
  const [allergyInput, setAllergyInput] = useState("");
  const [allergySeverity, setAllergySeverity] = useState("mild");
  const [compareItems, setCompareItems] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  const S = useMemo(() => makeStyles(theme), [theme]);

  useEffect(() => { applyThemeVars(theme); }, [theme]);

  // NEW: Auto-follow system dark/light preference on first visit only
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (localStorage.getItem('theme') === null) {
        setTheme(media.matches ? 'dark' : 'light');
      }
    };
    media.addEventListener('change', handleChange);
    handleChange();
    return () => media.removeEventListener('change', handleChange);
  }, [setTheme]);

  // ... (all your existing useEffect hooks remain exactly the same — I kept them untouched)

  // [the rest of your component (navigateTo, toggleSection, searchResults, etc.) stays 100% identical]

  // === HOME VIEW (only this section was updated with the toggle button) ===
  if (navState === NAV_STATES.HOME) {
    return (<Layout>
      {/* your existing header, search, disease grid, etc. — unchanged */}

      <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
        <button className="pr-card" style={{ ...S.card, cursor: "pointer", marginBottom: 0, padding: "14px 20px", display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: 600 }} onClick={() => { setCompareItems([]); navigateTo(NAV_STATES.COMPARE); }}>{"\u2696"} Compare Drugs</button>
        <button className="pr-card" style={{ ...S.card, cursor: "pointer", marginBottom: 0, padding: "14px 20px", display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: 600 }} onClick={() => setShowAllergyModal(true)}>{"\u26A0"} Allergy Profile {allergies.length > 0 && `(${allergies.length})`}</button>
        <button className="pr-card" style={{ ...S.card, cursor: "pointer", marginBottom: 0, padding: "14px 20px", display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: 600 }} onClick={() => navigateTo("audit")}>{"\uD83D\uDD0D"} Data Audit</button>
        
        {/* NEW: Theme toggle button */}
        <button
          className="pr-card"
          style={{ ...S.card, cursor: "pointer", marginBottom: 0, padding: "14px 20px", display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: 600 }}
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>

      {/* rest of your home view unchanged */}
      <div style={{ ...S.monographLabel, marginBottom: "10px", fontSize: "12px" }}>ALL DRUG MONOGRAPHS ({ALL_MONOGRAPHS.length})</div>
      {/* ... */}

      <DisclaimerModal S={S} />   {/* ← NEW */}
    </Layout>);
  }

  // === DISEASE OVERVIEW ===
  if (navState === NAV_STATES.DISEASE_OVERVIEW && selectedDisease) {
    // ... your existing code ...
    <DisclaimerModal S={S} />   {/* ← ADD THIS LINE before </Layout> */}
  }

  // === SUBCATEGORY ===
  if (navState === NAV_STATES.SUBCATEGORY && selectedSubcategory) {
    // ... your existing code ...
    <DisclaimerModal S={S} />   {/* ← ADD THIS LINE before </Layout> */}
  }

  // === MONOGRAPH ===
  if (navState === NAV_STATES.MONOGRAPH && selectedMonograph) {
    // ... your existing code ...
    <DisclaimerModal S={S} />   {/* ← ADD THIS LINE before </Layout> */}
  }

  // === AUDIT ===
  if (navState === "audit") {
    return (<Layout><button style={S.backBtn} onClick={() => navigateTo(NAV_STATES.HOME)}>{"\u2190"} Home</button><AuditView diseaseStates={DISEASE_STATES} findMonograph={findMonograph} S={S} /><DisclaimerModal S={S} /></Layout>);
  }

  // === LOADING ===
  return <Layout><p style={{ color: "#64748b", textAlign: "center", padding: "60px 0" }}>Loading{"\u2026"}</p><DisclaimerModal S={S} /></Layout>;
}