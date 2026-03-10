import type { DiseaseState, DrugMonograph, Subcategory } from "../types";
import { AuditViewProps } from "../types";
import {
  requiresExplicitMonographMeta,
  requiresExplicitSubcategoryMeta,
  resolveContentMeta,
} from "../data/metadata";
import { CONTENT_STALE_AFTER_DAYS } from "../version";

type IssueSeverity = "error" | "warn" | "info";

type Issue = {
  severity: IssueSeverity;
  disease: string;
  msg: string;
};

const REQUIRED_DISEASE_FIELDS: Array<keyof DiseaseState> = ["id", "name", "icon", "category", "overview", "subcategories", "drugMonographs"];
const REQUIRED_OVERVIEW_FIELDS: Array<keyof DiseaseState["overview"]> = [
  "definition",
  "epidemiology",
  "keyGuidelines",
  "landmarkTrials",
  "riskFactors",
];
const REQUIRED_SUBCATEGORY_FIELDS: Array<keyof Subcategory> = ["id", "name", "definition", "empiricTherapy"];
const REQUIRED_MONOGRAPH_FIELDS: Array<keyof DrugMonograph> = [
  "id",
  "name",
  "brandNames",
  "drugClass",
  "mechanismOfAction",
  "spectrum",
  "dosing",
  "renalAdjustment",
  "hepaticAdjustment",
  "adverseEffects",
  "drugInteractions",
  "monitoring",
  "pregnancyLactation",
  "pharmacistPearls",
];

