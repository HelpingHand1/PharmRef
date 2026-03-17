import type {
  BreakpointNote,
  CoverageMatrixRow,
  IntrinsicResistanceAlert,
  RapidDiagnosticAction,
  Styles,
} from "../types";

interface MicrobiologyCardsProps {
  rapidDiagnostics?: RapidDiagnosticAction[];
  breakpointNotes?: BreakpointNote[];
  intrinsicResistance?: IntrinsicResistanceAlert[];
  coverageMatrix?: CoverageMatrixRow[];
  S: Styles;
}

function coverageBadge(status: CoverageMatrixRow["status"]) {
  switch (status) {
    case "preferred":
      return {
        background: "rgba(52,211,153,0.12)",
        borderColor: "rgba(52,211,153,0.28)",
        color: "#059669",
      };
    case "active":
      return {
        background: "rgba(56,189,248,0.12)",
        borderColor: "rgba(56,189,248,0.28)",
        color: "#0284c7",
      };
    case "conditional":
      return {
        background: "rgba(251,191,36,0.14)",
        borderColor: "rgba(251,191,36,0.3)",
        color: "#d97706",
      };
    case "inactive":
    case "avoid":
      return {
        background: "rgba(248,113,113,0.12)",
        borderColor: "rgba(248,113,113,0.28)",
        color: "#dc2626",
      };
  }
}

function sectionCardStyle(S: Styles) {
  return {
    padding: "14px 16px",
    background: S.card.background,
    borderRadius: "14px",
    border: `1px solid ${S.card.borderColor}`,
    boxShadow: S.meta.shadowSm,
  };
}

export default function MicrobiologyCards({
  rapidDiagnostics,
  breakpointNotes,
  intrinsicResistance,
  coverageMatrix,
  S,
}: MicrobiologyCardsProps) {
  return (
    <div style={{ display: "grid", gap: "10px" }}>
      {rapidDiagnostics?.length ? (
        <div style={sectionCardStyle(S)}>
          <div style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "#0284c7", marginBottom: "10px" }}>
            Rapid Diagnostics
          </div>
          <div style={{ display: "grid", gap: "10px" }}>
            {rapidDiagnostics.map((entry) => (
              <div key={`${entry.trigger}-${entry.action}`} style={{ display: "grid", gap: "4px" }}>
                <div style={{ fontSize: "13px", fontWeight: 700, color: S.meta.textHeading }}>{entry.trigger}</div>
                <div style={{ fontSize: "12px", color: S.monographValue.color, lineHeight: 1.6 }}>{entry.action}</div>
                {entry.rationale ? <div style={{ fontSize: "12px", color: S.meta.textMuted, lineHeight: 1.55 }}>{entry.rationale}</div> : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {breakpointNotes?.length ? (
        <div style={sectionCardStyle(S)}>
          <div style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "#a855f7", marginBottom: "10px" }}>
            Breakpoint / MIC Notes
          </div>
          <div style={{ display: "grid", gap: "10px" }}>
            {breakpointNotes.map((entry) => (
              <div key={`${entry.marker}-${entry.interpretation}`} style={{ display: "grid", gap: "4px" }}>
                <div style={{ fontSize: "13px", fontWeight: 700, color: S.meta.textHeading }}>{entry.marker}</div>
                <div style={{ fontSize: "12px", color: S.monographValue.color, lineHeight: 1.6 }}>{entry.interpretation}</div>
                {entry.action ? <div style={{ fontSize: "12px", color: S.meta.textMuted, lineHeight: 1.55 }}>{entry.action}</div> : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {intrinsicResistance?.length ? (
        <div style={sectionCardStyle(S)}>
          <div style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "#dc2626", marginBottom: "10px" }}>
            Intrinsic Resistance
          </div>
          <div style={{ display: "grid", gap: "10px" }}>
            {intrinsicResistance.map((entry) => (
              <div key={`${entry.organism}-${entry.resistance}`} style={{ display: "grid", gap: "4px" }}>
                <div style={{ fontSize: "13px", fontWeight: 700, color: S.meta.textHeading }}>{entry.organism}</div>
                <div style={{ fontSize: "12px", color: S.monographValue.color, lineHeight: 1.6 }}>{entry.resistance}</div>
                <div style={{ fontSize: "12px", color: S.meta.textMuted, lineHeight: 1.55 }}>{entry.implication}</div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {coverageMatrix?.length ? (
        <div style={sectionCardStyle(S)}>
          <div style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "#059669", marginBottom: "10px" }}>
            Coverage Matrix
          </div>
          <div style={{ display: "grid", gap: "10px" }}>
            {coverageMatrix.map((entry) => (
              <div key={`${entry.label}-${entry.status}`} style={{ display: "grid", gap: "6px" }}>
                <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: S.meta.textHeading }}>{entry.label}</div>
                  <span
                    style={{
                      ...S.crossRefPill,
                      cursor: "default",
                      marginRight: 0,
                      marginBottom: 0,
                      ...coverageBadge(entry.status),
                    }}
                  >
                    {entry.status}
                  </span>
                </div>
                <div style={{ fontSize: "12px", color: S.monographValue.color, lineHeight: 1.6 }}>{entry.detail}</div>
                {entry.note ? <div style={{ fontSize: "12px", color: S.meta.textMuted, lineHeight: 1.55 }}>{entry.note}</div> : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
