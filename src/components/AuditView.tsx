import { buildContentAuditSummary, buildContentValidationIssues } from "../data/content-validation";
import { AuditViewProps } from "../types";

export default function AuditView({ diseaseStates, S }: AuditViewProps) {
  const issues = buildContentValidationIssues(diseaseStates);
  const summary = buildContentAuditSummary(diseaseStates);
  const allDrugIds = new Set(
    diseaseStates.flatMap((disease) => disease.drugMonographs.map((monograph) => monograph.id)),
  );

  const errors = issues.filter((issue) => issue.severity === "error");
  const warnings = issues.filter((issue) => issue.severity === "warn");
  const infos = issues.filter((issue) => issue.severity === "info");
  const severityColor = { error: "#ef4444", warn: "#fbbf24", info: "#60a5fa" } as const;
  const toneColor = { fresh: "#34d399", info: "#60a5fa", warn: "#f59e0b" } as const;
  const sectionHeadingStyle = {
    fontSize: "14px",
    fontWeight: 700,
    color: S.meta.textHeading,
    marginBottom: "12px",
  } as const;
  const coverageCardStyle = {
    ...S.card,
    cursor: "default",
    padding: "16px 18px",
  } as const;

  return (
    <>
      <section className="page-hero" style={{ ...S.card, cursor: "default", padding: "20px 22px", marginBottom: "18px" }}>
        <div className="page-hero-copy">
          <div style={{ ...S.monographLabel, color: S.meta?.accent, marginBottom: "8px" }}>Content Audit</div>
          <h1 style={{ fontSize: "26px", lineHeight: 1.12, letterSpacing: "-0.04em", margin: 0, color: S.meta?.textHeading }}>Data Integrity Audit</h1>
          <p style={{ color: S.monographValue?.color || "#64748b", fontSize: "13px", marginTop: "10px", marginBottom: 0, lineHeight: 1.6 }}>
            {diseaseStates.length} clinical topics · {allDrugIds.size} unique drug monographs · {summary.totalPriorityItems} priority decision-support surfaces · {issues.length} issues found
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
        <span style={{ padding: "4px 12px", borderRadius: "9999px", fontSize: "12px", fontWeight: 600, background: "#f59e0b20", color: "#f59e0b", border: "1px solid #f59e0b40" }}>
          Review Watchlist: {summary.nonFreshPriorityCount}
        </span>
        <span style={{ padding: "4px 12px", borderRadius: "9999px", fontSize: "12px", fontWeight: 600, background: "#8b5cf620", color: "#8b5cf6", border: "1px solid #8b5cf640" }}>
          Active Disagreements: {summary.disagreementPriorityCount}
        </span>
      </div>
      <section style={{ marginBottom: "18px" }}>
        <div style={sectionHeadingStyle}>Priority Coverage</div>
        <div className="quick-facts-grid" style={{ ...S.quickFactsGrid, marginTop: 0 }}>
          {summary.pathwayCoverage.map((metric) => (
            <div key={`pathway-${metric.label}`} style={coverageCardStyle}>
              <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.06em", color: toneColor[metric.tone], fontWeight: 700 }}>
                Pathway
              </div>
              <div style={{ fontSize: "15px", fontWeight: 700, color: S.meta.textHeading, marginTop: "6px" }}>{metric.label}</div>
              <div style={{ fontSize: "24px", fontWeight: 800, color: S.meta.textHeading, marginTop: "8px" }}>
                {metric.completed}/{metric.total}
              </div>
            </div>
          ))}
          {summary.monographCoverage.map((metric) => (
            <div key={`monograph-${metric.label}`} style={coverageCardStyle}>
              <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.06em", color: toneColor[metric.tone], fontWeight: 700 }}>
                Monograph
              </div>
              <div style={{ fontSize: "15px", fontWeight: 700, color: S.meta.textHeading, marginTop: "6px" }}>{metric.label}</div>
              <div style={{ fontSize: "24px", fontWeight: 800, color: S.meta.textHeading, marginTop: "8px" }}>
                {metric.completed}/{metric.total}
              </div>
            </div>
          ))}
        </div>
      </section>
      <section style={{ marginBottom: "18px" }}>
        <div style={sectionHeadingStyle}>Priority Review Watchlist</div>
        {summary.agingPriorityContent.length === 0 ? (
          <div style={{ ...S.card, cursor: "default", padding: "18px 20px", color: "#34d399", fontWeight: 700 }}>
            All priority decision-support content is inside its current freshness window.
          </div>
        ) : (
          summary.agingPriorityContent.slice(0, 8).map((item) => (
            <div
              key={item.scope}
              style={{
                padding: "12px 14px",
                borderLeft: `4px solid ${toneColor[item.freshnessTone]}`,
                background: `${toneColor[item.freshnessTone]}10`,
                marginBottom: "8px",
                borderRadius: "14px",
                border: `1px solid ${toneColor[item.freshnessTone]}22`,
              }}
            >
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, color: toneColor[item.freshnessTone], textTransform: "uppercase" }}>
                  {item.kind}
                </span>
                <span style={{ fontWeight: 700, color: S.meta.text }}>{item.label}</span>
                <span style={{ fontSize: "11px", color: S.monographValue.color }}>{item.disease}</span>
              </div>
              <div style={{ fontSize: "12px", marginTop: "6px", color: S.monographValue.color }}>
                {item.freshnessLabel} · {item.confidenceLabel} · Owner: {item.reviewOwner}
              </div>
              {item.recentChangesCount > 0 && (
                <div style={{ fontSize: "12px", marginTop: "4px", color: S.monographValue.color }}>
                  Recent section changes tracked: {item.recentChangesCount}
                </div>
              )}
              <div style={{ fontSize: "11px", marginTop: "6px", color: S.monographValue.color }}>{item.scope}</div>
            </div>
          ))
        )}
      </section>
      <section style={{ marginBottom: "18px" }}>
        <div style={sectionHeadingStyle}>Guideline Disagreement Watchlist</div>
        {summary.disagreementPriorityContent.length === 0 ? (
          <div style={{ ...S.card, cursor: "default", padding: "18px 20px", color: S.monographValue.color }}>
            No active guideline disagreements are tagged on the current priority decision-support surfaces.
          </div>
        ) : (
          summary.disagreementPriorityContent.slice(0, 8).map((item) => (
            <div
              key={`${item.scope}-disagreement`}
              style={{
                padding: "12px 14px",
                borderLeft: "4px solid #8b5cf6",
                background: "#8b5cf610",
                marginBottom: "8px",
                borderRadius: "14px",
                border: "1px solid #8b5cf622",
              }}
            >
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#8b5cf6", textTransform: "uppercase" }}>{item.kind}</span>
                <span style={{ fontWeight: 700, color: S.meta.text }}>{item.label}</span>
                <span style={{ fontSize: "11px", color: S.monographValue.color }}>{item.disease}</span>
              </div>
              <div style={{ fontSize: "12px", marginTop: "6px", color: S.monographValue.color }}>
                {item.disagreementCount} disagreement{item.disagreementCount === 1 ? "" : "s"} · {item.confidenceLabel}
              </div>
              <div style={{ fontSize: "11px", marginTop: "6px", color: S.monographValue.color }}>{item.scope}</div>
            </div>
          ))
        )}
      </section>
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
