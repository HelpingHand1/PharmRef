// ============================================================
// CONSTANTS & STYLES — PharmRef v3.0
// ============================================================
export const NAV_STATES = {
  HOME: "home",
  DISEASE_OVERVIEW: "disease_overview",
  SUBCATEGORY: "subcategory",
  MONOGRAPH: "monograph",
  PATHOGEN: "pathogen",
  COMPARE: "compare",
  CALCULATORS: "calculators",
  BREAKPOINTS: "breakpoints",
} as const;

// ============================================================
// THEME SYSTEM
// ============================================================
export const THEMES = {
  dark: {
    name: "dark",
    bg: "#0f172a",
    bgCard: "rgba(15, 23, 42, 0.86)",
    bgSection: "rgba(15, 23, 42, 0.64)",
    bgHeader: "linear-gradient(135deg, rgba(8, 15, 31, 0.92) 0%, rgba(15, 23, 42, 0.94) 50%, rgba(12, 74, 110, 0.84) 100%)",
    bgInput: "rgba(15, 23, 42, 0.88)",
    bgPearl: "#fde68a12",
    borderPearl: "#f59e0b3d",
    border: "#263449",
    borderAccent: "#36506e",
    text: "#e5eef8",
    textSecondary: "#c3d0e0",
    textMuted: "#8ea1bb",
    textHeading: "#f8fbff",
    accent: "#7dd3fc",
    accentHover: "#bae6fd",
    accentSurface: "#38bdf814",
    accentSurfaceStrong: "#38bdf826",
    heroGlow: "#0ea5e918",
    scrollTrack: "#0f172a",
    scrollThumb: "#486581",
    scrollThumbHover: "#5b7894",
    topBtnBg: "rgba(15, 23, 42, 0.94)",
    topBtnBorder: "#36506e",
    topBtnHoverBg: "#1e334b",
    sectionHdrHover: "rgba(30, 41, 59, 0.92)",
    shadowSm: "0 4px 18px rgba(2, 8, 23, 0.22)",
    shadowMd: "0 14px 34px rgba(2, 8, 23, 0.30)",
    shadowLg: "0 22px 60px rgba(2, 8, 23, 0.44)",
    overlay: "rgba(2, 8, 23, 0.58)",
    codeBg: "rgba(15, 23, 42, 0.72)",
  },
  oled: {
    name: "oled",
    bg: "#000000",
    bgCard: "rgba(5, 5, 5, 0.98)",
    bgSection: "rgba(10, 10, 10, 0.96)",
    bgHeader: "linear-gradient(135deg, rgba(0, 0, 0, 0.98) 0%, rgba(5, 5, 5, 0.96) 50%, rgba(8, 20, 36, 0.92) 100%)",
    bgInput: "rgba(8, 8, 8, 0.96)",
    bgPearl: "#fde68a0d",
    borderPearl: "#f59e0b28",
    border: "#1a2538",
    borderAccent: "#243347",
    text: "#e5eef8",
    textSecondary: "#c3d0e0",
    textMuted: "#7a8fa8",
    textHeading: "#f8fbff",
    accent: "#7dd3fc",
    accentHover: "#bae6fd",
    accentSurface: "#38bdf80d",
    accentSurfaceStrong: "#38bdf81a",
    heroGlow: "#0ea5e910",
    scrollTrack: "#000000",
    scrollThumb: "#2d4a66",
    scrollThumbHover: "#3d5f80",
    topBtnBg: "rgba(5, 5, 5, 0.98)",
    topBtnBorder: "#243347",
    topBtnHoverBg: "#0d1a2b",
    sectionHdrHover: "rgba(10, 15, 25, 0.96)",
    shadowSm: "0 4px 18px rgba(0, 0, 0, 0.5)",
    shadowMd: "0 14px 34px rgba(0, 0, 0, 0.6)",
    shadowLg: "0 22px 60px rgba(0, 0, 0, 0.7)",
    overlay: "rgba(0, 0, 0, 0.72)",
    codeBg: "rgba(5, 5, 5, 0.96)",
  },
  light: {
    name: "light",
    bg: "#f3f5f1",
    bgCard: "rgba(255, 253, 249, 0.92)",
    bgSection: "rgba(248, 250, 247, 0.92)",
    bgHeader: "linear-gradient(135deg, rgba(255, 252, 247, 0.98) 0%, rgba(245, 248, 243, 0.97) 58%, rgba(224, 242, 254, 0.94) 100%)",
    bgInput: "#fffefd",
    bgPearl: "#fff7db",
    borderPearl: "#f2cb67",
    border: "#d7dfd4",
    borderAccent: "#c6d3dc",
    text: "#172033",
    textSecondary: "#475569",
    textMuted: "#5b6a80",
    textHeading: "#0f172a",
    accent: "#0f766e",
    accentHover: "#115e59",
    accentSurface: "#0f766e10",
    accentSurfaceStrong: "#0f766e18",
    heroGlow: "#38bdf818",
    scrollTrack: "#eef2f5",
    scrollThumb: "#c3cdd8",
    scrollThumbHover: "#94a3b8",
    topBtnBg: "rgba(255, 253, 249, 0.96)",
    topBtnBorder: "#cbd5df",
    topBtnHoverBg: "#f1f5f9",
    sectionHdrHover: "rgba(241, 245, 249, 0.95)",
    shadowSm: "0 6px 18px rgba(15, 23, 42, 0.06)",
    shadowMd: "0 16px 34px rgba(15, 23, 42, 0.08)",
    shadowLg: "0 28px 64px rgba(15, 23, 42, 0.12)",
    overlay: "rgba(15, 23, 42, 0.42)",
    codeBg: "#f8fafc",
  },
};

