import type { Styles } from "../types";
import type {
  TransitionReadinessItem,
  TransitionReadinessStatus,
} from "../utils/patientTransitionReadiness";

interface TransitionReadinessPanelProps {
  items: TransitionReadinessItem[];
  subtitle?: string;
  title: string;
  S: Styles;
}

const STATUS_STYLES: Record<
  TransitionReadinessStatus,
  { bg: string; border: string; text: string; label: string }
> = {
  ready: {
    bg: "rgba(52,211,153,0.10)",
    border: "#059669",
    text: "#059669",
    label: "Ready",
  },
  caution: {
    bg: "rgba(245,158,11,0.10)",
    border: "#d97706",
    text: "#d97706",
    label: "Caution",
  },
  not_ready: {
    bg: "rgba(239,68,68,0.10)",
    border: "#dc2626",
    text: "#dc2626",
    label: "Not ready",
  },
  needs_data: {
    bg: "rgba(56,189,248,0.10)",
    border: "#0284c7",
    text: "#0284c7",
    label: "Needs data",
  },
  not_applicable: {
    bg: "rgba(148,163,184,0.10)",
    border: "#64748b",
    text: "#64748b",
    label: "N/A",
  },
};

export default function TransitionReadinessPanel({
  items,
  subtitle,
  title,
  S,
}: TransitionReadinessPanelProps) {
  if (!items.length) return null;

  return (
    <section
      style={{
        background: S.card.background,
        border: `1px solid ${S.card.borderColor}`,
        borderLeft: "4px solid #34d399",
        borderRadius: "16px",
        padding: "16px 18px",
        marginBottom: "18px",
        boxShadow: S.meta.shadowSm,
      }}
    >
      <div style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "#059669", marginBottom: "8px" }}>
        {title}
      </div>
      {subtitle ? (
        <div style={{ fontSize: "13px", color: S.monographValue.color, lineHeight: 1.6, marginBottom: "12px" }}>
          {subtitle}
        </div>
      ) : null}
      <div style={{ display: "grid", gap: "10px" }}>
        {items.map((item) => {
          const palette = STATUS_STYLES[item.status];
          return (
            <div
              key={item.id}
              style={{
                border: `1px solid ${palette.border}40`,
                borderLeft: `4px solid ${palette.border}`,
                borderRadius: "12px",
                background: palette.bg,
                padding: "10px 12px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                <div style={{ fontSize: "13px", fontWeight: 700, color: S.meta.textHeading }}>{item.title}</div>
                <span
                  style={{
                    ...S.crossRefPill,
                    cursor: "default",
                    marginRight: 0,
                    marginBottom: 0,
                    background: palette.bg,
                    borderColor: `${palette.border}55`,
                    color: palette.text,
                  }}
                >
                  {palette.label}
                </span>
              </div>
              <div style={{ fontSize: "12px", color: palette.text, fontWeight: 700, marginTop: "6px", lineHeight: 1.55 }}>
                {item.summary}
              </div>
              <div style={{ fontSize: "12px", color: S.monographValue.color, marginTop: "4px", lineHeight: 1.55 }}>
                {item.detail}
              </div>
              {item.cues.length > 0 ? (
                <div style={{ fontSize: "11px", color: S.meta.textHeading, marginTop: "8px", lineHeight: 1.55 }}>
                  Key cues: {item.cues.join(" · ")}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
