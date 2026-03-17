import { buildTrustSurfaceSummary } from "../data/trust-surface";
import type { ContentMeta, Styles } from "../types";

interface TrustSurfaceBannerProps {
  meta: ContentMeta | null;
  S: Styles;
}

function pillStyle(S: Styles, tone: "fresh" | "info" | "warn") {
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

export default function TrustSurfaceBanner({ meta, S }: TrustSurfaceBannerProps) {
  const summary = buildTrustSurfaceSummary(meta);
  if (!summary) return null;

  return (
    <section
      style={{
        background: S.card.background,
        border: `1px solid ${S.card.borderColor}`,
        borderLeft: `4px solid ${summary.highlights.some((highlight) => highlight.tone === "warn") ? "#f59e0b" : "#38bdf8"}`,
        borderRadius: "16px",
        padding: "14px 16px",
        marginBottom: "18px",
        boxShadow: S.meta.shadowSm,
        display: "grid",
        gap: "10px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
        <div style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: S.meta.accent }}>
          Editorial Trust Signals
        </div>
        <span style={pillStyle(S, summary.confidenceTone)}>{summary.confidenceLabel}</span>
        <span style={pillStyle(S, summary.freshnessTone)}>{summary.freshnessLabel}</span>
      </div>
      <div style={{ fontSize: "14px", fontWeight: 700, color: S.meta.textHeading, lineHeight: 1.55 }}>{summary.headline}</div>
      <div style={{ display: "grid", gap: "8px" }}>
        {summary.highlights.map((highlight) => (
          <div
            key={`${highlight.title}-${highlight.detail}`}
            style={{
              borderRadius: "12px",
              padding: "10px 12px",
              background:
                highlight.tone === "warn"
                  ? "rgba(245,158,11,0.08)"
                  : highlight.tone === "info"
                    ? "rgba(56,189,248,0.08)"
                    : "rgba(52,211,153,0.08)",
              border:
                highlight.tone === "warn"
                  ? "1px solid rgba(245,158,11,0.22)"
                  : highlight.tone === "info"
                    ? "1px solid rgba(56,189,248,0.22)"
                    : "1px solid rgba(52,211,153,0.22)",
            }}
          >
            <div style={{ fontSize: "12px", fontWeight: 700, color: S.meta.textHeading }}>{highlight.title}</div>
            <div style={{ fontSize: "12px", color: S.monographValue.color, marginTop: "4px", lineHeight: 1.55 }}>{highlight.detail}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
