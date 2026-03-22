import type {
  ContentMeta,
  DiseaseState,
  DrugMonograph,
  OverviewEvidenceEntry,
  PathogenReference,
  Subcategory,
} from "../types";
import { CONTENT_STALE_AFTER_DAYS } from "../version";
import { PATHOGEN_REFERENCES } from "./pathogen-references";
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
import {
  PRIORITY_MICROBIOLOGY_MONOGRAPH_IDS,
  PRIORITY_MICROBIOLOGY_SUBCATEGORY_KEYS,
} from "./microbiology";
import {
  PRIORITY_EXECUTION_MONOGRAPH_IDS,
  PRIORITY_REGIMEN_PLAN_OPTION_KEYS,
  PRIORITY_STRUCTURED_MONOGRAPH_IDS,
  PRIORITY_WORKFLOW_DISEASE_IDS,
  WORKFLOW_FIELD_CONFIG,
  flattenWorkflowBlock,
  getPriorityRegimenPlanKey,
  getWorkflowBlock,
  hasWorkflowBlockContent,
} from "./stewardship";

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
const VALID_COVERAGE_STATUSES = new Set(["preferred", "active", "conditional", "inactive", "avoid"]);

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

function validateStructuredSourceIds(
  issues: ContentValidationIssue[],
  disease: string,
  scope: string,
  sourceIds: string[] | undefined,
) {
  if (!sourceIds?.length) {
    addIssue(issues, "error", disease, scope, "Missing explicit structured source ids.");
    return;
  }

  sourceIds.forEach((sourceId) => {
    if (!sourceId.trim()) {
      addIssue(issues, "error", disease, scope, "Structured source id is blank.");
      return;
    }
    if (!resolveSourceEntry(sourceId)) {
      addIssue(issues, "error", disease, scope, `Unknown source id "${sourceId}".`);
    }
  });
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

  meta.whatChanged?.forEach((item, index) => {
    if (!item?.trim()) {
      addIssue(issues, "warn", disease, `${scope} whatChanged #${index + 1}`, "Empty whatChanged entry.");
    }
  });

  meta.sectionConfidence?.forEach((entry, index) => {
    if (!entry.section?.trim() || !entry.rationale?.trim()) {
      addIssue(issues, "warn", disease, `${scope} sectionConfidence #${index + 1}`, "Section confidence entry is incomplete.");
    }
    if (!["high", "moderate", "emerging"].includes(entry.confidence)) {
      addIssue(issues, "warn", disease, `${scope} sectionConfidence #${index + 1}`, `Invalid section confidence "${String(entry.confidence)}".`);
    }
  });

  meta.guidelineDisagreements?.forEach((entry, index) => {
    if (!entry.topic?.trim() || !entry.guidanceA?.trim() || !entry.guidanceB?.trim() || !entry.pharmacistTakeaway?.trim()) {
      addIssue(issues, "warn", disease, `${scope} guidelineDisagreements #${index + 1}`, "Guideline disagreement entry is incomplete.");
    }
  });

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
      const regimenPlanKey = getPriorityRegimenPlanKey(disease.id, subcategory.id, tier.line, option);
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
      if (option.plan) {
        if (!option.plan.regimen?.trim()) {
          addIssue(issues, "warn", disease.name, optionScope, "Structured regimen plan is missing regimen text.");
        }
        if (!option.plan.rationale?.trim()) {
          addIssue(issues, "warn", disease.name, optionScope, "Structured regimen plan is missing rationale.");
        }
        option.plan.linkedMonographIds?.forEach((linkedMonographId) => {
          if (!knownMonographIds.has(linkedMonographId)) {
            addIssue(
              issues,
              "error",
              disease.name,
              optionScope,
              `Structured regimen plan links unknown monographId "${linkedMonographId}".`,
            );
          }
        });
      }
      if (PRIORITY_REGIMEN_PLAN_OPTION_KEYS.has(regimenPlanKey)) {
        if (!option.plan) {
          addIssue(issues, "error", disease.name, optionScope, "Priority empiric option is missing a structured regimen plan.");
        } else {
          if (!option.plan.rationale?.trim()) {
            addIssue(issues, "error", disease.name, optionScope, "Priority empiric option is missing regimen plan rationale.");
          }
          if (!option.plan.linkedMonographIds?.length) {
            addIssue(issues, "error", disease.name, optionScope, "Priority empiric option is missing linked monograph ids.");
          }
        }
      }
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

  if (subcategory.diagnosticStewardship && subcategory.diagnosticStewardship.length === 0) {
    addIssue(issues, "error", disease.name, `${subcategoryScope} diagnosticStewardship`, "Structured diagnostic stewardship block is empty.");
  }
  subcategory.diagnosticStewardship?.forEach((entry, index) => {
    const scope = `${subcategoryScope} diagnosticStewardship #${index + 1}`;
    if (!entry.title?.trim() || !entry.detail?.trim()) {
      addIssue(issues, "error", disease.name, scope, "Diagnostic stewardship entry is incomplete.");
    }
    validateStructuredSourceIds(issues, disease.name, scope, entry.sourceIds);
  });

  if (subcategory.reassessmentCheckpoints && subcategory.reassessmentCheckpoints.length === 0) {
    addIssue(issues, "error", disease.name, `${subcategoryScope} reassessmentCheckpoints`, "Structured reassessment checkpoint block is empty.");
  }
  subcategory.reassessmentCheckpoints?.forEach((entry, index) => {
    const scope = `${subcategoryScope} reassessmentCheckpoints #${index + 1}`;
    if (!entry.window || !entry.title?.trim() || !entry.trigger?.trim() || entry.actions.length === 0) {
      addIssue(issues, "error", disease.name, scope, "Reassessment checkpoint entry is incomplete.");
    }
    validateStructuredSourceIds(issues, disease.name, scope, entry.sourceIds);
  });

  if (subcategory.contaminationPitfalls && subcategory.contaminationPitfalls.length === 0) {
    addIssue(issues, "error", disease.name, `${subcategoryScope} contaminationPitfalls`, "Structured contamination pitfalls block is empty.");
  }
  subcategory.contaminationPitfalls?.forEach((entry, index) => {
    const scope = `${subcategoryScope} contaminationPitfalls #${index + 1}`;
    if (!entry.scenario?.trim() || !entry.implication?.trim() || !entry.action?.trim()) {
      addIssue(issues, "error", disease.name, scope, "Contamination pitfall entry is incomplete.");
    }
    validateStructuredSourceIds(issues, disease.name, scope, entry.sourceIds);
  });

  if (subcategory.durationAnchors && subcategory.durationAnchors.length === 0) {
    addIssue(issues, "error", disease.name, `${subcategoryScope} durationAnchors`, "Structured duration anchors block is empty.");
  }
  subcategory.durationAnchors?.forEach((entry, index) => {
    const scope = `${subcategoryScope} durationAnchors #${index + 1}`;
    if (!entry.event?.trim() || !entry.anchor?.trim()) {
      addIssue(issues, "error", disease.name, scope, "Duration anchor entry is incomplete.");
    }
    validateStructuredSourceIds(issues, disease.name, scope, entry.sourceIds);
  });

  subcategory.rapidDiagnostics?.forEach((entry, index) => {
    if (!entry.trigger?.trim() || !entry.action?.trim()) {
      addIssue(issues, "warn", disease.name, `${subcategoryScope} rapidDiagnostics #${index + 1}`, "Rapid diagnostic entry is incomplete.");
    }
  });

  subcategory.breakpointNotes?.forEach((entry, index) => {
    if (!entry.marker?.trim() || !entry.interpretation?.trim()) {
      addIssue(issues, "warn", disease.name, `${subcategoryScope} breakpointNotes #${index + 1}`, "Breakpoint note is incomplete.");
    }
  });

  subcategory.intrinsicResistance?.forEach((entry, index) => {
    if (!entry.organism?.trim() || !entry.resistance?.trim() || !entry.implication?.trim()) {
      addIssue(issues, "warn", disease.name, `${subcategoryScope} intrinsicResistance #${index + 1}`, "Intrinsic resistance alert is incomplete.");
    }
  });

  subcategory.coverageMatrix?.forEach((entry, index) => {
    if (!entry.label?.trim() || !entry.detail?.trim()) {
      addIssue(issues, "warn", disease.name, `${subcategoryScope} coverageMatrix #${index + 1}`, "Coverage matrix entry is incomplete.");
    }
    if (!VALID_COVERAGE_STATUSES.has(entry.status)) {
      addIssue(issues, "warn", disease.name, `${subcategoryScope} coverageMatrix #${index + 1}`, `Invalid coverage status "${String(entry.status)}".`);
    }
  });

  if (PRIORITY_WORKFLOW_DISEASE_IDS.has(disease.id)) {
    WORKFLOW_FIELD_CONFIG.forEach((fieldConfig) => {
      const block = getWorkflowBlock(subcategory, fieldConfig.key);
      if (!hasWorkflowBlockContent(block)) {
        addIssue(
          issues,
          "error",
          disease.name,
          `${subcategoryScope} workflow.${fieldConfig.key}`,
          "Priority pathway is missing a standardized stewardship workflow block.",
        );
        return;
      }

      if (block?.status !== "not_applicable" && flattenWorkflowBlock(block).length === 0) {
        addIssue(
          issues,
          "warn",
          disease.name,
          `${subcategoryScope} workflow.${fieldConfig.key}`,
          "Workflow block has no summary or bullets.",
        );
      }
    });
  }

  const microbiologyKey = `${disease.id}/${subcategory.id}`;
  if (PRIORITY_MICROBIOLOGY_SUBCATEGORY_KEYS.has(microbiologyKey)) {
    if (!subcategory.rapidDiagnostics?.length) {
      addIssue(issues, "error", disease.name, subcategoryScope, "Priority microbiology pathway is missing rapid diagnostic actions.");
    }
    if (!subcategory.breakpointNotes?.length) {
      addIssue(issues, "error", disease.name, subcategoryScope, "Priority microbiology pathway is missing breakpoint/MIC notes.");
    }
    if (!subcategory.intrinsicResistance?.length) {
      addIssue(issues, "error", disease.name, subcategoryScope, "Priority microbiology pathway is missing intrinsic resistance alerts.");
    }
    if (!subcategory.coverageMatrix?.length) {
      addIssue(issues, "error", disease.name, subcategoryScope, "Priority microbiology pathway is missing coverage matrix rows.");
    }
  }

  if (!subcategory.pearls || subcategory.pearls.length === 0) {
    addIssue(issues, "info", disease.name, subcategoryScope, "No pearls listed.");
  }
}

