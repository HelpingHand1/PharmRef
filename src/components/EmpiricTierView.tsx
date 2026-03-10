import { memo } from "react";
import { NAV_STATES } from "../styles/constants";
import { EmpiricTierViewProps } from "../types";
import { getLineStyle } from "../styles/constants";
import CopyBtn from "./CopyBtn";
import AllergyWarning from "./AllergyWarning";
import RegimenPatientWarnings from "./RegimenPatientWarnings";

const EmpiricTierView = memo(function EmpiricTierView({
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
  return (
    <div style={{ marginBottom: "20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
        <span style={{ ...S.tag, ...getLineStyle(tier.line) }}>{tier.line}</span>
      </div>
      {tier.options.map((opt, oi) => {
        const found = findMonograph(opt.drug || "");
        const lineColor = getLineStyle(tier.line).color || "#1e3a5f";
        return (
          <div
            key={oi}
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
                <span style={{ fontSize: "15px", fontWeight: 700, color: S.meta?.textHeading || S.app?.color || "#e2e8f0" }}>{opt.regimen.split(" ")[0]}</span>
              )}
              <CopyBtn text={opt.regimen} id={`empiric-${oi}-${opt.drug}`} copiedId={copiedId} onCopy={onCopy} S={S} />
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
            </div>
            <div style={{ fontSize: "13px", color: S.monographValue?.color || "#94a3b8", fontFamily: "'JetBrains Mono', monospace", marginBottom: "8px", lineHeight: 1.65 }}>
              {opt.regimen}
            </div>
            {opt.notes && <div style={{ fontSize: "13px", color: S.monographValue?.color || "#cbd5e1", lineHeight: 1.65 }}>{opt.notes}</div>}
            <AllergyWarning drugId={`${opt.drug ?? ""} ${opt.regimen}`.trim()} allergies={allergies} S={S} />
            <RegimenPatientWarnings
              crcl={crcl}
              drugId={opt.drug}
              navigateTo={navigateTo}
              patient={patient}
              regimen={opt.regimen}
              S={S}
            />
          </div>
        );
      })}
    </div>
  );
});

export default EmpiricTierView;
