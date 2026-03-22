import type { PatientContext, Subcategory } from "../types";
import type { TransitionReadinessItem, TransitionReadinessStatus } from "./patientTransitionReadiness";

function hoursSince(value?: string) {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return (Date.now() - parsed.getTime()) / (1000 * 60 * 60);
}

function summarize(values: string[], limit = 3) {
  const unique = [...new Set(values.filter(Boolean))];
  const shown = unique.slice(0, limit);
  const remaining = unique.length - shown.length;
  return [...shown, remaining > 0 ? `+${remaining} more` : ""].filter(Boolean).join(" | ");
}

function buildDefaultCheckpoints(subcategory: Subcategory) {
  return [
    {
      window: "24h" as const,
      title: "24-hour diagnostic timeout",
      trigger: subcategory.diagnosticWorkup?.summary ?? "Confirm cultures, source clues, and whether the initial syndrome framing still fits.",
      actions: [
        ...(subcategory.rapidDiagnostics?.map((entry) => entry.action) ?? []),
        ...(subcategory.diagnosticWorkup?.bullets ?? []),
      ].slice(0, 4),
      sourceIds: [],
    },
    {
      window: "48h" as const,
      title: "48-hour de-escalation timeout",
      trigger: subcategory.deEscalation?.summary ?? "Use culture and clinical response to narrow or stop unnecessary empiric therapy.",
      actions: [
        ...(subcategory.deEscalation?.bullets ?? []),
        ...(subcategory.sourceControl?.bullets ?? []),
      ].slice(0, 4),
      sourceIds: [],
    },
    {
      window: "definitive" as const,
      title: "Definitive-therapy lock",
      trigger: subcategory.durationAnchor?.summary ?? "Lock the active definitive agent, transition path, and duration anchor.",
      actions: [
        ...(subcategory.durationAnchor?.bullets ?? []),
        ...(subcategory.ivToPoPlan?.bullets ?? []),
      ].slice(0, 4),
      sourceIds: [],
    },
  ];
}

function resolveCheckpointStatus(
  window: "24h" | "48h" | "definitive",
  patient: PatientContext,
): {
  status: TransitionReadinessStatus;
  summary: string;
  detail: string;
} {
  const cultureHours = hoursSince(patient.cultureCollectedOn);
  const finalCultureHours = hoursSince(patient.finalCultureOn);
  const sourceControlHours = hoursSince(patient.sourceControlOn ?? patient.operativeSourceControlOn);

  if (window === "24h") {
    if (patient.cultureStatus === "not_sent") {
      return {
        status: "not_ready",
        summary: "24-hour diagnostic timeout is off track",
        detail: "Cultures were not sent before or near treatment start, so the first-day stewardship checkpoint is incomplete.",
      };
    }

    if (cultureHours !== null && cultureHours < 24) {
      return {
        status: "caution",
        summary: "24-hour timeout is queued",
        detail: "The culture clock has started, but the 24-hour microbiology review window is still maturing.",
      };
    }

    if (patient.cultureStatus === "pending" || patient.cultureStatus === "final" || cultureHours !== null) {
      return {
        status: "ready",
        summary: "24-hour diagnostic timeout is due now",
        detail: "Recheck the initial syndrome framing, sent cultures, rapid diagnostics, and the first dose strategy before inertia sets in.",
      };
    }

    return {
      status: "needs_data",
      summary: "Need culture timing to score the 24-hour timeout",
      detail: "Add culture timing or current culture status to make the first reassessment checkpoint deterministic.",
    };
  }

  if (window === "48h") {
    if (patient.sourceControl === "pending") {
      return {
        status: "not_ready",
        summary: "48-hour de-escalation timeout is blocked by source control",
        detail: "Pending drainage, device management, or operative control is the main reason to stay broad at 48 hours.",
      };
    }

    if (patient.cultureStatus === "final") {
      return {
        status: "ready",
        summary: "48-hour de-escalation timeout is active",
        detail: "Cultures are final, so today should be a narrow/stop/document moment rather than a 'keep everything' day.",
      };
    }

    if ((cultureHours !== null && cultureHours >= 48) || patient.cultureStatus === "pending") {
      return {
        status: "caution",
        summary: "48-hour timeout is due, but key data are still incomplete",
        detail: "Use the current response, source-control progress, and interim microbiology to decide what can be safely stopped now.",
      };
    }

    return {
      status: "needs_data",
      summary: "Need source-control or culture progress to score the 48-hour timeout",
      detail: "Add source-control status and culture progress to make the second timeout deterministic.",
    };
  }

  if (patient.cultureStatus === "final" && (patient.sourceControl === "achieved" || patient.sourceControl === "not_applicable")) {
    return {
      status: "ready",
      summary: "Definitive therapy can be locked",
      detail: "The microbiology anchor and source-control state support a final agent, transition plan, and duration clock.",
    };
  }

  if (patient.rapidDiagnosticResult && patient.rapidDiagnosticResult !== "none") {
    return {
      status: "caution",
      summary: "Definitive therapy is partially informed but not fully locked",
      detail: "Rapid diagnostics can support early narrowing, but final source and susceptibility context still matter before you call the plan definitive.",
    };
  }

  if (finalCultureHours !== null || sourceControlHours !== null) {
    return {
      status: "caution",
      summary: "Definitive lock is approaching",
      detail: "A microbiology or source-control milestone is present, but the full definitive therapy anchor is not complete yet.",
    };
  }

  return {
    status: "needs_data",
    summary: "Need final microbiology to lock definitive therapy",
    detail: "Add final culture timing or source-control completion so the definitive-therapy checkpoint can fire deterministically.",
  };
}

export function getPathwayReassessmentItems(
  subcategory: Subcategory,
  patient: PatientContext,
): TransitionReadinessItem[] {
  const checkpoints = subcategory.reassessmentCheckpoints?.length
    ? subcategory.reassessmentCheckpoints
    : buildDefaultCheckpoints(subcategory);

  return checkpoints.map((checkpoint, index) => {
    const status = resolveCheckpointStatus(checkpoint.window, patient);
    return {
      id: `reassessment-${checkpoint.window}-${index}`,
      title: checkpoint.title,
      status: status.status,
      summary: status.summary,
      detail: `${checkpoint.trigger} ${status.detail}`.trim(),
      cues: checkpoint.actions.length > 0 ? checkpoint.actions : [summarize([checkpoint.trigger])],
    };
  });
}