function validateMonograph(
  issues: ContentValidationIssue[],
  disease: DiseaseState,
  monograph: DrugMonograph,
  primaryMonographOwnerById: Record<string, string>,
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

  if (monograph.dosingByIndication && monograph.dosingByIndication.length === 0) {
    addIssue(issues, "warn", disease.name, monographScope, "Structured dosingByIndication block is empty.");
  }
  monograph.dosingByIndication?.forEach((entry, index) => {
    if (!entry.label?.trim() || !entry.regimen?.trim()) {
      addIssue(issues, "warn", disease.name, `${monographScope} dosingByIndication #${index + 1}`, "Structured dosing entry is incomplete.");
    }
  });

  monograph.renalReplacement?.forEach((entry, index) => {
    if (!entry.guidance?.trim()) {
      addIssue(issues, "warn", disease.name, `${monographScope} renalReplacement #${index + 1}`, "Renal replacement entry is missing guidance.");
    }
  });

  monograph.specialPopulations?.forEach((entry, index) => {
    if (!entry.population?.trim() || !entry.guidance?.trim()) {
      addIssue(issues, "warn", disease.name, `${monographScope} specialPopulations #${index + 1}`, "Special population entry is incomplete.");
    }
  });

  if (monograph.therapeuticDrugMonitoring) {
    if (!monograph.therapeuticDrugMonitoring.target?.trim()) {
      addIssue(issues, "warn", disease.name, monographScope, "Therapeutic drug monitoring block is missing target guidance.");
    }
    if (!monograph.therapeuticDrugMonitoring.sampling?.trim()) {
      addIssue(issues, "warn", disease.name, monographScope, "Therapeutic drug monitoring block is missing sampling guidance.");
    }
    if (!monograph.therapeuticDrugMonitoring.adjustment?.trim()) {
      addIssue(issues, "warn", disease.name, monographScope, "Therapeutic drug monitoring block is missing adjustment guidance.");
    }
  }

  monograph.penetration?.forEach((entry, index) => {
    if (!entry.site?.trim() || !entry.detail?.trim()) {
      addIssue(issues, "warn", disease.name, `${monographScope} penetration #${index + 1}`, "Penetration entry is incomplete.");
    }
  });

  monograph.interactionActions?.forEach((entry, index) => {
    if (!entry.interactingAgent?.trim() || !entry.effect?.trim() || !entry.management?.trim()) {
      addIssue(issues, "warn", disease.name, `${monographScope} interactionActions #${index + 1}`, "Interaction action entry is incomplete.");
    }
  });

  monograph.stewardshipUseCases?.forEach((entry, index) => {
    if (!entry.scenario?.trim() || !entry.role?.trim()) {
      addIssue(issues, "warn", disease.name, `${monographScope} stewardshipUseCases #${index + 1}`, "Stewardship use case entry is incomplete.");
    }
  });

  if (monograph.monitoringActions && monograph.monitoringActions.length === 0) {
    addIssue(issues, "error", disease.name, `${monographScope} monitoringActions`, "Structured monitoring actions block is empty.");
  }
  monograph.monitoringActions?.forEach((entry, index) => {
    const scope = `${monographScope} monitoringActions #${index + 1}`;
    if (!entry.trigger?.trim() || !entry.action?.trim()) {
      addIssue(issues, "error", disease.name, scope, "Monitoring action entry is incomplete.");
    }
    validateStructuredSourceIds(issues, disease.name, scope, entry.sourceIds);
  });

  if (monograph.misuseTraps && monograph.misuseTraps.length === 0) {
    addIssue(issues, "error", disease.name, `${monographScope} misuseTraps`, "Structured misuse traps block is empty.");
  }
  monograph.misuseTraps?.forEach((entry, index) => {
    const scope = `${monographScope} misuseTraps #${index + 1}`;
    if (!entry.scenario?.trim() || !entry.risk?.trim() || !entry.saferApproach?.trim()) {
      addIssue(issues, "error", disease.name, scope, "Misuse trap entry is incomplete.");
    }
    validateStructuredSourceIds(issues, disease.name, scope, entry.sourceIds);
  });

  if (monograph.administrationConstraints && monograph.administrationConstraints.length === 0) {
    addIssue(issues, "error", disease.name, `${monographScope} administrationConstraints`, "Structured administration constraints block is empty.");
  }
  monograph.administrationConstraints?.forEach((entry, index) => {
    const scope = `${monographScope} administrationConstraints #${index + 1}`;
    if (!entry.title?.trim() || !entry.detail?.trim()) {
      addIssue(issues, "error", disease.name, scope, "Administration constraint entry is incomplete.");
    }
    validateStructuredSourceIds(issues, disease.name, scope, entry.sourceIds);
  });

  if (monograph.siteSpecificAvoidances && monograph.siteSpecificAvoidances.length === 0) {
    addIssue(issues, "error", disease.name, `${monographScope} siteSpecificAvoidances`, "Structured site-specific avoidances block is empty.");
  }
  monograph.siteSpecificAvoidances?.forEach((entry, index) => {
    const scope = `${monographScope} siteSpecificAvoidances #${index + 1}`;
    if (!entry.site?.trim() || !entry.reason?.trim()) {
      addIssue(issues, "error", disease.name, scope, "Site-specific avoidance entry is incomplete.");
    }
    validateStructuredSourceIds(issues, disease.name, scope, entry.sourceIds);
  });

  monograph.rapidDiagnostics?.forEach((entry, index) => {
    if (!entry.trigger?.trim() || !entry.action?.trim()) {
      addIssue(issues, "warn", disease.name, `${monographScope} rapidDiagnostics #${index + 1}`, "Rapid diagnostic entry is incomplete.");
    }
  });

  monograph.breakpointNotes?.forEach((entry, index) => {
    if (!entry.marker?.trim() || !entry.interpretation?.trim()) {
      addIssue(issues, "warn", disease.name, `${monographScope} breakpointNotes #${index + 1}`, "Breakpoint note is incomplete.");
    }
  });

  monograph.intrinsicResistance?.forEach((entry, index) => {
    if (!entry.organism?.trim() || !entry.resistance?.trim() || !entry.implication?.trim()) {
      addIssue(issues, "warn", disease.name, `${monographScope} intrinsicResistance #${index + 1}`, "Intrinsic resistance alert is incomplete.");
    }
  });

  monograph.coverageMatrix?.forEach((entry, index) => {
    if (!entry.label?.trim() || !entry.detail?.trim()) {
      addIssue(issues, "warn", disease.name, `${monographScope} coverageMatrix #${index + 1}`, "Coverage matrix entry is incomplete.");
    }
    if (!VALID_COVERAGE_STATUSES.has(entry.status)) {
      addIssue(issues, "warn", disease.name, `${monographScope} coverageMatrix #${index + 1}`, `Invalid coverage status "${String(entry.status)}".`);
    }
  });

  if (PRIORITY_STRUCTURED_MONOGRAPH_IDS.has(monograph.id) && primaryMonographOwnerById[monograph.id] === disease.id) {
    if (!monograph.dosingByIndication?.length) {
      addIssue(issues, "error", disease.name, monographScope, "Priority stewardship monograph is missing dosingByIndication.");
    }
    if (!monograph.renalReplacement?.length) {
      addIssue(issues, "error", disease.name, monographScope, "Priority stewardship monograph is missing renalReplacement guidance.");
    }
    if (!monograph.specialPopulations?.length) {
      addIssue(issues, "error", disease.name, monographScope, "Priority stewardship monograph is missing special population guidance.");
    }
    if (!monograph.therapeuticDrugMonitoring) {
      addIssue(issues, "error", disease.name, monographScope, "Priority stewardship monograph is missing therapeutic drug monitoring guidance.");
    }
    if (!monograph.administration) {
      addIssue(issues, "error", disease.name, monographScope, "Priority stewardship monograph is missing administration guidance.");
    }
    if (!monograph.penetration?.length) {
      addIssue(issues, "error", disease.name, monographScope, "Priority stewardship monograph is missing penetration guidance.");
    }
    if (!monograph.stewardshipUseCases?.length) {
      addIssue(issues, "error", disease.name, monographScope, "Priority stewardship monograph is missing stewardship use cases.");
    }
  }

  if (PRIORITY_EXECUTION_MONOGRAPH_IDS.has(monograph.id) && primaryMonographOwnerById[monograph.id] === disease.id) {
    if (!monograph.dosingByIndication?.length) {
      addIssue(issues, "error", disease.name, monographScope, "Priority execution monograph is missing dosingByIndication.");
    }
    if (!monograph.specialPopulations?.length) {
      addIssue(issues, "error", disease.name, monographScope, "Priority execution monograph is missing special population guidance.");
    }
    if (!monograph.ivToPoSwitch) {
      addIssue(issues, "error", disease.name, monographScope, "Priority execution monograph is missing IV-to-PO guidance.");
    }
    if (!monograph.opatEligibility) {
      addIssue(issues, "error", disease.name, monographScope, "Priority execution monograph is missing OPAT guidance.");
    }
  }

  if (PRIORITY_MICROBIOLOGY_MONOGRAPH_IDS.has(monograph.id) && primaryMonographOwnerById[monograph.id] === disease.id) {
    if (!monograph.rapidDiagnostics?.length) {
      addIssue(issues, "error", disease.name, monographScope, "Priority microbiology monograph is missing rapid diagnostic actions.");
    }
    if (!monograph.breakpointNotes?.length) {
      addIssue(issues, "error", disease.name, monographScope, "Priority microbiology monograph is missing breakpoint/MIC notes.");
    }
    if (!monograph.intrinsicResistance?.length) {
      addIssue(issues, "error", disease.name, monographScope, "Priority microbiology monograph is missing intrinsic resistance alerts.");
    }
    if (!monograph.coverageMatrix?.length) {
      addIssue(issues, "error", disease.name, monographScope, "Priority microbiology monograph is missing coverage matrix rows.");
    }
  }
}

