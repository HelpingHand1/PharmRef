// ============================================================
// CONSTANTS & STYLES — PharmRef v3.0
// ============================================================
export const NAV_STATES = {
  HOME: "home",
  DISEASE_OVERVIEW: "disease_overview",
  SUBCATEGORY: "subcategory",
  MONOGRAPH: "monograph",
  COMPARE: "compare",
} as const;

// ============================================================
// THEME SYSTEM
// ============================================================
export const THEMES = {
  dark: {
    name: "dark",
    bg: "#0a0f1a",
    bgCard: "#111827",
    bgSection: "#0d1117",
    bgHeader: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    bgInput: "#0f172a",
    bgPearl: "#fef3c710",
    borderPearl: "#fef3c730",
    border: "#1e293b",
    borderAccent: "#1e3a5f",
    text: "#e2e8f0",
    textSecondary: "#94a3b8",
    textMuted: "#64748b",
    textHeading: "#f1f5f9",
    accent: "#38bdf8",
    accentHover: "#7dd3fc",
    scrollTrack: "#0a0f1a",
    scrollThumb: "#334155",
    scrollThumbHover: "#475569",
    topBtnBg: "#1e293b",
    topBtnBorder: "#334155",
    sectionHdrHover: "#1e293b",
  },
  light: {
    name: "light",
    bg: "#f8fafc",
    bgCard: "#ffffff",
    bgSection: "#f1f5f9",
    bgHeader: "linear-gradient(135deg, #e2e8f0 0%, #f1f5f9 100%)",
    bgInput: "#ffffff",
    bgPearl: "#fef3c740",
    borderPearl: "#fde68a80",
    border: "#e2e8f0",
    borderAccent: "#94a3b8",
    text: "#1e293b",
    textSecondary: "#475569",
    textMuted: "#94a3b8",
    textHeading: "#0f172a",
    accent: "#0284c7",
    accentHover: "#0369a1",
    scrollTrack: "#f1f5f9",
    scrollThumb: "#cbd5e1",
    scrollThumbHover: "#94a3b8",
    topBtnBg: "#e2e8f0",
    topBtnBorder: "#cbd5e1",
    sectionHdrHover: "#e2e8f0",
  },
};

// Inject global styles (print, scrollbar, focus, animations, responsive)
const GLOBAL_STYLE_ID = "pharmref-globals";
if (typeof document !== "undefined" && !document.getElementById(GLOBAL_STYLE_ID)) {
  const style = document.createElement("style");
  style.id = GLOBAL_STYLE_ID;
  style.textContent = `
    /* Smooth scrollbar — overridden per theme via CSS vars */
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: var(--pr-scroll-track, #0a0f1a); }
    ::-webkit-scrollbar-thumb { background: var(--pr-scroll-thumb, #334155); border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: var(--pr-scroll-thumb-hover, #475569); }

    /* Focus ring */
    *:focus-visible { outline: 2px solid var(--pr-accent, #0ea5e9); outline-offset: 2px; }

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
    .section-hdr:hover { background: var(--pr-section-hover, #1e293b) !important; }

    /* Card hover */
    .pr-card { transition: border-color 0.15s ease, transform 0.1s ease, box-shadow 0.15s ease; }
    .pr-card:hover { border-color: var(--pr-accent, #0ea5e9) !important; box-shadow: 0 0 0 1px var(--pr-accent-glow, #0ea5e920); }
    .pr-card:active { transform: scale(0.995); }

    /* Drug link hover */
    .drug-link:hover { color: var(--pr-accent-hover, #7dd3fc) !important; }

    /* Back-to-top animation */
    .top-btn { transition: opacity 0.2s ease, transform 0.2s ease; }
    .top-btn:hover { transform: translateY(-2px); background: #334155 !important; }

    /* Search focus */
    .search-input:focus { border-color: var(--pr-accent, #0ea5e9) !important; box-shadow: 0 0 0 2px var(--pr-accent-glow, #0ea5e920); }

    /* Cross-ref pill hover */
    .xref-pill:hover { background: #0ea5e920 !important; color: #38bdf8 !important; border-color: #0ea5e9 !important; }

    /* Toast animation */
    @keyframes toast-in { from { transform: translateX(120%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes toast-out { from { transform: translateX(0); opacity: 1; } to { transform: translateX(120%); opacity: 0; } }
    .pr-toast { animation: toast-in 0.3s ease forwards; }
    .pr-toast.leaving { animation: toast-out 0.3s ease forwards; }

    /* Copy button */
    .copy-btn { transition: all 0.15s ease; }
    .copy-btn:hover { background: #1e3a5f !important; color: #38bdf8 !important; }

    /* Allergy warning badge */
    @keyframes allergy-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
    .allergy-badge { animation: allergy-pulse 2s ease infinite; }

    /* Reading mode */
    .reading-mode main { max-width: 680px !important; }
    .reading-mode .section-content-anim { max-height: none !important; opacity: 1 !important; overflow: visible !important; }
    .reading-mode .section-hdr { cursor: default !important; }

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
      .compare-grid { grid-template-columns: 1fr !important; }
    }
  `;
  document.head.appendChild(style);
}

