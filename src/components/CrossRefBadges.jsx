import React from "react";

export default function CrossRefBadges({ drugId, currentDiseaseId, monographXref, navigateTo, NAV_STATES, showToast, currentDrugName, S }) {
  const refs = monographXref[drugId];
  if (!refs || refs.length <= 1) return null;
  const others = refs.filter(ds => ds.id !== currentDiseaseId);
  if (others.length === 0) return null;
  return (
    <div style={{ marginTop: "8px" }}>
      <span style={{ fontSize: "11px", color: "#64748b", marginRight: "6px" }}>Also in:</span>
      {others.map(ds => (
        <span key={ds.id} className="xref-pill" style={S.crossRefPill} onClick={() => {
          showToast(`Viewing ${currentDrugName || "drug"} in ${ds.name}`, ds.icon);
          const mono = ds.drugMonographs?.find(m => m.id === drugId);
          if (mono) navigateTo(NAV_STATES.MONOGRAPH, { disease: ds, monograph: mono });
        }}>
          {ds.icon} {ds.name}
        </span>
      ))}
    </div>
  );
}