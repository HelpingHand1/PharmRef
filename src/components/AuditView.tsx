import React from "react";
import { AuditViewProps } from "../types";

export default function AuditView({ diseaseStates, findMonograph, S }: AuditViewProps) {
  const issues = [];
  const requiredDsFields = ["id", "name", "icon", "category", "overview", "subcategories", "drugMonographs"];
  const requiredOverviewFields = ["definition", "epidemiology", "keyGuidelines", "landmarkTrials", "riskFactors"];
  const requiredScFields = ["id", "name", "definition", "empiricTherapy"];
  const requiredDmFields = ["id", "name", "brandNames", "drugClass", "mechanismOfAction", "spectrum", "dosing", "renalAdjustment", "hepaticAdjustment", "adverseEffects", "drugInteractions", "monitoring", "pregnancyLactation", "pharmacistPearls"];
  const allDrugIds = new Set();

  diseaseStates.forEach(ds => {
    requiredDsFields.forEach(f => { if (!ds[f]) issues.push({ severity: "error", disease: ds.name || ds.id, msg: `Missing required field: ${f}` }); });
    if (ds.overview) {
      requiredOverviewFields.forEach(f => { if (!ds.overview[f]) issues.push({ severity: "warn", disease: ds.name, msg: `Overview missing: ${f}` }); });
      if (ds.overview.keyGuidelines?.length === 0) issues.push({ severity: "warn", disease: ds.name, msg: "No key guidelines listed" });
      if (ds.overview.landmarkTrials?.length === 0) issues.push({ severity: "warn", disease: ds.name, msg: "No landmark trials listed" });
    }
    if (ds.subcategories) {
      ds.subcategories.forEach(sc => {
        requiredScFields.forEach(f => { if (!sc[f]) issues.push({ severity: "error", disease: ds.name, msg: `Subcategory "${sc.name || sc.id}" missing: ${f}` }); });
        if (!sc.pearls || sc.pearls.length === 0) issues.push({ severity: "info", disease: ds.name, msg: `Subcategory "${sc.name}" has no pearls` });
        sc.empiricTherapy?.forEach(tier => {
          tier.options?.forEach(opt => {
            if (opt.drug && opt.drug.length > 0) {
              const found = findMonograph(opt.drug);
              if (!found) issues.push({ severity: "warn", disease: ds.name, msg: `Empiric drug "${opt.drug}" in "${sc.name}" → "${tier.line}" has no matching monograph` });
            }
          });
        });
      });
    }
    if (ds.drugMonographs) {
      ds.drugMonographs.forEach(dm => {
        allDrugIds.add(dm.id);
        requiredDmFields.forEach(f => {
          const val = dm[f];
          if (!val || (typeof val === "string" && val.trim() === "") || (Array.isArray(val) && val.length === 0)) {
            issues.push({ severity: f === "pharmacistPearls" ? "warn" : "error", disease: ds.name, msg: `Monograph "${dm.name}" missing: ${f}` });
          }
        });
        if (!dm.adverseEffects?.common) issues.push({ severity: "warn", disease: ds.name, msg: `Monograph "${dm.name}" missing adverseEffects.common` });
        if (!dm.adverseEffects?.serious) issues.push({ severity: "warn", disease: ds.name, msg: `Monograph "${dm.name}" missing adverseEffects.serious` });
      });
    } else {
      issues.push({ severity: "error", disease: ds.name || ds.id, msg: "No drugMonographs array" });
    }
  });

  const errors = issues.filter(i => i.severity === "error");
  const warnings = issues.filter(i => i.severity === "warn");
  const infos = issues.filter(i => i.severity === "info");
  const sevColor = { error: "#ef4444", warn: "#fbbf24", info: "#60a5fa" };

  return (
    <>
      <h1 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "4px" }}>🔍 Data Integrity Audit</h1>
      <p style={{ color: "#64748b", fontSize: "12px", marginBottom: "16px" }}>{diseaseStates.length} disease states · {allDrugIds.size} unique drug monographs · {issues.length} issues found</p>
      <div style={{ display: "flex", gap: "12px", marginBottom: "16px", flexWrap: "wrap" }}>
        <span style={{ padding: "4px 12px", borderRadius: "9999px", fontSize: "12px", fontWeight: 600, background: "#ef444420", color: "#ef4444", border: "1px solid #ef444440" }}>Errors: {errors.length}</span>
        <span style={{ padding: "4px 12px", borderRadius: "9999px", fontSize: "12px", fontWeight: 600, background: "#fbbf2420", color: "#fbbf24", border: "1px solid #fbbf2440" }}>Warnings: {warnings.length}</span>
        <span style={{ padding: "4px 12px", borderRadius: "9999px", fontSize: "12px", fontWeight: 600, background: "#60a5fa20", color: "#60a5fa", border: "1px solid #60a5fa40" }}>Info: {infos.length}</span>
      </div>
      {issues.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#34d399", fontSize: "16px", fontWeight: 600 }}>✓ All checks passed</div>
      ) : (
        issues.map((issue, i) => (
          <div key={i} style={{ padding: "8px 14px", borderLeft: `3px solid ${sevColor[issue.severity]}`, background: `${sevColor[issue.severity]}08`, marginBottom: "4px", borderRadius: "0 6px 6px 0" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: sevColor[issue.severity], textTransform: "uppercase", marginRight: "8px" }}>{issue.severity}</span>
            <span style={{ fontSize: "11px", color: "#64748b", marginRight: "8px" }}>[{issue.disease}]</span>
            <span style={{ fontSize: "12px", color: S.monographValue?.color || "#cbd5e1" }}>{issue.msg}</span>
          </div>
        ))
      )}
    </>
  );
}