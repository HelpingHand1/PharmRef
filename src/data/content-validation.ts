import type { ContentMeta, DiseaseState, DrugMonograph, OverviewEvidenceEntry, Subcategory } from "../types";
import { CONTENT_STALE_AFTER_DAYS } from "../version";
import {
  computeDiseaseOverviewFingerprint,
  getMonographContentKey,
  getSubcategoryContentKey,
  computeMonographFingerprint,
  computeSubcategoryFingerprint,
  requiresExplicitMonographMeta,
  requiresExplicitSubcategoryMeta,
  resolveContentMeta,
} from "./metadata";
import { resolveOverviewEntrySources } from "./overview-evidence";
import {
  getSourceRegistryIssues,
  OVERVIEW_DISALLOWED_SOURCE_IDS,
  resolveEvidenceSourceText,
  resolveSourceEntry,
} from "./source-registry";

export type ContentValidationSeverity = "error" | "warn" | "info";

export interface ContentValidationIssue {
  severity: ContentValidationSeverity;
  disease: string;
  scope: string;
  message: string;
}

const REQUIRED_DISEASE_FIELDS: Array<keyof DiseaseState> = ["id", "name", "icon", "category", "overview", "subcategories"];
const REQUIRED_OVERVIEW_FIELDS: Array<keyof DiseaseState["overview"]> = [
  "definition",
  "epidemiology",
  "keyGuidelines",
  "landmarkTrials",
  "riskFactors",
];
const REQUIRED_SUBCATEGORY_FIELDS: Array<keyof Subcategory> = ["id", "name", "definition"];
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

const EVIDENCE_GRADE_PATTERN = /^(A|B|C)-(I|II|III)(?:\s*\(.+\))?$/;

function addIssue(
  issues: ContentValidationIssue[],
  severity: ContentValidationSeverity,
  disease: string,
  scope: string,
  message: string,
) {
  issues.push({ severity, disease, scope, message });
}