// Status and tag ink colors. The bright set reads on dark surfaces; light mode swaps in
// darker shades so small text clears WCAG AA (4.5:1). Applied as CSS variables, so inline
// styles can use `var(--pr-success, #059669)` and switch instantly with the theme.
const BRIGHT_INK = {
  success: "#34d399", warning: "#fbbf24", danger: "#f87171", info: "#38bdf8", neutral: "#94a3b8",
  "tag-green": "#34d399", "tag-yellow": "#fbbf24", "tag-red": "#f87171", "tag-blue": "#60a5fa",
  "tag-purple": "#c084fc", "tag-cyan": "#22d3ee", "tag-pink": "#f472b6", "tag-emerald": "#5eead4",
};
const LIGHT_INK: typeof BRIGHT_INK = {
  success: "#047857", warning: "#b45309", danger: "#b91c1c", info: "#0369a1", neutral: "#475569",
  "tag-green": "#047857", "tag-yellow": "#a16207", "tag-red": "#b91c1c", "tag-blue": "#1d4ed8",
  "tag-purple": "#7e22ce", "tag-cyan": "#0e7490", "tag-pink": "#be185d", "tag-emerald": "#0f766e",
};

const ACCENT_INK_TOKENS: Record<string, keyof typeof BRIGHT_INK> = {
  "#34d399": "tag-green", "#10b981": "tag-green", "#059669": "success",
  "#fbbf24": "tag-yellow", "#f59e0b": "warning", "#d97706": "warning",
  "#f87171": "tag-red", "#ef4444": "danger", "#dc2626": "danger",
  "#38bdf8": "info", "#0ea5e9": "info", "#0284c7": "info", "#60a5fa": "tag-blue",
  "#a78bfa": "tag-purple", "#c084fc": "tag-purple", "#22d3ee": "tag-cyan", "#06b6d4": "tag-cyan",
  "#f472b6": "tag-pink", "#ec4899": "tag-pink", "#5eead4": "tag-emerald", "#14b8a6": "tag-emerald",
  "#94a3b8": "neutral", "#64748b": "neutral",
};

// For accent colors that come from data and are reused as text: theme-aware ink when known.
export function inkFor(accent: string | undefined): string | undefined {
  if (!accent) return accent;
  const token = ACCENT_INK_TOKENS[accent.toLowerCase()];
  return token ? `var(--pr-${token}, ${accent})` : accent;
}

