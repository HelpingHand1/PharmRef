import type { DrugMonograph, PatientContext } from "../types";
import { hasAnyPatientSignals } from "./regimenGuidance";
import { findMatchedInteractionActions } from "./patientMedicationInteractions";

export type TransitionReadinessStatus =
  | "ready"
  | "caution"
  | "not_ready"
  | "needs_data"
  | "not_applicable";

export interface TransitionReadinessItem {
  id: string;
  title: string;
  status: TransitionReadinessStatus;
  summary: string;
  detail: string;
  cues: string[];
}

const ORAL_ONLY_IDS = new Set([
  "amoxicillin",
  "fidaxomicin",
  "fosfomycin",
  "nitrofurantoin",
  "vancomycin-oral",
]);

const LOW_SERUM_FIT_IDS = new Set([
  "fidaxomicin",
  "fosfomycin",
  "nitrofurantoin",
  "vancomycin-oral",
]);

function includesAny(text: string, needles: string[]) {
  return needles.some((needle) => text.includes(needle));
}

function unique(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

function summarizeCues(values: string[], limit = 3) {
  const shown = unique(values).slice(0, limit);
  const remaining = unique(values).length - shown.length;
  return [...shown, remaining > 0 ? `+${remaining} more` : ""].filter(Boolean).join(" | ");
}

function buildStatusSummary(
  status: TransitionReadinessStatus,
  readyText: string,
  cautionText: string,
  notReadyText: string,
  needsDataText: string,
  naText: string,
) {
  switch (status) {
    case "ready":
      return readyText;
    case "caution":
      return cautionText;
    case "not_ready":
      return notReadyText;
    case "needs_data":
      return needsDataText;
    case "not_applicable":
    default:
      return naText;
  }
}

function isEnteralSensitive(monograph: DrugMonograph) {
  const text = (monograph.administration?.oralAbsorption ?? "").toLowerCase();
  return includesAny(text, [
    "enteral",
    "tube",
    "feed",
    "cation",
    "calcium",
    "magnesium",
    "iron",
    "zinc",
    "hold",
    "separate",
  ]);
}

function hasMajorInteractionMonitoring(monograph: DrugMonograph, patient: PatientContext) {
  return findMatchedInteractionActions(monograph.interactionActions, patient).some(
    (entry) => entry.action.severity === "major",
  );
}

export function getPathwayTransitionReadiness(patient: PatientContext) {
  const hasSignals = hasAnyPatientSignals(patient);

  if (!hasSignals) {
    return [
      {
        id: "pathway-iv-to-po",
        title: "IV-to-PO readiness",
        status: "needs_data",
        summary: "Need route, source-control, and culture data",
        detail: "Add oral-route reliability, source-control progress, and culture status to score whether step-down is reasonable yet.",
        cues: [],
      },
      {
        id: "pathway-opat",
        title: "OPAT / discharge readiness",
        status: "needs_data",
        summary: "Need logistics and source-control data",
        detail: "Add OPAT support, dialysis status, source control, and culture progress to score whether outpatient therapy is realistic.",
        cues: [],
      },
    ] satisfies TransitionReadinessItem[];
  }

  const ivSupports: string[] = [];
  const ivCautions: string[] = [];
  const ivBlockers: string[] = [];

  if (patient.oralRoute === "adequate") ivSupports.push("PO route is reliable");
  if (patient.oralRoute === "limited") ivCautions.push("PO route is only partly reliable");
  if (patient.oralRoute === "none") ivBlockers.push("No enteral route is available");
  if (patient.enteralFeeds) ivCautions.push("Feeds or cations may complicate oral absorption");
  if (patient.sourceControl === "achieved" || patient.sourceControl === "not_applicable") ivSupports.push("Source control is handled");
  if (patient.sourceControl === "pending") ivCautions.push("Source control is still pending");
  if (patient.cultureStatus === "final") ivSupports.push("Cultures are final");
  if (patient.cultureStatus === "pending") ivCautions.push("Cultures are still pending");
  if (patient.cultureStatus === "not_sent") ivCautions.push("No culture anchor was sent");
  if (patient.bacteremiaConcern) ivCautions.push("Bacteremia concern keeps step-down conservative");
  if (patient.endovascularConcern) ivBlockers.push("Endovascular concern argues against oral step-down");

  const ivStatus: TransitionReadinessStatus =
    ivBlockers.length > 0
      ? "not_ready"
      : ivCautions.length > 0
        ? "caution"
        : ivSupports.length > 0
          ? "ready"
          : "needs_data";

  const opatSupports: string[] = [];
  const opatCautions: string[] = [];
  const opatBlockers: string[] = [];

  if (patient.dialysis === "CRRT") opatBlockers.push("CRRT still needs inpatient-level monitoring");
  if (patient.opatSupport === "adequate") opatSupports.push("Home infusion logistics are in place");
  if (patient.opatSupport === "uncertain") opatCautions.push("Home infusion logistics still need confirmation");
  if (patient.opatSupport === "limited") opatBlockers.push("Home infusion support is limited");
  if (patient.sourceControl === "achieved" || patient.sourceControl === "not_applicable") opatSupports.push("Source control does not block discharge");
  if (patient.sourceControl === "pending") opatBlockers.push("Pending source control is still a discharge blocker");
  if (patient.cultureStatus === "final") opatSupports.push("Culture data are final");
  if (patient.cultureStatus === "pending") opatCautions.push("Culture data are still pending");
  if (patient.cultureStatus === "not_sent") opatCautions.push("Definitive microbiology anchor is missing");
  if (patient.bacteremiaConcern) opatCautions.push("Bacteremia concern needs a clear follow-up plan");
  if (patient.endovascularConcern) opatBlockers.push("Endovascular concern is not ready for discharge planning");
  if (patient.activeMedications?.length) opatCautions.push("Medication complexity may increase outpatient monitoring burden");

  const opatStatus: TransitionReadinessStatus =
    opatBlockers.length > 0
      ? "not_ready"
      : opatCautions.length > 0
        ? "caution"
        : opatSupports.length > 0
          ? "ready"
          : "needs_data";

  return [
    {
      id: "pathway-iv-to-po",
      title: "IV-to-PO readiness",
      status: ivStatus,
      summary: buildStatusSummary(
        ivStatus,
        "Step-down looks operationally reasonable",
        "Step-down may be possible, but key checks remain",
        "Not ready for oral transition yet",
        "Need more bedside data",
        "IV-to-PO assessment not applicable",
      ),
      detail:
        ivStatus === "ready"
          ? "The current bedside signals support reviewing oral options and matching them to syndrome, microbiology, and penetration needs."
          : ivStatus === "caution"
            ? "Oral step-down may still be possible, but resolve the listed cautions before locking a discharge plan."
            : ivStatus === "not_ready"
              ? "Keep therapy IV until the main blockers are addressed."
              : "Add route reliability, source control, and culture progress to score oral transition readiness.",
      cues: ivStatus === "ready" ? ivSupports : ivStatus === "caution" ? ivCautions : ivBlockers,
    },
    {
      id: "pathway-opat",
      title: "OPAT / discharge readiness",
      status: opatStatus,
      summary: buildStatusSummary(
        opatStatus,
        "Outpatient therapy planning looks feasible",
        "Discharge may work, but follow-up burden is still meaningful",
        "Not ready for OPAT or discharge planning yet",
        "Need more logistics and microbiology data",
        "OPAT assessment not applicable",
      ),
      detail:
        opatStatus === "ready"
          ? "The current bedside signals support lining up lab follow-up, access plans, and a final stop date."
          : opatStatus === "caution"
            ? "Outpatient treatment may still work, but unresolved monitoring or microbiology issues should be closed before discharge."
            : opatStatus === "not_ready"
              ? "Address the listed discharge blockers before moving this course into OPAT."
              : "Add OPAT support, culture progress, and source-control status to score discharge readiness.",
      cues: opatStatus === "ready" ? opatSupports : opatStatus === "caution" ? opatCautions : opatBlockers,
    },
  ] satisfies TransitionReadinessItem[];
}

export function getMonographTransitionReadiness(
  monograph: DrugMonograph,
  patient: PatientContext,
) {
  const hasSignals = hasAnyPatientSignals(patient);
  const oralOnly = ORAL_ONLY_IDS.has(monograph.id);
  const lowSerumFit = LOW_SERUM_FIT_IDS.has(monograph.id);
  const enteralSensitive = isEnteralSensitive(monograph);
  const matchedMajorInteraction = hasMajorInteractionMonitoring(monograph, patient);

  const ivToPo: TransitionReadinessItem = !monograph.ivToPoSwitch
    ? {
        id: "monograph-iv-to-po",
        title: "IV-to-PO readiness",
        status: "not_applicable",
        summary: "No structured IV-to-PO pathway on this monograph",
        detail: "This drug does not currently expose a dedicated structured IV-to-PO block.",
        cues: [],
      }
    : !hasSignals
      ? {
          id: "monograph-iv-to-po",
          title: "IV-to-PO readiness",
          status: "needs_data",
          summary: "Need route and stewardship context",
          detail: "Add oral-route reliability, source-control status, and culture progress to score whether this drug is ready for oral continuation.",
          cues: [],
        }
      : (() => {
          const supports: string[] = [];
          const cautions: string[] = [];
          const blockers: string[] = [];

          if (patient.oralRoute === "adequate") supports.push("PO route is reliable");
          if (patient.oralRoute === "limited") cautions.push("PO route is only partly reliable");
          if (patient.oralRoute === "none") blockers.push("No enteral route is available");
          if (patient.enteralFeeds && enteralSensitive) cautions.push("Feeds or cations can compromise oral exposure");
          if (patient.sourceControl === "achieved" || patient.sourceControl === "not_applicable") supports.push("Source control is handled");
          if (patient.sourceControl === "pending") cautions.push("Source control is still pending");
          if (patient.cultureStatus === "final") supports.push("Cultures are final");
          if (patient.cultureStatus === "pending") cautions.push("Cultures are still pending");
          if (patient.cultureStatus === "not_sent") cautions.push("No culture anchor was sent");
          if (patient.endovascularConcern) blockers.push("Endovascular concern argues against step-down");
          if (patient.bacteremiaConcern && (oralOnly || lowSerumFit)) blockers.push("This drug is a poor fit while bacteremia is still a real concern");
          if (patient.bacteremiaConcern && !blockers.length) cautions.push("Bacteremia concern makes oral transition more conservative");
          if (matchedMajorInteraction) cautions.push("Matched interaction burden may complicate outpatient oral monitoring");

          const status: TransitionReadinessStatus =
            blockers.length > 0
              ? "not_ready"
              : cautions.length > 0
                ? "caution"
                : supports.length > 0
                  ? "ready"
                  : "needs_data";

          return {
            id: "monograph-iv-to-po",
            title: "IV-to-PO readiness",
            status,
            summary: buildStatusSummary(
              status,
              "This monograph looks operationally ready for oral continuation",
              "This monograph may work for step-down, but key checks remain",
              "This monograph is not ready for oral continuation yet",
              "Need more bedside data to score oral readiness",
              "IV-to-PO assessment not applicable",
            ),
            detail:
              status === "ready"
                ? `${monograph.ivToPoSwitch.switchCriteria} ${monograph.ivToPoSwitch.note ?? ""}`.trim()
                : status === "caution"
                  ? `${summarizeCues(cautions)}. ${monograph.ivToPoSwitch.switchCriteria}`.trim()
                  : status === "not_ready"
                    ? `${summarizeCues(blockers)}. Keep therapy IV until the main blockers are addressed.`.trim()
                    : "Add oral-route reliability, source-control status, and culture progress to score this IV-to-PO pathway.",
            cues: status === "ready" ? supports : status === "caution" ? cautions : blockers,
          } satisfies TransitionReadinessItem;
        })();

  const opat: TransitionReadinessItem = !monograph.opatEligibility
    ? {
        id: "monograph-opat",
        title: "OPAT readiness",
        status: "not_applicable",
        summary: "No structured OPAT pathway on this monograph",
        detail: "This drug does not currently expose a dedicated structured OPAT block.",
        cues: [],
      }
    : !hasSignals
      ? {
          id: "monograph-opat",
          title: "OPAT readiness",
          status: "needs_data",
          summary: "Need OPAT logistics and source-control context",
          detail: "Add OPAT support, culture progress, dialysis status, and source-control status to score whether this drug is ready for outpatient therapy.",
          cues: [],
        }
      : (() => {
          const supports: string[] = [];
          const cautions: string[] = [];
          const blockers: string[] = [];

          if (patient.dialysis === "CRRT") blockers.push("CRRT still needs inpatient-level monitoring");
          if (monograph.opatEligibility.eligible === "no") blockers.push("This drug is not recommended for OPAT");
          if (monograph.opatEligibility.eligible === "conditional") cautions.push("This drug is only conditionally OPAT-friendly");
          if (monograph.opatEligibility.eligible === "yes") supports.push("Structured OPAT pathway is available");
          if (patient.opatSupport === "adequate") supports.push("Home infusion logistics are in place");
          if (patient.opatSupport === "uncertain") cautions.push("Home infusion logistics still need confirmation");
          if (patient.opatSupport === "limited") blockers.push("Home infusion support is limited");
          if (patient.sourceControl === "achieved" || patient.sourceControl === "not_applicable") supports.push("Source control does not block discharge");
          if (patient.sourceControl === "pending") blockers.push("Pending source control still blocks discharge");
          if (patient.cultureStatus === "final") supports.push("Culture data are final");
          if (patient.cultureStatus === "pending") cautions.push("Culture data are still pending");
          if (patient.cultureStatus === "not_sent") cautions.push("Definitive microbiology anchor is missing");
          if (patient.bacteremiaConcern && patient.cultureStatus !== "final") cautions.push("Bacteremia concern still needs a clear follow-up plan");
          if (patient.endovascularConcern) blockers.push("Endovascular concern is not ready for outpatient treatment planning");
          if (matchedMajorInteraction) cautions.push("Matched interactions increase outpatient lab or toxicity monitoring burden");

          const status: TransitionReadinessStatus =
            blockers.length > 0
              ? "not_ready"
              : cautions.length > 0
                ? "caution"
                : supports.length > 0
                  ? "ready"
                  : "needs_data";

          return {
            id: "monograph-opat",
            title: "OPAT readiness",
            status,
            summary: buildStatusSummary(
              status,
              "This monograph looks operationally ready for OPAT",
              "This monograph may work in OPAT, but the plan still needs tightening",
              "This monograph is not ready for OPAT yet",
              "Need more logistics and microbiology data",
              "OPAT assessment not applicable",
            ),
            detail:
              status === "ready"
                ? `${monograph.opatEligibility.administration} ${monograph.opatEligibility.monitoring}`.trim()
                : status === "caution"
                  ? `${summarizeCues(cautions)}. ${monograph.opatEligibility.monitoring}`.trim()
                  : status === "not_ready"
                    ? `${summarizeCues(blockers)}. Keep this plan inpatient or revise the discharge strategy.`.trim()
                    : "Add OPAT support, source-control status, and microbiology progress to score outpatient readiness.",
            cues: status === "ready" ? supports : status === "caution" ? cautions : blockers,
          } satisfies TransitionReadinessItem;
        })();

  return [ivToPo, opat];
}
