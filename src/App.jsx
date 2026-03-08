import React from "react";
import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { DISEASE_STATES } from "./data";
import { NAV_STATES, makeStyles, getLineStyle, aeCard, aeLabel, applyThemeVars } from "./styles/constants";
import { usePersistedState } from "./utils/persistence";
import {
  Section, Toast, CopyBtn, AllergyModal, AllergyWarning, checkAllergyMatch,
  CompareView, EmpiricTierView, CrossRefBadges, AuditView,
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

const RENAL_RANGES = [{ label: "Normal (>50)", min: 50, max: Infinity }, { label: "30\u201350", min: 30, max: 50 }, { label: "10\u201329", min: 10, max: 29 }, { label: "<10 / HD", min: 0, max: 10 }];

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
  useEffect(() => { const restore = () => { const s = hashToState(window.location.hash); isHashNav.current = true; setNavState(s.nav); setSelectedDisease(s.disease || null); setSelectedSubcategory(s.subcategory || null); setSelectedMonograph(s.monograph || null); setExpandedSections({}); setSearchQuery(""); setFocusSection(null); window.scrollTo?.(0, 0); setTimeout(() => { isHashNav.current = false; }, 50); }; restore(); window.addEventListener("popstate", restore); return () => window.removeEventListener("popstate", restore); }, []);
  useEffect(() => { const t = setTimeout(() => { setDebouncedQuery(searchQuery); setSearchActiveIdx(-1); }, 150); return () => clearTimeout(t); }, [searchQuery]);
  useEffect(() => { if (focusSection) { setExpandedSections(prev => ({ ...prev, [focusSection]: true })); setTimeout(() => { document.getElementById(`section-${focusSection}`)?.scrollIntoView({ behavior: "smooth", block: "start" }); setFocusSection(null); }, 100); } }, [focusSection, navState]);
  useEffect(() => { const handler = (e) => { if (e.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) { e.preventDefault(); searchRef.current?.focus(); } if (e.key === "Escape" && document.activeElement === searchRef.current) { searchRef.current?.blur(); if (searchQuery) setSearchQuery(""); } }; window.addEventListener("keydown", handler); return () => window.removeEventListener("keydown", handler); }, [searchQuery]);
  useEffect(() => { const handler = () => setShowTopBtn(window.scrollY > 400); window.addEventListener("scroll", handler, { passive: true }); return () => window.removeEventListener("scroll", handler); }, []);

  const showToast = useCallback((message, icon = "\u2139") => { clearTimeout(toastTimer.current); setToast({ message, icon, leaving: false }); toastTimer.current = setTimeout(() => { setToast(prev => prev ? { ...prev, leaving: true } : null); setTimeout(() => setToast(null), 300); }, 2500); }, []);
  const trackRecent = useCallback((item) => { setRecents(prev => [{ ...item, timestamp: Date.now() }, ...prev.filter(r => !(r.id === item.id && r.type === item.type))].slice(0, 10)); }, []);
  const navigateTo = useCallback((state, data = {}) => { setNavState(state); if (data.disease !== undefined) setSelectedDisease(data.disease); if (data.subcategory !== undefined) setSelectedSubcategory(data.subcategory); if (data.monograph !== undefined) setSelectedMonograph(data.monograph); setExpandedSections({}); setFocusSection(data.focusSection || null); setReadingMode(false); window.scrollTo?.(0, 0); if (state === NAV_STATES.MONOGRAPH && data.monograph) trackRecent({ id: data.monograph.id, name: data.monograph.name, diseaseId: data.disease?.id, type: "drug" }); else if (state === NAV_STATES.SUBCATEGORY && data.subcategory) trackRecent({ id: data.subcategory.id, name: data.subcategory.name, diseaseId: data.disease?.id, type: "subcategory" }); if (!isHashNav.current) { const hash = stateToHash(state, data.disease ?? selectedDisease, data.subcategory ?? selectedSubcategory, data.monograph ?? selectedMonograph); if (window.location.hash !== hash) window.history.pushState(null, "", hash); } }, [selectedDisease, selectedSubcategory, selectedMonograph, trackRecent]);
  const toggleSection = useCallback((id) => { if (!readingMode) setExpandedSections(prev => ({ ...prev, [id]: !prev[id] })); }, [readingMode]);
  const getCurrentSectionIds = useCallback(() => { if (navState === NAV_STATES.SUBCATEGORY) return ["presentation", "diagnostics", "empiric", "organism", "pearls"]; if (navState === NAV_STATES.MONOGRAPH) return ["moa", "spectrum", "dosing", "renal", "hepatic", "ae", "interactions", "monitoring", "pregnancy", "pharm-pearls"]; if (navState === NAV_STATES.DISEASE_OVERVIEW) return ["overview", "guidelines", "trials"]; return []; }, [navState]);
  const expandAll = useCallback(() => { const ids = getCurrentSectionIds(); setExpandedSections(prev => { const n = { ...prev }; ids.forEach(id => { n[id] = true; }); return n; }); }, [getCurrentSectionIds]);
  const collapseAll = useCallback(() => { const ids = getCurrentSectionIds(); setExpandedSections(prev => { const n = { ...prev }; ids.forEach(id => { n[id] = false; }); return n; }); }, [getCurrentSectionIds]);
  const toggleFavorite = useCallback((drugId, drugName, diseaseId) => { setFavorites(prev => prev.some(f => f.id === drugId) ? prev.filter(f => f.id !== drugId) : [...prev, { id: drugId, name: drugName, diseaseId }]); }, []);
  const isFavorite = useCallback((drugId) => favorites.some(f => f.id === drugId), [favorites]);
  const handleCopy = useCallback(async (text, id) => { if (await copyToClipboard(text)) { setCopiedId(id); showToast("Copied to clipboard", "\uD83D\uDCCB"); setTimeout(() => setCopiedId(null), 2000); } }, [showToast]);
  const addAllergy = useCallback(() => { if (!allergyInput.trim()) return; setAllergies(prev => prev.some(a => a.name.toLowerCase() === allergyInput.trim().toLowerCase()) ? prev : [...prev, { name: allergyInput.trim(), severity: allergySeverity }]); setAllergyInput(""); }, [allergyInput, allergySeverity]);
  const removeAllergy = useCallback((name) => { setAllergies(prev => prev.filter(a => a.name !== name)); }, []);

  const searchResults = useMemo(() => {
    if (!debouncedQuery.trim() || debouncedQuery.trim().length < 2) return null;
    const q = debouncedQuery.toLowerCase();
    const results = { drugs: [], organisms: [], subcategories: [], diseases: [] };
    const seen = { drugs: new Set(), subcats: new Set(), organisms: new Set() };
    for (const entry of SEARCH_INDEX) {
      if (!entry.text.includes(q)) continue;
      if (entry.type === "disease") { results.diseases.push(entry.data); }
      else if (entry.type === "subcategory") { const key = entry.disease.id + "-" + entry.data.id; if (!seen.subcats.has(key)) { seen.subcats.add(key); results.subcategories.push({ ...entry.data, parentDisease: entry.disease, matchType: entry.matchClassify(q) }); } }
      else if (entry.type === "organism") { const key = entry.disease.id + "-" + entry.subcategory.id + "-" + entry.data.organism; if (!seen.organisms.has(key)) { seen.organisms.add(key); results.organisms.push({ ...entry.data, parentSubcategory: entry.subcategory, parentDisease: entry.disease }); } }
      else if (entry.type === "drug" && !seen.drugs.has(entry.data.id)) { seen.drugs.add(entry.data.id); let ms = null; if ((entry.data.renalAdjustment || "").toLowerCase().includes(q)) ms = "renal"; else if ((entry.data.spectrum || "").toLowerCase().includes(q)) ms = "spectrum"; else if ((entry.data.mechanismOfAction || "").toLowerCase().includes(q)) ms = "moa"; else if (entry.data.drugInteractions?.some(di => di.toLowerCase().includes(q))) ms = "interactions"; else if (entry.data.pharmacistPearls?.some(p => p.toLowerCase().includes(q))) ms = "pharm-pearls"; results.drugs.push({ ...entry.data, parentDisease: entry.disease, matchSection: ms }); }
    }
    return results;
  }, [debouncedQuery]);
  const flatSearchResults = useMemo(() => { if (!searchResults) return []; return [...searchResults.drugs.map(d => ({ type: "drug", data: d })), ...searchResults.organisms.map(o => ({ type: "organism", data: o })), ...searchResults.subcategories.map(s => ({ type: "subcategory", data: s })), ...searchResults.diseases.map(d => ({ type: "disease", data: d }))]; }, [searchResults]);
  const handleSearchKeyDown = useCallback((e) => { if (!searchResults || flatSearchResults.length === 0) return; if (e.key === "ArrowDown") { e.preventDefault(); setSearchActiveIdx(prev => Math.min(prev + 1, flatSearchResults.length - 1)); } else if (e.key === "ArrowUp") { e.preventDefault(); setSearchActiveIdx(prev => Math.max(prev - 1, -1)); } else if (e.key === "Enter" && searchActiveIdx >= 0) { e.preventDefault(); const item = flatSearchResults[searchActiveIdx]; setSearchQuery(""); if (item.type === "drug") navigateTo(NAV_STATES.MONOGRAPH, { disease: item.data.parentDisease, monograph: item.data, focusSection: item.data.matchSection }); else if (item.type === "organism") navigateTo(NAV_STATES.SUBCATEGORY, { disease: item.data.parentDisease, subcategory: item.data.parentSubcategory }); else if (item.type === "subcategory") navigateTo(NAV_STATES.SUBCATEGORY, { disease: item.data.parentDisease, subcategory: item.data }); else if (item.type === "disease") navigateTo(NAV_STATES.DISEASE_OVERVIEW, { disease: item.data }); } }, [searchResults, flatSearchResults, searchActiveIdx, navigateTo]);
  const breadcrumbs = useMemo(() => { const crumbs = [{ label: "PharmRef", action: () => navigateTo(NAV_STATES.HOME) }]; if (navState === NAV_STATES.COMPARE) crumbs.push({ label: "Compare Drugs", action: null }); else { if (selectedDisease && navState !== NAV_STATES.HOME) crumbs.push({ label: selectedDisease.name, action: () => navigateTo(NAV_STATES.DISEASE_OVERVIEW, { disease: selectedDisease }) }); if (selectedSubcategory && navState === NAV_STATES.SUBCATEGORY) crumbs.push({ label: selectedSubcategory.name, action: null }); if (selectedMonograph && navState === NAV_STATES.MONOGRAPH) crumbs.push({ label: selectedMonograph.name, action: null }); } return crumbs; }, [navState, selectedDisease, selectedSubcategory, selectedMonograph, navigateTo]);

  const sectionProps = { expandedSections, toggleSection, readingMode, S };
  const copyProps = { copiedId, onCopy: handleCopy, S };
  const empiricProps = { S, navigateTo, NAV_STATES, findMonograph, copiedId, onCopy: handleCopy, allergies };

  const ExpandCollapseBar = () => (<div className="no-print" style={{ display: "flex", justifyContent: "flex-end", marginBottom: "8px", gap: "6px", flexWrap: "wrap" }}><button style={S.readingToggle} onClick={() => setReadingMode(r => !r)}>{readingMode ? "\uD83D\uDCD6 Exit Reading" : "\uD83D\uDCD6 Reading Mode"}</button><button style={S.expandAllBtn} onClick={() => window.print()}>{"\uD83D\uDDA8"} Print</button>{!readingMode && (<><button style={S.expandAllBtn} onClick={expandAll}>Expand All</button><button style={S.expandAllBtn} onClick={collapseAll}>Collapse All</button></>)}</div>);
  const QuickNav = ({ items }) => (<div className="no-print" style={S.quickNav}>{items.filter(i => i.show !== false).map(i => (<button key={i.id} className="qnav-pill" style={S.quickNavPill} onClick={() => { setExpandedSections(prev => ({ ...prev, [i.id]: true })); setTimeout(() => document.getElementById(`section-${i.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" }), 60); }}>{i.icon} {i.label}</button>))}</div>);
  const BackToTop = () => showTopBtn ? <button className="top-btn no-print" style={S.topBtn} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} title="Back to top">{"\u2191"}</button> : null;

  const Layout = ({ children, compact }) => (
    <div style={S.app} className={readingMode ? "reading-mode" : ""}>
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet" />
      <header style={S.header} className="no-print">
        <div style={S.headerTop}>
          <div style={S.logo} onClick={() => { setSearchQuery(""); navigateTo(NAV_STATES.HOME); }}><span>{"\u2695"}</span> PharmRef <span style={S.logoPill}>Rx</span></div>
          <div style={S.searchWrap}><span style={S.searchIcon}>{"\u2315"}</span><input ref={searchRef} className="search-input" style={{ ...S.searchBox, ...(compact ? { maxWidth: "300px" } : {}) }} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onKeyDown={handleSearchKeyDown} placeholder="Search drugs, organisms, pearls\u2026 (\u2191\u2193 navigate)" />{searchQuery ? <button style={S.clearBtn} onClick={() => setSearchQuery("")} title="Clear search (Esc)">{"\u2715"}</button> : <span style={S.kbdHint}>/</span>}</div>
          <div style={S.headerToolbar}><button style={{ ...S.themeToggle, ...(allergies.length > 0 ? { borderColor: "#f59e0b60", color: "#fbbf24" } : {}) }} onClick={() => setShowAllergyModal(true)} title="Allergy Profile">{allergies.length > 0 ? `\u26A0 ${allergies.length}` : "\u26A0"}</button><button style={S.themeToggle} onClick={() => setTheme(t => t === "dark" ? "light" : "dark")} title={theme === "dark" ? "Light mode" : "Dark mode"}>{theme === "dark" ? "\u2600" : "\uD83C\uDF19"}</button></div>
        </div>
        {navState !== NAV_STATES.HOME && !searchResults && (<div style={S.breadcrumbs}>{breadcrumbs.map((c, i) => (<span key={i} style={{ display: "flex", alignItems: "center", gap: "6px" }}>{i > 0 && <span style={{ color: "#475569" }}>{"\u203A"}</span>}{c.action ? <button style={S.breadcrumbLink} onClick={c.action}>{c.label}</button> : <span style={{ color: S.app?.color || "#e2e8f0" }}>{c.label}</span>}</span>))}</div>)}
      </header>
      <main style={S.main}>{children}</main>
      <BackToTop />
      <Toast toast={toast} S={S} />
      <AllergyModal show={showAllergyModal} onClose={() => setShowAllergyModal(false)} theme={theme} allergies={allergies} allergyInput={allergyInput} setAllergyInput={setAllergyInput} allergySeverity={allergySeverity} setAllergySeverity={setAllergySeverity} addAllergy={addAllergy} removeAllergy={removeAllergy} />
    </div>
  );

  // SEARCH RESULTS
  if (searchResults) {
    const total = searchResults.diseases.length + searchResults.subcategories.length + searchResults.drugs.length + searchResults.organisms.length;
    let flatIdx = 0;
    return (<Layout><p style={{ color: "#64748b", fontSize: "13px", marginBottom: "16px" }}>{total} result{total !== 1 ? "s" : ""} for "<span style={{ color: S.logo?.color || "#38bdf8" }}>{debouncedQuery}</span>" <span style={{ marginLeft: "12px", fontSize: "11px", color: "#475569" }}>{"\u2191\u2193"} navigate {"\u00B7"} Enter select</span></p>
      {searchResults.drugs.length > 0 && <div style={{ ...S.monographLabel, marginBottom: "8px" }}>{"\uD83D\uDC8A"} DRUGS ({searchResults.drugs.length})</div>}
      {searchResults.drugs.map(d => { const idx = flatIdx++; return (<div key={d.id} className={`pr-card ${searchActiveIdx === idx ? "search-result-active" : ""}`} style={S.card} onClick={() => { setSearchQuery(""); navigateTo(NAV_STATES.MONOGRAPH, { disease: d.parentDisease, monograph: d, focusSection: d.matchSection }); }}><div style={{ fontSize: "11px", color: "#64748b", marginBottom: "4px" }}>{"\uD83D\uDC8A"} DRUG MONOGRAPH{d.matchSection && <span style={{ marginLeft: "8px", color: "#0ea5e9" }}>matched in {d.matchSection}</span>}</div><div style={{ fontSize: "16px", fontWeight: 600 }}>{d.name}</div><div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>{d.brandNames} {"\u2014"} {d.drugClass}</div><AllergyWarning drugId={d.id} allergies={allergies} S={S} /></div>); })}
      {searchResults.organisms.length > 0 && <div style={{ ...S.monographLabel, marginTop: "16px", marginBottom: "8px" }}>{"\uD83E\uDDA0"} ORGANISMS ({searchResults.organisms.length})</div>}
      {searchResults.organisms.map((org, i) => { const idx = flatIdx++; return (<div key={"org-" + i} className={`pr-card ${searchActiveIdx === idx ? "search-result-active" : ""}`} style={S.card} onClick={() => { setSearchQuery(""); navigateTo(NAV_STATES.SUBCATEGORY, { disease: org.parentDisease, subcategory: org.parentSubcategory }); }}><div style={{ fontSize: "11px", color: "#64748b", marginBottom: "4px" }}>{"\uD83E\uDDA0"} ORGANISM</div><div style={{ fontSize: "16px", fontWeight: 600 }}>{org.organism}</div><div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>{org.parentSubcategory.name} {"\u2192"} {org.parentDisease.name}</div></div>); })}
      {searchResults.subcategories.length > 0 && <div style={{ ...S.monographLabel, marginTop: "16px", marginBottom: "8px" }}>{"\uD83D\uDCCB"} SUBCATEGORIES ({searchResults.subcategories.length})</div>}
      {searchResults.subcategories.map(sc => { const idx = flatIdx++; return (<div key={sc.parentDisease.id + "-" + sc.id} className={`pr-card ${searchActiveIdx === idx ? "search-result-active" : ""}`} style={S.card} onClick={() => { setSearchQuery(""); navigateTo(NAV_STATES.SUBCATEGORY, { disease: sc.parentDisease, subcategory: sc }); }}><div style={{ fontSize: "11px", color: "#64748b", marginBottom: "4px" }}>{"\uD83D\uDCCB"} {sc.matchType === "pearl" ? "MATCHED IN PEARLS" : sc.matchType === "empiric" ? "MATCHED IN THERAPY" : "DISEASE STATE"}</div><div style={{ fontSize: "16px", fontWeight: 600 }}>{sc.name}</div><div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>{sc.parentDisease.name}</div></div>); })}
      {searchResults.diseases.map(ds => { const idx = flatIdx++; return (<div key={ds.id} className={`pr-card ${searchActiveIdx === idx ? "search-result-active" : ""}`} style={S.card} onClick={() => { setSearchQuery(""); navigateTo(NAV_STATES.DISEASE_OVERVIEW, { disease: ds }); }}><div style={{ fontSize: "11px", color: "#64748b", marginBottom: "4px" }}>{"\uD83D\uDD2C"} CATEGORY</div><div style={{ fontSize: "16px", fontWeight: 600 }}>{ds.name}</div></div>); })}
      {total === 0 && <p style={{ color: "#64748b", textAlign: "center", padding: "40px 0" }}>No results found.</p>}
    </Layout>);
  }

  // COMPARE
  if (navState === NAV_STATES.COMPARE) { const drugs = compareItems.map(id => findMonograph(id)).filter(Boolean); return (<Layout><button style={S.backBtn} onClick={() => { setCompareItems([]); navigateTo(NAV_STATES.HOME); }}>{"\u2190"} Back</button><CompareView drugs={drugs} compareItems={compareItems} setCompareItems={setCompareItems} allMonographs={ALL_MONOGRAPHS} navigateTo={navigateTo} NAV_STATES={NAV_STATES} ExpandCollapseBar={ExpandCollapseBar} S={S} /></Layout>); }

  // HOME
  if (navState === NAV_STATES.HOME) {
    return (<Layout>
      <div style={{ textAlign: "center", padding: "24px 0 16px" }}><h1 style={{ fontSize: "26px", fontWeight: 700, color: S.app.color, marginBottom: "8px" }}>Clinical Antibiotic Reference</h1><p style={{ color: "#64748b", fontSize: "13px", maxWidth: "480px", margin: "0 auto", lineHeight: 1.6 }}>Evidence-based, pharmacist-grade reference built on landmark trials and rigorous data.</p></div>
      <div className="stat-row" style={{ display: "flex", justifyContent: "center", gap: "24px", padding: "12px 0 24px", flexWrap: "wrap" }}>{[{ n: DISEASE_STATES.length, label: "Disease States" }, { n: TOTAL_SUBCATEGORIES, label: "Subcategories" }, { n: ALL_MONOGRAPHS.length, label: "Drug Monographs" }].map((s, i) => (<div key={i} style={{ textAlign: "center" }}><div style={{ fontSize: "22px", fontWeight: 700, color: S.logo?.color || "#38bdf8" }}>{s.n}</div><div style={{ fontSize: "10px", color: "#64748b", letterSpacing: "0.5px", textTransform: "uppercase" }}>{s.label}</div></div>))}</div>
      {favorites.length > 0 && (<><div style={{ ...S.monographLabel, marginBottom: "6px" }}>{"\u2B50"} FAVORITES</div><div style={S.recentStrip}>{favorites.map(f => { const found = findMonograph(f.id); return <div key={f.id} style={{ ...S.recentChip, borderColor: "#fbbf2440" }} onClick={() => found && navigateTo(NAV_STATES.MONOGRAPH, { disease: found.disease, monograph: found.monograph })}>{"\u2B50"} {f.name}</div>; })}</div></>)}
      {recents.length > 0 && (<><div style={{ ...S.monographLabel, marginBottom: "6px" }}>{"\uD83D\uDD50"} RECENTLY VIEWED</div><div style={S.recentStrip}>{recents.map((r, i) => { const found = r.type === "drug" ? findMonograph(r.id) : null; const ds = DISEASE_STATES.find(d => d.id === r.diseaseId); return <div key={r.id + "-" + i} style={S.recentChip} onClick={() => { if (r.type === "drug" && found) navigateTo(NAV_STATES.MONOGRAPH, { disease: found.disease, monograph: found.monograph }); else if (r.type === "subcategory" && ds) { const sc = ds.subcategories?.find(s => s.id === r.id); if (sc) navigateTo(NAV_STATES.SUBCATEGORY, { disease: ds, subcategory: sc }); } }}>{r.type === "drug" ? "\uD83D\uDC8A" : "\uD83D\uDCCB"} {r.name}</div>; })}</div></>)}
      <div style={{ ...S.monographLabel, marginBottom: "10px", fontSize: "12px" }}>DISEASE STATES</div>
      <div className="home-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "10px", marginBottom: "24px" }}>{DISEASE_STATES.map(ds => (<div key={ds.id} className="pr-card" style={{ ...S.card, display: "flex", alignItems: "center", gap: "14px", marginBottom: 0 }} onClick={() => navigateTo(NAV_STATES.DISEASE_OVERVIEW, { disease: ds })}><div style={{ fontSize: "28px", width: "44px", height: "44px", display: "flex", alignItems: "center", justifyContent: "center", background: "#0ea5e908", borderRadius: "10px", flexShrink: 0 }}>{ds.icon}</div><div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: "15px", fontWeight: 600 }}>{ds.name}</div><div style={{ fontSize: "11px", color: "#64748b", marginTop: "3px" }}>{ds.subcategories?.length || 0} sections {"\u00B7"} {ds.drugMonographs?.length || 0} drugs</div></div><div style={{ color: "#475569", fontSize: "18px", flexShrink: 0 }}>{"\u203A"}</div></div>))}</div>
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}><button className="pr-card" style={{ ...S.card, cursor: "pointer", marginBottom: 0, padding: "14px 20px", display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: 600 }} onClick={() => { setCompareItems([]); navigateTo(NAV_STATES.COMPARE); }}>{"\u2696"} Compare Drugs</button><button className="pr-card" style={{ ...S.card, cursor: "pointer", marginBottom: 0, padding: "14px 20px", display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: 600 }} onClick={() => setShowAllergyModal(true)}>{"\u26A0"} Allergy Profile {allergies.length > 0 && `(${allergies.length})`}</button><button className="pr-card" style={{ ...S.card, cursor: "pointer", marginBottom: 0, padding: "14px 20px", display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: 600 }} onClick={() => navigateTo("audit")}>{"\uD83D\uDD0D"} Data Audit</button></div>
      <div style={{ ...S.monographLabel, marginBottom: "10px", fontSize: "12px" }}>ALL DRUG MONOGRAPHS ({ALL_MONOGRAPHS.length})</div>
      <div className="monograph-pills" style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "24px" }}>{ALL_MONOGRAPHS.map(dm => <button key={dm.id} className="qnav-pill" style={{ background: S.card?.background, border: `1px solid ${S.card?.borderColor || "#1e293b"}`, borderRadius: "6px", padding: "5px 12px", color: S.logo?.color || "#38bdf8", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }} onClick={() => { const f = findMonograph(dm.id); if (f) navigateTo(NAV_STATES.MONOGRAPH, { disease: f.disease, monograph: f.monograph }); }}>{dm.name}</button>)}</div>
      <div style={{ padding: "14px 18px", background: S.card?.background, borderRadius: "10px", border: `1px solid ${S.card?.borderColor || "#1e293b"}` }}><div style={{ fontSize: "12px", color: "#94a3b8", lineHeight: 1.6 }}><strong style={{ color: "#fbbf24" }}>{"\u26A0"} Clinical Disclaimer:</strong> This reference is a personal study and practice tool. Always verify against primary sources.</div></div>
    </Layout>);
  }

  // DISEASE OVERVIEW
  if (navState === NAV_STATES.DISEASE_OVERVIEW && selectedDisease) {
    const ds = selectedDisease, ov = ds.overview;
    return (<Layout compact>
      <button style={S.backBtn} onClick={() => navigateTo(NAV_STATES.HOME)}>{"\u2190"} All Disease States</button>
      <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "4px" }}>{ds.icon} {ds.name}</h1>
      <div style={{ color: "#64748b", fontSize: "12px", marginBottom: "16px" }}>{ds.category}</div>
      <QuickNav items={[{ id: "overview", icon: "\uD83D\uDCD6", label: "Overview" }, { id: "guidelines", icon: "\uD83D\uDCCB", label: "Guidelines" }, { id: "trials", icon: "\uD83E\uDDEA", label: "Trials" }]} />
      <ExpandCollapseBar />
      <Section id="overview" title="Overview & Epidemiology" icon={"\uD83D\uDCD6"} accentColor="#38bdf8" {...sectionProps}><p style={{ ...S.monographValue, marginBottom: "12px" }}>{ov.definition}</p><p style={{ ...S.monographValue, marginBottom: "12px" }}>{ov.epidemiology}</p><div style={{ ...S.monographLabel, marginTop: "16px" }}>Risk Factors</div><p style={S.monographValue}>{ov.riskFactors}</p></Section>
      <Section id="guidelines" title="Key Guidelines" icon={"\uD83D\uDCCB"} accentColor="#34d399" {...sectionProps}>{ov.keyGuidelines.map((g, i) => (<div key={i} style={{ padding: "10px 0", borderBottom: i < ov.keyGuidelines.length - 1 ? "1px solid #1e293b" : "none" }}><div style={{ fontWeight: 600, fontSize: "14px", color: "#34d399" }}>{g.name}</div><div style={{ fontSize: "13px", color: "#94a3b8", marginTop: "4px", lineHeight: 1.5 }}>{g.detail}</div></div>))}</Section>
      <Section id="trials" title="Landmark Trials" icon={"\uD83E\uDDEA"} accentColor="#fbbf24" {...sectionProps}>{ov.landmarkTrials.map((t, i) => (<div key={i} style={{ padding: "10px 0", borderBottom: i < ov.landmarkTrials.length - 1 ? "1px solid #1e293b" : "none" }}><div style={{ fontWeight: 600, fontSize: "14px", color: "#fbbf24" }}>{t.name}</div><div style={{ fontSize: "13px", color: "#94a3b8", marginTop: "4px", lineHeight: 1.5 }}>{t.detail}</div></div>))}</Section>
      <div style={{ ...S.monographLabel, marginTop: "24px", marginBottom: "10px", fontSize: "12px" }}>DISEASE SUBCATEGORIES</div>
      {ds.subcategories.map(sc => (<div key={sc.id} className="pr-card" style={{ ...S.card, display: "flex", alignItems: "center", justifyContent: "space-between" }} onClick={() => navigateTo(NAV_STATES.SUBCATEGORY, { subcategory: sc })}><div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: "15px", fontWeight: 600 }}>{sc.name}</div><div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px", lineHeight: 1.5 }}>{(sc.definition || "").slice(0, 120)}{(sc.definition || "").length > 120 ? "\u2026" : ""}</div></div><span style={{ color: "#475569", fontSize: "18px", flexShrink: 0, marginLeft: "12px" }}>{"\u203A"}</span></div>))}
      <div style={{ ...S.monographLabel, marginTop: "24px", marginBottom: "10px", fontSize: "12px" }}>DRUG MONOGRAPHS ({ds.drugMonographs?.length})</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "8px" }}>{ds.drugMonographs.map(dm => (<div key={dm.id} className="pr-card" style={{ ...S.card, cursor: "pointer", marginBottom: 0, padding: "14px" }} onClick={() => navigateTo(NAV_STATES.MONOGRAPH, { monograph: dm })}><div style={{ fontSize: "14px", fontWeight: 600, color: S.logo?.color || "#38bdf8" }}>{dm.name}</div><div style={{ fontSize: "11px", color: "#64748b", marginTop: "3px" }}>{dm.drugClass}</div></div>))}</div>
    </Layout>);
  }

  // SUBCATEGORY
  if (navState === NAV_STATES.SUBCATEGORY && selectedSubcategory) {
    const sc = selectedSubcategory;
    const hasOrganisms = sc.organismSpecific?.length > 0, hasPresentation = sc.clinicalPresentation && !sc.clinicalPresentation.startsWith("N/A"), hasDiagnostics = sc.diagnostics && !sc.diagnostics.startsWith("N/A"), hasPearls = sc.pearls?.length > 0;
    return (<Layout compact>
      <button style={S.backBtn} onClick={() => navigateTo(NAV_STATES.DISEASE_OVERVIEW, { disease: selectedDisease })}>{"\u2190"} {selectedDisease.name}</button>
      <h1 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "4px" }}>{sc.name}</h1>
      <div style={{ color: "#94a3b8", fontSize: "13px", lineHeight: 1.6, marginBottom: "16px" }}>{sc.definition}</div>
      <QuickNav items={[{ id: "presentation", icon: "\uD83E\uDE7A", label: "Presentation", show: hasPresentation }, { id: "diagnostics", icon: "\uD83D\uDD0E", label: "Diagnostics", show: hasDiagnostics }, { id: "empiric", icon: "\uD83D\uDC8A", label: "Therapy" }, { id: "organism", icon: "\uD83E\uDDA0", label: "Organisms", show: hasOrganisms }, { id: "pearls", icon: "\uD83D\uDCA1", label: "Pearls", show: hasPearls }]} />
      <ExpandCollapseBar />
      {hasPresentation && <Section id="presentation" title="Clinical Presentation" icon={"\uD83E\uDE7A"} accentColor="#38bdf8" {...sectionProps}><p style={S.monographValue}>{sc.clinicalPresentation}</p></Section>}
      {hasDiagnostics && <Section id="diagnostics" title="Diagnostics" icon={"\uD83D\uDD0E"} accentColor="#a78bfa" {...sectionProps}><p style={S.monographValue}>{sc.diagnostics}</p></Section>}
      <Section id="empiric" title={sc.empiricTherapy?.some(t => t.line.toLowerCase().includes("prevention") || t.line.toLowerCase().includes("stewardship")) ? "Interventions & Protocols" : "Empiric Therapy"} icon={"\uD83D\uDC8A"} accentColor="#34d399" {...sectionProps}>{sc.empiricTherapy?.map((tier, ti) => <EmpiricTierView key={ti} tier={tier} {...empiricProps} />)}</Section>
      {hasOrganisms && (<Section id="organism" title="Organism-Specific Therapy" icon={"\uD83E\uDDA0"} accentColor="#f59e0b" {...sectionProps}>{sc.organismSpecific.map((org, oi) => (<div key={oi} style={{ padding: "14px 0", borderBottom: oi < sc.organismSpecific.length - 1 ? "1px solid #1e293b" : "none" }}><div style={{ fontWeight: 600, fontSize: "14px", color: "#f59e0b", marginBottom: "8px" }}>{org.organism}</div><div style={{ display: "grid", gap: "6px" }}><div style={{ fontSize: "12px", display: "flex", alignItems: "center", gap: "6px" }}><span style={{ color: "#64748b", fontWeight: 600 }}>Preferred: </span><span style={{ color: "#34d399" }}>{org.preferred}</span><CopyBtn text={org.preferred} id={`org-p-${oi}`} {...copyProps} /></div>{org.alternative && <div style={{ fontSize: "12px", display: "flex", alignItems: "center", gap: "6px" }}><span style={{ color: "#64748b", fontWeight: 600 }}>Alternative: </span><span style={{ color: "#fbbf24" }}>{org.alternative}</span><CopyBtn text={org.alternative} id={`org-a-${oi}`} {...copyProps} /></div>}<div style={{ fontSize: "12px", color: "#94a3b8", lineHeight: 1.5, marginTop: "4px" }}>{org.notes}</div></div></div>))}</Section>)}
      {hasPearls && <Section id="pearls" title="Pharmacist Pearls & Clinical Tips" icon={"\uD83D\uDCA1"} accentColor="#fbbf24" {...sectionProps}>{sc.pearls.map((p, pi) => <div key={pi} style={S.pearlBox}>{"\uD83D\uDCA1"} {p}</div>)}</Section>}
    </Layout>);
  }

  // MONOGRAPH
  if (navState === NAV_STATES.MONOGRAPH && selectedMonograph) {
    const dm = selectedMonograph, allergyMatch = checkAllergyMatch(dm.id, allergies);
    return (<Layout compact>
      <button style={S.backBtn} onClick={() => navigateTo(NAV_STATES.DISEASE_OVERVIEW, { disease: selectedDisease })}>{"\u2190"} {selectedDisease?.name}</button>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
        <div><h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "2px" }}>{dm.name}</h1><div style={{ fontSize: "13px", color: "#94a3b8" }}>{dm.brandNames} {"\u2014"} <span style={{ color: "#64748b" }}>{dm.drugClass}</span></div></div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}><button className="fav-star" style={S.favStar} onClick={() => toggleFavorite(dm.id, dm.name, selectedDisease?.id)} title={isFavorite(dm.id) ? "Remove favorite" : "Add favorite"}>{isFavorite(dm.id) ? "\u2B50" : "\u2606"}</button><button style={S.expandAllBtn} onClick={() => { const other = selectedDisease?.drugMonographs?.filter(m => m.id !== dm.id) || []; if (other.length > 0) { setCompareItems([dm.id, other[0].id]); navigateTo(NAV_STATES.COMPARE); } }}>{"\u2696"} Compare</button></div>
      </div>
      <CrossRefBadges drugId={dm.id} currentDiseaseId={selectedDisease?.id} monographXref={MONOGRAPH_XREF} navigateTo={navigateTo} NAV_STATES={NAV_STATES} showToast={showToast} currentDrugName={dm.name} S={S} />
      {allergyMatch && <div className="allergy-badge" style={{ ...S.allergyBadge, marginTop: "10px", marginBottom: "4px", fontSize: "12px", padding: "6px 12px" }}>{"\u26A0"} {allergyMatch.type === "interaction" ? "DRUG INTERACTION" : "ALLERGY ALERT"}: Patient profile includes {allergyMatch.allergy}{allergyMatch.note && <span style={{ fontWeight: 400, marginLeft: "4px" }}>{"\u2014"} {allergyMatch.note}</span>}</div>}
      <div style={{ marginTop: "12px" }} />
      <QuickNav items={[{ id: "moa", icon: "\u2699", label: "MOA" }, { id: "spectrum", icon: "\uD83C\uDFAF", label: "Spectrum" }, { id: "dosing", icon: "\uD83D\uDCD0", label: "Dosing" }, { id: "renal", icon: "\uD83E\uDED8", label: "Renal" }, { id: "hepatic", icon: "\uD83E\uDEC1", label: "Hepatic" }, { id: "ae", icon: "\u26A0", label: "ADRs" }, { id: "interactions", icon: "\uD83D\uDD17", label: "Interactions" }, { id: "monitoring", icon: "\uD83D\uDCCA", label: "Monitoring" }, { id: "pregnancy", icon: "\uD83E\uDD30", label: "Pregnancy" }, { id: "pharm-pearls", icon: "\uD83D\uDCA1", label: "Pearls" }]} />
      <ExpandCollapseBar />
      <div className="no-print" style={S.renalFilter}><span style={{ fontSize: "11px", fontWeight: 600, color: "#f59e0b", letterSpacing: "0.3px" }}>{"\uD83E\uDED8"} CrCl Filter:</span>{RENAL_RANGES.map((r, i) => <button key={i} style={{ ...S.renalPill, ...(renalFilter === i ? S.renalPillActive : {}) }} onClick={() => setRenalFilter(renalFilter === i ? null : i)}>{r.label}</button>)}{renalFilter !== null && <button style={{ ...S.renalPill, color: "#ef4444", borderColor: "#ef444440" }} onClick={() => setRenalFilter(null)}>{"\u2715"} Clear</button>}</div>
      <Section id="moa" title="Mechanism of Action" icon={"\u2699"} accentColor="#60a5fa" {...sectionProps}><p style={S.monographValue}>{dm.mechanismOfAction}</p></Section>
      <Section id="spectrum" title="Spectrum of Activity" icon={"\uD83C\uDFAF"} accentColor="#34d399" {...sectionProps}><p style={S.monographValue}>{dm.spectrum}</p></Section>
      <Section id="dosing" title="Dosing" icon={"\uD83D\uDCD0"} accentColor="#a78bfa" {...sectionProps}>{dm.dosing && Object.entries(dm.dosing).map(([key, val]) => (<div key={key} style={{ padding: "8px 0", borderBottom: "1px solid #1e293b20", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}><div><span style={{ fontSize: "12px", fontWeight: 600, color: "#a78bfa", textTransform: "capitalize" }}>{key.replace(/_/g, " ")}: </span><span style={{ fontSize: "13px", color: S.monographValue?.color || "#cbd5e1", fontFamily: "'IBM Plex Mono', monospace" }}>{val}</span></div><CopyBtn text={`${key.replace(/_/g, " ")}: ${val}`} id={`dose-${key}`} {...copyProps} /></div>))}</Section>
      <Section id="renal" title={renalFilter !== null ? `Renal Dose Adjustment (${RENAL_RANGES[renalFilter].label} mL/min)` : "Renal Dose Adjustment"} icon={"\uD83E\uDED8"} accentColor="#f59e0b" {...sectionProps}><p style={{ ...S.monographValue, ...(renalFilter !== null ? { background: "#f59e0b10", padding: "12px", borderRadius: "6px", border: "1px solid #f59e0b30" } : {}) }}>{dm.renalAdjustment}</p></Section>
      <Section id="hepatic" title="Hepatic Dose Adjustment" icon={"\uD83E\uDEC1"} accentColor="#f59e0b" {...sectionProps}><p style={S.monographValue}>{dm.hepaticAdjustment}</p></Section>
      <Section id="ae" title="Adverse Effects" icon={"\u26A0"} accentColor="#ef4444" {...sectionProps}>{dm.adverseEffects && (<div style={S.aeGrid}><div style={aeCard("#fbbf24")}><div style={aeLabel("#fbbf24")}>Common</div><p style={{ fontSize: "13px", color: S.monographValue?.color || "#cbd5e1", lineHeight: 1.6, margin: 0 }}>{dm.adverseEffects.common}</p></div><div style={aeCard("#ef4444")}><div style={aeLabel("#ef4444")}>Serious</div><p style={{ fontSize: "13px", color: S.monographValue?.color || "#cbd5e1", lineHeight: 1.6, margin: 0 }}>{dm.adverseEffects.serious}</p></div><div style={aeCard("#64748b")}><div style={aeLabel("#94a3b8")}>Rare</div><p style={{ fontSize: "13px", color: S.monographValue?.color || "#cbd5e1", lineHeight: 1.6, margin: 0 }}>{dm.adverseEffects.rare}</p></div></div>)}</Section>
      <Section id="interactions" title="Drug Interactions" icon={"\uD83D\uDD17"} accentColor="#f97316" {...sectionProps}>{dm.drugInteractions?.map((di, i) => <div key={i} style={S.interactionItem}>{di}</div>)}</Section>
      <Section id="monitoring" title="Monitoring" icon={"\uD83D\uDCCA"} accentColor="#8b5cf6" {...sectionProps}><p style={S.monographValue}>{dm.monitoring}</p></Section>
      <Section id="pregnancy" title="Pregnancy & Lactation" icon={"\uD83E\uDD30"} accentColor="#ec4899" {...sectionProps}><p style={S.monographValue}>{dm.pregnancyLactation}</p></Section>
      <Section id="pharm-pearls" title="Pharmacist Pearls" icon={"\uD83D\uDCA1"} accentColor="#fbbf24" {...sectionProps}>{dm.pharmacistPearls?.map((p, i) => <div key={i} style={S.pearlBox}>{"\uD83D\uDCA1"} {p}</div>)}</Section>
    </Layout>);
  }

  // AUDIT
  if (navState === "audit") { return (<Layout><button style={S.backBtn} onClick={() => navigateTo(NAV_STATES.HOME)}>{"\u2190"} Home</button><AuditView diseaseStates={DISEASE_STATES} findMonograph={findMonograph} S={S} /></Layout>); }

  return <Layout><p style={{ color: "#64748b", textAlign: "center", padding: "60px 0" }}>Loading{"\u2026"}</p></Layout>;
}