import { buildMonographCompareSnapshot } from "../data/compare";
import { CompareViewProps } from "../types";

function formatStructuredBlock(label: string, value: string | undefined) {
  if (!value) return null;
  return `${label}: ${value}`;
}

function formatMonographPenetration(
  monograph: CompareViewProps["drugs"][number]["monograph"],
) {
  if (monograph.penetration?.length) {
    return monograph.penetration.map((entry) => `${entry.site}: ${entry.detail}`).join(" | ");
  }

  if (monograph.tissuePenetration) {
    return Object.entries(monograph.tissuePenetration)
      .filter(([, value]) => Boolean(value))
      .map(([site, detail]) => `${site}: ${detail}`)
      .join(" | ");
  }

  return "—";
}

function formatBreakpointNotes(
  monograph: CompareViewProps["drugs"][number]["monograph"],
) {
  return monograph.breakpointNotes?.map((entry) => `${entry.marker}: ${entry.interpretation}`).join(" | ") || "—";
}

function formatCoverageMatrix(
  monograph: CompareViewProps["drugs"][number]["monograph"],
) {
  return monograph.coverageMatrix?.map((entry) => `${entry.label} (${entry.status}): ${entry.detail}`).join(" | ") || "—";
}

function badgeStyles(
  S: CompareViewProps["S"],
  tone: "fresh" | "info" | "warn" | "danger" | null,
) {
  if (tone === "fresh") {
    return {
      ...S.crossRefPill,
      cursor: "default",
      marginRight: 0,
      marginBottom: 0,
      background: "rgba(52,211,153,0.12)",
      borderColor: "rgba(52,211,153,0.28)",
      color: "#059669",
    };
  }

  if (tone === "warn") {
    return {
      ...S.crossRefPill,
      cursor: "default",
      marginRight: 0,
      marginBottom: 0,
      background: "rgba(245,158,11,0.12)",
      borderColor: "rgba(245,158,11,0.28)",
      color: "#d97706",
    };
  }

  if (tone === "danger") {
    return {
      ...S.crossRefPill,
      cursor: "default",
      marginRight: 0,
      marginBottom: 0,
      background: "rgba(239,68,68,0.12)",
      borderColor: "rgba(239,68,68,0.28)",
      color: "#dc2626",
    };
  }

  if (tone === "info") {
    return {
      ...S.crossRefPill,
      cursor: "default",
      marginRight: 0,
      marginBottom: 0,
      background: "rgba(56,189,248,0.12)",
      borderColor: "rgba(56,189,248,0.28)",
      color: "#0284c7",
    };
  }

  return {
    ...S.crossRefPill,
    cursor: "default",
    marginRight: 0,
    marginBottom: 0,
  };
}