function validatePathogenReference(
  issues: ContentValidationIssue[],
  pathogen: PathogenReference,
  diseaseStates: DiseaseState[],
  knownMonographIds: Set<string>,
) {
  const scope = `Pathogen ${pathogen.id}`;

  if (!pathogen.id?.trim() || !pathogen.name?.trim() || !pathogen.phenotype?.trim() || !pathogen.summary?.trim()) {
    addIssue(issues, "error", pathogen.name || pathogen.id, scope, "Pathogen reference is missing a required identity field.");
  }
  if (!pathogen.likelySyndromes.length) {
    addIssue(issues, "error", pathogen.name, scope, "Pathogen reference is missing likely syndromes.");
  }
  if (!pathogen.rapidDiagnosticInterpretation.length) {
    addIssue(issues, "error", pathogen.name, scope, "Pathogen reference is missing rapid diagnostic interpretation.");
  }
  if (!pathogen.resistanceMechanisms.length) {
    addIssue(issues, "error", pathogen.name, scope, "Pathogen reference is missing resistance mechanisms.");
  }
  if (!pathogen.breakpointCaveats.length) {
    addIssue(issues, "error", pathogen.name, scope, "Pathogen reference is missing breakpoint caveats.");
  }
  if (!pathogen.preferredTherapyBySite.length) {
    addIssue(issues, "error", pathogen.name, scope, "Pathogen reference is missing therapy-by-site recommendations.");
  }
  if (!pathogen.breakpointRules?.length) {
    addIssue(issues, "error", pathogen.name, scope, "Pathogen reference is missing structured breakpoint rules.");
  }

  pathogen.rapidDiagnosticInterpretation.forEach((entry, index) => {
    const entryScope = `${scope} rapidDiagnosticInterpretation #${index + 1}`;
    if (!entry.title?.trim() || !entry.detail?.trim()) {
      addIssue(issues, "error", pathogen.name, entryScope, "Rapid diagnostic interpretation entry is incomplete.");
    }
    validateStructuredSourceIds(issues, pathogen.name, entryScope, entry.sourceIds);
  });

  pathogen.contaminationPitfalls.forEach((entry, index) => {
    const entryScope = `${scope} contaminationPitfalls #${index + 1}`;
    if (!entry.scenario?.trim() || !entry.implication?.trim() || !entry.action?.trim()) {
      addIssue(issues, "error", pathogen.name, entryScope, "Contamination pitfall entry is incomplete.");
    }
    validateStructuredSourceIds(issues, pathogen.name, entryScope, entry.sourceIds);
  });

  pathogen.resistanceMechanisms.forEach((entry, index) => {
    const entryScope = `${scope} resistanceMechanisms #${index + 1}`;
    if (!entry.title?.trim() || !entry.detail?.trim()) {
      addIssue(issues, "error", pathogen.name, entryScope, "Resistance mechanism entry is incomplete.");
    }
    validateStructuredSourceIds(issues, pathogen.name, entryScope, entry.sourceIds);
  });

  pathogen.breakpointCaveats.forEach((entry, index) => {
    const entryScope = `${scope} breakpointCaveats #${index + 1}`;
    if (!entry.title?.trim() || !entry.detail?.trim()) {
      addIssue(issues, "error", pathogen.name, entryScope, "Breakpoint caveat entry is incomplete.");
    }
    validateStructuredSourceIds(issues, pathogen.name, entryScope, entry.sourceIds);
  });

  pathogen.preferredTherapyBySite.forEach((entry, index) => {
    const entryScope = `${scope} preferredTherapyBySite #${index + 1}`;
    if (!entry.site?.trim() || !entry.preferred?.trim() || !entry.rationale?.trim()) {
      addIssue(issues, "error", pathogen.name, entryScope, "Preferred-therapy entry is incomplete.");
    }
    entry.linkedMonographIds?.forEach((linkedMonographId) => {
      if (!knownMonographIds.has(linkedMonographId)) {
        addIssue(issues, "error", pathogen.name, entryScope, `Unknown linked monograph id "${linkedMonographId}".`);
      }
    });
    validateStructuredSourceIds(issues, pathogen.name, entryScope, entry.sourceIds);
  });

  pathogen.breakpointRules?.forEach((entry, index) => {
    const entryScope = `${scope} breakpointRules #${index + 1}`;
    if (!entry.title?.trim() || !entry.detail?.trim()) {
      addIssue(issues, "error", pathogen.name, entryScope, "Breakpoint rule entry is incomplete.");
    }
    entry.linkedMonographIds?.forEach((linkedMonographId) => {
      if (!knownMonographIds.has(linkedMonographId)) {
        addIssue(issues, "error", pathogen.name, entryScope, `Unknown linked monograph id "${linkedMonographId}".`);
      }
    });
    validateStructuredSourceIds(issues, pathogen.name, entryScope, entry.sourceIds);
  });

  pathogen.linkedMonographIds?.forEach((linkedMonographId) => {
    if (!knownMonographIds.has(linkedMonographId)) {
      addIssue(issues, "error", pathogen.name, scope, `Unknown linked monograph id "${linkedMonographId}".`);
    }
  });

  pathogen.relatedPathways?.forEach((pathway, index) => {
    const entryScope = `${scope} relatedPathways #${index + 1}`;
    const disease = diseaseStates.find((candidate) => candidate.id === pathway.diseaseId);
    if (!disease) {
      addIssue(issues, "error", pathogen.name, entryScope, `Unknown disease id "${pathway.diseaseId}".`);
      return;
    }
    if (pathway.subcategoryId && !disease.subcategories.some((subcategory) => subcategory.id === pathway.subcategoryId)) {
      addIssue(issues, "error", pathogen.name, entryScope, `Unknown subcategory id "${pathway.subcategoryId}" for disease "${pathway.diseaseId}".`);
    }
    if (!pathway.label?.trim()) {
      addIssue(issues, "error", pathogen.name, entryScope, "Related pathway is missing a label.");
    }
  });
}