// Inject global styles (print, scrollbar, focus, animations, responsive)
const GLOBAL_STYLE_ID = "pharmref-globals";
if (typeof document !== "undefined" && !document.getElementById(GLOBAL_STYLE_ID)) {
  const style = document.createElement("style");
  style.id = GLOBAL_STYLE_ID;
  style.textContent = `
    body {
      transition: background 0.2s ease, color 0.2s ease;
    }

    /* Smooth scrollbar — overridden per theme via CSS vars */
    ::-webkit-scrollbar { width: 10px; height: 10px; }
    ::-webkit-scrollbar-track { background: var(--pr-scroll-track, #0a0f1a); }
    ::-webkit-scrollbar-thumb {
      background: var(--pr-scroll-thumb, #334155);
      border-radius: 999px;
      border: 2px solid var(--pr-scroll-track, #0a0f1a);
    }
    ::-webkit-scrollbar-thumb:hover { background: var(--pr-scroll-thumb-hover, #475569); }

    /* Focus ring */
    *:focus-visible { outline: 3px solid var(--pr-accent, #0ea5e9); outline-offset: 2px; }

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
    .pr-card { transition: border-color 0.18s ease, transform 0.16s ease, box-shadow 0.18s ease, background 0.18s ease; }
    .pr-card:hover { border-color: var(--pr-accent, #0ea5e9) !important; box-shadow: var(--pr-card-hover-shadow, 0 20px 50px rgba(15, 23, 42, 0.12)); transform: translateY(-2px); }
    .pr-card:active { transform: translateY(0); }

    /* Drug link hover */
    .drug-link:hover { color: var(--pr-accent-hover, #7dd3fc) !important; }

    /* Back-to-top animation */
    .top-btn { transition: opacity 0.2s ease, transform 0.2s ease; }
    .top-btn:hover { transform: translateY(-2px); background: var(--pr-top-btn-hover, #334155) !important; }

    /* Search focus */
    .search-input:focus { border-color: var(--pr-accent, #0ea5e9) !important; box-shadow: 0 0 0 2px var(--pr-accent-glow, #0ea5e920); }

    /* Cross-ref pill hover */
    .xref-pill:hover { background: var(--pr-accent-soft, #0ea5e920) !important; color: var(--pr-accent, #38bdf8) !important; border-color: var(--pr-accent, #0ea5e9) !important; }

    /* Toast animation */
    @keyframes toast-in { from { transform: translateX(120%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes toast-out { from { transform: translateX(0); opacity: 1; } to { transform: translateX(120%); opacity: 0; } }
    .pr-toast { animation: toast-in 0.3s ease forwards; }
    .pr-toast.leaving { animation: toast-out 0.3s ease forwards; }

    /* Copy button */
    .copy-btn { transition: all 0.15s ease; }
    .copy-btn:hover { background: var(--pr-accent-soft, #1e3a5f) !important; color: var(--pr-accent, #38bdf8) !important; border-color: var(--pr-accent, #0ea5e9) !important; }

    /* Allergy warning badge */
    @keyframes allergy-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
    .allergy-badge { animation: allergy-pulse 2s ease infinite; }

    /* Reading mode */
    .reading-mode main { max-width: 680px !important; }
    .reading-mode .section-content-anim { max-height: none !important; opacity: 1 !important; overflow: visible !important; }
    .reading-mode .section-hdr { cursor: default !important; }

    /* Loading spinner */
    @keyframes pr-spin { to { transform: rotate(360deg); } }
    .pr-spinner {
      width: 24px; height: 24px; border-radius: 50%;
      border: 3px solid var(--pr-accent, #0ea5e9);
      border-top-color: transparent;
      animation: pr-spin 0.8s linear infinite;
      display: inline-block;
    }

    /* Page fade-in */
    @keyframes pr-fade-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
    .pr-fade-in { animation: pr-fade-in 0.2s ease-out; }

    /* Command palette and modal entrance */
    @keyframes palette-in { from { opacity: 0; transform: translateY(-12px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }

    /* Route transition */
    .app-main { animation: pr-fade-in 0.2s ease-out; }

    /* Reduced motion accessibility */
    @media (prefers-reduced-motion: reduce) {
      .section-content-anim { transition: none !important; }
      .pr-card { transition: none !important; }
      .pr-card:hover { transform: none !important; }
      .top-btn { transition: none !important; }
      .pr-toast { animation: none !important; opacity: 1 !important; transform: translateX(0) !important; }
      .allergy-badge { animation: none !important; }
      .pr-spinner { animation: none !important; border-top-color: var(--pr-accent, #0ea5e9); opacity: 0.5; }
      .pr-fade-in { animation: none !important; }
      .app-main { animation: none !important; }
      * { scroll-behavior: auto !important; }
    }

    /* Print styles */
    @media print {
      body { background: #fff !important; color: #111 !important; }
      .no-print, .top-btn, button[title="Back to top"], header { display: none !important; }
      .pr-card, [class*="section"] { border: 1px solid #ccc !important; background: #fff !important; color: #111 !important; }
      .section-content-anim { max-height: none !important; opacity: 1 !important; overflow: visible !important; }
      * { color: #111 !important; background: transparent !important; }
      a { text-decoration: underline; }
    }

    /* Tablet responsive */
    @media (max-width: 900px) {
      .app-main {
        padding: 24px 16px 88px !important;
      }

      .home-hero,
      .page-hero {
        padding: 22px !important;
      }

      .page-hero-body {
        gap: 14px !important;
      }

      .results-grid,
      .home-actions,
      .home-recent-grid,
      .home-hero-grid {
        grid-template-columns: 1fr !important;
      }

      .home-hero-copy {
        max-width: none !important;
      }
    }

    /* Keyboard-only affordances are noise on touch screens */
    @media (hover: none) and (pointer: coarse) {
      .cmdk-btn { display: none !important; }
    }

    /* Mobile responsive */
    @media (max-width: 640px) {
      /* Two-row header: logo + tools, then search; breadcrumbs drop away once scrolled */
      .app-header {
        padding: 10px 12px !important;
      }

      .header-row {
        display: grid !important;
        grid-template-columns: auto 1fr !important;
        grid-template-areas: "logo tools" "search search" !important;
        align-items: center !important;
        gap: 8px 10px !important;
        margin-bottom: 8px !important;
      }

      .header-row > button:first-child {
        grid-area: logo;
        font-size: 19px !important;
      }

      .logo-pill,
      .badge-unit {
        display: none !important;
      }

      .search-wrap {
        grid-area: search;
        width: 100% !important;
        max-width: none !important;
        min-width: 0 !important;
      }

      .search-input {
        padding-top: 11px !important;
        padding-bottom: 11px !important;
      }

      .header-toolbar {
        grid-area: tools;
        justify-content: flex-end !important;
        flex-wrap: wrap !important;
        gap: 6px !important;
      }

      .header-toolbar > button {
        min-width: 40px;
        height: 40px;
        padding: 8px !important;
      }

      .app-header.is-scrolled .header-row {
        margin-bottom: 0 !important;
      }

      .app-header.is-scrolled .breadcrumbs-row {
        display: none !important;
      }

      .breadcrumbs-row {
        gap: 6px !important;
      }

      /* Phone home: tools as chips, topics up front; desktop keeps the hero and cards */
      .home-hero,
      .home-actions {
        display: none !important;
      }

      .home-tool-chips {
        display: flex !important;
      }

      .home-recent-list > :nth-child(n+4) {
        display: none !important;
      }

      .page-hero .quick-facts-grid {
        display: none !important;
      }

      .app-main {
        padding: 18px 12px 80px !important;
      }

      .home-hero,
      .page-hero {
        padding: 18px !important;
        margin-bottom: 18px !important;
      }

      .home-hero h1,
      .page-hero h1 {
        font-size: 26px !important;
      }

      .home-hero-copy,
      .page-hero-copy {
        max-width: none !important;
      }

      .page-hero-icon {
        width: 52px !important;
        height: 52px !important;
        border-radius: 16px !important;
        font-size: 24px !important;
      }

      .section-meta-row {
        display: grid !important;
        gap: 6px !important;
      }

      .expand-bar {
        justify-content: stretch !important;
      }

      .expand-bar > button {
        flex: 1 1 0 !important;
      }

      .home-grid,
      .results-grid,
      .home-actions,
      .home-recent-grid,
      .home-hero-grid,
      .compare-grid,
      .compare-select-grid {
        grid-template-columns: 1fr !important;
      }

      .disease-card,
      .result-card,
      .recent-card,
      .action-card,
      .mono-grid-card {
        padding: 14px 15px !important;
      }

      .detail-row,
      .quick-facts-grid {
        grid-template-columns: 1fr !important;
      }

      .detail-row {
        gap: 6px !important;
      }

      .disease-card {
        align-items: flex-start !important;
      }

      .disease-card-arrow {
        display: none !important;
      }

      .monograph-pills {
        gap: 6px !important;
      }

      .monograph-pills > button {
        font-size: 12px !important;
        padding: 7px 11px !important;
      }

      .xref-row {
        display: grid !important;
        gap: 6px !important;
      }

      .xref-row > span:first-child {
        margin-right: 0 !important;
      }

      .pr-toast {
        left: 12px !important;
        right: 12px !important;
        bottom: 16px !important;
        max-width: none !important;
      }

      .modal-panel {
        padding: 18px !important;
        border-radius: 18px !important;
      }

      .allergy-form {
        grid-template-columns: 1fr !important;
      }

      .allergy-form > button,
      .allergy-form > select {
        width: 100% !important;
      }

      .modal-panel-sm button {
        width: 100% !important;
      }

      .section-hdr {
        padding: 12px 14px !important;
      }

      .section-content-anim.expanded {
        max-height: 80000px;
      }
    }
  `;
  document.head.appendChild(style);
}

