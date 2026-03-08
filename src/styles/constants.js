// ============================================================
// CONSTANTS & STYLES
// ============================================================
export const NAV_STATES = {
  HOME: "home",
  DISEASE_OVERVIEW: "disease_overview",
  SUBCATEGORY: "subcategory",
  MONOGRAPH: "monograph",
};

// Inject global styles (print, scrollbar, focus, animations, responsive)
const GLOBAL_STYLE_ID = "pharmref-globals";
if (typeof document !== "undefined" && !document.getElementById(GLOBAL_STYLE_ID)) {
  const style = document.createElement("style");
  style.id = GLOBAL_STYLE_ID;
  style.textContent = `
    /* Smooth scrollbar */
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: #0a0f1a; }
    ::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: #475569; }

    /* Focus ring */
    *:focus-visible { outline: 2px solid #0ea5e9; outline-offset: 2px; }

    /* Section content expand/collapse animation */
    .section-content-anim {
      overflow: hidden;
      transition: max-height 0.25s ease-out, opacity 0.2s ease-out, padding 0.25s ease-out;
    }
    .section-content-anim.collapsed {
      max-height: 0 !important;
      opacity: 0;
      padding-top: 0 !important;
      padding-bottom: 0 !important;
    }
    .section-content-anim.expanded {
      max-height: 50000px;
      opacity: 1;
    }

    /* Section header hover */
    .section-hdr:hover { background: #1e293b !important; }

    /* Card hover */
    .pr-card { transition: border-color 0.15s ease, transform 0.1s ease, box-shadow 0.15s ease; }
    .pr-card:hover { border-color: #0ea5e9 !important; box-shadow: 0 0 0 1px #0ea5e920; }
    .pr-card:active { transform: scale(0.995); }

    /* Drug link hover */
    .drug-link:hover { color: #7dd3fc !important; }

    /* Quick nav pill active */
    .qnav-pill { transition: all 0.15s ease; }
    .qnav-pill:hover { background: #1e3a5f !important; color: #38bdf8 !important; border-color: #0ea5e9 !important; }

    /* Back-to-top animation */
    .top-btn { transition: opacity 0.2s ease, transform 0.2s ease; }
    .top-btn:hover { transform: translateY(-2px); background: #334155 !important; }

    /* Search focus */
    .search-input:focus { border-color: #0ea5e9 !important; box-shadow: 0 0 0 2px #0ea5e920; }

    /* Cross-ref pill hover */
    .xref-pill:hover { background: #0ea5e920 !important; color: #38bdf8 !important; border-color: #0ea5e9 !important; }

    /* Print styles */
    @media print {
      body { background: #fff !important; color: #111 !important; }
      .no-print, .top-btn, button[title="Back to top"], header { display: none !important; }
      .pr-card, [class*="section"] { border: 1px solid #ccc !important; background: #fff !important; color: #111 !important; }
      .section-content-anim { max-height: none !important; opacity: 1 !important; overflow: visible !important; }
      * { color: #111 !important; background: transparent !important; }
      a { text-decoration: underline; }
    }

    /* Mobile responsive */
    @media (max-width: 640px) {
      .home-grid { grid-template-columns: 1fr !important; }
      .monograph-pills { gap: 4px !important; }
      .monograph-pills > button { font-size: 11px !important; padding: 4px 8px !important; }
      .stat-row { gap: 12px !important; }
    }
  `;
  document.head.appendChild(style);
}

