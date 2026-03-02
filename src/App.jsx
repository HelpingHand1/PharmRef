import React from "react";
import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { DISEASE_STATES } from "./data";
import { NAV_STATES, S, TAG_COLORS, getLineStyle, aeCard, aeLabel, cardHover } from "./styles/constants";

// Aggregate stats (computed once at module level)
const ALL_MONOGRAPHS = (() => {
  const seen = new Set();
  const list = [];
  DISEASE_STATES.forEach(ds => {
    ds.drugMonographs?.forEach(dm => {
      if (!seen.has(dm.id)) { seen.add(dm.id); list.push({ ...dm, parentDisease: ds }); }
    });
  });
  return list.sort((a, b) => a.name.localeCompare(b.name));
})();
const TOTAL_SUBCATEGORIES = DISEASE_STATES.reduce((n, ds) => n + (ds.subcategories?.length || 0), 0);

// Cross-disease monograph map: drugId -> [disease states that contain it]
const MONOGRAPH_XREF = (() => {
  const map = {};
  DISEASE_STATES.forEach(ds => {
    ds.drugMonographs?.forEach(dm => {
      if (!map[dm.id]) map[dm.id] = [];
      map[dm.id].push(ds);
    });
  });
  return map;
})();

// Find a monograph by drug ID across all disease states
const findMonograph = (drugId) => {
  for (const ds of DISEASE_STATES) {
    const m = ds.drugMonographs?.find(dm => dm.id === drugId);
    if (m) return { monograph: m, disease: ds };
  }
  return null;
};

