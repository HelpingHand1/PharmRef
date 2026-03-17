import type { InstitutionAntibiogramEntry, Styles } from "../types";

interface InstitutionAntibiogramCardsProps {
  entries: InstitutionAntibiogramEntry[];
  compact?: boolean;
  S: Styles;
}

function badgeStyle(status: InstitutionAntibiogramEntry["status"]) {
  if (status === "preferred") {
    return {
      background: "rgba(52,211,153,0.12)",
      borderColor: "rgba(52,211,153,0.28)",
      color: "#059669",
      label: "Local preferred",
    };
  }

  return {
    background: "rgba(251,191,36,0.14)",
    borderColor: "rgba(251,191,36,0.3)",
    color: "#d97706",
    label: "Use with caution",
  };
}

export default function InstitutionAntibiogramCards({
  entries,
  compact = false,
  S,
}: InstitutionAntibiogramCardsProps) {
  if (!entries.length) return null;

  return (
    <div style={{ display: "grid", gap: compact ? "8px" : "10px" }}>
      {entries.map((entry) => {
        const badge = entry.status ? badgeStyle(entry.status) : null;
        return (
          <div
            key={`${entry.organism}-${entry.sample}-${entry.drugId ?? "pathway"}`}
            style={{
              padding: compact ? "10px 12px" : "14px 16px",
              background: S.card.background,
              borderRadius: compact ? "12px" : "14px",
              border: `1px solid ${S.card.borderColor}`,
              boxShadow: compact ? "none" : S.meta.shadowSm,
            }}
          >
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center", marginBottom: "6px" }}>
              <div style={{ fontSize: compact ? "12px" : "13px", fontWeight: 700, color: S.meta.textHeading }}>{entry.organism}</div>
              {badge && (
                <span
                  style={{
                    ...S.crossRefPill,
                    cursor: "default",
                    marginRight: 0,
                    marginBottom: 0,
                    ...badge,
                  }}
                >
                  {badge.label}
                </span>
              )}
            </div>
            <div style={{ fontSize: compact ? "12px" : "13px", color: S.meta.textHeading, lineHeight: 1.55, fontWeight: 700 }}>
              {entry.susceptibility}
            </div>
            <div style={{ fontSize: "12px", color: S.monographValue.color, marginTop: "4px", lineHeight: 1.55 }}>
              {entry.sample}
            </div>
            {entry.note ? (
              <div style={{ fontSize: "12px", color: S.monographValue.color, marginTop: "6px", lineHeight: 1.55 }}>
                {entry.note}
              </div>
            ) : null}
            <div style={{ fontSize: "11px", color: S.meta.textMuted, marginTop: "6px", lineHeight: 1.45 }}>
              Source: {entry.source}
            </div>
          </div>
        );
      })}
    </div>
  );
}