export const S = {
  app: {
    minHeight: "100vh",
    background: "#0a0f1a",
    color: "#e2e8f0",
    fontFamily: "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  header: {
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    borderBottom: "1px solid #1e3a5f",
    padding: "12px 20px",
    position: "sticky",
    top: 0,
    zIndex: 100,
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
  },
  headerTop: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    marginBottom: "8px", gap: "12px", flexWrap: "wrap",
  },
  logo: {
    fontSize: "20px", fontWeight: 700, letterSpacing: "-0.5px", color: "#38bdf8",
    cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", flexShrink: 0,
    userSelect: "none",
  },
  logoPill: {
    fontSize: "10px", fontWeight: 600, background: "#0ea5e9", color: "#0a0f1a",
    padding: "2px 8px", borderRadius: "9999px", letterSpacing: "0.5px",
  },
  searchWrap: { position: "relative", flex: 1, maxWidth: "500px", minWidth: "160px" },
  searchBox: {
    width: "100%", padding: "9px 36px 9px 38px", background: "#0f172a",
    border: "1px solid #1e3a5f", borderRadius: "8px", color: "#e2e8f0",
    fontSize: "14px", outline: "none", boxSizing: "border-box",
    transition: "border-color 0.15s, box-shadow 0.15s",
  },
  searchIcon: { position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#64748b", fontSize: "14px", pointerEvents: "none" },
  clearBtn: {
    position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)",
    background: "none", border: "none", color: "#64748b", fontSize: "16px",
    cursor: "pointer", padding: "2px 6px", lineHeight: 1, borderRadius: "4px",
  },
  kbdHint: {
    position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)",
    color: "#475569", fontSize: "11px", fontFamily: "monospace",
    border: "1px solid #334155", borderRadius: "4px", padding: "1px 6px",
    pointerEvents: "none", lineHeight: "18px",
  },
  breadcrumbs: { display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#64748b", flexWrap: "wrap" },
  breadcrumbLink: { color: "#38bdf8", cursor: "pointer", textDecoration: "none", background: "none", border: "none", font: "inherit", padding: 0 },
  main: { maxWidth: "900px", margin: "0 auto", padding: "20px 16px 80px" },
  card: {
    background: "#111827", border: "1px solid #1e293b", borderRadius: "10px",
    padding: "18px", marginBottom: "10px", cursor: "pointer",
  },
  sectionHeader: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    cursor: "pointer", padding: "12px 16px", background: "#111827",
    border: "1px solid #1e293b", borderRadius: "8px", marginBottom: "2px", userSelect: "none",
    transition: "background 0.1s ease",
  },
  sectionContent: {
    padding: "14px 16px", background: "#0d1117", border: "1px solid #1e293b",
    borderTop: "none", borderRadius: "0 0 8px 8px", marginBottom: "8px",
  },
  tag: { display: "inline-block", padding: "3px 10px", borderRadius: "9999px", fontSize: "11px", fontWeight: 600, letterSpacing: "0.3px" },
  drugLink: {
    color: "#38bdf8", cursor: "pointer", textDecoration: "underline",
    textUnderlineOffset: "3px", background: "none", border: "none", font: "inherit", padding: 0,
  },
  pearlBox: {
    background: "#fef3c710", border: "1px solid #fef3c730", borderRadius: "8px",
    padding: "12px 16px", marginBottom: "8px", fontSize: "13px", lineHeight: 1.65, color: "#fde68a",
  },
  monographLabel: { fontSize: "11px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "#64748b", marginBottom: "8px" },
  monographValue: { fontSize: "14px", lineHeight: 1.7, color: "#cbd5e1" },
  interactionItem: {
    padding: "10px 14px", background: "#0a0f1a", borderLeft: "3px solid #f59e0b",
    marginBottom: "6px", borderRadius: "0 6px 6px 0", fontSize: "13px", lineHeight: 1.6,
  },
  aeGrid: { display: "grid", gap: "10px" },
  backBtn: {
    display: "inline-flex", alignItems: "center", gap: "6px", color: "#38bdf8",
    background: "none", border: "none", fontSize: "13px", cursor: "pointer",
    padding: "6px 0", marginBottom: "12px", fontFamily: "inherit",
  },
  expandAllBtn: {
    background: "none", border: "1px solid #1e3a5f", borderRadius: "6px",
    color: "#64748b", fontSize: "11px", padding: "4px 10px", cursor: "pointer",
    fontFamily: "inherit", marginRight: "6px",
    transition: "color 0.15s, border-color 0.15s",
  },
  topBtn: {
    position: "fixed", bottom: "24px", right: "24px", width: "40px", height: "40px",
    borderRadius: "50%", background: "#1e293b", border: "1px solid #334155",
    color: "#94a3b8", fontSize: "18px", cursor: "pointer", display: "flex",
    alignItems: "center", justifyContent: "center", zIndex: 50,
    boxShadow: "0 4px 12px #0006",
  },
  crossRefPill: {
    display: "inline-block", fontSize: "10px", fontWeight: 600, padding: "2px 8px",
    borderRadius: "9999px", background: "#1e293b", color: "#94a3b8",
    border: "1px solid #334155", cursor: "pointer", marginRight: "4px", marginBottom: "4px",
    transition: "all 0.15s ease",
  },
  // Quick-nav bar for section jumping
  quickNav: {
    display: "flex", flexWrap: "wrap", gap: "4px", padding: "8px 0", marginBottom: "8px",
    borderBottom: "1px solid #1e293b20",
  },
  quickNavPill: {
    background: "#111827", border: "1px solid #1e293b", borderRadius: "6px",
    padding: "4px 10px", color: "#64748b", fontSize: "11px", fontWeight: 500,
    cursor: "pointer", fontFamily: "inherit",
  },
};

