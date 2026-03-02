// ============================================================
// CONSTANTS & STYLES (outside component — no re-creation)
// ============================================================
export const NAV_STATES = {
  HOME: "home",
  DISEASE_OVERVIEW: "disease_overview",
  SUBCATEGORY: "subcategory",
  MONOGRAPH: "monograph",
};

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
    padding: "16px 24px",
    position: "sticky",
    top: 0,
    zIndex: 100,
    backdropFilter: "blur(10px)",
  },
  headerTop: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    marginBottom: "12px", gap: "16px", flexWrap: "wrap",
  },
  logo: {
    fontSize: "22px", fontWeight: 700, letterSpacing: "-0.5px", color: "#38bdf8",
    cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", flexShrink: 0,
  },
  logoPill: {
    fontSize: "10px", fontWeight: 600, background: "#0ea5e9", color: "#0a0f1a",
    padding: "2px 8px", borderRadius: "9999px", letterSpacing: "0.5px",
  },
  searchWrap: { position: "relative", flex: 1, maxWidth: "500px", minWidth: "180px" },
  searchBox: {
    width: "100%", padding: "10px 36px 10px 40px", background: "#0f172a",
    border: "1px solid #1e3a5f", borderRadius: "8px", color: "#e2e8f0",
    fontSize: "14px", outline: "none", boxSizing: "border-box",
  },
  searchIcon: { position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#64748b", fontSize: "14px", pointerEvents: "none" },
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
  main: { maxWidth: "900px", margin: "0 auto", padding: "24px 20px 80px" },
  card: {
    background: "#111827", border: "1px solid #1e293b", borderRadius: "10px",
    padding: "20px", marginBottom: "12px", cursor: "pointer", transition: "border-color 0.15s ease",
  },
  sectionHeader: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    cursor: "pointer", padding: "14px 18px", background: "#111827",
    border: "1px solid #1e293b", borderRadius: "8px", marginBottom: "2px", userSelect: "none",
  },
  sectionContent: {
    padding: "16px 18px", background: "#0d1117", border: "1px solid #1e293b",
    borderTop: "none", borderRadius: "0 0 8px 8px", marginBottom: "10px",
  },
  tag: { display: "inline-block", padding: "3px 10px", borderRadius: "9999px", fontSize: "11px", fontWeight: 600, letterSpacing: "0.3px" },
  drugLink: {
    color: "#38bdf8", cursor: "pointer", textDecoration: "underline",
    textUnderlineOffset: "3px", background: "none", border: "none", font: "inherit", padding: 0,
  },
  pearlBox: {
    background: "#fef3c720", border: "1px solid #fef3c740", borderRadius: "8px",
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
    padding: "8px 0", marginBottom: "16px", fontFamily: "inherit",
  },
  expandAllBtn: {
    background: "none", border: "1px solid #1e3a5f", borderRadius: "6px",
    color: "#64748b", fontSize: "11px", padding: "4px 10px", cursor: "pointer",
    fontFamily: "inherit", marginBottom: "12px", marginRight: "8px",
  },
  topBtn: {
    position: "fixed", bottom: "24px", right: "24px", width: "40px", height: "40px",
    borderRadius: "50%", background: "#1e293b", border: "1px solid #334155",
    color: "#94a3b8", fontSize: "18px", cursor: "pointer", display: "flex",
    alignItems: "center", justifyContent: "center", zIndex: 50,
    boxShadow: "0 2px 8px #0008",
  },
  crossRefPill: {
    display: "inline-block", fontSize: "10px", fontWeight: 600, padding: "2px 8px",
    borderRadius: "9999px", background: "#1e293b", color: "#94a3b8",
    border: "1px solid #334155", cursor: "pointer", marginRight: "4px", marginBottom: "4px",
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
};

export const getLineStyle = (lineName) => {
  const l = lineName.toLowerCase();
  if (l.includes("avoid")) return TAG_COLORS.red;
  if (l.includes("newer agent") || l.includes("reserve")) return TAG_COLORS.red;
  if (l.includes("first") || l.includes("preferred")) return TAG_COLORS.green;
  if (l.includes("second") || l.includes("alternative")) return TAG_COLORS.yellow;
  if (l.includes("duration")) return TAG_COLORS.purple;
  if (l.includes("adjunct") || l.includes("adjunctive")) return TAG_COLORS.purple;
  if (l.includes("iv") && l.includes("po")) return TAG_COLORS.cyan;
  if (l.includes("add") && (l.includes("mrsa") || l.includes("pseudo"))) return TAG_COLORS.pink;
  if (l.includes("idsa") || l.includes("four-step") || l.includes("step")) return TAG_COLORS.cyan;
  if (l.includes("prevention") || l.includes("bundle") || l.includes("stewardship")) return TAG_COLORS.cyan;
  if (l.includes("vap") && l.includes("mdr")) return TAG_COLORS.pink;
  if (l.includes("vap") || l.includes("hap")) return TAG_COLORS.blue;
  if (l.includes("empiric")) return TAG_COLORS.blue;
  if (l.includes("inpatient") || l.includes("iv")) return TAG_COLORS.blue;
  if (l.includes("outpatient") || l.includes("oral")) return TAG_COLORS.green;
  if (l.includes("lung abscess") || l.includes("abscess")) return TAG_COLORS.red;
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

export const cardHover = (e, on) => { e.currentTarget.style.borderColor = on ? "#0ea5e9" : "#1e293b"; };