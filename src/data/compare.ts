import type {
  ContentConfidence,
  InstitutionProfile,
  MonographLookupResult,
  PatientContext,
  RegimenReference,
  StructuredEntryStatus,
} from "../types";
import {
  getInstitutionDrugAntibiogram,
  getInstitutionDrugPolicy,
  INSTITUTION_PROFILE,
} from "./institution-profile";
import {
  getConfidenceBadge,
  getContentFreshness,
  getMonographContentKey,
  resolveContentMeta,
} from "./metadata";
import { getMonographPatientFit } from "../utils/patientFit";
import { findMatchedInteractionActions } from "../utils/patientMedicationInteractions";

type Tone = "fresh" | "info" | "warn" | "danger";

const DEFAULT_SUMMARY_LIMIT = 3;

function summarizeList(items: string[], limit = DEFAULT_SUMMARY_LIMIT) {
  const normalized = items.map((item) => item.trim()).filter(Boolean);
  const unique = [...new Set(normalized)];
  const shown = unique.slice(0, limit);
  const remaining = unique.length - shown.length;
  return [...shown, remaining > 0 ? `+${remaining} more` : ""].filter(Boolean).join(" | ");
}

function formatConfidenceTone(confidence: ContentConfidence): Tone {
  return getConfidenceBadge(confidence).tone;
}

function formatStatusTone(status: StructuredEntryStatus | undefined): Tone {
  return status === "not_applicable" ? "info" : "fresh";
}

function summarizeRapidDiagnostics(record: MonographLookupResult) {
  if (!record.monograph.rapidDiagnostics?.length) {
    return "No monograph-level rapid diagnostic actions authored.";
  }

  return summarizeList(
    record.monograph.rapidDiagnostics.map(
      (entry) => `${entry.trigger}: ${entry.action}`,
    ),
  );
}

function summarizeIvToPo(record: MonographLookupResult) {
  if (!record.monograph.ivToPoSwitch) {
    return "No structured IV-to-PO switch guidance authored.";
  }

  return summarizeList(
    [
      `Bioavailability: ${record.monograph.ivToPoSwitch.poBioavailability}`,
      `Switch when: ${record.monograph.ivToPoSwitch.switchCriteria}`,
      record.monograph.ivToPoSwitch.note ?? "",
    ],
    4,
  );
}

function summarizeOpat(record: MonographLookupResult) {
  if (!record.monograph.opatEligibility) {
    return "No structured OPAT guidance authored.";
  }

  return summarizeList(
    [
      `Eligibility: ${record.monograph.opatEligibility.eligible}`,
      `Administration: ${record.monograph.opatEligibility.administration}`,
      `Monitoring: ${record.monograph.opatEligibility.monitoring}`,
      ...(record.monograph.opatEligibility.considerations ?? []),
    ],
    4,
  );
}

function summarizeInteractionActions(record: MonographLookupResult, patient: PatientContext) {
  const matched = findMatchedInteractionActions(record.monograph.interactionActions, patient);
  if (matched.length) {
    return summarizeList(
      matched.map(
        (entry) => `${entry.label}: ${entry.action.management}`,
      ),
      4,
    );
  }

  if (!record.monograph.interactionActions?.length) {
    return "No structured interaction action plans authored.";
  }

  return summarizeList(
    record.monograph.interactionActions.map(
      (entry) => `${entry.interactingAgent}: ${entry.management}`,
    ),
  );
}

function summarizeRegimenFootprint(regimens: RegimenReference[]) {
  if (!regimens.length) {
    return "No structured regimen cross-references yet.";
  }

  const contexts = regimens.map((regimen) =>
    [
      `${regimen.diseaseName} \u203a ${regimen.subcategoryName}`,
      regimen.role ? `(${regimen.role})` : "",
      regimen.site ? `[${regimen.site}]` : "",
    ]
      .filter(Boolean)
      .join(" "),
  );

  return `${regimens.length} structured regimen reference${regimens.length === 1 ? "" : "s"} | ${summarizeList(contexts, 4)}`;
}

function summarizeInstitutionPolicy(record: MonographLookupResult, profile: InstitutionProfile | null) {
  const policy = getInstitutionDrugPolicy(record.monograph.id, profile);
  if (!policy) {
    return "No local drug policy configured.";
  }

  return summarizeList(
    [
      policy.restriction ? `Restriction: ${policy.restriction}` : "",
      policy.approval ? `Approval: ${policy.approval}` : "",
      ...(policy.preferredContexts ?? []).map((context) => `Preferred when: ${context}`),
      ...(policy.notes ?? []).map((note) => `Note: ${note}`),
    ],
    4,
  );
}