function validateDisease(
  issues: ContentValidationIssue[],
  disease: DiseaseState,
  knownMonographIds: Set<string>,
  primaryMonographOwnerById: Record<string, string>,
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
    validateMonograph(issues, disease, monograph, primaryMonographOwnerById);
  });
}

export function buildContentValidationIssues(diseaseStates: DiseaseState[]) {
  const issues: ContentValidationIssue[] = [];
  const diseaseIds = new Set<string>();
  const knownMonographIds = new Set(
    diseaseStates.flatMap((disease) => disease.drugMonographs.map((monograph) => monograph.id)),
  );
  const primaryMonographOwnerById = diseaseStates.reduce<Record<string, string>>((lookup, disease) => {
    disease.drugMonographs.forEach((monograph) => {
      if (!lookup[monograph.id]) {
        lookup[monograph.id] = disease.id;
      }
    });
    return lookup;
  }, {});

  getSourceRegistryIssues().forEach((issue) => {
    addIssue(issues, "error", "Source Registry", issue.scope, issue.message);
  });

  diseaseStates.forEach((disease) => {
    if (diseaseIds.has(disease.id)) {
      addIssue(issues, "error", "Catalog", "catalog", `Duplicate disease id "${disease.id}".`);
    }
    diseaseIds.add(disease.id);

    validateDisease(issues, disease, knownMonographIds, primaryMonographOwnerById);
  });

  PATHOGEN_REFERENCES.forEach((pathogen) => {
    validatePathogenReference(issues, pathogen, diseaseStates, knownMonographIds);
  });

  return issues;
}
