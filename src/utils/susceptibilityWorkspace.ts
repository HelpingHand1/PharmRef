import type {
  NormalizedCombinationObservation,
  NormalizedSusceptibilityObservation,
  PatientContext,
  PathogenBreakpointRule,
  PathogenReference,
  PathogenTherapyRecommendation,
  SusceptibilityWorkspaceExecutionNote,
  SusceptibilityWorkspaceFinding,
  SusceptibilityWorkspaceInput,
  SusceptibilityWorkspaceResult,
  WorkflowReadinessItem,
  WorkflowReadinessStatus,
} from "../types";
import {
  AZTREONAM_EXECUTION_ENHANCEMENTS,
  CEFTAZIDIME_AVIBACTAM_EXECUTION_ENHANCEMENTS,
} from "../data/execution-monograph-content";
import {
  normalizeCombinationObservation,
  normalizeSusceptibilityObservation,
} from "./normalizeSusceptibilityObservation";

const RENAL_REVIEW_MONOGRAPH_IDS = new Set([
  "amikacin",
  "aztreonam",
  "cefepime",
  "cefiderocol",
  "ceftazidime-avibactam",
  "ceftolozane-tazobactam",
  "ciprofloxacin",
  "colistin",
  "daptomycin",
  "ertapenem",
  "fluconazole",
  "gentamicin",
  "imipenem-cilastatin-relebactam",
  "levofloxacin",
  "meropenem",
  "meropenem-vaborbactam",
  "nitrofurantoin",
  "pip-tazo",
  "tmp-smx",
  "tobramycin",
  "vancomycin",
]);

const INFUSION_SENSITIVE_MONOGRAPH_IDS = new Set([
  "aztreonam",
  "cefepime",
  "cefiderocol",
  "ceftazidime-avibactam",
  "ceftolozane-tazobactam",
  "imipenem-cilastatin-relebactam",
  "meropenem",
  "meropenem-vaborbactam",
  "pip-tazo",
]);

function normalizeSite(value: string) {
  return value.trim().toLowerCase();
}

function siteMatches(candidate: string, selectedSite: string) {
  const left = normalizeSite(candidate);
  const right = normalizeSite(selectedSite);
  return left.includes(right) || right.includes(left);
}

function recommendationMatchesSite(
  recommendation: PathogenTherapyRecommendation,
  selectedSite: string,
) {
  if (!selectedSite.trim()) return true;
  return siteMatches(recommendation.site, selectedSite);
}

function ruleMatches(rule: PathogenBreakpointRule, input: SusceptibilityWorkspaceInput) {
  if (rule.site?.length && !rule.site.some((site) => siteMatches(site, input.site))) {
    return false;
  }

  if (rule.interpretation?.length && !rule.interpretation.includes(input.interpretation)) {
    return false;
  }

  if (rule.rapidDiagnostic?.length && !rule.rapidDiagnostic.includes(input.rapidDiagnostic ?? "none")) {
    return false;
  }

  return true;
}

function buildTherapyFinding(
  recommendation: PathogenTherapyRecommendation,
  input: SusceptibilityWorkspaceInput,
): SusceptibilityWorkspaceFinding {
  if (input.interpretation === "resistant") {
    return {
      outcome: "avoid",
      title: `${recommendation.site}: do not trust the listed preferred option yet`,
      detail: `The current interpretation is resistant. ${recommendation.rationale}`,
      linkedMonographIds: recommendation.linkedMonographIds,
      sourceIds: recommendation.sourceIds,
    };
  }

  if (input.interpretation === "intermediate" || input.interpretation === "sdd") {
    return {
      outcome: "caution",
      title: `${recommendation.site}: possible fit, but only with disciplined exposure`,
      detail: `${recommendation.preferred}. Use only if the site, dosing strategy, and breakpoint context truly support it.`,
      linkedMonographIds: recommendation.linkedMonographIds,
      sourceIds: recommendation.sourceIds,
    };
  }

  if (input.interpretation === "unknown") {
    return {
      outcome: "caution",
      title: `${recommendation.site}: phenotype fit, but AST is still incomplete`,
      detail: `${recommendation.preferred}. The phenotype points here, but final susceptibility and execution details still need to settle before this becomes a definitive plan.`,
      linkedMonographIds: recommendation.linkedMonographIds,
      sourceIds: recommendation.sourceIds,
    };
  }

  return {
    outcome: "reliable",
    title: `${recommendation.site}: likely reliable path`,
    detail: `${recommendation.preferred}. ${recommendation.rationale}`,
    linkedMonographIds: recommendation.linkedMonographIds,
    sourceIds: recommendation.sourceIds,
  };
}

