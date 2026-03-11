import { buildContentValidationIssues } from "../data/content-validation";
import { AuditViewProps } from "../types";

export default function AuditView({ diseaseStates, S }: AuditViewProps) {
  const issues = buildContentValidationIssues(diseaseStates);
  const allDrugIds = new Set(
    diseaseStates.flatMap((disease) => disease.drugMonographs.map((monograph) => monograph.id)),
  );

  const errors = issues.filter((issue) => issue.severity === "error");
  const warnings = issues.filter((issue) => issue.severity === "warn");
  const infos = issues.filter((issue) => issue.severity === "info");
  const severityColor = { error: "#ef4444", warn: "#fbbf24", info: "#60a5fa" } as const;

  return (
    <>
      <section className="page-hero" style={{ ...S.card, cursor: "default", padding: "20px 22px", marginBottom: "18px" }}>
        <div className="page-hero-copy">
          <div style={{ ...S.monographLabel, color: S.meta?.accent, marginBottom: "8px" }}>Content Audit</div>
          <h1 style={{ fontSize: "26px", lineHeight: 1.12, letterSpacing: "-0.04em", margin: 0, color: S.meta?.textHeading }}>Data Integrity Audit</h1>
          <p style={{ color: S.monographValue?.color || "#64748b", fontSize: "13px", marginTop: "10px", marginBottom: 0, lineHeight: 1.6 }}>
            {diseaseStates.length} disease states · {allDrugIds.size} unique drug monographs · {issues.length} issues found
          </p>
        </div>
      </section>
      <div className="quick-facts-grid" style={{ ...S.quickFactsGrid, marginTop: 0, marginBottom: "18px" }}>
        <span style={{ padding: "4px 12px", borderRadius: "9999px", fontSize: "12px", fontWeight: 600, background: "#ef444420", color: "#ef4444", border: "1px solid #ef444440" }}>
          Errors: {errors.length}
        </span>
        <span style={{ padding: "4px 12px", borderRadius: "9999px", fontSize: "12px", fontWeight: 600, background: "#fbbf2420", color: "#fbbf24", border: "1px solid #fbbf2440" }}>
          Warnings: {warnings.length}
        </span>
        <span style={{ padding: "4px 12px", borderRadius: "9999px", fontSize: "12px", fontWeight: 600, background: "#60a5fa20", color: "#60a5fa", border: "1px solid #60a5fa40" }}>
          Info: {infos.length}
        </span>
      </div>
      {issues.length === 0 ? (
        <div style={{ ...S.card, cursor: "default", textAlign: "center", padding: "40px", color: "#34d399", fontSize: "16px", fontWeight: 700 }}>✓ All checks passed</div>
      ) : (
        issues.map((issue, index) => (
          <div
            key={`${issue.scope}-${index}`}
            style={{
              padding: "12px 14px",
              borderLeft: `4px solid ${severityColor[issue.severity]}`,
              background: `${severityColor[issue.severity]}08`,
              marginBottom: "8px",
              borderRadius: "14px",
              border: `1px solid ${severityColor[issue.severity]}20`,
            }}
          >
            <span style={{ fontSize: "11px", fontWeight: 700, color: severityColor[issue.severity], textTransform: "uppercase", marginRight: "8px" }}>
              {issue.severity}
            </span>
            <span style={{ fontWeight: 700, color: S.meta.text }}>{issue.disease}</span>
            <div style={{ fontSize: "13px", marginTop: "4px", color: S.monographValue.color }}>{issue.message}</div>
            <div style={{ fontSize: "11px", marginTop: "6px", color: S.monographValue.color }}>{issue.scope}</div>
          </div>
        ))
      )}
    </>
  );
}
