import React from "react";
import { EmpiricTierViewProps } from "../types";
import { getLineStyle } from "../styles/constants";
import CopyBtn from "./CopyBtn";
import AllergyWarning from "./AllergyWarning";

export default function EmpiricTierView({
  tier,
  S,
  navigateTo,
  NAV_STATES,
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
          <div key={oi} style={{ padding: "12px 16px", background: S.app.background === "#0a0f1a" ? "#0a0f1a" : "#f8fafc", borderRadius: "8px", marginBottom: "8px", borderLeft: "3px solid " + lineColor }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              {found ? (
                <button className="drug-link" style={{ ...S.drugLink, fontSize: "14px", fontWeight: 600 }} onClick={() => navigateTo(NAV_STATES.MONOGRAPH, { disease: found.disease, monograph: found.monograph })}>
                  {opt.regimen.split(" ")[0]} →
                </button>
              ) : (
                <span style={{ fontSize: "14px", fontWeight: 600, color: S.app?.color || "#e2e8f0" }}>{opt.regimen.split(" ")[0]}</span>
              )}
              <CopyBtn text={opt.regimen} id={`empiric-${oi}-${opt.drug}`} copiedId={copiedId} onCopy={onCopy} S={S} />
            </div>
            <div style={{ fontSize: "13px", color: S.monographValue?.color || "#94a3b8", fontFamily: "'IBM Plex Mono', monospace", marginBottom: "6px" }}>{opt.regimen}</div>
            <div style={{ fontSize: "12px", color: S.monographValue?.color || "#cbd5e1", lineHeight: 1.6 }}>{opt.notes}</div>
            <AllergyWarning drugId={opt.drug || opt.regimen.split(" ")[0].toLowerCase()} allergies={allergies} S={S} />
          </div>
        );
      })}
    </div>
  );
}