// ============================================================
// DYNAMIC STYLE GENERATOR (theme-aware)
// ============================================================
export function makeStyles(theme: "dark" | "light" | "oled"): any {
  const t = THEMES[theme] || THEMES.dark;
  return {
    meta: {
      accent: t.accent,
      accentHover: t.accentHover,
      accentSurface: t.accentSurface,
      accentSurfaceStrong: t.accentSurfaceStrong,
      textHeading: t.textHeading,
      textMuted: t.textMuted,
      bgSection: t.bgSection,
      border: t.border,
      codeBg: t.codeBg,
      shadowSm: t.shadowSm,
      shadowMd: t.shadowMd,
    },
    app: {
      minHeight: "100vh",
      background: `radial-gradient(circle at top left, ${t.accentSurfaceStrong} 0%, transparent 28%), radial-gradient(circle at 85% 8%, ${t.heroGlow} 0%, transparent 22%), ${t.bg}`,
      color: t.text,
      fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, sans-serif",
      letterSpacing: "-0.01em",
    },
    header: {
      background: t.bgHeader,
      borderBottom: `1px solid ${t.borderAccent}`,
      padding: "16px 20px 14px",
      position: "sticky",
      top: 0,
      zIndex: 100,
      boxShadow: t.shadowSm,
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
    },
    headerTop: {
      display: "flex", alignItems: "center", justifyContent: "space-between",
      marginBottom: "10px", gap: "14px", flexWrap: "wrap",
    },
    logo: {
      fontSize: "22px", fontWeight: 800, letterSpacing: "-0.04em", color: t.textHeading,
      cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", flexShrink: 0,
      userSelect: "none",
    },
    logoPill: {
      fontSize: "11px", fontWeight: 700, background: t.accent, color: theme === "dark" ? "#082f49" : "#ecfeff",
      padding: "4px 10px", borderRadius: "9999px", letterSpacing: "0.08em",
    },
    searchWrap: { position: "relative", flex: 1, maxWidth: "620px", minWidth: "180px" },
    searchBox: {
      width: "100%", padding: "13px 46px 13px 44px", background: t.bgInput,
      border: `1px solid ${t.border}`, borderRadius: "14px", color: t.text,
      fontSize: "15px", outline: "none", boxSizing: "border-box",
      transition: "border-color 0.15s, box-shadow 0.15s",
      boxShadow: theme === "dark" ? "inset 0 1px 0 rgba(255,255,255,0.03)" : "inset 0 1px 0 rgba(255,255,255,0.9)",
    },
    searchIcon: { position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: t.textMuted, fontSize: "15px", pointerEvents: "none" },
    clearBtn: {
      position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)",
      background: t.accentSurface, border: "none", color: t.textMuted, fontSize: "16px",
      cursor: "pointer", padding: 0, lineHeight: 1, borderRadius: "10px",
      width: "28px", height: "28px",
    },
    kbdHint: {
      position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)",
      color: t.textMuted, fontSize: "12px", fontFamily: "'JetBrains Mono', monospace",
      border: `1px solid ${t.border}`, borderRadius: "8px", padding: "3px 7px",
      pointerEvents: "none", lineHeight: 1, background: t.bgSection,
    },
    breadcrumbs: { display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: t.textMuted, flexWrap: "wrap" },
    breadcrumbLink: { color: t.accent, cursor: "pointer", textDecoration: "none", background: "none", border: "none", font: "inherit", padding: 0 },
    main: { maxWidth: "1100px", margin: "0 auto", padding: "32px 20px 96px" },
    card: {
      background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: "18px",
      padding: "18px", marginBottom: "14px", cursor: "pointer", boxShadow: t.shadowSm,
    },
    sectionHeader: {
      display: "flex", alignItems: "center", justifyContent: "space-between",
      cursor: "pointer", padding: "14px 18px", background: t.bgCard,
      border: `1px solid ${t.border}`, borderRadius: "16px", marginBottom: "2px", userSelect: "none",
      transition: "background 0.1s ease", boxShadow: t.shadowSm,
    },
    sectionContent: {
      padding: "18px 20px", background: t.bgSection, border: `1px solid ${t.border}`,
      borderTop: "none", borderRadius: "0 0 16px 16px", marginBottom: "12px",
    },
    tag: { display: "inline-block", padding: "5px 11px", borderRadius: "9999px", fontSize: "12px", fontWeight: 700, letterSpacing: "0.05em" },
    drugLink: {
      color: t.accent, cursor: "pointer", textDecoration: "none",
      borderBottom: `1px solid ${t.accent}55`, background: "none", borderTop: "none", borderLeft: "none", borderRight: "none", font: "inherit", padding: 0,
    },
    pearlBox: {
      background: t.bgPearl, border: `1px solid ${t.borderPearl}`, borderRadius: "14px",
      padding: "14px 16px", marginBottom: "10px", fontSize: "14px", lineHeight: 1.7, color: t.textSecondary,
    },
    monographLabel: { fontSize: "12px", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: t.textMuted, marginBottom: "8px" },
    monographValue: { fontSize: "15px", lineHeight: 1.72, color: t.textSecondary },
    interactionItem: {
      padding: "12px 14px", background: t.bgCard, borderLeft: "4px solid #f59e0b",
      marginBottom: "8px", borderRadius: "12px", fontSize: "13px", lineHeight: 1.65, boxShadow: t.shadowSm,
    },
    aeGrid: { display: "grid", gap: "12px", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" },
    detailList: { display: "grid", gap: "2px" },
    detailRow: {
      display: "grid",
      gridTemplateColumns: "minmax(150px, 210px) 1fr",
      gap: "14px",
      alignItems: "start",
      padding: "14px 0",
      borderBottom: `1px solid ${t.border}`,
    },
    detailKey: {
      fontSize: "12px",
      fontWeight: 800,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: t.textMuted,
    },
    detailValue: {
      fontSize: "13px",
      lineHeight: 1.7,
      color: t.textSecondary,
    },
    proseCallout: {
      background: t.bgCard,
      border: `1px solid ${t.border}`,
      borderRadius: "16px",
      padding: "16px 18px",
      boxShadow: t.shadowSm,
    },
    quickFactsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
      gap: "10px",
      marginTop: "18px",
    },
    quickFactCard: {
      background: theme === "dark" ? "rgba(15, 23, 42, 0.56)" : "rgba(255, 255, 255, 0.76)",
      border: `1px solid ${t.border}`,
      borderRadius: "16px",
      padding: "14px 16px",
      boxShadow: t.shadowSm,
    },
    backBtn: {
      display: "inline-flex", alignItems: "center", gap: "8px", color: t.textSecondary,
      background: t.bgCard, border: `1px solid ${t.border}`, fontSize: "13px", cursor: "pointer",
      padding: "9px 14px", marginBottom: "18px", fontFamily: "inherit", borderRadius: "9999px", boxShadow: t.shadowSm,
    },
    expandAllBtn: {
      background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: "9999px",
      color: t.textSecondary, fontSize: "12px", padding: "7px 12px", cursor: "pointer",
      fontFamily: "inherit", marginRight: "6px",
      transition: "color 0.15s, border-color 0.15s, transform 0.15s",
    },
    topBtn: {
      position: "fixed", bottom: "24px", right: "24px", width: "48px", height: "48px",
      borderRadius: "16px", background: t.topBtnBg, border: `1px solid ${t.topBtnBorder}`,
      color: t.textSecondary, fontSize: "18px", cursor: "pointer", display: "flex",
      alignItems: "center", justifyContent: "center", zIndex: 50,
      boxShadow: t.shadowMd,
    },
    crossRefPill: {
      display: "inline-block", fontSize: "12px", fontWeight: 700, padding: "5px 10px",
      borderRadius: "9999px", background: t.bgCard, color: t.textSecondary,
      border: `1px solid ${t.border}`, cursor: "pointer", marginRight: "4px", marginBottom: "4px",
      transition: "all 0.15s ease",
    },
    // --- NEW: Toast ---
    toast: {
      position: "fixed", bottom: "80px", right: "24px", zIndex: 200,
      background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: "16px",
      padding: "12px 16px", color: t.text, fontSize: "13px",
      boxShadow: t.shadowLg, maxWidth: "360px",
      display: "flex", alignItems: "center", gap: "8px",
      backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)",
    },
    // --- NEW: Copy button ---
    copyBtn: {
      background: t.codeBg, border: `1px solid ${t.border}`, borderRadius: "10px",
      color: t.textMuted, fontSize: "12px", padding: "4px 8px", cursor: "pointer",
      fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.4, flexShrink: 0,
    },
    // --- NEW: Theme toggle ---
    themeToggle: {
      background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: "12px",
      color: t.textSecondary, fontSize: "13px", padding: "10px 12px", cursor: "pointer",
      fontFamily: "inherit", transition: "all 0.15s",
      display: "flex", alignItems: "center", justifyContent: "center",
    },
    // --- NEW: Comparison view ---
    compareGrid: {
      display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px",
    },
    compareHeader: {
      fontSize: "16px", fontWeight: 700, color: t.textHeading, marginBottom: "12px",
      padding: "12px 16px", background: t.bgCard, border: `1px solid ${t.border}`,
      borderRadius: "16px", textAlign: "center", boxShadow: t.shadowSm,
    },
    compareCell: {
      padding: "10px 14px", background: t.bgCard, fontSize: "13px",
      lineHeight: 1.65, color: t.textSecondary, boxShadow: t.shadowSm,
    },
    compareLabelRow: {
      padding: "8px 14px", background: t.bgSection, fontSize: "12px",
      fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase",
      color: t.textMuted, gridColumn: "1 / -1",
    },
    // --- NEW: Allergy badge ---
    allergyBadge: {
      display: "inline-flex", alignItems: "center", gap: "4px",
      background: "#7f1d1d18", border: "1px solid #f8717140", borderRadius: "9999px",
      padding: "5px 10px", fontSize: "12px", fontWeight: 700, color: "var(--pr-tag-red, #f87171)",
      letterSpacing: "0.04em", flexWrap: "wrap",
    },
    // --- NEW: Header toolbar ---
    headerToolbar: {
      display: "flex", alignItems: "center", gap: "8px", flexShrink: 0,
    },
    // --- v2.1: Duration guidance callout ---
    durationCallout: {
      background: theme !== "light" ? "rgba(6, 182, 212, 0.08)" : "rgba(6, 182, 212, 0.06)",
      border: "1px solid rgba(6, 182, 212, 0.35)",
      borderRadius: "16px",
      padding: "14px 18px",
      marginBottom: "14px",
      display: "grid",
      gap: "10px",
    },
    // --- v2.1: PK/PD driver chip ---
    pkpdChip: {
      display: "inline-flex", alignItems: "center", gap: "6px",
      padding: "5px 12px", borderRadius: "9999px", fontSize: "12px", fontWeight: 800,
      letterSpacing: "0.05em", marginBottom: "14px",
    },
    // --- v2.1: IV→PO callout ---
    ivpoCallout: {
      background: theme !== "light" ? "rgba(6, 182, 212, 0.06)" : "rgba(6, 182, 212, 0.04)",
      border: "1px solid rgba(6, 182, 212, 0.28)",
      borderRadius: "14px",
      padding: "12px 16px",
      marginBottom: "10px",
      fontSize: "13px",
      lineHeight: 1.65,
      color: t.textSecondary,
    },
    // --- v2.1: Patient context banner ---
    patientBanner: {
      borderRadius: "12px",
      padding: "10px 14px",
      marginBottom: "14px",
      fontSize: "13px",
      fontWeight: 600,
      display: "flex",
      alignItems: "center",
      gap: "8px",
      flexWrap: "wrap" as const,
    },
    // --- v2.1: Calculator card ---
    calcCard: {
      background: t.bgCard,
      border: `1px solid ${t.border}`,
      borderRadius: "20px",
      padding: "22px 24px",
      boxShadow: t.shadowSm,
    },
    // --- v2.1: Calculator result ---
    calcResult: {
      borderRadius: "14px",
      padding: "14px 18px",
      marginTop: "16px",
      fontSize: "15px",
      fontWeight: 700,
    },
  };
}

