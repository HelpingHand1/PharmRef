import { memo } from "react";
import { NAV_STATES } from "../styles/constants";
import { RegimenCrossRefsProps } from "../types";
import RegimenEvidencePills from "./RegimenEvidencePills";

const RegimenCrossRefs = memo(function RegimenCrossRefs({
  currentDiseaseId,
  currentDrugName,
  navigateTo,
  regimenXref,
  showToast,
  drugId,
  S,
}: RegimenCrossRefsProps) {
  const refs = regimenXref[drugId];
  if (!refs?.length) return null;

  return (
    <section style={{ ...S.card, cursor: "default", padding: "18px 20px", marginBottom: "18px" }}>
      <div style={{ ...S.monographLabel, color: S.meta.accent, marginBottom: "8px" }}>Regimen Cross-References</div>
      <h2 style={{ fontSize: "20px", lineHeight: 1.15, margin: 0, color: S.meta.textHeading }}>
        Used in {refs.length} empiric regimen{refs.length === 1 ? "" : "s"}
      </h2>
      <p style={{ color: S.monographValue.color, fontSize: "13px", marginTop: "8px", marginBottom: "14px", lineHeight: 1.6 }}>
        These entries are generated from the structured empiric regimen catalog and link back to the source pathway.
      </p>
      <div style={{ display: "grid", gap: "10px" }}>
        {refs.map((ref) => {
          const sameDisease = ref.diseaseId === currentDiseaseId;
          const openPathway = () => {
            showToast(`Viewing ${currentDrugName} in ${ref.subcategoryName}`, ref.diseaseIcon);
            navigateTo(NAV_STATES.SUBCATEGORY, { diseaseId: ref.diseaseId, subcategoryId: ref.subcategoryId });
          };
          return (
            <div
              key={ref.id}
              role="button"
              tabIndex={0}
              style={{
                textAlign: "left",
                background: S.meta.accentSurface,
                border: `1px solid ${S.meta.border}`,
                borderRadius: "14px",
                padding: "12px 14px",
                cursor: "pointer",
                transition: "transform 0.15s ease, border-color 0.15s ease",
              }}
              onClick={openPathway}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  openPathway();
                }
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "6px" }}>
                <span style={{ ...S.crossRefPill, marginRight: 0, marginBottom: 0 }}>
                  {ref.diseaseIcon} {ref.diseaseName}
                </span>
                <span style={{ ...S.crossRefPill, marginRight: 0, marginBottom: 0 }}>
                  {ref.subcategoryName}
                </span>
                <span
                  style={{
                    ...S.tag,
                    background: sameDisease ? "rgba(52,211,153,0.12)" : S.meta.accentSurface,
                    color: sameDisease ? "#059669" : S.meta.accent,
                    border: `1px solid ${sameDisease ? "rgba(52,211,153,0.28)" : S.meta.border}`,
                  }}
                >
                  {ref.line}
                </span>
              </div>
              <div style={{ fontSize: "13px", color: S.meta.textHeading, fontWeight: 700, lineHeight: 1.5 }}>{ref.regimen}</div>
              {ref.notes && (
                <div style={{ fontSize: "12px", marginTop: "6px", color: S.monographValue.color, lineHeight: 1.55 }}>
                  {ref.notes}
                </div>
              )}
              <RegimenEvidencePills
                evidence={ref.evidence}
                evidenceSource={ref.evidenceSource}
                evidenceSourceIds={ref.evidenceSourceIds}
                S={S}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
});

export default RegimenCrossRefs;