function isMissing(value: unknown): boolean {
  if (value == null) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

function isValidDate(value: string) {
  return !Number.isNaN(new Date(`${value}T00:00:00`).getTime());
}

function daysOld(value: string | undefined): number | null {
  if (!value) return null;
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return null;
  return Math.floor((Date.now() - parsed.getTime()) / (1000 * 60 * 60 * 24));
}

function hasValidReviewHistory(
  meta: Pick<ContentMeta, "lastReviewed" | "reviewedBy" | "reviewHistory">,
) {
  if (meta.reviewHistory.length === 0) return false;
  const [latestReview] = meta.reviewHistory;
  if (!latestReview) return false;
  if (latestReview.reviewedOn !== meta.lastReviewed || latestReview.reviewedBy !== meta.reviewedBy) {
    return false;
  }
  return meta.reviewHistory.every((entry, index, entries) => {
    if (!entry.reviewedOn || !entry.reviewedBy?.trim() || !entry.summary?.trim()) {
      return false;
    }
    const current = new Date(`${entry.reviewedOn}T00:00:00`).getTime();
    if (Number.isNaN(current)) return false;
    if (index === 0) return true;
    const previous = new Date(`${entries[index - 1].reviewedOn}T00:00:00`).getTime();
    return !Number.isNaN(previous) && previous >= current;
  });
}

function getEmpiricTherapy(subcategory: Subcategory) {
  return subcategory.empiricTherapy ?? subcategory.empiricRegimens ?? [];
}

function hasNonEmptyRecordValues(record?: Record<string, string | undefined>) {
  if (!record) return false;
  return Object.values(record).some((value) => typeof value === "string" && value.trim().length > 0);
}

function validateMeta(
  issues: ContentValidationIssue[],
  disease: string,
  scope: string,
  meta: ContentMeta | undefined,
  expectedBodyVersion?: string,
) {
  if (!meta) {
    addIssue(issues, "error", disease, scope, "Missing contentMeta.");
    return;
  }

  if (!isValidDate(meta.lastReviewed)) {
    addIssue(issues, "error", disease, scope, `Invalid lastReviewed date "${meta.lastReviewed}".`);
  } else {
    const ageDays = daysOld(meta.lastReviewed);
    if (ageDays !== null && ageDays > CONTENT_STALE_AFTER_DAYS) {
      addIssue(issues, "warn", disease, scope, `Review date is ${ageDays} days old.`);
    }
  }

  if (!meta.sources.length) {
    addIssue(issues, "error", disease, scope, "No structured sources listed.");
  }

  if (!["high", "moderate", "emerging"].includes(meta.confidence)) {
    addIssue(issues, "error", disease, scope, `Invalid confidence value "${String(meta.confidence)}".`);
  }

  if (!meta.reviewedBy?.trim()) {
    addIssue(issues, "error", disease, scope, "Missing reviewedBy attribution.");
  }

  if (!meta.reviewScope?.trim()) {
    addIssue(issues, "error", disease, scope, "Missing reviewScope attribution.");
  }

  if (!hasValidReviewHistory(meta)) {
    addIssue(issues, "error", disease, scope, "Missing valid structured reviewHistory entries.");
  }

  if (!meta.governance?.owner?.trim()) {
    addIssue(issues, "error", disease, scope, "Missing content owner attribution.");
  }

  if (!meta.governance?.approvedBodyVersion?.trim()) {
    addIssue(issues, "error", disease, scope, "Missing approved body version.");
  } else if (expectedBodyVersion && meta.governance.approvedBodyVersion !== expectedBodyVersion) {
    addIssue(
      issues,
      "error",
      disease,
      scope,
      `Approved body version "${meta.governance.approvedBodyVersion}" does not match current content version "${expectedBodyVersion}". Run \`npm run approve:content\` after review.`,
    );
  }

  meta.sources.forEach((source, index) => {
    if (!source.id.trim()) {
      addIssue(issues, "error", disease, `${scope} source #${index + 1}`, "Missing source id.");
    }
    if (!source.citation.trim()) {
      addIssue(issues, "error", disease, `${scope} source #${index + 1}`, "Missing source citation.");
    }
    if (!resolveSourceEntry(source.id)) {
      addIssue(issues, "error", disease, `${scope} source #${index + 1}`, `Unknown source id "${source.id}".`);
    }
  });

  const duplicateSourceIds = meta.sources
    .map((source) => source.id)
    .filter((sourceId, index, all) => all.indexOf(sourceId) !== index);
  duplicateSourceIds.forEach((sourceId) => {
    addIssue(issues, "warn", disease, scope, `Duplicate source id "${sourceId}".`);
  });
}

function validateOverviewEntries(
  issues: ContentValidationIssue[],
  disease: DiseaseState,
  label: "key guideline" | "landmark trial",
  entries: OverviewEvidenceEntry[],
) {
  entries.forEach((entry, index) => {
    const scope = `Disease ${disease.id} ${label} #${index + 1}`;
    if (!entry.name?.trim()) {
      addIssue(issues, "error", disease.name, scope, `Missing ${label} name.`);
    }
    if (!entry.detail?.trim()) {
      addIssue(issues, "error", disease.name, scope, `Missing ${label} detail.`);
    }
    entry.sourceIds?.forEach((sourceId) => {
      const source = resolveSourceEntry(sourceId);
      if (!source) {
        addIssue(issues, "error", disease.name, scope, `Unknown ${label} source id "${sourceId}".`);
      } else if (OVERVIEW_DISALLOWED_SOURCE_IDS.has(sourceId)) {
        addIssue(
          issues,
          "error",
          disease.name,
          scope,
          `${label} source id "${sourceId}" is too generic for overview evidence.`,
        );
      } else if (!source.url && !source.pmid && !source.doi) {
        addIssue(
          issues,
          "error",
          disease.name,
          scope,
          `${label} source id "${sourceId}" does not yet have a verified PMID, DOI, or direct URL.`,
        );
      }
    });
    if (!entry.sourceIds?.length) {
      addIssue(
        issues,
        "error",
        disease.name,
        scope,
        `${label} is missing explicit structured source ids.`,
      );
      return;
    }
    if (resolveOverviewEntrySources(entry).length === 0) {
      addIssue(
        issues,
        "error",
        disease.name,
        scope,
        `${label} source ids do not resolve to canonical sources.`,
      );
    }
  });
}

function validateSubcategory(
  issues: ContentValidationIssue[],
  disease: DiseaseState,
  subcategory: Subcategory,
  knownMonographIds: Set<string>,
  optionIds: Set<string>,
) {
  const subcategoryScope = `Subcategory ${disease.id}/${subcategory.id}`;
  const resolvedMeta = resolveContentMeta(subcategory, disease, {
    contentKey: getSubcategoryContentKey(disease.id, subcategory.id),
  }).meta;

  REQUIRED_SUBCATEGORY_FIELDS.forEach((field) => {
    if (isMissing(subcategory[field])) {
      addIssue(issues, "error", disease.name, subcategoryScope, `Missing required field "${field}".`);
    }
  });

  if (requiresExplicitSubcategoryMeta(disease.id, subcategory.id) && !subcategory.contentMeta) {
    addIssue(issues, "error", disease.name, subcategoryScope, "Priority pathway is missing explicit review metadata.");
  }

  validateMeta(
    issues,
    disease.name,
    subcategoryScope,
    resolvedMeta ?? undefined,
    computeSubcategoryFingerprint(subcategory),
  );

  const tiers = getEmpiricTherapy(subcategory);
  if (tiers.length === 0) {
    addIssue(issues, "error", disease.name, subcategoryScope, "No empiric therapy tiers listed.");
  }

  tiers.forEach((tier, tierIndex) => {
    const tierScope = `${subcategoryScope} tier #${tierIndex + 1}`;
    if (!tier.line?.trim()) {
      addIssue(issues, "error", disease.name, tierScope, "Missing empiric tier line label.");
    }
    if (!tier.options.length) {
      addIssue(issues, "error", disease.name, tierScope, "Empiric tier has no regimen options.");
    }

    tier.options.forEach((option, optionIndex) => {
      const optionScope = `${tierScope} option #${optionIndex + 1}`;
      if (!option.id?.trim()) {
        addIssue(issues, "error", disease.name, optionScope, "Missing structured empiric option id.");
      } else if (optionIds.has(option.id)) {
        addIssue(issues, "error", disease.name, optionScope, `Duplicate empiric option id "${option.id}".`);
      } else {
        optionIds.add(option.id);
      }
      if (!option.regimen?.trim()) {
        addIssue(issues, "error", disease.name, optionScope, "Missing regimen text.");
      }
      if (!option.notes?.trim()) {
        addIssue(issues, "warn", disease.name, optionScope, "Missing regimen explanatory notes.");
      }
      if (option.monographId && !knownMonographIds.has(option.monographId)) {
        addIssue(issues, "error", disease.name, optionScope, `Unknown monographId "${option.monographId}".`);
      }
      if (option.evidence && !EVIDENCE_GRADE_PATTERN.test(option.evidence)) {
        addIssue(issues, "error", disease.name, optionScope, `Invalid evidence grade "${option.evidence}".`);
      }
      if (option.evidence && !option.evidenceSource) {
        addIssue(issues, "warn", disease.name, optionScope, `Evidence grade "${option.evidence}" is missing a source label.`);
      }
      if (option.evidenceSource && !option.evidence) {
        addIssue(issues, "warn", disease.name, optionScope, `Evidence source "${option.evidenceSource}" is missing an evidence grade.`);
      }
      if (option.evidenceSource && resolveEvidenceSourceText(option.evidenceSource).length === 0) {
        addIssue(
          issues,
          "warn",
          disease.name,
          optionScope,
          `Evidence source "${option.evidenceSource}" does not resolve to the canonical registry.`,
        );
      }
      if (option.evidenceSource && (!option.evidenceSourceIds || option.evidenceSourceIds.length === 0)) {
        addIssue(issues, "error", disease.name, optionScope, "Evidence source label is missing structured source ids.");
      }
      option.evidenceSourceIds?.forEach((sourceId) => {
        if (sourceId.trim().length === 0) return;
        if (!resolveSourceEntry(sourceId)) {
          addIssue(issues, "error", disease.name, optionScope, `Unknown evidenceSourceId "${sourceId}".`);
        }
      });
    });
  });

  subcategory.organismSpecific?.forEach((organism, index) => {
    const organismScope = `${subcategoryScope} organism #${index + 1}`;
    if (!organism.organism?.trim()) {
      addIssue(issues, "error", disease.name, organismScope, "Missing organism label.");
    }
    if (!organism.preferred?.trim() && !organism.alternative?.trim() && !organism.notes?.trim()) {
      addIssue(issues, "warn", disease.name, organismScope, "Organism entry has no preferred, alternative, or notes text.");
    }
  });

  if (subcategory.durationGuidance && !subcategory.durationGuidance.standard?.trim()) {
    addIssue(issues, "warn", disease.name, subcategoryScope, "Duration guidance is missing the standard duration.");
  }

  if (!subcategory.pearls || subcategory.pearls.length === 0) {
    addIssue(issues, "info", disease.name, subcategoryScope, "No pearls listed.");
  }
}

function validateMonograph(
  issues: ContentValidationIssue[],
  disease: DiseaseState,
  monograph: DrugMonograph,
) {
  const monographScope = `Monograph ${disease.id}/${monograph.id}`;
  const resolvedMeta = resolveContentMeta(monograph, disease, {
    contentKey: getMonographContentKey(disease.id, monograph.id),
  }).meta;

  REQUIRED_MONOGRAPH_FIELDS.forEach((field) => {
    if (isMissing(monograph[field])) {
      addIssue(
        issues,
        field === "pharmacistPearls" ? "warn" : "error",
        disease.name,
        monographScope,
        `Missing required field "${field}".`,
      );
    }
  });

  if (requiresExplicitMonographMeta(monograph.id) && !monograph.contentMeta) {
    addIssue(issues, "error", disease.name, monographScope, "Priority monograph is missing explicit review metadata.");
  }

  validateMeta(
    issues,
    disease.name,
    monographScope,
    resolvedMeta ?? undefined,
    computeMonographFingerprint(monograph),
  );

  if (!hasNonEmptyRecordValues(monograph.dosing)) {
    addIssue(issues, "error", disease.name, monographScope, "Dosing block has no populated scenarios.");
  } else if (monograph.dosing) {
    Object.entries(monograph.dosing).forEach(([key, value]) => {
      if (!value?.trim()) {
        addIssue(issues, "warn", disease.name, `${monographScope} dosing.${key}`, "Dosing scenario is empty.");
      }
    });
  }

  if (!monograph.adverseEffects?.common) {
    addIssue(issues, "warn", disease.name, monographScope, "Missing adverseEffects.common.");
  }
  if (!monograph.adverseEffects?.serious) {
    addIssue(issues, "warn", disease.name, monographScope, "Missing adverseEffects.serious.");
  }

  if (monograph.pkpdDriver && (!monograph.pkpdDriver.driver || !monograph.pkpdDriver.target?.trim())) {
    addIssue(issues, "warn", disease.name, monographScope, "PK/PD driver block is incomplete.");
  }

  if (monograph.ivToPoSwitch) {
    if (!monograph.ivToPoSwitch.poBioavailability?.trim()) {
      addIssue(issues, "warn", disease.name, monographScope, "IV-to-PO switch block is missing poBioavailability.");
    }
    if (!monograph.ivToPoSwitch.switchCriteria?.trim()) {
      addIssue(issues, "warn", disease.name, monographScope, "IV-to-PO switch block is missing switchCriteria.");
    }
  }

  if (monograph.opatEligibility) {
    if (!monograph.opatEligibility.administration?.trim()) {
      addIssue(issues, "warn", disease.name, monographScope, "OPAT block is missing administration guidance.");
    }
    if (!monograph.opatEligibility.monitoring?.trim()) {
      addIssue(issues, "warn", disease.name, monographScope, "OPAT block is missing monitoring guidance.");
    }
  }
}

function validateDisease(
  issues: ContentValidationIssue[],
  disease: DiseaseState,
  knownMonographIds: Set<string>,
) {
  const diseaseScope = `Disease ${disease.id}`;
  const optionIds = new Set<string>();

  REQUIRED_DISEASE_FIELDS.forEach((field) => {
    if (isMissing(disease[field])) {
      addIssue(issues, "error", disease.name || disease.id, diseaseScope, `Missing required field "${field}".`);
    }
  });

  REQUIRED_OVERVIEW_FIELDS.forEach((field) => {
    if (isMissing(disease.overview[field])) {
      addIssue(issues, "warn", disease.name, diseaseScope, `Overview missing "${field}".`);
    }
  });

  validateMeta(
    issues,
    disease.name,
    diseaseScope,
    disease.contentMeta,
    computeDiseaseOverviewFingerprint(disease),
  );
  validateOverviewEntries(issues, disease, "key guideline", disease.overview.keyGuidelines);
  validateOverviewEntries(issues, disease, "landmark trial", disease.overview.landmarkTrials);

  const subcategoryIds = new Set<string>();
  disease.subcategories.forEach((subcategory) => {
    if (subcategoryIds.has(subcategory.id)) {
      addIssue(issues, "error", disease.name, diseaseScope, `Duplicate subcategory id "${subcategory.id}".`);
    }
    subcategoryIds.add(subcategory.id);
    validateSubcategory(issues, disease, subcategory, knownMonographIds, optionIds);
  });

  disease.drugMonographs.forEach((monograph) => {
    validateMonograph(issues, disease, monograph);
  });
}

export function buildContentValidationIssues(diseaseStates: DiseaseState[]) {
  const issues: ContentValidationIssue[] = [];
  const diseaseIds = new Set<string>();
  const knownMonographIds = new Set(
    diseaseStates.flatMap((disease) => disease.drugMonographs.map((monograph) => monograph.id)),
  );

  getSourceRegistryIssues().forEach((issue) => {
    addIssue(issues, "error", "Source Registry", issue.scope, issue.message);
  });

  diseaseStates.forEach((disease) => {
    if (diseaseIds.has(disease.id)) {
      addIssue(issues, "error", "Catalog", "catalog", `Duplicate disease id "${disease.id}".`);
    }
    diseaseIds.add(disease.id);

    validateDisease(issues, disease, knownMonographIds);
  });

  return issues;
}
