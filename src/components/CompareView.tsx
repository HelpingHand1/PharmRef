import React from "react";
import { CompareViewProps } from "../types";
import { aeCard, aeLabel } from "../styles/constants";

export default function CompareView({
  drugs,
  compareItems,
  setCompareItems,
  allMonographs,
  navigateTo,
  NAV_STATES,
  ExpandCollapseBar,
  S,
}: CompareViewProps) {
  // Selection screen
  if (drugs.length < 2) {
    return (
      <>
        <h1 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "16px" }}>⚖ Compare Drugs</h1>
        <p style={{ color: "#64748b", fontSize: "13px", marginBottom: "16px" }}>Select two drugs to compare side-by-side. Click to select, click again to deselect.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "8px" }}>
          {allMonographs.map(dm => {
            const isSelected = compareItems.includes(dm.id);
            return (
              <div
                key={dm.id}
                className="pr-card"
                style={{
                  ...S.card, cursor: "pointer", marginBottom: 0, padding: "14px",
                  borderColor: isSelected ? "#0ea5e9" : S.card.borderColor,
                  background: isSelected ? "#0ea5e910" : S.card.background,
                }}
                onClick={() => {
                  setCompareItems(prev => {
                    if (prev.includes(dm.id)) return prev.filter(x => x !== dm.id);
                    if (prev.length >= 2) return [prev[1], dm.id];
                    return [...prev, dm.id];
                  });
                }}
              >
                <div style={{ fontSize: "14px", fontWeight: 600, color: isSelected ? "#38bdf8" : S.monographValue?.color || "#e2e8f0" }}>
                  {isSelected ? "✓ " : ""}{dm.name}
                </div>
                <div style={{ fontSize: "11px", color: "#64748b", marginTop: "3px" }}>{dm.drugClass}</div>
              </div>
            );
          })}
        </div>
        {compareItems.length === 2 && (
          <div style={{ textAlign: "center", marginTop: "16px" }}>
            <button
              onClick={() => {/* parent re-renders with 2 drugs */}}
              style={{ padding: "10px 24px", background: "#0ea5e9", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 600, cursor: "pointer", fontSize: "14px" }}
            >
              Compare Selected →
            </button>
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
      <h1 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "16px" }}>⚖ Drug Comparison</h1>
      <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
        <button
          style={S.expandAllBtn}
          onClick={() => { setCompareItems([]); }}
          onMouseEnter={e => { e.currentTarget.style.color = "#38bdf8"; }}
          onMouseLeave={e => { e.currentTarget.style.color = S.expandAllBtn.color; }}
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
              <span style={{ fontSize: "12px", fontFamily: "'IBM Plex Mono', monospace" }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={S.compareCell}>
          {dm2.dosing && Object.entries(dm2.dosing).map(([k, v]) => (
            <div key={k} style={{ marginBottom: "6px" }}>
              <span style={{ fontSize: "11px", fontWeight: 600, color: "#a78bfa", textTransform: "capitalize" }}>{k.replace(/_/g, " ")}: </span>
              <span style={{ fontSize: "12px", fontFamily: "'IBM Plex Mono', monospace" }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Attribute rows */}
      {rows.map((r, i) => (
        <React.Fragment key={i}>
          <div style={S.compareLabelRow}>{r.label}</div>
          <div className="compare-grid" style={{ ...S.compareGrid, gap: "1px", marginBottom: "2px" }}>
            <div style={S.compareCell}>{r.v1 || "—"}</div>
            <div style={S.compareCell}>{r.v2 || "—"}</div>
          </div>
        </React.Fragment>
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