function isMissing(value: unknown): boolean {
  if (value == null) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

function daysOld(value: string | undefined): number | null {
  if (!value) return null;
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return null;
  return Math.floor((Date.now() - parsed.getTime()) / (1000 * 60 * 60 * 24));
}

export default function AuditView({ diseaseStates, findMonograph, S }: AuditViewProps) {
  const issues: Issue[] = [];
  const allDrugIds = new Set<string>();

  diseaseStates.forEach((disease) => {
    REQUIRED_DISEASE_FIELDS.forEach((field) => {
      if (isMissing(disease[field])) {
        issues.push({ severity: "error", disease: disease.name || disease.id, msg: `Missing required field: ${field}` });
      }
    });

    REQUIRED_OVERVIEW_FIELDS.forEach((field) => {
      if (isMissing(disease.overview[field])) {
        issues.push({ severity: "warn", disease: disease.name, msg: `Overview missing: ${field}` });
      }
    });

    if (!disease.contentMeta) {
      issues.push({ severity: "error", disease: disease.name, msg: "Missing disease review metadata" });
    } else {
      if (disease.contentMeta.sources.length === 0) {
        issues.push({ severity: "error", disease: disease.name, msg: "Disease review metadata has no structured sources" });
      }
      if (!["high", "moderate", "emerging"].includes(disease.contentMeta.confidence)) {
        issues.push({ severity: "error", disease: disease.name, msg: "Disease review metadata has invalid confidence" });
      }
      const reviewAge = daysOld(disease.contentMeta.lastReviewed);
      if (reviewAge === null) {
        issues.push({ severity: "error", disease: disease.name, msg: "Disease review metadata has an invalid review date" });
      } else if (reviewAge > CONTENT_STALE_AFTER_DAYS) {
        issues.push({ severity: "warn", disease: disease.name, msg: `Disease review metadata is stale (${reviewAge} days old)` });
      }
    }

    if (disease.overview.keyGuidelines.length === 0) {
      issues.push({ severity: "warn", disease: disease.name, msg: "No key guidelines listed" });
    }
    if (disease.overview.landmarkTrials.length === 0) {
      issues.push({ severity: "warn", disease: disease.name, msg: "No landmark trials listed" });
    }

    disease.subcategories.forEach((subcategory) => {
      const resolvedSubcategoryMeta = resolveContentMeta(subcategory, disease).meta;
      REQUIRED_SUBCATEGORY_FIELDS.forEach((field) => {
        if (isMissing(subcategory[field])) {
          issues.push({
            severity: "error",
            disease: disease.name,
            msg: `Subcategory "${subcategory.name || subcategory.id}" missing: ${field}`,
          });
        }
      });

      if (requiresExplicitSubcategoryMeta(disease.id, subcategory.id) && !subcategory.contentMeta) {
        issues.push({ severity: "error", disease: disease.name, msg: `Priority pathway "${subcategory.name}" is missing explicit review metadata` });
      }

      if (!resolvedSubcategoryMeta) {
        issues.push({ severity: "error", disease: disease.name, msg: `Subcategory "${subcategory.name || subcategory.id}" is missing review metadata` });
      } else {
        if (!resolvedSubcategoryMeta.sources.length) {
          issues.push({ severity: "error", disease: disease.name, msg: `Subcategory "${subcategory.name}" has no structured sources` });
        }
        if (!["high", "moderate", "emerging"].includes(resolvedSubcategoryMeta.confidence)) {
          issues.push({ severity: "error", disease: disease.name, msg: `Subcategory "${subcategory.name}" has invalid confidence metadata` });
        }
        const reviewAge = daysOld(resolvedSubcategoryMeta.lastReviewed);
        if (reviewAge === null) {
          issues.push({ severity: "error", disease: disease.name, msg: `Subcategory "${subcategory.name}" has an invalid review date` });
        } else if (reviewAge > CONTENT_STALE_AFTER_DAYS) {
          issues.push({ severity: "warn", disease: disease.name, msg: `Subcategory "${subcategory.name}" metadata is stale (${reviewAge} days old)` });
        }
      }

      if (!subcategory.pearls || subcategory.pearls.length === 0) {
        issues.push({ severity: "info", disease: disease.name, msg: `Subcategory "${subcategory.name}" has no pearls` });
      }

      subcategory.empiricTherapy?.forEach((tier) => {
        tier.options.forEach((option) => {
          if (!option.drug) return;
          if (!findMonograph(option.drug)) {
            issues.push({
              severity: "warn",
              disease: disease.name,
              msg: `Empiric drug "${option.drug}" in "${subcategory.name}" → "${tier.line}" has no matching monograph`,
            });
          }
        });
      });
    });

    disease.drugMonographs.forEach((monograph) => {
      const resolvedMonographMeta = resolveContentMeta(monograph, disease).meta;
      allDrugIds.add(monograph.id);
      REQUIRED_MONOGRAPH_FIELDS.forEach((field) => {
        if (isMissing(monograph[field])) {
          issues.push({
            severity: field === "pharmacistPearls" ? "warn" : "error",
            disease: disease.name,
            msg: `Monograph "${monograph.name}" missing: ${field}`,
          });
        }
      });

      if (requiresExplicitMonographMeta(monograph.id) && !monograph.contentMeta) {
        issues.push({ severity: "error", disease: disease.name, msg: `Priority monograph "${monograph.name}" is missing explicit review metadata` });
      }

      if (!resolvedMonographMeta) {
        issues.push({ severity: "error", disease: disease.name, msg: `Monograph "${monograph.name}" is missing review metadata` });
      } else {
        if (!resolvedMonographMeta.sources.length) {
          issues.push({ severity: "error", disease: disease.name, msg: `Monograph "${monograph.name}" has no structured sources` });
        }
        if (!["high", "moderate", "emerging"].includes(resolvedMonographMeta.confidence)) {
          issues.push({ severity: "error", disease: disease.name, msg: `Monograph "${monograph.name}" has invalid confidence metadata` });
        }
        const reviewAge = daysOld(resolvedMonographMeta.lastReviewed);
        if (reviewAge === null) {
          issues.push({ severity: "error", disease: disease.name, msg: `Monograph "${monograph.name}" has an invalid review date` });
        } else if (reviewAge > CONTENT_STALE_AFTER_DAYS) {
          issues.push({ severity: "warn", disease: disease.name, msg: `Monograph "${monograph.name}" metadata is stale (${reviewAge} days old)` });
        }
      }

      if (!monograph.adverseEffects?.common) {
        issues.push({ severity: "warn", disease: disease.name, msg: `Monograph "${monograph.name}" missing adverseEffects.common` });
      }
      if (!monograph.adverseEffects?.serious) {
        issues.push({ severity: "warn", disease: disease.name, msg: `Monograph "${monograph.name}" missing adverseEffects.serious` });
      }
    });
  });

  const errors = issues.filter((issue) => issue.severity === "error");
  const warnings = issues.filter((issue) => issue.severity === "warn");
  const infos = issues.filter((issue) => issue.severity === "info");
  const severityColor: Record<IssueSeverity, string> = { error: "#ef4444", warn: "#fbbf24", info: "#60a5fa" };

  return (
    <>
      <section className="page-hero" style={{ ...S.card, cursor: "default", padding: "20px 22px", marginBottom: "18px" }}>
        <div className="page-hero-copy">
          <div style={{ ...S.monographLabel, color: S.meta?.accent, marginBottom: "8px" }}>Content Audit</div>
          <h1 style={{ fontSize: "26px", lineHeight: 1.12, letterSpacing: "-0.04em", margin: 0, color: S.meta?.textHeading }}>Data Integrity Audit</h1>
          <p style={{ color: S.monographValue?.color || "#64748b", fontSize: "13px", marginTop: "10px", marginBottom: 0, lineHeight: 1.6 }}>
            {diseaseStates.length} disease states · {allDrugIds.size} unique drug monographs · {issues.length} issues found
          </p>
        </div>
      </section>
      <div className="quick-facts-grid" style={{ ...S.quickFactsGrid, marginTop: 0, marginBottom: "18px" }}>
        <span style={{ padding: "4px 12px", borderRadius: "9999px", fontSize: "12px", fontWeight: 600, background: "#ef444420", color: "#ef4444", border: "1px solid #ef444440" }}>
          Errors: {errors.length}
        </span>
        <span style={{ padding: "4px 12px", borderRadius: "9999px", fontSize: "12px", fontWeight: 600, background: "#fbbf2420", color: "#fbbf24", border: "1px solid #fbbf2440" }}>
          Warnings: {warnings.length}
        </span>
        <span style={{ padding: "4px 12px", borderRadius: "9999px", fontSize: "12px", fontWeight: 600, background: "#60a5fa20", color: "#60a5fa", border: "1px solid #60a5fa40" }}>
          Info: {infos.length}
        </span>
      </div>
      {issues.length === 0 ? (
        <div style={{ ...S.card, cursor: "default", textAlign: "center", padding: "40px", color: "#34d399", fontSize: "16px", fontWeight: 700 }}>✓ All checks passed</div>
      ) : (
        issues.map((issue, index) => (
          <div
            key={`${issue.disease}-${index}`}
            style={{
              padding: "12px 14px",
              borderLeft: `4px solid ${severityColor[issue.severity]}`,
              background: `${severityColor[issue.severity]}08`,
              marginBottom: "8px",
              borderRadius: "14px",
              border: `1px solid ${severityColor[issue.severity]}20`,
            }}
          >
            <span style={{ fontSize: "11px", fontWeight: 700, color: severityColor[issue.severity], textTransform: "uppercase", marginRight: "8px" }}>
              {issue.severity}
            </span>
            <span style={{ fontSize: "11px", color: S.monographLabel?.color || "#64748b", marginRight: "8px" }}>[{issue.disease}]</span>
            <span style={{ fontSize: "12px", color: S.monographValue?.color || "#cbd5e1" }}>{issue.msg}</span>
          </div>
        ))
      )}
    </>
  );
}
