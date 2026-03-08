import { CompareViewProps } from "../types";

export default function CompareView({
  drugs,
  compareItems,
  setCompareItems,
  allMonographs,
  ExpandCollapseBar,
  S,
}: CompareViewProps) {
  // Selection screen
  if (drugs.length < 2) {
    return (
      <>
        <section className="page-hero" style={{ ...S.card, cursor: "default", padding: "20px 22px", marginBottom: "18px" }}>
          <div className="page-hero-copy">
            <div style={{ ...S.monographLabel, color: S.meta?.accent, marginBottom: "8px" }}>Comparison Tool</div>
            <h1 style={{ fontSize: "26px", lineHeight: 1.12, letterSpacing: "-0.04em", margin: 0, color: S.meta?.textHeading }}>Compare Drugs</h1>
            <p style={{ color: S.monographValue?.color || "#64748b", fontSize: "13px", marginTop: "10px", marginBottom: 0, lineHeight: 1.6 }}>
              Select two drugs to compare side by side. Click to select, click again to deselect.
            </p>
          </div>
          <div className="quick-facts-grid" style={S.quickFactsGrid}>
            <div style={S.quickFactCard}>
              <div style={{ ...S.monographLabel, marginBottom: "6px" }}>Selected</div>
              <div style={{ fontSize: "14px", fontWeight: 700, color: S.meta?.textHeading }}>{compareItems.length} of 2</div>
            </div>
            <div style={S.quickFactCard}>
              <div style={{ ...S.monographLabel, marginBottom: "6px" }}>Available</div>
              <div style={{ fontSize: "14px", fontWeight: 700, color: S.meta?.textHeading }}>{allMonographs.length} monographs</div>
            </div>
          </div>
        </section>
        <div className="compare-select-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "8px" }}>
          {allMonographs.map((dm) => {
            const isSelected = compareItems.includes(dm.id);
            return (
              <div
                key={dm.id}
                className="pr-card result-card"
                style={{
                  ...S.card, cursor: "pointer", marginBottom: 0, padding: "14px",
                  borderColor: isSelected ? S.meta?.accent || "#0ea5e9" : S.card.borderColor,
                  background: isSelected ? S.meta?.accentSurfaceStrong || "#0ea5e910" : S.card.background,
                }}
                onClick={() => {
                  setCompareItems((prev) => {
                    if (prev.includes(dm.id)) return prev.filter(x => x !== dm.id);
                    if (prev.length >= 2) return [prev[1], dm.id];
                    return [...prev, dm.id];
                  });
                }}
              >
                <div style={{ fontSize: "14px", fontWeight: 700, color: isSelected ? S.meta?.accent || "#38bdf8" : S.meta?.textHeading || S.monographValue?.color || "#e2e8f0" }}>
                  {isSelected ? "✓ " : ""}{dm.name}
                </div>
                <div style={{ fontSize: "11px", color: S.monographLabel?.color || "#64748b", marginTop: "4px" }}>{dm.drugClass}</div>
              </div>
            );
          })}
        </div>
        {compareItems.length === 2 && (
          <div style={{ textAlign: "center", marginTop: "16px", animation: "toast-in 0.3s ease forwards" }}>
            <div
              style={{ display: "inline-block", padding: "10px 24px", background: S.meta?.accentSurfaceStrong || "#0ea5e920", color: S.meta?.accent || "#38bdf8", border: `1px solid ${S.meta?.accent || "#0ea5e9"}`, borderRadius: "9999px", fontWeight: 700, fontSize: "14px" }}
            >
              Generating Comparison...
            </div>
          </div>
        )}
      </>
    );
  }

  // Comparison table
  const [d1, d2] = drugs;
  const dm1 = d1.monograph, dm2 = d2.monograph;
  const rows = [
    { label: "Drug Class", v1: dm1.drugClass, v2: dm2.drugClass },
    { label: "Brand Names", v1: dm1.brandNames, v2: dm2.brandNames },
    { label: "Mechanism of Action", v1: dm1.mechanismOfAction, v2: dm2.mechanismOfAction },
    { label: "Spectrum", v1: dm1.spectrum, v2: dm2.spectrum },
    { label: "Renal Adjustment", v1: dm1.renalAdjustment, v2: dm2.renalAdjustment },
    { label: "Hepatic Adjustment", v1: dm1.hepaticAdjustment, v2: dm2.hepaticAdjustment },
    { label: "Common ADRs", v1: dm1.adverseEffects?.common, v2: dm2.adverseEffects?.common },
    { label: "Serious ADRs", v1: dm1.adverseEffects?.serious, v2: dm2.adverseEffects?.serious },
    { label: "Monitoring", v1: dm1.monitoring, v2: dm2.monitoring },
    { label: "Pregnancy / Lactation", v1: dm1.pregnancyLactation, v2: dm2.pregnancyLactation },
  ];

  return (
    <>
      <section className="page-hero" style={{ ...S.card, cursor: "default", padding: "20px 22px", marginBottom: "18px" }}>
        <div className="page-hero-copy">
          <div style={{ ...S.monographLabel, color: S.meta?.accent, marginBottom: "8px" }}>Comparison View</div>
          <h1 style={{ fontSize: "26px", lineHeight: 1.12, letterSpacing: "-0.04em", margin: 0, color: S.meta?.textHeading }}>
            {dm1.name} vs {dm2.name}
          </h1>
          <p style={{ color: S.monographValue?.color || "#64748b", fontSize: "13px", marginTop: "10px", marginBottom: 0, lineHeight: 1.6 }}>
            Review class, dosing, safety, monitoring, and pearls side by side.
          </p>
        </div>
      </section>
      <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
        <button
          style={S.expandAllBtn}
          onClick={() => { setCompareItems([]); }}
          onMouseEnter={(e) => { e.currentTarget.style.color = S.meta?.accent || "#38bdf8"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = S.expandAllBtn.color; }}
        >
          ↻ New Comparison
        </button>
      </div>
      <ExpandCollapseBar />

      {/* Headers */}
      <div className="compare-grid" style={S.compareGrid}>
        <div style={S.compareHeader}>{dm1.name}</div>
        <div style={S.compareHeader}>{dm2.name}</div>
      </div>

      {/* Dosing */}
      <div style={{ ...S.compareLabelRow, borderRadius: "8px 8px 0 0", marginTop: "8px" }}>DOSING</div>
      <div className="compare-grid" style={{ ...S.compareGrid, gap: "1px", marginBottom: "2px" }}>
        <div style={S.compareCell}>
          {dm1.dosing && Object.entries(dm1.dosing).map(([k, v]) => (
            <div key={k} style={{ marginBottom: "6px" }}>
              <span style={{ fontSize: "11px", fontWeight: 600, color: "#a78bfa", textTransform: "capitalize" }}>{k.replace(/_/g, " ")}: </span>
              <span style={{ fontSize: "12px", fontFamily: "'JetBrains Mono', monospace" }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={S.compareCell}>
          {dm2.dosing && Object.entries(dm2.dosing).map(([k, v]) => (
            <div key={k} style={{ marginBottom: "6px" }}>
              <span style={{ fontSize: "11px", fontWeight: 600, color: "#a78bfa", textTransform: "capitalize" }}>{k.replace(/_/g, " ")}: </span>
              <span style={{ fontSize: "12px", fontFamily: "'JetBrains Mono', monospace" }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Attribute rows */}
      {rows.map((r, i) => (
        <div key={i}>
          <div style={S.compareLabelRow}>{r.label}</div>
          <div className="compare-grid" style={{ ...S.compareGrid, gap: "1px", marginBottom: "2px" }}>
            <div style={S.compareCell}>{r.v1 || "—"}</div>
            <div style={S.compareCell}>{r.v2 || "—"}</div>
          </div>
        </div>
      ))}

      {/* Pharmacist Pearls */}
      <div style={S.compareLabelRow}>PHARMACIST PEARLS</div>
      <div className="compare-grid" style={{ ...S.compareGrid, gap: "1px" }}>
        <div style={S.compareCell}>
          {dm1.pharmacistPearls?.map((p, i) => <div key={i} style={{ marginBottom: "6px", fontSize: "12px" }}>💡 {p}</div>)}
        </div>
        <div style={S.compareCell}>
          {dm2.pharmacistPearls?.map((p, i) => <div key={i} style={{ marginBottom: "6px", fontSize: "12px" }}>💡 {p}</div>)}
        </div>
      </div>
    </>
  );
}