export const TAG_COLORS = {
  green: { background: "#065f4620", color: "#34d399", border: "1px solid #065f4640" },
  yellow: { background: "#92400e20", color: "#fbbf24", border: "1px solid #92400e40" },
  red: { background: "#7f1d1d20", color: "#f87171", border: "1px solid #7f1d1d40" },
  blue: { background: "#1e3a5f20", color: "#60a5fa", border: "1px solid #1e3a5f40" },
  purple: { background: "#4a1d7520", color: "#c084fc", border: "1px solid #4a1d7540" },
  cyan: { background: "#0e4a5f20", color: "#22d3ee", border: "1px solid #0e4a5f40" },
  pink: { background: "#7f1d4e20", color: "#f472b6", border: "1px solid #7f1d4e40" },
  emerald: { background: "#064e3b20", color: "#6ee7b7", border: "1px solid #064e3b40" },
};

export const getLineStyle = (lineName) => {
  const l = lineName.toLowerCase();
  // Negative / avoid
  if (l.includes("avoid") || l.includes("not recommended")) return TAG_COLORS.red;
  if (l.includes("newer agent") || l.includes("reserve")) return TAG_COLORS.red;
  // Surgical / procedural
  if (l.includes("surgical") || l.includes("surgery")) return TAG_COLORS.pink;
  if (l.includes("dair") || l.includes("exchange") || l.includes("device")) return TAG_COLORS.pink;
  if (l.includes("drainage")) return TAG_COLORS.pink;
  // Preferred / first-line
  if (l.includes("first") || l.includes("preferred")) return TAG_COLORS.green;
  if (l.includes("pre-biopsy") || l.includes("hold antibiotics")) return TAG_COLORS.emerald;
  // Alternative / second-line
  if (l.includes("second") || l.includes("alternative")) return TAG_COLORS.yellow;
  // Duration / monitoring
  if (l.includes("duration") || l.includes("monitoring")) return TAG_COLORS.purple;
  if (l.includes("adjunct") || l.includes("adjunctive")) return TAG_COLORS.purple;
  // Microbiome / FMT
  if (l.includes("microbiome") || l.includes("fmt") || l.includes("fecal")) return TAG_COLORS.emerald;
  // Severity-based
  if (l.includes("fulminant") || l.includes("severe")) return TAG_COLORS.red;
  if (l.includes("rectal")) return TAG_COLORS.pink;
  // OPAT / transition
  if (l.includes("opat") || (l.includes("iv") && l.includes("po"))) return TAG_COLORS.cyan;
  if (l.includes("oral") && l.includes("step")) return TAG_COLORS.cyan;
  // Pathogen-directed
  if (l.includes("pathogen") || l.includes("directed")) return TAG_COLORS.cyan;
  // Intrathecal / intraventricular
  if (l.includes("intrathecal") || l.includes("intraventricular")) return TAG_COLORS.purple;
  // Add-on coverage
  if (l.includes("add") && (l.includes("mrsa") || l.includes("pseudo") || l.includes("listeria"))) return TAG_COLORS.pink;
  // Specific tier patterns
  if (l.includes("prevention") || l.includes("bundle") || l.includes("stewardship")) return TAG_COLORS.cyan;
  if (l.includes("vap") && l.includes("mdr")) return TAG_COLORS.pink;
  if (l.includes("vap") || l.includes("hap")) return TAG_COLORS.blue;
  if (l.includes("empiric")) return TAG_COLORS.blue;
  if (l.includes("neonatal") || l.includes("neonate")) return TAG_COLORS.pink;
  if (l.includes("inpatient") || l.includes("iv")) return TAG_COLORS.blue;
  if (l.includes("outpatient") || l.includes("oral")) return TAG_COLORS.green;
  if (l.includes("abscess")) return TAG_COLORS.red;
  // Specific organisms
  if (l.includes("mssa")) return TAG_COLORS.green;
  if (l.includes("mrsa")) return TAG_COLORS.yellow;
  if (l.includes("enterococcal")) return TAG_COLORS.purple;
  if (l.includes("streptococcal")) return TAG_COLORS.green;
  if (l.includes("staphylococcal")) return TAG_COLORS.yellow;
  // Complicated / uncomplicated
  if (l.includes("complicated")) return TAG_COLORS.yellow;
  if (l.includes("uncomplicated")) return TAG_COLORS.green;
  // Post-surgical / post-trauma
  if (l.includes("post-") || l.includes("healthcare")) return TAG_COLORS.purple;
  return TAG_COLORS.blue;
};

export const aeCard = (color) => ({
  padding: "12px 16px", background: `${color}10`,
  border: `1px solid ${color}30`, borderRadius: "8px",
});
export const aeLabel = (color) => ({
  fontSize: "11px", fontWeight: 700, letterSpacing: "0.5px",
  textTransform: "uppercase", color, marginBottom: "6px",
});

// Deprecated — replaced by CSS class .pr-card:hover
export const cardHover = (e, on) => {};