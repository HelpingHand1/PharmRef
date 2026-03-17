import type { DrugMonograph, InteractionAction, PatientContext, RegimenPlan } from "../types";
import {
  getRegimenPatientWarnings,
  hasAnyPatientSignals,
  type RegimenPatientWarning,
} from "./regimenGuidance";
import {
  getMonographPatientGuidance,
  type MonographPatientGuidanceItem,
} from "./monographPatientGuidance";

export type PatientFitStatus =
  | "preferred"
  | "caution"
  | "avoid"
  | "needs_data"
  | "unavailable";

export interface PatientFitSummary {
  status: PatientFitStatus;
  label: string;
  detail: string;
  reasons: string[];
}

const POSITIVE_MONOGRAPH_INFO_TITLES = new Set([
  "Operational OPAT fit",
  "PO-first fit",
  "PO step-down candidate",
  "Source control achieved",
]);

function summarizeReasons(reasons: string[], limit = 2) {
  const unique = [...new Set(reasons.filter(Boolean))];
  const shown = unique.slice(0, limit);
  const remaining = unique.length - shown.length;
  return [...shown, remaining > 0 ? `+${remaining} more` : ""].filter(Boolean).join(" | ");
}

function buildUnavailableSummary(): PatientFitSummary {
  return {
    status: "unavailable",
    label: "Patient fit unavailable",
    detail: "Set patient context to score bedside fit for this option.",
    reasons: [],
  };
}

export function getPatientFitSortRank(summary: PatientFitSummary) {
  switch (summary.status) {
    case "preferred":
      return 0;
    case "caution":
      return 1;
    case "needs_data":
      return 2;
    case "avoid":
      return 3;
    case "unavailable":
    default:
      return 4;
  }
}

function classifyFromWarnings(
  warnings: RegimenPatientWarning[],
): PatientFitSummary {
  const critical = warnings.filter((warning) => warning.severity === "critical");
  const caution = warnings.filter((warning) => warning.severity === "warn");
  const info = warnings.filter((warning) => warning.severity === "info");

  if (critical.length > 0) {
    const reasons = critical.map((warning) => warning.title);
    return {
      status: "avoid",
      label: "Avoid",
      detail: summarizeReasons(reasons),
      reasons,
    };
  }

  if (caution.length > 0) {
    const reasons = caution.map((warning) => warning.title);
    return {
      status: "caution",
      label: "Caution",
      detail: summarizeReasons(reasons),
      reasons,
    };
  }

  if (info.length > 0) {
    const reasons = info.map((warning) => warning.title);
    return {
      status: "needs_data",
      label: "Needs data",
      detail: summarizeReasons(reasons),
      reasons,
    };
  }

  return {
    status: "preferred",
    label: "Preferred",
    detail: "No patient-specific regimen cautions fired.",
    reasons: [],
  };
}

function classifyMonographItems(
  items: MonographPatientGuidanceItem[],
): PatientFitSummary {
  const critical = items.filter((item) => item.severity === "critical");
  const caution = items.filter((item) => item.severity === "warn");
  const blockingInfo = items.filter(
    (item) =>
      item.severity === "info" &&
      !POSITIVE_MONOGRAPH_INFO_TITLES.has(item.title),
  );

  if (critical.length > 0) {
    const reasons = critical.map((item) => item.title);
    return {
      status: "avoid",
      label: "Avoid",
      detail: summarizeReasons(reasons),
      reasons,
    };
  }

  if (caution.length > 0) {
    const reasons = caution.map((item) => item.title);
    return {
      status: "caution",
      label: "Caution",
      detail: summarizeReasons(reasons),
      reasons,
    };
  }

  if (blockingInfo.length > 0) {
    const reasons = blockingInfo.map((item) => item.title);
    return {
      status: "needs_data",
      label: "Needs data",
      detail: summarizeReasons(reasons),
      reasons,
    };
  }

  const positiveInfo = items.filter((item) => item.severity === "info");
  return {
    status: "preferred",
    label: "Preferred",
    detail:
      positiveInfo.length > 0
        ? summarizeReasons(positiveInfo.map((item) => item.title))
        : "No patient-specific monograph cautions fired.",
    reasons: positiveInfo.map((item) => item.title),
  };
}

export function getRegimenPatientFit(
  regimen: string,
  drugId: string | undefined,
  patient: PatientContext,
  crcl: number | null,
  plan?: RegimenPlan | null,
  interactionActions?: InteractionAction[],
) {
  if (!hasAnyPatientSignals(patient)) {
    return buildUnavailableSummary();
  }

  return classifyFromWarnings(
    getRegimenPatientWarnings(regimen, drugId, patient, crcl, plan, interactionActions),
  );
}

export function getMonographPatientFit(
  monograph: DrugMonograph,
  patient: PatientContext,
  crcl: number | null,
  ibw: number | null,
  adjbw: number | null,
) {
  if (!hasAnyPatientSignals(patient)) {
    return buildUnavailableSummary();
  }

  return classifyMonographItems(
    getMonographPatientGuidance(monograph, patient, crcl, ibw, adjbw),
  );
}