// ============================================================
// DYNAMIC STYLE GENERATOR (theme-aware)
// ============================================================
export function makeStyles(theme: "dark" | "light"): any {
  const t = THEMES[theme] || THEMES.dark;
  return {
    app: {
      minHeight: "100vh",
      background: t.bg,
      color: t.text,
      fontFamily: "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    },
    header: {
      background: t.bgHeader,
      borderBottom: `1px solid ${t.borderAccent}`,
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
      fontSize: "20px", fontWeight: 700, letterSpacing: "-0.5px", color: t.accent,
      cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", flexShrink: 0,
      userSelect: "none",
    },
    logoPill: {
      fontSize: "10px", fontWeight: 600, background: t.accent, color: t.bg,
      padding: "2px 8px", borderRadius: "9999px", letterSpacing: "0.5px",
    },
    searchWrap: { position: "relative", flex: 1, maxWidth: "500px", minWidth: "160px" },
    searchBox: {
      width: "100%", padding: "9px 36px 9px 38px", background: t.bgInput,
      border: `1px solid ${t.borderAccent}`, borderRadius: "8px", color: t.text,
      fontSize: "14px", outline: "none", boxSizing: "border-box",
      transition: "border-color 0.15s, box-shadow 0.15s",
    },
    searchIcon: { position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: t.textMuted, fontSize: "14px", pointerEvents: "none" },
    clearBtn: {
      position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)",
      background: "none", border: "none", color: t.textMuted, fontSize: "16px",
      cursor: "pointer", padding: "2px 6px", lineHeight: 1, borderRadius: "4px",
    },
    kbdHint: {
      position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)",
      color: "#475569", fontSize: "11px", fontFamily: "monospace",
      border: `1px solid ${t.border}`, borderRadius: "4px", padding: "1px 6px",
      pointerEvents: "none", lineHeight: "18px",
    },
    breadcrumbs: { display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: t.textMuted, flexWrap: "wrap" },
    breadcrumbLink: { color: t.accent, cursor: "pointer", textDecoration: "none", background: "none", border: "none", font: "inherit", padding: 0 },
    main: { maxWidth: "900px", margin: "0 auto", padding: "20px 16px 80px" },
    card: {
      background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: "10px",
      padding: "18px", marginBottom: "10px", cursor: "pointer",
    },
    sectionHeader: {
      display: "flex", alignItems: "center", justifyContent: "space-between",
      cursor: "pointer", padding: "12px 16px", background: t.bgCard,
      border: `1px solid ${t.border}`, borderRadius: "8px", marginBottom: "2px", userSelect: "none",
      transition: "background 0.1s ease",
    },
    sectionContent: {
      padding: "14px 16px", background: t.bgSection, border: `1px solid ${t.border}`,
      borderTop: "none", borderRadius: "0 0 8px 8px", marginBottom: "8px",
    },
    tag: { display: "inline-block", padding: "3px 10px", borderRadius: "9999px", fontSize: "11px", fontWeight: 600, letterSpacing: "0.3px" },
    drugLink: {
      color: t.accent, cursor: "pointer", textDecoration: "underline",
      textUnderlineOffset: "3px", background: "none", border: "none", font: "inherit", padding: 0,
    },
    pearlBox: {
      background: t.bgPearl, border: `1px solid ${t.borderPearl}`, borderRadius: "8px",
      padding: "12px 16px", marginBottom: "8px", fontSize: "13px", lineHeight: 1.65, color: "#fde68a",
    },
    monographLabel: { fontSize: "11px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: t.textMuted, marginBottom: "8px" },
    monographValue: { fontSize: "14px", lineHeight: 1.7, color: t.textSecondary },
    interactionItem: {
      padding: "10px 14px", background: t.bg, borderLeft: "3px solid #f59e0b",
      marginBottom: "6px", borderRadius: "0 6px 6px 0", fontSize: "13px", lineHeight: 1.6,
    },
    aeGrid: { display: "grid", gap: "10px" },
    backBtn: {
      display: "inline-flex", alignItems: "center", gap: "6px", color: t.accent,
      background: "none", border: "none", fontSize: "13px", cursor: "pointer",
      padding: "6px 0", marginBottom: "12px", fontFamily: "inherit",
    },
    expandAllBtn: {
      background: "none", border: `1px solid ${t.borderAccent}`, borderRadius: "6px",
      color: t.textMuted, fontSize: "11px", padding: "4px 10px", cursor: "pointer",
      fontFamily: "inherit", marginRight: "6px",
      transition: "color 0.15s, border-color 0.15s",
    },
    topBtn: {
      position: "fixed", bottom: "24px", right: "24px", width: "40px", height: "40px",
      borderRadius: "50%", background: t.topBtnBg, border: `1px solid ${t.topBtnBorder}`,
      color: t.textSecondary, fontSize: "18px", cursor: "pointer", display: "flex",
      alignItems: "center", justifyContent: "center", zIndex: 50,
      boxShadow: "0 4px 12px #0006",
    },
    crossRefPill: {
      display: "inline-block", fontSize: "10px", fontWeight: 600, padding: "2px 8px",
      borderRadius: "9999px", background: t.bgCard, color: t.textSecondary,
      border: `1px solid ${t.border}`, cursor: "pointer", marginRight: "4px", marginBottom: "4px",
      transition: "all 0.15s ease",
    },
    // --- NEW: Toast ---
    toast: {
      position: "fixed", bottom: "80px", right: "24px", zIndex: 200,
      background: "#1e293b", border: "1px solid #334155", borderRadius: "10px",
      padding: "10px 16px", color: "#e2e8f0", fontSize: "13px",
      boxShadow: "0 8px 32px #0008", maxWidth: "320px",
      display: "flex", alignItems: "center", gap: "8px",
    },
    // --- NEW: Copy button ---
    copyBtn: {
      background: "none", border: `1px solid ${t.border}`, borderRadius: "4px",
      color: t.textMuted, fontSize: "10px", padding: "2px 6px", cursor: "pointer",
      fontFamily: "'IBM Plex Mono', monospace", lineHeight: 1.4, flexShrink: 0,
    },
    // --- NEW: Theme toggle ---
    themeToggle: {
      background: "none", border: `1px solid ${t.borderAccent}`, borderRadius: "6px",
      color: t.textMuted, fontSize: "14px", padding: "4px 8px", cursor: "pointer",
      fontFamily: "inherit", transition: "all 0.15s",
      display: "flex", alignItems: "center", justifyContent: "center",
    },
    // --- NEW: Comparison view ---
    compareGrid: {
      display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px",
    },
    compareHeader: {
      fontSize: "16px", fontWeight: 700, color: t.accent, marginBottom: "12px",
      padding: "12px 16px", background: t.bgCard, border: `1px solid ${t.border}`,
      borderRadius: "8px", textAlign: "center",
    },
    compareCell: {
      padding: "10px 14px", background: t.bgCard, fontSize: "13px",
      lineHeight: 1.6, color: t.textSecondary,
    },
    compareLabelRow: {
      padding: "8px 14px", background: t.bgSection, fontSize: "11px",
      fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase",
      color: t.textMuted, gridColumn: "1 / -1",
    },
    // --- NEW: Allergy badge ---
    allergyBadge: {
      display: "inline-flex", alignItems: "center", gap: "4px",
      background: "#7f1d1d30", border: "1px solid #f8717140", borderRadius: "6px",
      padding: "3px 8px", fontSize: "10px", fontWeight: 600, color: "#f87171",
      letterSpacing: "0.3px",
    },
    // --- NEW: Header toolbar ---
    headerToolbar: {
      display: "flex", alignItems: "center", gap: "6px", flexShrink: 0,
    },
  };
}

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

