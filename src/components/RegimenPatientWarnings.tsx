import { NAV_STATES } from "../styles/constants";
import type { InteractionAction, NavigateTo, PatientContext, RegimenPlan, Styles } from "../types";
import { getRegimenPatientWarnings } from "../utils/regimenGuidance";

interface RegimenPatientWarningsProps {
  crcl: number | null;
  drugId?: string;
  navigateTo: NavigateTo;
  patient: PatientContext;
  plan?: RegimenPlan;
  regimen: string;
  interactionActions?: InteractionAction[];
  S: Styles;
}

const SEVERITY_STYLES = {
  critical: { border: "#ef4444", text: "#dc2626", bg: "rgba(239,68,68,0.10)", label: "Critical" },
  warn: { border: "#f59e0b", text: "#d97706", bg: "rgba(245,158,11,0.10)", label: "Caution" },
  info: { border: "#38bdf8", text: "#0284c7", bg: "rgba(56,189,248,0.10)", label: "Info" },
} as const;

export default function RegimenPatientWarnings({
  crcl,
  drugId,
  navigateTo,
  patient,
  plan,
  regimen,
  interactionActions,
  S,
}: RegimenPatientWarningsProps) {
  const warnings = getRegimenPatientWarnings(regimen, drugId, patient, crcl, plan, interactionActions);

  if (warnings.length === 0) return null;

  const calculatorLabels = [...new Set(warnings.map((warning) => warning.calculatorLabel).filter(Boolean))] as string[];

  return (
    <div style={{ display: "grid", gap: "8px", marginTop: "10px" }}>
      {warnings.map((warning) => {
        const palette = SEVERITY_STYLES[warning.severity];
        return (
          <div
            key={`${warning.title}-${warning.detail}`}
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
            <div style={{ fontSize: "13px", fontWeight: 700, color: S.meta.textHeading, marginTop: "4px" }}>{warning.title}</div>
            <div style={{ fontSize: "12px", color: S.monographValue.color, marginTop: "4px", lineHeight: 1.55 }}>{warning.detail}</div>
          </div>
        );
      })}

      {calculatorLabels.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {calculatorLabels.map((label) => (
            <button
              key={label}
              type="button"
              style={{ ...S.expandAllBtn, marginRight: 0 }}
              onClick={() => navigateTo(NAV_STATES.CALCULATORS)}
              title="Open the calculators workspace"
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
