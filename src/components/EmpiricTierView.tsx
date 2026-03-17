import { memo } from "react";
import {
  getInstitutionOptionAntibiogram,
  getInstitutionOptionOverlay,
  sortEmpiricOptionsForInstitution,
} from "../data/institution-profile";
import { NAV_STATES } from "../styles/constants";
import { EmpiricTierViewProps } from "../types";
import { getLineStyle } from "../styles/constants";
import { getSourceLookupHref, resolveEvidenceSourceText, resolveSourceEntry } from "../data/source-registry";
import { getPreferredRegimenNotes, getPreferredRegimenText } from "../data/stewardship";
import CopyBtn from "./CopyBtn";
import AllergyWarning from "./AllergyWarning";
import InstitutionAntibiogramCards from "./InstitutionAntibiogramCards";
import RegimenPatientWarnings from "./RegimenPatientWarnings";
import { getPatientFitSortRank, getRegimenPatientFit } from "../utils/patientFit";
import { hasAnyPatientSignals } from "../utils/regimenGuidance";

const FIT_BADGE_STYLES = {
  preferred: { bg: "rgba(52,211,153,0.12)", border: "rgba(52,211,153,0.28)", color: "#059669" },
  caution: { bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.28)", color: "#d97706" },
  avoid: { bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.28)", color: "#dc2626" },
  needs_data: { bg: "rgba(56,189,248,0.12)", border: "rgba(56,189,248,0.28)", color: "#0284c7" },
  unavailable: { bg: "rgba(148,163,184,0.12)", border: "rgba(148,163,184,0.24)", color: "#64748b" },
} as const;

function collectOptionInteractionActions(
  option: EmpiricTierViewProps["tier"]["options"][number],
  findMonograph: EmpiricTierViewProps["findMonograph"],
) {
  const monographIds = [...new Set([option.monographId, ...(option.plan?.linkedMonographIds ?? [])].filter((value): value is string => Boolean(value)))];
  return monographIds.flatMap((monographId) => findMonograph(monographId)?.monograph.interactionActions ?? []);
}