function dedupeFindings(findings: SusceptibilityWorkspaceFinding[]) {
  const seen = new Set<string>();
  return findings.filter((finding) => {
    const key = `${finding.outcome}:${finding.title}:${finding.detail}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function dedupeStrings(values: (string | undefined)[]) {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value))));
}

function dedupeObservations(observations: (NormalizedSusceptibilityObservation | null | undefined)[]) {
  const seen = new Set<string>();
  return observations.filter((observation): observation is NormalizedSusceptibilityObservation => {
    if (!observation) {
      return false;
    }
    const key = [
      observation.normalizedAgentId ?? "",
      observation.agentLabel ?? "",
      observation.interpretation ?? "",
      observation.comparator ?? "",
      observation.value ?? "",
      observation.units ?? "",
      (observation.keywords ?? []).join("|"),
      observation.raw,
    ].join("::");
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function dedupeCombinationObservations(
  observations: (NormalizedCombinationObservation | null | undefined)[],
) {
  const seen = new Set<string>();
  return observations.filter((observation): observation is NormalizedCombinationObservation => {
    if (!observation) {
      return false;
    }
    const key = [
      observation.comboId,
      observation.interpretation ?? "",
      observation.testMethod ?? "",
      (observation.keywords ?? []).join("|"),
      observation.raw,
    ].join("::");
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function siteMatchesAny(selectedSite: string, candidates: string[]) {
  return candidates.some((candidate) => siteMatches(candidate, selectedSite));
}

function observationHasKeyword(
  observation: NormalizedSusceptibilityObservation | null | undefined,
  keyword: string,
) {
  return observation?.keywords?.includes(keyword) ?? false;
}

function collectLinkedMonographIds(recommendations: PathogenTherapyRecommendation[]) {
  return dedupeStrings(recommendations.flatMap((recommendation) => recommendation.linkedMonographIds ?? []));
}

function collectSourceIds(recommendations: PathogenTherapyRecommendation[]) {
  return dedupeStrings(recommendations.flatMap((recommendation) => recommendation.sourceIds ?? []));
}

function findCombinationObservation(
  combinationObservations: NormalizedCombinationObservation[],
  comboId: string,
) {
  return combinationObservations.find((observation) => observation.comboId === comboId) ?? null;
}

function hasDocumentedCombinationObservation(
  combinationObservations: NormalizedCombinationObservation[],
  comboId: string,
) {
  return Boolean(findCombinationObservation(combinationObservations, comboId));
}

function dedupeExecutionNotes(notes: SusceptibilityWorkspaceExecutionNote[]) {
  const seen = new Set<string>();
  return notes.filter((note) => {
    const key = `${note.title}:${note.detail}:${note.action ?? ""}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function summarizeWorkflowStatus(
  status: WorkflowReadinessStatus,
  readyText: string,
  cautionText: string,
  notReadyText: string,
  needsDataText: string,
  notApplicableText: string,
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
      return notApplicableText;
  }
}

function formatCombinationMethod(
  method: NormalizedCombinationObservation["testMethod"],
) {
  switch (method) {
    case "bde":
      return "Broth disk elution documented";
    case "local-combo":
      return "Local combo AST documented";
    case "reported-pair":
      return "Reported paired plan documented";
    case "not-stated":
      return "Combo support method not stated";
    default:
      return "Combo support method not stated";
  }
}

function hasComboWorkflowSignals(patient?: PatientContext) {
  return Boolean(
    patient &&
      (
        patient.cultureStatus ||
        patient.sourceControl ||
        patient.rapidDiagnosticResult ||
        patient.bacteremiaConcern ||
        patient.endovascularConcern ||
        patient.immunocompromised ||
        patient.neutropenic ||
        patient.transplant ||
        patient.icuLevelCare ||
        patient.vasopressors
      ),
  );
}

function isCazAviAztreonamStrategyUnderReview(
  pathogen: PathogenReference,
  combinationObservations: NormalizedCombinationObservation[],
  observations: NormalizedSusceptibilityObservation[],
) {
  if (pathogen.id !== "mbl-cre") {
    return false;
  }

  return Boolean(
    hasDocumentedCombinationObservation(combinationObservations, "caz-avi-aztreonam") ||
      observations.some((observation) =>
        ["ceftazidime-avibactam", "aztreonam"].includes(observation.normalizedAgentId ?? ""),
      ),
  );
}

function buildExecutionContextFindings(
  recommendations: PathogenTherapyRecommendation[],
  input: SusceptibilityWorkspaceInput,
): SusceptibilityWorkspaceFinding[] {
  if (input.interpretation === "resistant") {
    return [];
  }

  const linkedMonographIds = collectLinkedMonographIds(recommendations).filter((id) =>
    RENAL_REVIEW_MONOGRAPH_IDS.has(id),
  );
  if (!linkedMonographIds.length) {
    return [];
  }

  const sourceIds = collectSourceIds(recommendations);
  const infusionSensitive = linkedMonographIds.some((id) => INFUSION_SENSITIVE_MONOGRAPH_IDS.has(id));
  const dialysis = input.dialysis ?? "none";
  const findings: SusceptibilityWorkspaceFinding[] = [];

  if (dialysis !== "none") {
    findings.push({
      outcome: "caution",
      title:
        dialysis === "CRRT"
          ? "CRRT can change whether the preferred regimen is truly executable"
          : `${dialysis}: dialysis timing still needs to be locked`,
      detail: infusionSensitive
        ? `${dialysis} can materially change interval, infusion, or post-dialysis timing for the matched regimen. Do not treat a susceptible phenotype result as operationally reliable until dialysis-specific dosing is confirmed.`
        : `${dialysis} can materially change dose or timing for the matched regimen. Confirm dialysis-specific dosing before finalizing therapy.`,
      linkedMonographIds,
      sourceIds,
    });
    return findings;
  }

  if (input.crcl === null || input.crcl === undefined) {
    findings.push({
      outcome: "caution",
      title: "Renal function still needs to be defined",
      detail: "CrCl is not set. A susceptible phenotype result is not yet a fully executable plan until renal adjustment is confirmed.",
      linkedMonographIds,
      sourceIds,
    });
    return findings;
  }

  if (input.crcl < 50) {
    findings.push({
      outcome: "caution",
      title: "Reduced CrCl changes the execution plan",
      detail: `CrCl ${input.crcl} mL/min can change dose, interval, or infusion strategy for the matched regimen. Confirm renal adjustment before treating susceptibility as final reassurance.`,
      linkedMonographIds,
      sourceIds,
    });
  }

  if (linkedMonographIds.includes("nitrofurantoin") && input.crcl < 30) {
    findings.push({
      outcome: "avoid",
      title: "Nitrofurantoin loses fit below the usual renal cutoff",
      detail: `CrCl ${input.crcl} mL/min is below the usual threshold for nitrofurantoin reliability. Do not let a lower-tract susceptibility result overrule the renal execution problem.`,
      linkedMonographIds: ["nitrofurantoin"],
      sourceIds,
    });
  }

  if (input.crcl > 120 && infusionSensitive) {
    findings.push({
      outcome: "caution",
      title: "High renal clearance can erase the susceptible margin",
      detail: `CrCl ${input.crcl} mL/min raises the risk of underexposure for renally cleared beta-lactams. Confirm high-dose or prolonged-infusion execution before relying on this as a definitive plan.`,
      linkedMonographIds: linkedMonographIds.filter((id) => INFUSION_SENSITIVE_MONOGRAPH_IDS.has(id)),
      sourceIds,
    });
  }

  return findings;
}

function buildMicFindings(
  pathogen: PathogenReference,
  input: SusceptibilityWorkspaceInput,
  observations: NormalizedSusceptibilityObservation[],
): SusceptibilityWorkspaceFinding[] {
  if (!observations.length || input.interpretation === "resistant") {
    return [];
  }

  const findings: SusceptibilityWorkspaceFinding[] = [];
  const invasiveNonUrinarySite = siteMatchesAny(input.site, ["bloodstream", "systemic", "endovascular", "lung"]);
  const bloodstreamSite = siteMatchesAny(input.site, ["bloodstream", "endovascular", "systemic"]);
  const pulmonarySite = siteMatchesAny(input.site, ["lung", "pneumonia"]);

  observations.forEach((observation) => {
    const micValue = observation.value;
    const agentId = observation.normalizedAgentId;

    if (pathogen.id === "mrsa" && agentId === "vancomycin" && micValue !== undefined && micValue >= 2) {
      findings.push({
        outcome: bloodstreamSite ? "avoid" : "caution",
        title: "Vancomycin MIC 2 or higher is a clearance-risk signal",
        detail: pulmonarySite
          ? `Vancomycin MIC ${micValue} should trigger aggressive AUC review and an early linezolid-versus-vancomycin discussion for MRSA lung infection.`
          : `Vancomycin MIC ${micValue} increases failure concern for invasive MRSA infection. In bloodstream or endovascular disease, do not leave vancomycin on autopilot if clearance is lagging; reassess for daptomycin when the lung is not the target.`,
        linkedMonographIds: pulmonarySite ? ["vancomycin", "linezolid"] : ["vancomycin", "daptomycin"],
        sourceIds: ["ashp-idsa-pids-2020-vancomycin", "camera2"],
      });
    }

    if (
      pathogen.id === "esbl-enterobacterales" &&
      agentId === "pip-tazo" &&
      micValue !== undefined &&
      micValue <= 16 &&
      invasiveNonUrinarySite
    ) {
      findings.push({
        outcome: "avoid",
        title: "Piperacillin-tazobactam MIC does not rescue serious ESBL infection",
        detail: `Piperacillin-tazobactam MIC ${micValue} can still be false reassurance in serious ESBL bacteremia or other invasive non-urinary infection. Keep a carbapenem-centered definitive plan instead of trusting the printed susceptible result.`,
        linkedMonographIds: ["pip-tazo", "meropenem"],
        sourceIds: ["merino", "idsa-2024-amr"],
      });
    }

    if (
      pathogen.id === "dtr-pseudomonas" &&
      ["cefepime", "meropenem", "pip-tazo"].includes(agentId ?? "") &&
      (micValue !== undefined ? micValue >= 4 : observationHasKeyword(observation, "borderline"))
    ) {
      findings.push({
        outcome: "caution",
        title: "Borderline traditional beta-lactam MIC needs PK/PD discipline",
        detail: `${observation.agentLabel ?? "This agent"}${micValue !== undefined ? ` MIC ${micValue}` : ""} sits close enough to the exposure edge that short infusions or underdosing can erase the susceptible margin. If this traditional agent remains the plan, use high-dose prolonged infusion rather than treating the MIC as self-executing reassurance.`,
        linkedMonographIds: agentId ? [agentId] : ["cefepime", "meropenem", "pip-tazo"],
        sourceIds: ["idsa-2024-amr", "pkpd-stewardship"],
      });
    }

    if (
      pathogen.id === "kpc-cre" &&
      observationHasKeyword(observation, "restored") &&
      (agentId === "meropenem" || /\bmeropenem\b/i.test(observation.raw))
    ) {
      findings.push({
        outcome: "caution",
        title: "Restored meropenem needs mechanism-aware review, not autopilot",
        detail: `A note like "${observation.raw}" can reflect the KPC resistance see-saw. Confirm whether ceftazidime-avibactam resistance or KPC mutation testing changed the field before treating meropenem as routine monotherapy.`,
        linkedMonographIds: ["meropenem", "meropenem-vaborbactam", "ceftazidime-avibactam"],
        sourceIds: ["idsa-2024-amr", "kpc-observational-outcomes"],
      });
    }
  });

  if (pathogen.id === "kpc-cre") {
    const cazAviCompromised = observations.find(
      (observation) =>
        observation.normalizedAgentId === "ceftazidime-avibactam" &&
        ["resistant", "intermediate"].includes(observation.interpretation ?? ""),
    );
    const meropenemReappearing = observations.find(
      (observation) =>
        observation.normalizedAgentId === "meropenem" &&
        (
          observationHasKeyword(observation, "restored") ||
          observation.interpretation === "susceptible" ||
          (observation.value !== undefined && observation.value <= 2)
        ),
    );

    if (cazAviCompromised && meropenemReappearing) {
      findings.push({
        outcome: "caution",
        title: "Ceftazidime-avibactam resistance with restored meropenem needs phenotype re-check",
        detail: "This pattern can reflect a KPC resistance see-saw rather than a return to routine meropenem therapy. Reconfirm carbapenemase mechanism, testing method, and whether a KPC-active reserve strategy still fits better than plain meropenem monotherapy.",
        linkedMonographIds: ["ceftazidime-avibactam", "meropenem", "meropenem-vaborbactam"],
        sourceIds: ["idsa-2024-amr", "kpc-observational-outcomes"],
      });
    }
  }

  return findings;
}

function buildCombinationFindings(
  pathogen: PathogenReference,
  combinationObservations: NormalizedCombinationObservation[],
  observations: NormalizedSusceptibilityObservation[],
): SusceptibilityWorkspaceFinding[] {
  const findings: SusceptibilityWorkspaceFinding[] = [];

  if (pathogen.id !== "mbl-cre") {
    return findings;
  }

  const cazAviAztreonamCombo = findCombinationObservation(
    combinationObservations,
    "caz-avi-aztreonam",
  );
  const ceftazidimeAvibactamObservation = observations.find(
    (observation) => observation.normalizedAgentId === "ceftazidime-avibactam",
  );
  const aztreonamObservation = observations.find(
    (observation) => observation.normalizedAgentId === "aztreonam",
  );

  if (cazAviAztreonamCombo) {
    const methodLead =
      cazAviAztreonamCombo.testMethod === "bde"
        ? "Broth disk elution support is documented."
        : cazAviAztreonamCombo.testMethod === "local-combo"
          ? "Local combination testing support is documented."
          : cazAviAztreonamCombo.testMethod === "reported-pair"
            ? "An intentional paired-execution plan is documented."
            : "A dedicated combo interpretation is documented.";

    if (cazAviAztreonamCombo.interpretation === "resistant") {
      findings.push({
        outcome: "avoid",
        title: "Ceftazidime-avibactam + aztreonam combo support is unfavorable",
        detail: `${methodLead} Do not treat the pair as the definitive MBL strategy without a different active anchor such as cefiderocol or updated microbiology review.`,
        linkedMonographIds: ["ceftazidime-avibactam", "aztreonam", "cefiderocol"],
        sourceIds: ["idsa-2024-amr", "aztreonam-avibactam-evidence", "clsi-breakpoint-updates"],
      });
      return findings;
    }

    findings.push({
      outcome:
        cazAviAztreonamCombo.interpretation === "susceptible"
          ? "reliable"
          : "caution",
      title:
        cazAviAztreonamCombo.interpretation === "susceptible"
          ? "Ceftazidime-avibactam + aztreonam has explicit combo support"
          : "Ceftazidime-avibactam + aztreonam is documented, but still needs disciplined execution",
      detail:
        cazAviAztreonamCombo.interpretation === "susceptible"
          ? `${methodLead} This is the kind of synchronized combo support that makes the aztreonam strategy meaningfully interpretable for MBL-CRE.`
          : `${methodLead} Keep the pair synchronized in dosing, infusion timing, and handoff language rather than assuming separate single-agent calls prove the regimen end to end.`,
      linkedMonographIds: ["ceftazidime-avibactam", "aztreonam"],
      sourceIds: ["idsa-2024-amr", "aztreonam-avibactam-evidence", "clsi-breakpoint-updates"],
    });
    return findings;
  }

  if (ceftazidimeAvibactamObservation && aztreonamObservation) {
    findings.push({
      outcome: "caution",
      title: "Separate agent rows are not the same as combo support",
      detail: "Both ceftazidime-avibactam and aztreonam are present, but MBL reliability comes from synchronized combo testing or an explicit paired-execution plan, not from isolated single-agent calls alone.",
      linkedMonographIds: ["ceftazidime-avibactam", "aztreonam"],
      sourceIds: ["idsa-2024-amr", "aztreonam-avibactam-evidence", "clsi-breakpoint-updates"],
    });
  } else if (aztreonamObservation) {
    findings.push({
      outcome: "avoid",
      title: "Standalone aztreonam data is false reassurance in MBL-CRE",
      detail: "Aztreonam can still be inactivated by co-produced serine beta-lactamases unless avibactam protection is intentionally built into the plan.",
      linkedMonographIds: ["aztreonam", "ceftazidime-avibactam"],
      sourceIds: ["idsa-2024-amr", "aztreonam-avibactam-evidence"],
    });
  }

  return findings;
}

function shouldSuppressFindingForCombination(
  pathogen: PathogenReference,
  finding: SusceptibilityWorkspaceFinding,
  combinationObservations: NormalizedCombinationObservation[],
) {
  if (
    pathogen.id === "mbl-cre" &&
    hasDocumentedCombinationObservation(combinationObservations, "caz-avi-aztreonam") &&
    finding.title === "Rapid MBL signal should block avibactam monotherapy"
  ) {
    return true;
  }

  return false;
}

function buildCombinationExecutionNotes(
  pathogen: PathogenReference,
  input: SusceptibilityWorkspaceInput,
  combinationObservations: NormalizedCombinationObservation[],
): SusceptibilityWorkspaceExecutionNote[] {
  if (
    pathogen.id !== "mbl-cre" ||
    !hasDocumentedCombinationObservation(combinationObservations, "caz-avi-aztreonam")
  ) {
    return [];
  }

  const notes: SusceptibilityWorkspaceExecutionNote[] = [];
  const ceftazidimeConstraint =
    CEFTAZIDIME_AVIBACTAM_EXECUTION_ENHANCEMENTS.administrationConstraints?.find((entry) =>
      /paired aztreonam execution/i.test(entry.title),
    ) ?? null;
  const aztreonamConstraint =
    AZTREONAM_EXECUTION_ENHANCEMENTS.administrationConstraints?.find((entry) =>
      /coordinated intentionally/i.test(entry.title),
    ) ?? null;
  const ceftazidimeInteraction =
    CEFTAZIDIME_AVIBACTAM_EXECUTION_ENHANCEMENTS.interactionActions?.find((entry) =>
      /Aztreonam/i.test(entry.interactingAgent),
    ) ?? null;
  const ceftazidimeHdGuidance =
    CEFTAZIDIME_AVIBACTAM_EXECUTION_ENHANCEMENTS.renalReplacement?.find((entry) => entry.modality === "HD") ?? null;
  const ceftazidimeCrrtGuidance =
    CEFTAZIDIME_AVIBACTAM_EXECUTION_ENHANCEMENTS.renalReplacement?.find((entry) => entry.modality === "CRRT") ?? null;
  const aztreonamHdGuidance =
    AZTREONAM_EXECUTION_ENHANCEMENTS.renalReplacement?.find((entry) => entry.modality === "HD") ?? null;
  const aztreonamCrrtGuidance =
    AZTREONAM_EXECUTION_ENHANCEMENTS.renalReplacement?.find((entry) => entry.modality === "CRRT") ?? null;

  if (ceftazidimeConstraint) {
    notes.push({
      title: ceftazidimeConstraint.title,
      detail: ceftazidimeConstraint.detail,
      action: ceftazidimeConstraint.action,
      linkedMonographIds: ["ceftazidime-avibactam", "aztreonam"],
      sourceIds: ceftazidimeConstraint.sourceIds,
    });
  }

  if (aztreonamConstraint) {
    notes.push({
      title: aztreonamConstraint.title,
      detail: aztreonamConstraint.detail,
      action: aztreonamConstraint.action,
      linkedMonographIds: ["aztreonam", "ceftazidime-avibactam"],
      sourceIds: aztreonamConstraint.sourceIds,
    });
  }

  if (input.dialysis === "HD" && ceftazidimeHdGuidance && aztreonamHdGuidance) {
    notes.push({
      title: "Hemodialysis: renally adjust both agents on the same plan",
      detail: `${ceftazidimeHdGuidance.guidance} ${aztreonamHdGuidance.guidance}`,
      action: ceftazidimeInteraction?.management ?? "Do not let one agent shift to post-HD timing while the partner remains on an old schedule.",
      linkedMonographIds: ["ceftazidime-avibactam", "aztreonam"],
      sourceIds: ["idsa-2024-amr", "aztreonam-avibactam-evidence", "clsi-breakpoint-updates"],
    });
  } else if (input.dialysis === "CRRT" && ceftazidimeCrrtGuidance && aztreonamCrrtGuidance) {
    notes.push({
      title: "CRRT: keep the combo aligned to effluent and downtime",
      detail: `${ceftazidimeCrrtGuidance.guidance} ${aztreonamCrrtGuidance.guidance}`,
      action: "Re-check the pair whenever effluent rate changes or CRRT downtime occurs so the protected-aztreonam strategy does not silently underdose.",
      linkedMonographIds: ["ceftazidime-avibactam", "aztreonam"],
      sourceIds: ["idsa-2024-amr", "aztreonam-avibactam-evidence", "clsi-breakpoint-updates"],
    });
  } else if ((input.crcl ?? null) !== null && (input.crcl ?? 0) < 50) {
    notes.push({
      title: "Reduced CrCl: renally adjust the pair together",
      detail: ceftazidimeInteraction?.effect ?? "The combo only works when both agents keep their intended exposure at the same time.",
      action: ceftazidimeInteraction?.management ?? "Renally adjust both drugs together rather than making isolated changes to one component.",
      linkedMonographIds: ["ceftazidime-avibactam", "aztreonam"],
      sourceIds: ["idsa-2024-amr", "aztreonam-avibactam-evidence", "clsi-breakpoint-updates"],
    });
  }

  return dedupeExecutionNotes(notes);
}

function buildCombinationReadinessItems(
  pathogen: PathogenReference,
  input: SusceptibilityWorkspaceInput,
  combinationObservations: NormalizedCombinationObservation[],
  observations: NormalizedSusceptibilityObservation[],
): WorkflowReadinessItem[] {
  if (!isCazAviAztreonamStrategyUnderReview(pathogen, combinationObservations, observations)) {
    return [];
  }

  const items: WorkflowReadinessItem[] = [];
  const combinationObservation = findCombinationObservation(
    combinationObservations,
    "caz-avi-aztreonam",
  );
  const ceftazidimeObservation = observations.find(
    (observation) => observation.normalizedAgentId === "ceftazidime-avibactam",
  );
  const aztreonamObservation = observations.find(
    (observation) => observation.normalizedAgentId === "aztreonam",
  );
  const supportCues = dedupeStrings([
    combinationObservation ? formatCombinationMethod(combinationObservation.testMethod) : undefined,
    combinationObservation?.interpretation
      ? `Combo call: ${combinationObservation.interpretation}`
      : undefined,
    ceftazidimeObservation ? "Ceftazidime-avibactam row entered" : undefined,
    aztreonamObservation ? "Aztreonam row entered" : undefined,
  ]);

  let supportStatus: WorkflowReadinessStatus;
  let supportSummary: string;
  let supportDetail: string;

  if (combinationObservation?.interpretation === "resistant") {
    supportStatus = "not_ready";
    supportSummary = "Paired-regimen support is unfavorable";
    supportDetail =
      "The documented combo result does not support using ceftazidime-avibactam plus aztreonam as the definitive MBL strategy right now.";
  } else if (combinationObservation?.interpretation === "susceptible") {
    if (
      combinationObservation.testMethod === "bde" ||
      combinationObservation.testMethod === "local-combo"
    ) {
      supportStatus = "ready";
      supportSummary = "Paired-regimen support is explicitly documented";
      supportDetail =
        "The aztreonam strategy is backed by combo-specific support rather than inferred from separate single-agent rows.";
    } else {
      supportStatus = "caution";
      supportSummary = "Paired regimen is documented, but microbiology support is thinner";
      supportDetail =
        "A paired plan is on record, but the support method is not as strong as dedicated combo AST. Keep the stewardship note explicit and verify local lab interpretation.";
    }
  } else if (combinationObservation) {
    supportStatus = "caution";
    supportSummary = "Paired regimen is present, but not yet fully reassuring";
    supportDetail =
      "The pair is documented, but the combo call is not a clean susceptible result yet. Keep this on a tight microbiology review loop before treating it as definitive.";
  } else if (ceftazidimeObservation && aztreonamObservation) {
    supportStatus = "caution";
    supportSummary = "Single-agent rows do not yet lock the pair";
    supportDetail =
      "Both component agents are entered, but MBL reliability still depends on documented combo support or an intentional paired-execution plan.";
  } else {
    supportStatus = "needs_data";
    supportSummary = "Need explicit paired support to score the aztreonam strategy";
    supportDetail =
      "Only part of the pair is documented so far. Add the combo observation or the missing companion agent before calling the aztreonam strategy bedside-ready.";
  }

  items.push({
    id: "combo-support",
    title: "Paired-regimen support",
    status: supportStatus,
    summary: supportSummary,
    detail: supportDetail,
    cues: supportCues,
  });

  const viablePair = supportStatus !== "not_ready";
  if (!viablePair) {
    items.push({
      id: "combo-execution",
      title: "Renal / dialysis execution lock",
      status: "not_applicable",
      summary: "No viable pair to operationalize yet",
      detail: "Execution timing is not the active bottleneck until the paired-regimen support problem is resolved.",
      cues: [],
    });
    items.push({
      id: "combo-handoff",
      title: "Definitive handoff",
      status: "not_applicable",
      summary: "Do not hand this pair off as definitive therapy",
      detail: "Close the microbiology support gap or choose a different active anchor before turning this into the signed plan.",
      cues: [],
    });
    return items;
  }

  const renalCues = dedupeStrings([
    input.dialysis && input.dialysis !== "none" ? input.dialysis : "No dialysis flag",
    input.crcl !== null && input.crcl !== undefined ? `CrCl ${input.crcl} mL/min` : undefined,
  ]);
  let executionStatus: WorkflowReadinessStatus;
  let executionDetail: string;

  if (input.dialysis && input.dialysis !== "none") {
    executionStatus = "caution";
    executionDetail =
      input.dialysis === "CRRT"
        ? "CRRT can change exposure for both agents. Keep the pair synchronized whenever effluent or downtime changes."
        : `${input.dialysis} changes timing and dose strategy for both agents. Do not let only one component get renally updated.`;
  } else if (input.crcl === null || input.crcl === undefined) {
    executionStatus = "needs_data";
    executionDetail =
      "CrCl is not defined. The pair should not be treated as operationally locked until renal function is explicit.";
  } else if (input.crcl < 50) {
    executionStatus = "caution";
    executionDetail =
      `CrCl ${input.crcl} mL/min changes both agents. Renally adjust the pair together instead of making isolated changes to one component.`;
  } else if (input.crcl > 120) {
    executionStatus = "caution";
    executionDetail =
      `CrCl ${input.crcl} mL/min raises the risk of losing protected aztreonam exposure. Use an intentional dosing strategy rather than assuming standard scheduling is enough.`;
  } else {
    executionStatus = "ready";
    executionDetail =
      "Renal context is defined and no dialysis flag is active, so the pair can be scheduled intentionally instead of estimated on the fly.";
  }

  items.push({
    id: "combo-execution",
    title: "Renal / dialysis execution lock",
    status: executionStatus,
    summary: summarizeWorkflowStatus(
      executionStatus,
      "Renal execution context is defined",
      "Paired execution still needs deliberate dose/timing attention",
      "Paired execution is blocked",
      "Need renal data before locking the pair",
      "Execution scoring is not applicable",
    ),
    detail: executionDetail,
    cues: renalCues,
  });

  const patient = input.patient;
  if (!hasComboWorkflowSignals(patient)) {
    items.push({
      id: "combo-handoff",
      title: "Definitive handoff",
      status: "needs_data",
      summary: "Need culture and source-control context before handoff",
      detail:
        "Add culture status, source-control progress, and key host-risk signals before turning the pair into a definitive pharmacist-to-team handoff plan.",
      cues: [],
    });
    return items;
  }

  const handoffSupports = dedupeStrings([
    patient?.cultureStatus === "final" ? "Cultures are final" : undefined,
    patient?.sourceControl === "achieved" ? "Source control achieved" : undefined,
    patient?.sourceControl === "not_applicable" ? "No source-control blocker" : undefined,
    patient?.rapidDiagnosticResult === "mbl" || input.rapidDiagnostic === "mbl"
      ? "MBL phenotype is already documented"
      : undefined,
  ]);
  const handoffCautions = dedupeStrings([
    patient?.cultureStatus === "pending" ? "Cultures still pending" : undefined,
    patient?.bacteremiaConcern ? "Bacteremia concern still active" : undefined,
    patient?.endovascularConcern ? "Endovascular concern still active" : undefined,
    patient?.immunocompromised ? "Immunocompromised host" : undefined,
    patient?.neutropenic ? "Neutropenia keeps this on a tight review loop" : undefined,
    patient?.transplant ? "Transplant status raises follow-up complexity" : undefined,
    patient?.icuLevelCare ? "ICU-level care still active" : undefined,
    patient?.vasopressors ? "Vasopressors still active" : undefined,
  ]);
  const handoffBlockers = dedupeStrings([
    patient?.cultureStatus === "not_sent" ? "Cultures were not sent" : undefined,
    patient?.sourceControl === "pending" ? "Source control is still pending" : undefined,
  ]);

  const handoffStatus: WorkflowReadinessStatus =
    handoffBlockers.length > 0
      ? "not_ready"
      : handoffCautions.length > 0
        ? "caution"
        : handoffSupports.length > 0
          ? "ready"
          : "needs_data";

  items.push({
    id: "combo-handoff",
    title: "Definitive handoff",
    status: handoffStatus,
    summary: summarizeWorkflowStatus(
      handoffStatus,
      "The pair can be handed off as a definitive plan",
      "The pair is usable, but the handoff still needs explicit caveats",
      "Do not hand this pair off as definitive therapy yet",
      "Need microbiology and source-control anchors before handoff",
      "Handoff scoring is not applicable",
    ),
    detail:
      handoffStatus === "ready"
        ? "Microbiology and source-control anchors are in place, so this can move from rescue thinking to a documented definitive plan."
        : handoffStatus === "caution"
          ? "The pair may still be the right active strategy, but bedside severity, host risk, or incomplete microbiology should be spelled out in the handoff rather than implied."
          : handoffStatus === "not_ready"
            ? "Key source-control or culture blockers are still open, so this should stay on an active reassessment loop rather than being presented as settled therapy."
            : "Add culture progress and source-control context before calling this pair a definitive handoff.",
    cues:
      handoffStatus === "ready"
        ? handoffSupports
        : handoffStatus === "caution"
          ? dedupeStrings([...handoffSupports, ...handoffCautions])
          : handoffStatus === "not_ready"
            ? dedupeStrings([...handoffBlockers, ...handoffCautions])
            : [],
  });

  return items;
}

export function buildSusceptibilityWorkspaceResult(
  pathogen: PathogenReference,
  input: SusceptibilityWorkspaceInput,
): SusceptibilityWorkspaceResult {
  const combinationObservations = dedupeCombinationObservations([
    ...(input.combinationObservations ?? []),
    input.mic ? normalizeCombinationObservation(input.mic) : null,
  ]);
  const observations = dedupeObservations([
    ...(input.observations ?? []),
    input.observation,
    input.mic ? normalizeSusceptibilityObservation(input.mic) : null,
  ]);
  const observation = observations[0] ?? null;
  const matchedTherapy =
    pathogen.preferredTherapyBySite.filter((recommendation) => recommendationMatchesSite(recommendation, input.site));

  const therapySlice = matchedTherapy.length > 0 ? matchedTherapy : pathogen.preferredTherapyBySite;
  const findings = dedupeFindings([
    ...therapySlice.map((recommendation) => buildTherapyFinding(recommendation, input)),
    ...buildExecutionContextFindings(therapySlice, input),
    ...buildMicFindings(pathogen, input, observations),
    ...buildCombinationFindings(pathogen, combinationObservations, observations),
    ...(pathogen.breakpointRules ?? [])
      .filter((rule) => ruleMatches(rule, input))
      .map(
        (rule): SusceptibilityWorkspaceFinding => ({
          outcome: rule.outcome,
          title: rule.title,
          detail: rule.detail,
          linkedMonographIds: rule.linkedMonographIds,
          sourceIds: rule.sourceIds,
        }),
      ),
  ])
    .filter((finding) => !shouldSuppressFindingForCombination(pathogen, finding, combinationObservations))
    .sort((left, right) => {
    const rank = { avoid: 0, caution: 1, reliable: 2 } as const;
    return rank[left.outcome] - rank[right.outcome];
  });
  const executionNotes = buildCombinationExecutionNotes(
    pathogen,
    input,
    combinationObservations,
  );
  const comboReadinessItems = buildCombinationReadinessItems(
    pathogen,
    input,
    combinationObservations,
    observations,
  );

  return {
    pathogen,
    matchedTherapy: therapySlice,
    findings,
    executionNotes,
    comboReadinessItems,
    observation,
    observations,
    combinationObservations,
  };
}