function summarizeInstitutionAntibiogram(record: MonographLookupResult, profile: InstitutionProfile | null) {
  const entries = getInstitutionDrugAntibiogram(record.monograph.id, profile);
  if (!entries.length) {
    return "No local antibiogram overlay for this monograph.";
  }

  return summarizeList(
    entries.map((entry) =>
      [
        `${entry.organism}: ${entry.susceptibility}`,
        entry.sample ? `(${entry.sample})` : "",
        entry.note ? `- ${entry.note}` : "",
      ]
        .filter(Boolean)
        .join(" "),
    ),
  );
}

function summarizeTrust(record: MonographLookupResult) {
  const resolvedMeta = resolveContentMeta(record.monograph, record.disease, {
    contentKey: getMonographContentKey(record.disease.id, record.monograph.id),
  });

  if (!resolvedMeta.meta) {
    return {
      summary: "No explicit review metadata attached.",
      confidenceBadge: null,
      confidenceTone: null,
      freshnessBadge: null,
      freshnessTone: null,
    };
  }

  const confidence = getConfidenceBadge(resolvedMeta.meta.confidence);
  const freshness = getContentFreshness(resolvedMeta.meta);
  const latestChange =
    resolvedMeta.meta.whatChanged?.[0] ??
    resolvedMeta.meta.reviewHistory[0]?.summary ??
    "";

  return {
    summary: summarizeList(
      [
        confidence.label,
        freshness.label,
        resolvedMeta.meta.guidelineVersion ?? "",
        latestChange ? `Latest: ${latestChange}` : "",
      ],
      4,
    ),
    confidenceBadge: confidence.shortLabel,
    confidenceTone: formatConfidenceTone(resolvedMeta.meta.confidence),
    freshnessBadge: freshness.shortLabel,
    freshnessTone: freshness.tone,
  };
}

export interface MonographCompareSnapshot {
  trustSummary: string;
  regimenFootprintSummary: string;
  patientFitSummary: string;
  rapidDiagnosticSummary: string;
  ivToPoSummary: string;
  opatSummary: string;
  interactionSummary: string;
  institutionPolicySummary: string;
  localAntibiogramSummary: string;
  patientFitBadge: string | null;
  patientFitTone: Tone | null;
  confidenceBadge: string | null;
  confidenceTone: Tone | null;
  freshnessBadge: string | null;
  freshnessTone: Tone | null;
  localBadge: string | null;
  localBadgeTone: Tone | null;
  regimenCount: number;
}

export function buildMonographCompareSnapshot(
  record: MonographLookupResult,
  regimenRefs: RegimenReference[],
  profile: InstitutionProfile | null = INSTITUTION_PROFILE,
  patient: PatientContext = {},
  crcl: number | null = null,
  ibw: number | null = null,
  adjbw: number | null = null,
): MonographCompareSnapshot {
  const trust = summarizeTrust(record);
  const patientFit = getMonographPatientFit(
    record.monograph,
    patient,
    crcl,
    ibw,
    adjbw,
  );
  const policy = getInstitutionDrugPolicy(record.monograph.id, profile);
  const localAntibiogram = getInstitutionDrugAntibiogram(record.monograph.id, profile);
  const localBadge =
    policy?.restriction
      ? "Restricted local use"
      : policy?.preferredContexts?.length
        ? "Local preferred contexts"
        : localAntibiogram.length
          ? "Local antibiogram"
          : null;

  return {
    trustSummary: trust.summary,
    regimenFootprintSummary: summarizeRegimenFootprint(regimenRefs),
    patientFitSummary: patientFit.detail,
    rapidDiagnosticSummary: summarizeRapidDiagnostics(record),
    ivToPoSummary: summarizeIvToPo(record),
    opatSummary: summarizeOpat(record),
    interactionSummary: summarizeInteractionActions(record, patient),
    institutionPolicySummary: summarizeInstitutionPolicy(record, profile),
    localAntibiogramSummary: summarizeInstitutionAntibiogram(record, profile),
    patientFitBadge:
      patientFit.status === "unavailable" ? null : `Patient fit: ${patientFit.label}`,
    patientFitTone:
      patientFit.status === "preferred"
        ? "fresh"
        : patientFit.status === "caution"
          ? "warn"
          : patientFit.status === "avoid"
            ? "danger"
            : patientFit.status === "needs_data"
              ? "info"
              : null,
    confidenceBadge: trust.confidenceBadge,
    confidenceTone: trust.confidenceTone,
    freshnessBadge: trust.freshnessBadge,
    freshnessTone: trust.freshnessTone,
    localBadge,
    localBadgeTone: policy?.restriction
      ? "warn"
      : localBadge
        ? formatStatusTone("ready")
        : null,
    regimenCount: regimenRefs.length,
  };
}