export const getLineStyle = (lineName: string) => {
  const l = lineName.toLowerCase();
  if (l.includes("avoid") || l.includes("not recommended")) return TAG_COLORS.red;
  if (l.includes("newer agent") || l.includes("reserve")) return TAG_COLORS.red;
  if (l.includes("surgical") || l.includes("surgery")) return TAG_COLORS.pink;
  if (l.includes("dair") || l.includes("exchange") || l.includes("device")) return TAG_COLORS.pink;
  if (l.includes("drainage")) return TAG_COLORS.pink;
  if (l.includes("first") || l.includes("preferred")) return TAG_COLORS.green;
  if (l.includes("pre-biopsy") || l.includes("hold antibiotics")) return TAG_COLORS.emerald;
  if (l.includes("second") || l.includes("alternative")) return TAG_COLORS.yellow;
  if (l.includes("duration") || l.includes("monitoring")) return TAG_COLORS.purple;
  if (l.includes("adjunct") || l.includes("adjunctive")) return TAG_COLORS.purple;
  if (l.includes("microbiome") || l.includes("fmt") || l.includes("fecal")) return TAG_COLORS.emerald;
  if (l.includes("fulminant") || l.includes("severe")) return TAG_COLORS.red;
  if (l.includes("rectal") || l.includes("enema")) return TAG_COLORS.purple;
  if (l.includes("recurrence") || l.includes("recurrent")) return TAG_COLORS.yellow;
  if (l.includes("initial") || l.includes("non-severe")) return TAG_COLORS.green;
  if (l.includes("surgical") || l.includes("source control")) return TAG_COLORS.pink;
  if (l.includes("opat") || (l.includes("iv") && l.includes("po"))) return TAG_COLORS.cyan;
  if (l.includes("oral") && l.includes("step")) return TAG_COLORS.cyan;
  if (l.includes("pathogen") || l.includes("directed")) return TAG_COLORS.cyan;
  if (l.includes("intrathecal") || l.includes("intraventricular")) return TAG_COLORS.purple;
  if (l.includes("add") && (l.includes("mrsa") || l.includes("pseudo") || l.includes("listeria"))) return TAG_COLORS.pink;
  if (l.includes("prevention") || l.includes("bundle") || l.includes("stewardship")) return TAG_COLORS.cyan;
  if (l.includes("vap") && l.includes("mdr")) return TAG_COLORS.pink;
  if (l.includes("vap") || l.includes("hap")) return TAG_COLORS.blue;
  if (l.includes("empiric")) return TAG_COLORS.blue;
  if (l.includes("neonatal") || l.includes("neonate")) return TAG_COLORS.pink;
  if (l.includes("inpatient") || l.includes("iv")) return TAG_COLORS.blue;
  if (l.includes("outpatient") || l.includes("oral")) return TAG_COLORS.green;
  if (l.includes("abscess")) return TAG_COLORS.red;
  if (l.includes("mssa")) return TAG_COLORS.green;
  if (l.includes("mrsa")) return TAG_COLORS.yellow;
  if (l.includes("enterococcal")) return TAG_COLORS.purple;
  if (l.includes("streptococcal")) return TAG_COLORS.green;
  if (l.includes("staphylococcal")) return TAG_COLORS.yellow;
  if (l.includes("complicated")) return TAG_COLORS.yellow;
  if (l.includes("uncomplicated")) return TAG_COLORS.green;
  if (l.includes("post-") || l.includes("healthcare")) return TAG_COLORS.purple;
  return TAG_COLORS.blue;
};

export const aeCard = (color: string) => ({
  padding: "12px 16px", background: `${color}10`,
  border: `1px solid ${color}30`, borderRadius: "8px",
});
export const aeLabel = (color: string) => ({
  fontSize: "11px", fontWeight: 700, letterSpacing: "0.5px",
  textTransform: "uppercase", color, marginBottom: "6px",
});

// ============================================================
// CSS VARIABLE INJECTOR (call on theme change)
// ============================================================
export function applyThemeVars(themeName: "dark" | "light") {
  const t = THEMES[themeName] || THEMES.dark;
  const root = document.documentElement;
  root.style.setProperty("--pr-scroll-track", t.scrollTrack);
  root.style.setProperty("--pr-scroll-thumb", t.scrollThumb);
  root.style.setProperty("--pr-scroll-thumb-hover", t.scrollThumbHover);
  root.style.setProperty("--pr-accent", t.accent);
  root.style.setProperty("--pr-accent-hover", t.accentHover);
  root.style.setProperty("--pr-accent-glow", t.accent + "20");
  root.style.setProperty("--pr-section-hover", t.sectionHdrHover);
  document.body.style.background = t.bg;
}
