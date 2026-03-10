import { DISEASE_STATES } from "../src/data/index";
import {
  requiresExplicitMonographMeta,
  requiresExplicitSubcategoryMeta,
  resolveContentMeta,
} from "../src/data/metadata";
import type { ContentMeta, DiseaseState } from "../src/types";
import { CONTENT_STALE_AFTER_DAYS } from "../src/version";

declare const console: { log: (...args: unknown[]) => void };
declare const process: { exit: (code?: number) => never };

type Severity = "error" | "warn";

type Issue = {
  severity: Severity;
  scope: string;
  message: string;
};

function addIssue(issues: Issue[], severity: Severity, scope: string, message: string) {
  issues.push({ severity, scope, message });
}

function isValidDate(value: string) {
  return !Number.isNaN(new Date(`${value}T00:00:00`).getTime());
}

function isValidHttpsUrl(value: string) {
  return /^https:\/\/\S+$/i.test(value);
}

function daysBetween(left: Date, right: Date) {
  const diffMs = left.getTime() - right.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

function validateMeta(issues: Issue[], scope: string, meta: ContentMeta | undefined) {
  if (!meta) {
    addIssue(issues, "error", scope, "Missing contentMeta.");
    return;
  }

  if (!isValidDate(meta.lastReviewed)) {
    addIssue(issues, "error", scope, `Invalid lastReviewed date "${meta.lastReviewed}".`);
  } else {
    const ageDays = daysBetween(new Date(), new Date(`${meta.lastReviewed}T00:00:00`));
    if (ageDays > CONTENT_STALE_AFTER_DAYS) {
      addIssue(issues, "warn", scope, `Review date is ${ageDays} days old.`);
    }
  }

  if (!meta.sources.length) {
    addIssue(issues, "error", scope, "No structured sources listed.");
  }

  if (!["high", "moderate", "emerging"].includes(meta.confidence)) {
    addIssue(issues, "error", scope, `Invalid confidence value "${String(meta.confidence)}".`);
  }

  meta.sources.forEach((source, index) => {
    if (!source.label.trim()) {
      addIssue(issues, "error", `${scope} source #${index + 1}`, "Missing source label.");
    }
    if (!source.citation.trim()) {
      addIssue(issues, "error", `${scope} source #${index + 1}`, "Missing source citation.");
    }
    if (source.url && !isValidHttpsUrl(source.url)) {
      addIssue(issues, "error", `${scope} source #${index + 1}`, `Invalid source url "${source.url}".`);
    }
  });
}

function validateDisease(issues: Issue[], disease: DiseaseState) {
  const diseaseScope = `Disease ${disease.id}`;
  validateMeta(issues, diseaseScope, disease.contentMeta);

  if (disease.overview.keyGuidelines.length === 0) {
    addIssue(issues, "warn", diseaseScope, "No key guidelines listed.");
  }

  if (disease.overview.landmarkTrials.length === 0) {
    addIssue(issues, "warn", diseaseScope, "No landmark trials listed.");
  }

  const subcategoryIds = new Set<string>();
  disease.subcategories.forEach((subcategory) => {
    const { meta } = resolveContentMeta(subcategory, disease);

    if (subcategoryIds.has(subcategory.id)) {
      addIssue(issues, "error", diseaseScope, `Duplicate subcategory id "${subcategory.id}".`);
    }
    subcategoryIds.add(subcategory.id);

    if (requiresExplicitSubcategoryMeta(disease.id, subcategory.id) && !subcategory.contentMeta) {
      addIssue(issues, "error", `Subcategory ${disease.id}/${subcategory.id}`, "Priority pathway is missing explicit review metadata.");
    }

    validateMeta(issues, `Subcategory ${disease.id}/${subcategory.id}`, meta ?? undefined);
  });

  disease.drugMonographs.forEach((monograph) => {
    const { meta } = resolveContentMeta(monograph, disease);
    if (requiresExplicitMonographMeta(monograph.id) && !monograph.contentMeta) {
      addIssue(issues, "error", `Monograph ${disease.id}/${monograph.id}`, "Priority monograph is missing explicit review metadata.");
    }
    validateMeta(issues, `Monograph ${disease.id}/${monograph.id}`, meta ?? undefined);

    if (!monograph.adverseEffects?.common) {
      addIssue(issues, "warn", `Monograph ${monograph.id}`, "Missing adverseEffects.common.");
    }

    if (!monograph.adverseEffects?.serious) {
      addIssue(issues, "warn", `Monograph ${monograph.id}`, "Missing adverseEffects.serious.");
    }
  });
}

function main() {
  const issues: Issue[] = [];
  const diseaseIds = new Set<string>();

  DISEASE_STATES.forEach((disease) => {
    if (diseaseIds.has(disease.id)) {
      addIssue(issues, "error", "catalog", `Duplicate disease id "${disease.id}".`);
    }
    diseaseIds.add(disease.id);

    validateDisease(issues, disease);
  });

  const errors = issues.filter((issue) => issue.severity === "error");
  const warnings = issues.filter((issue) => issue.severity === "warn");

  console.log(`Content validation: ${DISEASE_STATES.length} diseases, ${errors.length} error(s), ${warnings.length} warning(s)`);
  issues.forEach((issue) => {
    const prefix = issue.severity === "error" ? "ERROR" : "WARN ";
    console.log(`${prefix} [${issue.scope}] ${issue.message}`);
  });

  if (errors.length > 0) {
    process.exit(1);
  }
}

main();
