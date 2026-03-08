import { NAV_STATES } from "../styles/constants";
import { EmpiricTierViewProps } from "../types";
import { getLineStyle } from "../styles/constants";
import CopyBtn from "./CopyBtn";
import AllergyWarning from "./AllergyWarning";

export default function EmpiricTierView({
  tier,
  S,
  navigateTo,
  findMonograph,
  copiedId,
  onCopy,
  allergies,
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
            </div>
            <div style={{ fontSize: "13px", color: S.monographValue?.color || "#94a3b8", fontFamily: "'JetBrains Mono', monospace", marginBottom: "8px", lineHeight: 1.65 }}>
              {opt.regimen}
            </div>
            {opt.notes && <div style={{ fontSize: "13px", color: S.monographValue?.color || "#cbd5e1", lineHeight: 1.65 }}>{opt.notes}</div>}
            <AllergyWarning drugId={opt.drug || opt.regimen.split(" ")[0].toLowerCase()} allergies={allergies} S={S} />
          </div>
        );
      })}
    </div>
  );
}