// ============================================================
// APP COMPONENT
export default function PharmRef() {
  const [navState, setNavState] = useState(NAV_STATES.HOME);
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedMonograph, setSelectedMonograph] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSections, setExpandedSections] = useState({});
  const [showTopBtn, setShowTopBtn] = useState(false);
  const searchRef = React.useRef(null);

  // Keyboard shortcut: "/" to focus search, Escape to clear
  React.useEffect(() => {
    const handler = (e) => {
      if (e.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === "Escape" && document.activeElement === searchRef.current) {
        searchRef.current?.blur();
        if (searchQuery) setSearchQuery("");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [searchQuery]);

  // Scroll listener for back-to-top button
  React.useEffect(() => {
    const handler = () => setShowTopBtn(window.scrollY > 400);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const toggleSection = useCallback((id) => {
    setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const navigateTo = useCallback((state, data = {}) => {
    setNavState(state);
    if (data.disease !== undefined) setSelectedDisease(data.disease);
    if (data.subcategory !== undefined) setSelectedSubcategory(data.subcategory);
    if (data.monograph !== undefined) setSelectedMonograph(data.monograph);
    setExpandedSections({});
    window.scrollTo?.(0, 0);
  }, []);

  // Deep search: drugs, organisms, subcategories, diseases, pearls, empiric notes, interactions
  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) return null;
    const q = searchQuery.toLowerCase();
    const results = { drugs: [], organisms: [], subcategories: [], diseases: [] };
    const seen = { drugs: new Set(), subcats: new Set(), organisms: new Set() };

    DISEASE_STATES.forEach(ds => {
      if (ds.name.toLowerCase().includes(q) || ds.overview?.definition?.toLowerCase().includes(q))
        results.diseases.push(ds);

      ds.subcategories?.forEach(sc => {
        const scKey = ds.id + "-" + sc.id;
        const directMatch = sc.name.toLowerCase().includes(q) || sc.definition?.toLowerCase().includes(q);
        const pearlMatch = sc.pearls?.some(p => p.toLowerCase().includes(q));
        const empiricMatch = sc.empiricTherapy?.some(t =>
          t.line.toLowerCase().includes(q) || t.options.some(o => (o.notes || "").toLowerCase().includes(q) || (o.regimen || "").toLowerCase().includes(q))
        );
        if ((directMatch || pearlMatch || empiricMatch) && !seen.subcats.has(scKey)) {
          seen.subcats.add(scKey);
          results.subcategories.push({ ...sc, parentDisease: ds, matchType: directMatch ? "name" : pearlMatch ? "pearl" : "empiric" });
        }
        sc.organismSpecific?.forEach(org => {
          const orgKey = ds.id + "-" + sc.id + "-" + org.organism;
          if ((org.organism.toLowerCase().includes(q) || (org.notes || "").toLowerCase().includes(q) || (org.preferred || "").toLowerCase().includes(q)) && !seen.organisms.has(orgKey)) {
            seen.organisms.add(orgKey);
            results.organisms.push({ ...org, parentSubcategory: sc, parentDisease: ds });
          }
        });
      });

      ds.drugMonographs?.forEach(dm => {
        if (seen.drugs.has(dm.id)) return;
        const match = dm.name.toLowerCase().includes(q) ||
          (dm.brandNames || "").toLowerCase().includes(q) ||
          (dm.drugClass || "").toLowerCase().includes(q) ||
          (dm.spectrum || "").toLowerCase().includes(q) ||
          dm.pharmacistPearls?.some(p => p.toLowerCase().includes(q)) ||
          dm.drugInteractions?.some(di => di.toLowerCase().includes(q)) ||
          (dm.mechanismOfAction || "").toLowerCase().includes(q);
        if (match) {
          seen.drugs.add(dm.id);
          results.drugs.push({ ...dm, parentDisease: ds });
        }
      });
    });
    return results;
  }, [searchQuery]);

  const breadcrumbs = useMemo(() => {
    const crumbs = [{ label: "PharmRef", action: () => navigateTo(NAV_STATES.HOME) }];
    if (selectedDisease && navState !== NAV_STATES.HOME) {
      crumbs.push({
        label: selectedDisease.name,
        action: () => navigateTo(NAV_STATES.DISEASE_OVERVIEW, { disease: selectedDisease }),
      });
    }
    if (selectedSubcategory && navState === NAV_STATES.SUBCATEGORY) crumbs.push({ label: selectedSubcategory.name, action: null });
    if (selectedMonograph && navState === NAV_STATES.MONOGRAPH) crumbs.push({ label: selectedMonograph.name, action: null });
    return crumbs;
  }, [navState, selectedDisease, selectedSubcategory, selectedMonograph, navigateTo]);

  const getCurrentSectionIds = useCallback(() => {
    if (navState === NAV_STATES.SUBCATEGORY) return ["presentation", "diagnostics", "empiric", "organism", "pearls"];
    if (navState === NAV_STATES.MONOGRAPH) return ["moa", "spectrum", "dosing", "renal", "hepatic", "ae", "interactions", "monitoring", "pregnancy", "pharm-pearls"];
    if (navState === NAV_STATES.DISEASE_OVERVIEW) return ["overview", "guidelines", "trials"];
    return [];
  }, [navState]);

  const expandAll = useCallback(() => {
    const ids = getCurrentSectionIds();
    setExpandedSections(prev => { const n = { ...prev }; ids.forEach(id => { n[id] = true; }); return n; });
  }, [getCurrentSectionIds]);

  const collapseAll = useCallback(() => {
    const ids = getCurrentSectionIds();
    setExpandedSections(prev => { const n = { ...prev }; ids.forEach(id => { n[id] = false; }); return n; });
  }, [getCurrentSectionIds]);

  // ============================================================
  // SHARED SUB-COMPONENTS
  // ============================================================
  const Section = ({ id, title, icon, children, defaultOpen, accentColor }) => {
    const isOpen = expandedSections[id] ?? defaultOpen ?? false;
    return (
      <div style={{ marginBottom: "4px" }}>
        <div style={{ ...S.sectionHeader, ...(isOpen ? { borderBottom: "none", borderRadius: "8px 8px 0 0" } : {}), borderLeftColor: accentColor || "#1e293b", borderLeftWidth: accentColor ? "3px" : "1px" }} onClick={() => toggleSection(id)}>
          <span style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", fontWeight: 600 }}>
            {icon && <span style={{ fontSize: "16px" }}>{icon}</span>}
            {title}
          </span>
          <span style={{ color: "#64748b", fontSize: "18px", transform: isOpen ? "rotate(90deg)" : "none", transition: "transform 0.15s" }}>›</span>
        </div>
        {isOpen && <div style={S.sectionContent}>{children}</div>}
      </div>
    );
  };

  const ExpandCollapseBar = () => (
    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "8px" }}>
      <button style={S.expandAllBtn} onClick={expandAll}>Expand All</button>
      <button style={S.expandAllBtn} onClick={collapseAll}>Collapse All</button>
    </div>
  );

  const EmpiricTierView = ({ tier }) => (
    <div style={{ marginBottom: "20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
        <span style={{ ...S.tag, ...getLineStyle(tier.line) }}>{tier.line}</span>
      </div>
      {tier.options.map((opt, oi) => {
        const found = findMonograph(opt.drug);
        const lineColor = getLineStyle(tier.line).color || "#1e3a5f";
        return (
          <div key={oi} style={{ padding: "12px 16px", background: "#0a0f1a", borderRadius: "8px", marginBottom: "8px", borderLeft: "3px solid " + lineColor }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              {found ? (
                <button style={{ ...S.drugLink, fontSize: "14px", fontWeight: 600 }} onClick={() => navigateTo(NAV_STATES.MONOGRAPH, { disease: found.disease, monograph: found.monograph })}>
                  {opt.regimen.split(" ")[0]}
                </button>
              ) : (
                <span style={{ fontSize: "14px", fontWeight: 600, color: "#e2e8f0" }}>{opt.regimen.split(" ")[0]}</span>
              )}
            </div>
            <div style={{ fontSize: "13px", color: "#94a3b8", fontFamily: "'IBM Plex Mono', monospace", marginBottom: "6px" }}>{opt.regimen}</div>
            <div style={{ fontSize: "12px", color: "#cbd5e1", lineHeight: 1.6 }}>{opt.notes}</div>
          </div>
        );
      })}
    </div>
  );

  const CrossRefBadges = ({ drugId, currentDiseaseId }) => {
    const refs = MONOGRAPH_XREF[drugId];
    if (!refs || refs.length <= 1) return null;
    const others = refs.filter(ds => ds.id !== currentDiseaseId);
    if (others.length === 0) return null;
    return (
      <div style={{ marginTop: "8px" }}>
        <span style={{ fontSize: "11px", color: "#64748b", marginRight: "6px" }}>Also in:</span>
        {others.map(ds => (
          <span key={ds.id} style={S.crossRefPill} onClick={() => navigateTo(NAV_STATES.DISEASE_OVERVIEW, { disease: ds })}>
            {ds.icon} {ds.name}
          </span>
        ))}
      </div>
    );
  };

  const BackToTop = () => showTopBtn ? (
    <button style={S.topBtn} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} title="Back to top">↑</button>
  ) : null;

  // ============================================================
  // LAYOUT WRAPPER
  // ============================================================
  const Layout = ({ children, compact }) => (
    <div style={S.app}>
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet" />
      <header style={S.header}>
        <div style={S.headerTop}>
          <div style={S.logo} onClick={() => { setSearchQuery(""); navigateTo(NAV_STATES.HOME); }}>
            <span>⚕</span> PharmRef <span style={S.logoPill}>Rx</span>
          </div>
          <div style={S.searchWrap}>
            <span style={S.searchIcon}>⌕</span>
            <input ref={searchRef} style={{ ...S.searchBox, ...(compact ? { maxWidth: "300px" } : {}) }} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search drugs, organisms, pearls..." />
            {searchQuery ? (
              <button style={S.clearBtn} onClick={() => setSearchQuery("")} title="Clear search">✕</button>
            ) : (
              <span style={S.kbdHint}>/</span>
            )}
          </div>
        </div>
        {navState !== NAV_STATES.HOME && (
          <div style={S.breadcrumbs}>
            {breadcrumbs.map((c, i) => (
              <span key={i} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                {i > 0 && <span>›</span>}
                {c.action ? <button style={S.breadcrumbLink} onClick={c.action}>{c.label}</button> : <span style={{ color: "#e2e8f0" }}>{c.label}</span>}
              </span>
            ))}
          </div>
        )}
      </header>
      <main style={S.main}>{children}</main>
      <BackToTop />
    </div>
  );

  // ============================================================
  // SEARCH RESULTS VIEW
  // ============================================================
  if (searchResults) {
    const total = searchResults.diseases.length + searchResults.subcategories.length + searchResults.drugs.length + searchResults.organisms.length;
    return (
      <Layout>
        <p style={{ color: "#64748b", fontSize: "13px", marginBottom: "20px" }}>
          {total} result{total !== 1 ? "s" : ""} for "{searchQuery}"
        </p>
        {searchResults.drugs.map(d => (
          <div key={d.id} style={S.card} onClick={() => { setSearchQuery(""); navigateTo(NAV_STATES.MONOGRAPH, { disease: d.parentDisease, monograph: d }); }} onMouseEnter={e => cardHover(e, true)} onMouseLeave={e => cardHover(e, false)}>
            <div style={{ fontSize: "11px", color: "#64748b", marginBottom: "4px" }}>💊 DRUG MONOGRAPH</div>
            <div style={{ fontSize: "16px", fontWeight: 600 }}>{d.name}</div>
            <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>{d.brandNames} — {d.drugClass}</div>
          </div>
        ))}
        {searchResults.organisms.map((org, i) => (
          <div key={"org-" + i} style={S.card} onClick={() => { setSearchQuery(""); navigateTo(NAV_STATES.SUBCATEGORY, { disease: org.parentDisease, subcategory: org.parentSubcategory }); }} onMouseEnter={e => cardHover(e, true)} onMouseLeave={e => cardHover(e, false)}>
            <div style={{ fontSize: "11px", color: "#64748b", marginBottom: "4px" }}>🦠 ORGANISM</div>
            <div style={{ fontSize: "16px", fontWeight: 600 }}>{org.organism}</div>
            <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>{org.parentSubcategory.name} → {org.parentDisease.name}</div>
            <div style={{ fontSize: "11px", color: "#64748b", marginTop: "6px" }}>
              <span style={{ color: "#34d399" }}>Preferred: </span>{(org.preferred || "").slice(0, 80)}{(org.preferred || "").length > 80 ? "..." : ""}
            </div>
          </div>
        ))}
        {searchResults.subcategories.map(sc => (
          <div key={sc.parentDisease.id + "-" + sc.id} style={S.card} onClick={() => { setSearchQuery(""); navigateTo(NAV_STATES.SUBCATEGORY, { disease: sc.parentDisease, subcategory: sc }); }} onMouseEnter={e => cardHover(e, true)} onMouseLeave={e => cardHover(e, false)}>
            <div style={{ fontSize: "11px", color: "#64748b", marginBottom: "4px" }}>
              📋 {sc.matchType === "pearl" ? "MATCHED IN PEARLS" : sc.matchType === "empiric" ? "MATCHED IN THERAPY" : "DISEASE STATE"}
            </div>
            <div style={{ fontSize: "16px", fontWeight: 600 }}>{sc.name}</div>
            <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>{sc.parentDisease.name}</div>
          </div>
        ))}
        {searchResults.diseases.map(ds => (
          <div key={ds.id} style={S.card} onClick={() => { setSearchQuery(""); navigateTo(NAV_STATES.DISEASE_OVERVIEW, { disease: ds }); }} onMouseEnter={e => cardHover(e, true)} onMouseLeave={e => cardHover(e, false)}>
            <div style={{ fontSize: "11px", color: "#64748b", marginBottom: "4px" }}>🔬 CATEGORY</div>
            <div style={{ fontSize: "16px", fontWeight: 600 }}>{ds.name}</div>
          </div>
        ))}
        {total === 0 && <p style={{ color: "#64748b", textAlign: "center", padding: "40px 0" }}>No results found. Try a different search term.</p>}
      </Layout>
    );
  }

  // ============================================================
  // HOME VIEW
  // ============================================================
  if (navState === NAV_STATES.HOME) {
    return (
      <Layout>
        <div style={{ textAlign: "center", padding: "30px 0 20px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#f1f5f9", marginBottom: "10px" }}>Clinical Antibiotic Reference</h1>
          <p style={{ color: "#64748b", fontSize: "14px", maxWidth: "500px", margin: "0 auto", lineHeight: 1.6 }}>
            Evidence-based, pharmacist-grade reference built on landmark trials and rigorous data.
          </p>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: "24px", padding: "16px 0 32px", flexWrap: "wrap" }}>
          {[
            { n: DISEASE_STATES.length, label: "Disease States" },
            { n: TOTAL_SUBCATEGORIES, label: "Subcategories" },
            { n: ALL_MONOGRAPHS.length, label: "Drug Monographs" },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "24px", fontWeight: 700, color: "#38bdf8" }}>{s.n}</div>
              <div style={{ fontSize: "11px", color: "#64748b", letterSpacing: "0.5px", textTransform: "uppercase" }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div style={{ ...S.monographLabel, marginBottom: "12px", fontSize: "13px" }}>DISEASE STATES</div>
        {DISEASE_STATES.map(ds => (
          <div key={ds.id} style={{ ...S.card, display: "flex", alignItems: "center", gap: "16px" }} onClick={() => navigateTo(NAV_STATES.DISEASE_OVERVIEW, { disease: ds })} onMouseEnter={e => cardHover(e, true)} onMouseLeave={e => cardHover(e, false)}>
            <div style={{ fontSize: "32px", width: "50px", height: "50px", display: "flex", alignItems: "center", justifyContent: "center", background: "#0ea5e910", borderRadius: "10px", flexShrink: 0 }}>{ds.icon}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "17px", fontWeight: 600 }}>{ds.name}</div>
              <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>{ds.category} · {ds.subcategories?.length || 0} subcategories · {ds.drugMonographs?.length || 0} monographs</div>
            </div>
            <div style={{ color: "#64748b", fontSize: "20px", flexShrink: 0 }}>›</div>
          </div>
        ))}
        <div style={{ ...S.monographLabel, marginTop: "30px", marginBottom: "12px", fontSize: "13px" }}>QUICK ACCESS — ALL DRUG MONOGRAPHS ({ALL_MONOGRAPHS.length})</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "24px" }}>
          {ALL_MONOGRAPHS.map(dm => (
            <button key={dm.id} style={{ background: "#111827", border: "1px solid #1e293b", borderRadius: "6px", padding: "6px 12px", color: "#38bdf8", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "border-color 0.15s" }} onMouseEnter={e => { e.currentTarget.style.borderColor = "#0ea5e9"; }} onMouseLeave={e => { e.currentTarget.style.borderColor = "#1e293b"; }} onClick={() => { const f = findMonograph(dm.id); if (f) navigateTo(NAV_STATES.MONOGRAPH, { disease: f.disease, monograph: f.monograph }); }}>
              {dm.name}
            </button>
          ))}
        </div>
        <div style={{ padding: "16px 20px", background: "#111827", borderRadius: "10px", border: "1px solid #1e293b" }}>
          <div style={{ fontSize: "13px", color: "#94a3b8", lineHeight: 1.6 }}>
            <strong style={{ color: "#fbbf24" }}>⚠ Clinical Disclaimer:</strong> This reference is a personal study and practice tool. Always verify against primary sources (IDSA, package inserts, UpToDate, local antibiograms) before making clinical decisions.
          </div>
        </div>
      </Layout>
    );
  }

  // ============================================================
  // DISEASE OVERVIEW VIEW
  // ============================================================
  if (navState === NAV_STATES.DISEASE_OVERVIEW && selectedDisease) {
    const ds = selectedDisease;
    const ov = ds.overview;
    return (
      <Layout compact>
        <button style={S.backBtn} onClick={() => navigateTo(NAV_STATES.HOME)}>← All Disease States</button>
        <h1 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "6px" }}>{ds.icon} {ds.name}</h1>
        <div style={{ color: "#64748b", fontSize: "13px", marginBottom: "20px" }}>{ds.category}</div>
        <ExpandCollapseBar />
        <Section id="overview" title="Overview & Epidemiology" icon="📖" accentColor="#38bdf8">
          <p style={{ ...S.monographValue, marginBottom: "12px" }}>{ov.definition}</p>
          <p style={{ ...S.monographValue, marginBottom: "12px" }}>{ov.epidemiology}</p>
          <div style={{ ...S.monographLabel, marginTop: "16px" }}>Risk Factors</div>
          <p style={S.monographValue}>{ov.riskFactors}</p>
        </Section>
        <Section id="guidelines" title="Key Guidelines" icon="📋" accentColor="#34d399">
          {ov.keyGuidelines.map((g, i) => (
            <div key={i} style={{ padding: "10px 0", borderBottom: i < ov.keyGuidelines.length - 1 ? "1px solid #1e293b" : "none" }}>
              <div style={{ fontWeight: 600, fontSize: "14px", color: "#34d399" }}>{g.name}</div>
              <div style={{ fontSize: "13px", color: "#94a3b8", marginTop: "4px", lineHeight: 1.5 }}>{g.detail}</div>
            </div>
          ))}
        </Section>
        <Section id="trials" title="Landmark Trials" icon="🧪" accentColor="#fbbf24">
          {ov.landmarkTrials.map((t, i) => (
            <div key={i} style={{ padding: "10px 0", borderBottom: i < ov.landmarkTrials.length - 1 ? "1px solid #1e293b" : "none" }}>
              <div style={{ fontWeight: 600, fontSize: "14px", color: "#fbbf24" }}>{t.name}</div>
              <div style={{ fontSize: "13px", color: "#94a3b8", marginTop: "4px", lineHeight: 1.5 }}>{t.detail}</div>
            </div>
          ))}
        </Section>
        <div style={{ ...S.monographLabel, marginTop: "30px", marginBottom: "12px", fontSize: "13px" }}>DISEASE SUBCATEGORIES</div>
        {ds.subcategories.map(sc => (
          <div key={sc.id} style={{ ...S.card, display: "flex", alignItems: "center", justifyContent: "space-between" }} onClick={() => navigateTo(NAV_STATES.SUBCATEGORY, { subcategory: sc })} onMouseEnter={e => cardHover(e, true)} onMouseLeave={e => cardHover(e, false)}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "15px", fontWeight: 600 }}>{sc.name}</div>
              <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px", lineHeight: 1.5 }}>{(sc.definition || "").slice(0, 140)}{(sc.definition || "").length > 140 ? "..." : ""}</div>
            </div>
            <span style={{ color: "#64748b", fontSize: "20px", flexShrink: 0, marginLeft: "12px" }}>›</span>
          </div>
        ))}
        <div style={{ ...S.monographLabel, marginTop: "30px", marginBottom: "12px", fontSize: "13px" }}>DRUG MONOGRAPHS ({ds.drugMonographs?.length})</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "10px" }}>
          {ds.drugMonographs.map(dm => (
            <div key={dm.id} style={{ ...S.card, cursor: "pointer", marginBottom: 0 }} onClick={() => navigateTo(NAV_STATES.MONOGRAPH, { monograph: dm })} onMouseEnter={e => cardHover(e, true)} onMouseLeave={e => cardHover(e, false)}>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "#38bdf8" }}>{dm.name}</div>
              <div style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>{dm.drugClass}</div>
            </div>
          ))}
        </div>
      </Layout>
    );
  }

  // ============================================================
  // SUBCATEGORY VIEW
  // ============================================================
  if (navState === NAV_STATES.SUBCATEGORY && selectedSubcategory) {
    const sc = selectedSubcategory;
    const hasOrganisms = sc.organismSpecific && sc.organismSpecific.length > 0;
    return (
      <Layout compact>
        <button style={S.backBtn} onClick={() => navigateTo(NAV_STATES.DISEASE_OVERVIEW, { disease: selectedDisease })}>← {selectedDisease.name}</button>
        <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "6px" }}>{sc.name}</h1>
        <div style={{ color: "#94a3b8", fontSize: "13px", lineHeight: 1.6, marginBottom: "20px" }}>{sc.definition}</div>
        <ExpandCollapseBar />
        {sc.clinicalPresentation && !sc.clinicalPresentation.startsWith("N/A") && (
          <Section id="presentation" title="Clinical Presentation" icon="🩺" accentColor="#38bdf8">
            <p style={S.monographValue}>{sc.clinicalPresentation}</p>
          </Section>
        )}
        {sc.diagnostics && !sc.diagnostics.startsWith("N/A") && (
          <Section id="diagnostics" title="Diagnostics" icon="🔎" accentColor="#a78bfa">
            <p style={S.monographValue}>{sc.diagnostics}</p>
          </Section>
        )}
        <Section id="empiric" title={sc.empiricTherapy?.some(t => t.line.toLowerCase().includes("prevention") || t.line.toLowerCase().includes("stewardship")) ? "Interventions & Protocols" : "Empiric Therapy"} icon="💊" accentColor="#34d399">
          {sc.empiricTherapy?.map((tier, ti) => (
            <EmpiricTierView key={ti} tier={tier} />
          ))}
        </Section>
        {hasOrganisms && (
          <Section id="organism" title="Organism-Specific Therapy" icon="🦠" accentColor="#f59e0b">
            {sc.organismSpecific.map((org, oi) => (
              <div key={oi} style={{ padding: "14px 0", borderBottom: oi < sc.organismSpecific.length - 1 ? "1px solid #1e293b" : "none" }}>
                <div style={{ fontWeight: 600, fontSize: "14px", color: "#f59e0b", marginBottom: "8px" }}>{org.organism}</div>
                <div style={{ display: "grid", gap: "6px" }}>
                  <div style={{ fontSize: "12px" }}>
                    <span style={{ color: "#64748b", fontWeight: 600 }}>Preferred: </span>
                    <span style={{ color: "#34d399" }}>{org.preferred}</span>
                  </div>
                  {org.alternative && (
                    <div style={{ fontSize: "12px" }}>
                      <span style={{ color: "#64748b", fontWeight: 600 }}>Alternative: </span>
                      <span style={{ color: "#fbbf24" }}>{org.alternative}</span>
                    </div>
                  )}
                  <div style={{ fontSize: "12px", color: "#94a3b8", lineHeight: 1.5, marginTop: "4px" }}>{org.notes}</div>
                </div>
              </div>
            ))}
          </Section>
        )}
        {sc.pearls && sc.pearls.length > 0 && (
          <Section id="pearls" title="Pharmacist Pearls & Clinical Tips" icon="💡" accentColor="#fbbf24">
            {sc.pearls.map((p, pi) => (
              <div key={pi} style={S.pearlBox}>💡 {p}</div>
            ))}
          </Section>
        )}
      </Layout>
    );
  }

  // ============================================================
  // MONOGRAPH VIEW
  // ============================================================
  if (navState === NAV_STATES.MONOGRAPH && selectedMonograph) {
    const dm = selectedMonograph;
    return (
      <Layout compact>
        <button style={S.backBtn} onClick={() => navigateTo(NAV_STATES.DISEASE_OVERVIEW, { disease: selectedDisease })}>← {selectedDisease?.name || "Back"}</button>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", marginBottom: "20px" }}>
          <div style={{ width: "56px", height: "56px", background: "linear-gradient(135deg, #0ea5e920, #38bdf820)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", flexShrink: 0 }}>💊</div>
          <div style={{ minWidth: 0 }}>
            <h1 style={{ fontSize: "24px", fontWeight: 700, margin: 0 }}>{dm.name}</h1>
            <div style={{ fontSize: "13px", color: "#94a3b8", marginTop: "4px" }}>{dm.brandNames}</div>
            <div style={{ marginTop: "6px" }}>
              <span style={{ ...S.tag, background: "#0ea5e920", color: "#38bdf8", border: "1px solid #0ea5e940" }}>{dm.drugClass}</span>
            </div>
            <CrossRefBadges drugId={dm.id} currentDiseaseId={selectedDisease?.id} />
          </div>
        </div>
        <ExpandCollapseBar />
        <Section id="moa" title="Mechanism of Action" icon="⚙" accentColor="#38bdf8">
          <p style={S.monographValue}>{dm.mechanismOfAction}</p>
        </Section>
        <Section id="spectrum" title="Spectrum of Activity" icon="🎯" accentColor="#34d399">
          <p style={S.monographValue}>{dm.spectrum}</p>
        </Section>
        <Section id="dosing" title="Dosing" icon="📐" accentColor="#a78bfa">
          {dm.dosing && Object.entries(dm.dosing).map(([key, val]) => (
            <div key={key} style={{ padding: "8px 0", borderBottom: "1px solid #1e293b20" }}>
              <span style={{ fontSize: "12px", fontWeight: 600, color: "#a78bfa", textTransform: "capitalize" }}>{key.replace(/_/g, " ")}: </span>
              <span style={{ fontSize: "13px", color: "#cbd5e1", fontFamily: "'IBM Plex Mono', monospace" }}>{val}</span>
            </div>
          ))}
        </Section>
        <Section id="renal" title="Renal Dose Adjustment" icon="🫘" accentColor="#f59e0b">
          <p style={S.monographValue}>{dm.renalAdjustment}</p>
        </Section>
        <Section id="hepatic" title="Hepatic Dose Adjustment" icon="🫁" accentColor="#f59e0b">
          <p style={S.monographValue}>{dm.hepaticAdjustment}</p>
        </Section>
        <Section id="ae" title="Adverse Effects" icon="⚠" accentColor="#ef4444">
          {dm.adverseEffects && (
            <div style={S.aeGrid}>
              <div style={aeCard("#fbbf24")}><div style={aeLabel("#fbbf24")}>Common</div><p style={{ fontSize: "13px", color: "#cbd5e1", lineHeight: 1.6, margin: 0 }}>{dm.adverseEffects.common}</p></div>
              <div style={aeCard("#ef4444")}><div style={aeLabel("#ef4444")}>Serious</div><p style={{ fontSize: "13px", color: "#cbd5e1", lineHeight: 1.6, margin: 0 }}>{dm.adverseEffects.serious}</p></div>
              <div style={aeCard("#64748b")}><div style={aeLabel("#94a3b8")}>Rare</div><p style={{ fontSize: "13px", color: "#cbd5e1", lineHeight: 1.6, margin: 0 }}>{dm.adverseEffects.rare}</p></div>
              {dm.adverseEffects.fdaBoxedWarnings && (
                <div style={{ ...aeCard("#ef4444"), background: "#7f1d1d20", border: "2px solid #ef444480" }}><div style={aeLabel("#ef4444")}>⬛ FDA BOXED WARNINGS</div><p style={{ fontSize: "13px", color: "#fca5a5", lineHeight: 1.6, margin: 0 }}>{dm.adverseEffects.fdaBoxedWarnings}</p></div>
              )}
              {dm.adverseEffects.contraindications && (
                <div style={aeCard("#ef4444")}><div style={aeLabel("#ef4444")}>Contraindications</div><p style={{ fontSize: "13px", color: "#cbd5e1", lineHeight: 1.6, margin: 0 }}>{dm.adverseEffects.contraindications}</p></div>
              )}
            </div>
          )}
        </Section>
        <Section id="interactions" title="Drug Interactions" icon="🔗" accentColor="#f59e0b">
          {dm.drugInteractions?.map((di, i) => (
            <div key={i} style={S.interactionItem}>{di}</div>
          ))}
        </Section>
        <Section id="monitoring" title="Monitoring Parameters" icon="📊" accentColor="#38bdf8">
          <p style={S.monographValue}>{dm.monitoring}</p>
        </Section>
        <Section id="pregnancy" title="Pregnancy & Lactation" icon="🤰" accentColor="#ec4899">
          <p style={S.monographValue}>{dm.pregnancyLactation}</p>
        </Section>
        <Section id="pharm-pearls" title="Pharmacist Pearls" icon="💡" accentColor="#fbbf24">
          {dm.pharmacistPearls?.map((p, pi) => (
            <div key={pi} style={S.pearlBox}>💡 {p}</div>
          ))}
        </Section>
      </Layout>
    );
  }

  return null;
}