export const TAG_COLORS = {
  green: { background: "#10b98118", color: "var(--pr-tag-green, #34d399)", border: "1px solid #10b98135" },
  yellow: { background: "#f59e0b18", color: "var(--pr-tag-yellow, #fbbf24)", border: "1px solid #f59e0b35" },
  red: { background: "#ef444418", color: "var(--pr-tag-red, #f87171)", border: "1px solid #ef444435" },
  blue: { background: "#3b82f618", color: "var(--pr-tag-blue, #60a5fa)", border: "1px solid #3b82f635" },
  purple: { background: "#8b5cf618", color: "var(--pr-tag-purple, #c084fc)", border: "1px solid #8b5cf635" },
  cyan: { background: "#06b6d418", color: "var(--pr-tag-cyan, #22d3ee)", border: "1px solid #06b6d435" },
  pink: { background: "#ec489918", color: "var(--pr-tag-pink, #f472b6)", border: "1px solid #ec489935" },
  emerald: { background: "#14b8a618", color: "var(--pr-tag-emerald, #5eead4)", border: "1px solid #14b8a635" },
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
  padding: "14px 16px", background: `${color}12`,
  border: `1px solid ${color}30`, borderRadius: "16px",
});
export const aeLabel = (color: string) => ({
  fontSize: "12px", fontWeight: 800, letterSpacing: "0.08em",
  textTransform: "uppercase", color: inkFor(color), marginBottom: "6px",
});

// ============================================================
// CSS VARIABLE INJECTOR (call on theme change)
// ============================================================
export function applyThemeVars(themeName: "dark" | "light" | "oled") {
  const t = THEMES[themeName] || THEMES.dark;
  const root = document.documentElement;
  root.style.setProperty("--pr-scroll-track", t.scrollTrack);
  root.style.setProperty("--pr-scroll-thumb", t.scrollThumb);
  root.style.setProperty("--pr-scroll-thumb-hover", t.scrollThumbHover);
  root.style.setProperty("--pr-accent", t.accent);
  root.style.setProperty("--pr-accent-hover", t.accentHover);
  root.style.setProperty("--pr-accent-glow", t.accent + "20");
  root.style.setProperty("--pr-accent-soft", t.accentSurfaceStrong);
  root.style.setProperty("--pr-section-hover", t.sectionHdrHover);
  root.style.setProperty("--pr-top-btn-hover", t.topBtnHoverBg);
  root.style.setProperty("--pr-card-hover-shadow", t.shadowLg);
  const ink = themeName === "light" ? LIGHT_INK : BRIGHT_INK;
  Object.entries(ink).forEach(([name, value]) => root.style.setProperty(`--pr-${name}`, value));
  document.body.style.background = t.bg;
}