export default function CompareView({
  drugs,
  compareItems,
  setCompareItems,
  allMonographs,
  adjbw,
  crcl,
  ibw,
  patient,
  regimenXref,
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
  const snapshot1 = buildMonographCompareSnapshot(d1, regimenXref[dm1.id] ?? [], undefined, patient, crcl, ibw, adjbw);
  const snapshot2 = buildMonographCompareSnapshot(d2, regimenXref[dm2.id] ?? [], undefined, patient, crcl, ibw, adjbw);
  const rows = [
    { label: "Drug Class", v1: dm1.drugClass, v2: dm2.drugClass },
    { label: "Brand Names", v1: dm1.brandNames, v2: dm2.brandNames },
    { label: "Content Trust", v1: snapshot1.trustSummary, v2: snapshot2.trustSummary },
    { label: "Regimen Footprint", v1: snapshot1.regimenFootprintSummary, v2: snapshot2.regimenFootprintSummary },
    { label: "Patient-Specific Fit", v1: snapshot1.patientFitSummary, v2: snapshot2.patientFitSummary },
    { label: "Local Stewardship Policy", v1: snapshot1.institutionPolicySummary, v2: snapshot2.institutionPolicySummary },
    { label: "Local Antibiogram", v1: snapshot1.localAntibiogramSummary, v2: snapshot2.localAntibiogramSummary },
    { label: "Mechanism of Action", v1: dm1.mechanismOfAction, v2: dm2.mechanismOfAction },
    { label: "Spectrum", v1: dm1.spectrum, v2: dm2.spectrum },
    { label: "Renal Adjustment", v1: dm1.renalAdjustment, v2: dm2.renalAdjustment },
    { label: "Hepatic Adjustment", v1: dm1.hepaticAdjustment, v2: dm2.hepaticAdjustment },
    { label: "Common ADRs", v1: dm1.adverseEffects?.common, v2: dm2.adverseEffects?.common },
    { label: "Serious ADRs", v1: dm1.adverseEffects?.serious, v2: dm2.adverseEffects?.serious },
    { label: "Monitoring", v1: dm1.monitoring, v2: dm2.monitoring },
    {
      label: "Therapeutic Drug Monitoring",
      v1: dm1.therapeuticDrugMonitoring
        ? [
            formatStructuredBlock("Target", dm1.therapeuticDrugMonitoring.target),
            formatStructuredBlock("Sampling", dm1.therapeuticDrugMonitoring.sampling),
            formatStructuredBlock("Adjustment", dm1.therapeuticDrugMonitoring.adjustment),
          ]
            .filter(Boolean)
            .join(" | ")
        : "—",
      v2: dm2.therapeuticDrugMonitoring
        ? [
            formatStructuredBlock("Target", dm2.therapeuticDrugMonitoring.target),
            formatStructuredBlock("Sampling", dm2.therapeuticDrugMonitoring.sampling),
            formatStructuredBlock("Adjustment", dm2.therapeuticDrugMonitoring.adjustment),
          ]
            .filter(Boolean)
            .join(" | ")
        : "—",
    },
    {
      label: "Special Populations",
      v1: dm1.specialPopulations?.map((entry) => `${entry.population}: ${entry.guidance}`).join(" | ") || "—",
      v2: dm2.specialPopulations?.map((entry) => `${entry.population}: ${entry.guidance}`).join(" | ") || "—",
    },
    {
      label: "Administration",
      v1: [
        formatStructuredBlock("Infusion", dm1.administration?.infusion),
        formatStructuredBlock("Oral", dm1.administration?.oralAbsorption),
        formatStructuredBlock("Stability", dm1.administration?.stability),
      ]
        .filter(Boolean)
        .join(" | ") || "—",
      v2: [
        formatStructuredBlock("Infusion", dm2.administration?.infusion),
        formatStructuredBlock("Oral", dm2.administration?.oralAbsorption),
        formatStructuredBlock("Stability", dm2.administration?.stability),
      ]
        .filter(Boolean)
        .join(" | ") || "—",
    },
    {
      label: "Penetration",
      v1: formatMonographPenetration(dm1),
      v2: formatMonographPenetration(dm2),
    },
    {
      label: "Breakpoint / MIC Notes",
      v1: formatBreakpointNotes(dm1),
      v2: formatBreakpointNotes(dm2),
    },
    {
      label: "Rapid Diagnostic Actions",
      v1: snapshot1.rapidDiagnosticSummary,
      v2: snapshot2.rapidDiagnosticSummary,
    },
    {
      label: "Coverage Matrix",
      v1: formatCoverageMatrix(dm1),
      v2: formatCoverageMatrix(dm2),
    },
    {
      label: "IV-to-PO / Oral Continuation",
      v1: snapshot1.ivToPoSummary,
      v2: snapshot2.ivToPoSummary,
    },
    {
      label: "OPAT Readiness",
      v1: snapshot1.opatSummary,
      v2: snapshot2.opatSummary,
    },
    {
      label: "Interaction Actions",
      v1: snapshot1.interactionSummary,
      v2: snapshot2.interactionSummary,
    },
    {
      label: "Stewardship Use Cases",
      v1: dm1.stewardshipUseCases?.map((entry) => `${entry.scenario}: ${entry.role}`).join(" | ") || "—",
      v2: dm2.stewardshipUseCases?.map((entry) => `${entry.scenario}: ${entry.role}`).join(" | ") || "—",
    },
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
        <div style={S.compareHeader}>
          <div style={{ fontSize: "18px", fontWeight: 800 }}>{dm1.name}</div>
          <div style={{ fontSize: "12px", marginTop: "4px", color: S.monographValue.color }}>{d1.disease.name}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "10px" }}>
            {snapshot1.confidenceBadge && (
              <span style={badgeStyles(S, snapshot1.confidenceTone)}>{snapshot1.confidenceBadge}</span>
            )}
            {snapshot1.freshnessBadge && (
              <span style={badgeStyles(S, snapshot1.freshnessTone)}>{snapshot1.freshnessBadge}</span>
            )}
            {snapshot1.regimenCount > 0 && (
              <span style={badgeStyles(S, "info")}>
                {snapshot1.regimenCount} regimen ref{snapshot1.regimenCount === 1 ? "" : "s"}
              </span>
            )}
            {snapshot1.patientFitBadge && (
              <span style={badgeStyles(S, snapshot1.patientFitTone)}>{snapshot1.patientFitBadge}</span>
            )}
            {snapshot1.localBadge && (
              <span style={badgeStyles(S, snapshot1.localBadgeTone)}>{snapshot1.localBadge}</span>
            )}
          </div>
        </div>
        <div style={S.compareHeader}>
          <div style={{ fontSize: "18px", fontWeight: 800 }}>{dm2.name}</div>
          <div style={{ fontSize: "12px", marginTop: "4px", color: S.monographValue.color }}>{d2.disease.name}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "10px" }}>
            {snapshot2.confidenceBadge && (
              <span style={badgeStyles(S, snapshot2.confidenceTone)}>{snapshot2.confidenceBadge}</span>
            )}
            {snapshot2.freshnessBadge && (
              <span style={badgeStyles(S, snapshot2.freshnessTone)}>{snapshot2.freshnessBadge}</span>
            )}
            {snapshot2.regimenCount > 0 && (
              <span style={badgeStyles(S, "info")}>
                {snapshot2.regimenCount} regimen ref{snapshot2.regimenCount === 1 ? "" : "s"}
              </span>
            )}
            {snapshot2.patientFitBadge && (
              <span style={badgeStyles(S, snapshot2.patientFitTone)}>{snapshot2.patientFitBadge}</span>
            )}
            {snapshot2.localBadge && (
              <span style={badgeStyles(S, snapshot2.localBadgeTone)}>{snapshot2.localBadge}</span>
            )}
          </div>
        </div>
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
          {dm1.dosingByIndication?.length ? (
            <div style={{ marginTop: "10px" }}>
              {dm1.dosingByIndication.map((entry) => (
                <div key={entry.label} style={{ marginBottom: "6px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 600, color: "#38bdf8" }}>{entry.label}: </span>
                  <span style={{ fontSize: "12px" }}>{entry.regimen}</span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
        <div style={S.compareCell}>
          {dm2.dosing && Object.entries(dm2.dosing).map(([k, v]) => (
            <div key={k} style={{ marginBottom: "6px" }}>
              <span style={{ fontSize: "11px", fontWeight: 600, color: "#a78bfa", textTransform: "capitalize" }}>{k.replace(/_/g, " ")}: </span>
              <span style={{ fontSize: "12px", fontFamily: "'JetBrains Mono', monospace" }}>{v}</span>
            </div>
          ))}
          {dm2.dosingByIndication?.length ? (
            <div style={{ marginTop: "10px" }}>
              {dm2.dosingByIndication.map((entry) => (
                <div key={entry.label} style={{ marginBottom: "6px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 600, color: "#38bdf8" }}>{entry.label}: </span>
                  <span style={{ fontSize: "12px" }}>{entry.regimen}</span>
                </div>
              ))}
            </div>
          ) : null}
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