const EmpiricTierView = memo(function EmpiricTierView({
  diseaseId,
  subcategoryId,
  tier,
  S,
  navigateTo,
  findMonograph,
  copiedId,
  onCopy,
  allergies,
  patient,
  crcl,
}: EmpiricTierViewProps) {
  const institutionSortedOptions = sortEmpiricOptionsForInstitution(diseaseId, subcategoryId, tier.options);
  const options = institutionSortedOptions
    .map(({ option, overlay }) => {
      const warningReference = option.monographId ?? option.drug;
      const regimenText = getPreferredRegimenText(option.regimen, option.plan);
      const interactionActions = collectOptionInteractionActions(option, findMonograph);
      return {
        option,
        overlay,
        interactionActions,
        patientFit: getRegimenPatientFit(regimenText, warningReference, patient, crcl, option.plan, interactionActions),
      };
    })
    .sort((left, right) => {
      if (!hasAnyPatientSignals(patient)) {
        return 0;
      }

      const fitRank = getPatientFitSortRank(left.patientFit) - getPatientFitSortRank(right.patientFit);
      if (fitRank !== 0) return fitRank;

      const leftInstitutionRank = left.overlay?.preferred ? 0 : left.overlay?.restricted ? 2 : 1;
      const rightInstitutionRank = right.overlay?.preferred ? 0 : right.overlay?.restricted ? 2 : 1;
      return leftInstitutionRank - rightInstitutionRank;
    });

  return (
    <div style={{ marginBottom: "20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
        <span style={{ ...S.tag, ...getLineStyle(tier.line) }}>{tier.line}</span>
      </div>
      {options.map(({ option: opt, overlay, patientFit, interactionActions }, oi) => {
        const found = findMonograph(opt.monographId || "");
        const linkedMonographs = [...new Set(opt.plan?.linkedMonographIds ?? [])]
          .map((monographId) => findMonograph(monographId))
          .filter((entry): entry is NonNullable<ReturnType<typeof findMonograph>> => Boolean(entry));
        const lineColor = getLineStyle(tier.line).color || "#1e3a5f";
        const evidenceSources =
          opt.evidenceSourceIds?.map((sourceId) => resolveSourceEntry(sourceId)).filter(Boolean) ??
          resolveEvidenceSourceText(opt.evidenceSource);
        const optionId = opt.id ?? `empiric-${oi}-${opt.monographId ?? opt.drug ?? "option"}`;
        const warningReference = opt.monographId ?? opt.drug;
        const regimenText = getPreferredRegimenText(opt.regimen, opt.plan);
        const regimenNotes = getPreferredRegimenNotes(opt.notes, opt.plan);
        const localOverlay = overlay ?? getInstitutionOptionOverlay(diseaseId, subcategoryId, opt);
        const localAntibiogram = getInstitutionOptionAntibiogram(diseaseId, subcategoryId, opt);
        return (
          <div
            key={optionId}
            style={{
              padding: "14px 16px",
              background: S.card.background,
              borderRadius: "16px",
              marginBottom: "10px",
              border: `1px solid ${S.card.borderColor}`,
              borderLeft: `4px solid ${lineColor}`,
              boxShadow: S.meta?.shadowSm,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", flexWrap: "wrap" }}>
              {found ? (
                <button className="drug-link" style={{ ...S.drugLink, fontSize: "15px", fontWeight: 700 }} onClick={() => navigateTo(NAV_STATES.MONOGRAPH, { disease: found.disease, monograph: found.monograph })}>
                  {found.monograph.name} →
                </button>
              ) : (
                <span style={{ fontSize: "15px", fontWeight: 700, color: S.meta?.textHeading || S.app?.color || "#e2e8f0" }}>{regimenText.split(" ")[0]}</span>
              )}
              <CopyBtn text={regimenText} id={optionId} copiedId={copiedId} onCopy={onCopy} S={S} />
              {opt.evidence && (
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 800,
                    letterSpacing: "0.06em",
                    padding: "2px 7px",
                    borderRadius: "6px",
                    background: opt.evidence.startsWith("A") ? "rgba(52,211,153,0.15)" : opt.evidence.startsWith("B") ? "rgba(251,191,36,0.15)" : "rgba(148,163,184,0.15)",
                    color: opt.evidence.startsWith("A") ? "#059669" : opt.evidence.startsWith("B") ? "#d97706" : "#64748b",
                    border: `1px solid ${opt.evidence.startsWith("A") ? "rgba(52,211,153,0.3)" : opt.evidence.startsWith("B") ? "rgba(251,191,36,0.3)" : "rgba(148,163,184,0.25)"}`,
                  }}
                  title={opt.evidenceSource ? `Evidence: ${opt.evidenceSource}` : `Evidence grade: ${opt.evidence}`}
                >
                  {opt.evidence}
                </span>
              )}
              {opt.plan?.role && (
                <span style={{ ...S.crossRefPill, cursor: "default", marginRight: 0, marginBottom: 0 }}>
                  {opt.plan.role}
                </span>
              )}
              {patientFit.status !== "unavailable" && (
                <span
                  style={{
                    ...S.crossRefPill,
                    cursor: "default",
                    marginRight: 0,
                    marginBottom: 0,
                    background: FIT_BADGE_STYLES[patientFit.status].bg,
                    borderColor: FIT_BADGE_STYLES[patientFit.status].border,
                    color: FIT_BADGE_STYLES[patientFit.status].color,
                  }}
                  title={patientFit.detail}
                >
                  Patient fit: {patientFit.label}
                </span>
              )}
              {localOverlay?.preferred && (
                <span style={{ ...S.crossRefPill, cursor: "default", marginRight: 0, marginBottom: 0, background: "rgba(52,211,153,0.12)", borderColor: "rgba(52,211,153,0.28)", color: "#059669" }}>
                  Local preferred
                </span>
              )}
              {localOverlay?.restricted && (
                <span style={{ ...S.crossRefPill, cursor: "default", marginRight: 0, marginBottom: 0, background: "rgba(239,68,68,0.12)", borderColor: "rgba(239,68,68,0.28)", color: "#dc2626" }}>
                  Restricted
                </span>
              )}
            </div>
            <div style={{ fontSize: "13px", color: S.monographValue?.color || "#94a3b8", fontFamily: "'JetBrains Mono', monospace", marginBottom: "8px", lineHeight: 1.65 }}>
              {regimenText}
            </div>
            {patientFit.status !== "unavailable" && (
              <div style={{ fontSize: "12px", color: S.monographValue?.color || "#cbd5e1", lineHeight: 1.55, marginBottom: "8px" }}>
                <strong style={{ color: FIT_BADGE_STYLES[patientFit.status].color }}>Patient fit:</strong> {patientFit.detail}
              </div>
            )}
            {regimenNotes && <div style={{ fontSize: "13px", color: S.monographValue?.color || "#cbd5e1", lineHeight: 1.65 }}>{regimenNotes}</div>}
            {opt.plan && (
              <div style={{ display: "grid", gap: "8px", marginTop: "10px" }}>
                {(opt.plan.indication || opt.plan.site) && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {opt.plan.indication && <span style={{ ...S.crossRefPill, cursor: "default", marginRight: 0, marginBottom: 0 }}>Indication: {opt.plan.indication}</span>}
                    {opt.plan.site && <span style={{ ...S.crossRefPill, cursor: "default", marginRight: 0, marginBottom: 0 }}>Site: {opt.plan.site}</span>}
                  </div>
                )}
                {[
                  { label: "Pathogen focus", values: opt.plan.pathogenFocus },
                  { label: "Use when", values: opt.plan.riskFactorTriggers },
                  { label: "Avoid if", values: opt.plan.avoidIf },
                  { label: "Renal / dialysis", values: [...(opt.plan.renalFlags ?? []), ...(opt.plan.dialysisFlags ?? [])] },
                  { label: "Rapid diagnostics", values: opt.plan.rapidDiagnosticActions },
                ]
                  .filter((group) => group.values && group.values.length > 0)
                  .map((group) => (
                    <div key={group.label} style={{ fontSize: "12px", lineHeight: 1.6, color: S.monographValue?.color || "#cbd5e1" }}>
                      <strong style={{ color: S.meta?.textHeading || "#e2e8f0" }}>{group.label}:</strong> {group.values?.join(" · ")}
                    </div>
                  ))}
                {linkedMonographs.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {linkedMonographs.map((entry) => (
                      <button
                        key={`${optionId}-${entry.monograph.id}`}
                        type="button"
                        className="drug-link"
                        style={{ ...S.drugLink, fontSize: "12px", fontWeight: 700 }}
                        onClick={() => navigateTo(NAV_STATES.MONOGRAPH, { disease: entry.disease, monograph: entry.monograph })}
                      >
                        {entry.monograph.name} →
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            {localAntibiogram.length > 0 && (
              <div
                style={{
                  marginTop: "10px",
                  padding: "10px 12px",
                  borderRadius: "12px",
                  background: "rgba(5,150,105,0.06)",
                  border: "1px solid rgba(5,150,105,0.18)",
                }}
              >
                <div style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "#059669", marginBottom: "6px" }}>
                  Local susceptibility overlay
                </div>
                <InstitutionAntibiogramCards entries={localAntibiogram} compact S={S} />
              </div>
            )}
            {localOverlay && (
              <div
                style={{
                  marginTop: "10px",
                  padding: "10px 12px",
                  borderRadius: "12px",
                  background: localOverlay.preferred ? "rgba(52,211,153,0.08)" : "rgba(239,68,68,0.08)",
                  border: `1px solid ${localOverlay.preferred ? "rgba(52,211,153,0.24)" : "rgba(239,68,68,0.24)"}`,
                }}
              >
                <div style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: localOverlay.preferred ? "#059669" : "#dc2626", marginBottom: "6px" }}>
                  {localOverlay.preferred ? "Local stewardship preference" : "Local restriction"}
                </div>
                <div style={{ fontSize: "12px", color: S.monographValue?.color || "#cbd5e1", lineHeight: 1.6 }}>{localOverlay.detail}</div>
                {localOverlay.approval && (
                  <div style={{ fontSize: "12px", color: S.meta?.textHeading || "#e2e8f0", marginTop: "6px", lineHeight: 1.55 }}>
                    {localOverlay.approval}
                  </div>
                )}
              </div>
            )}
            {opt.evidenceSource && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "10px" }}>
                <span style={{ ...S.crossRefPill, cursor: "default", marginRight: 0, marginBottom: 0 }}>
                  Source: {opt.evidenceSource}
                </span>
                {evidenceSources.map((source) => {
                  const lookup = getSourceLookupHref(source, opt.evidenceSource);
                  return (
                    <a
                      key={source.id}
                      href={lookup.href}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        ...S.crossRefPill,
                        marginRight: 0,
                        marginBottom: 0,
                        textDecoration: "none",
                      }}
                    >
                      {source.label}
                    </a>
                  );
                })}
              </div>
            )}
            <AllergyWarning drugId={`${warningReference ?? ""} ${regimenText}`.trim()} allergies={allergies} S={S} />
            <RegimenPatientWarnings
              crcl={crcl}
              drugId={warningReference}
              interactionActions={interactionActions}
              navigateTo={navigateTo}
              patient={patient}
              plan={opt.plan}
              regimen={regimenText}
              S={S}
            />
          </div>
        );
      })}
    </div>
  );
});

export default EmpiricTierView;
