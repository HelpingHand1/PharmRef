import { NAV_STATES } from "../styles/constants";
import type { NavigateTo, PatientContext, Styles, DrugMonograph } from "../types";
import { hasAnyPatientSignals } from "../utils/regimenGuidance";
import { getMonographPatientGuidance } from "../utils/monographPatientGuidance";
import { buildPatientContextTags } from "../utils/patientStewardshipSummary";

interface MonographPatientGuidanceProps {
  adjbw: number | null;
  crcl: number | null;
  ibw: number | null;
  monograph: DrugMonograph;
  navigateTo: NavigateTo;
  onOpenPatientModal: () => void;
  patient: PatientContext;
  S: Styles;
}

const SEVERITY_STYLES = {
  critical: { border: "#ef4444", text: "#dc2626", bg: "rgba(239,68,68,0.10)", label: "Critical" },
  warn: { border: "#f59e0b", text: "#d97706", bg: "rgba(245,158,11,0.10)", label: "Caution" },
  info: { border: "#38bdf8", text: "#0284c7", bg: "rgba(56,189,248,0.10)", label: "Info" },
} as const;

export default function MonographPatientGuidance({
  adjbw,
  crcl,
  ibw,
  monograph,
  navigateTo,
  onOpenPatientModal,
  patient,
  S,
}: MonographPatientGuidanceProps) {
  const hasPatientContext = hasAnyPatientSignals(patient);
  const guidance = getMonographPatientGuidance(monograph, patient, crcl, ibw, adjbw);
  const patientTags = buildPatientContextTags(patient, crcl);
  const calculatorLabels = [...new Set(guidance.map((item) => item.calculatorLabel).filter(Boolean))] as string[];

  if (!hasPatientContext) {
    return (
      <section
        style={{
          background: S.card.background,
          border: `1px solid ${S.card.borderColor}`,
          borderLeft: "4px solid #38bdf8",
          borderRadius: "16px",
          padding: "16px 18px",
          marginBottom: "18px",
          boxShadow: S.meta.shadowSm,
        }}
      >
        <div style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "#0284c7", marginBottom: "8px" }}>
          Patient-specific execution lens
        </div>
        <div style={{ fontSize: "14px", fontWeight: 700, color: S.meta.textHeading, marginBottom: "6px" }}>
          Add patient context to personalize this monograph
        </div>
        <div style={{ fontSize: "13px", color: S.monographValue.color, lineHeight: 1.6 }}>
          Capture renal function, dialysis, pregnancy, oral route, microbiology, source-control, active medications, and OPAT flags to surface bedside-specific dosing, interaction, de-escalation, and transition cautions here.
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "12px" }}>
          <button type="button" style={{ ...S.expandAllBtn, marginRight: 0 }} onClick={onOpenPatientModal}>
            Set patient context
          </button>
          <button type="button" style={{ ...S.expandAllBtn, marginRight: 0 }} onClick={() => navigateTo(NAV_STATES.CALCULATORS)}>
            Open calculators
          </button>
        </div>
      </section>
    );
  }

  return (
    <section
      style={{
        background: S.card.background,
        border: `1px solid ${S.card.borderColor}`,
        borderLeft: `4px solid ${guidance[0] ? SEVERITY_STYLES[guidance[0].severity].border : "#38bdf8"}`,
        borderRadius: "16px",
        padding: "16px 18px",
        marginBottom: "18px",
        boxShadow: S.meta.shadowSm,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "flex-start", flexWrap: "wrap" }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "#0284c7", marginBottom: "8px" }}>
            Patient-specific execution lens
          </div>
          <div style={{ fontSize: "14px", fontWeight: 700, color: S.meta.textHeading }}>
            {guidance.length > 0 ? "Deterministic bedside checks fired for this patient." : "No deterministic cautions fired from the current patient inputs."}
          </div>
        </div>
        <button type="button" style={{ ...S.expandAllBtn, marginRight: 0 }} onClick={onOpenPatientModal}>
          Edit patient context
        </button>
      </div>

      {patientTags.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "12px" }}>
          {patientTags.map((tag) => (
            <span
              key={tag}
              style={{
                ...S.crossRefPill,
                cursor: "default",
                marginRight: 0,
                marginBottom: 0,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {guidance.length > 0 ? (
        <div style={{ display: "grid", gap: "8px", marginTop: "14px" }}>
          {guidance.map((item) => {
            const palette = SEVERITY_STYLES[item.severity];
            return (
              <div
                key={`${item.title}-${item.detail}`}
                style={{
                  border: `1px solid ${palette.border}40`,
                  borderLeft: `4px solid ${palette.border}`,
                  borderRadius: "12px",
                  background: palette.bg,
                  padding: "10px 12px",
                }}
              >
                <div style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: palette.text }}>
                  {palette.label}
                </div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: S.meta.textHeading, marginTop: "4px" }}>{item.title}</div>
                <div style={{ fontSize: "12px", color: S.monographValue.color, marginTop: "4px", lineHeight: 1.55 }}>{item.detail}</div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ fontSize: "12px", color: S.monographValue.color, marginTop: "12px", lineHeight: 1.6 }}>
          Keep using allergy review, local formulary notes, microbiology intelligence, and syndrome-level reassessment triggers alongside this patient context.
        </div>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "12px" }}>
        {calculatorLabels.map((label) => (
          <button
            key={label}
            type="button"
            style={{ ...S.expandAllBtn, marginRight: 0 }}
            onClick={() => navigateTo(NAV_STATES.CALCULATORS)}
          >
            {label}
          </button>
        ))}
      </div>
    </section>
  );
}
