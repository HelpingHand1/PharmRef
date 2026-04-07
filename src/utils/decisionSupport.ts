import type {
  AllergyRecord,
  BreakpointRapidDiagnostic,
  DecisionMatchCriteria,
  PatientContext,
  PatientRapidDiagnosticResult,
  PatientSignalKey,
} from "../types";
import { normalizeMedicationText } from "./patientMedicationInteractions";

export const PATIENT_SIGNAL_LABELS: Record<PatientSignalKey, string> = {
  allergy_beta_lactam: "beta-lactam allergy",
  pregnancy: "pregnancy",
  renal_impairment: "renal impairment",
  dialysis: "dialysis",
  poor_oral_route: "poor oral route",
  opat_limited: "limited OPAT support",
  bacteremia: "bacteremia concern",
  endovascular: "endovascular concern",
  thrombocytopenia: "thrombocytopenia",
  qtc_prolonged: "prolonged QTc",
  ck_elevated: "elevated CK",
  neutropenia: "neutropenia",
  transplant: "transplant",
  calcineurin_inhibitor: "calcineurin inhibitor exposure",
  arc: "augmented renal clearance",
  hepatic_injury: "hepatic injury",
  line_access_limited: "limited line access",
};

export type PatientSignalState = Record<PatientSignalKey, boolean | undefined>;

export interface DecisionSupportContext {
  allergies?: AllergyRecord[];
  crcl: number | null;
  patient: PatientContext;
  pathogenId?: string | null;
  rapidDiagnostic?: BreakpointRapidDiagnostic | null;
  site?: string | null;
}

export type DecisionSupportMatchState = "matched" | "needs_context" | "not_applicable";

export interface DecisionSupportMatch<T> {
  item: T;
  state: DecisionSupportMatchState;
  score: number;
  matchedCriteria: string[];
  blockedCriteria: string[];
}

const RAPID_DIAGNOSTIC_TO_PATHOGEN_ID: Partial<Record<BreakpointRapidDiagnostic | PatientRapidDiagnosticResult, string>> = {
  mssa: "mssa",
  mrsa: "mrsa",
  esbl: "esbl-enterobacterales",
  kpc: "kpc-cre",
  mbl: "mbl-cre",
  "dtr-pseudomonas": "dtr-pseudomonas",
};

const SUBCATEGORY_SITE_HINTS: Record<string, string> = {
  "bacteremia-endocarditis/sab-workup": "bloodstream",
  "bacteremia-endocarditis/gram-negative-bacteremia": "bloodstream",
  "hap-vap/hap-mdr-risk": "lung",
  "uti/complicated-uti": "urine",
};

const BETA_LACTAM_ALLERGY_PATTERN =
  /\b(beta[ -]?lactam|penicillin|penicillins|cephalosporin|cephalosporins|cef[a-z]+|carbapenem|piperacillin|amoxicillin|ampicillin)\b/i;

function hasCalcineurinExposure(patient: PatientContext) {
  if (patient.transplantImmunosuppression === "calcineurin_inhibitor") {
    return true;
  }

  return (patient.activeMedications ?? []).some((medication) =>
    ["tacrolimus", "cyclosporine", "cyclosporin"].some((needle) =>
      normalizeMedicationText(medication).includes(needle),
    ),
  );
}

function hasBetaLactamAllergy(allergies: AllergyRecord[]) {
  return allergies.some((allergy) => BETA_LACTAM_ALLERGY_PATTERN.test(allergy.name));
}

export function mapRapidDiagnosticToPathogenId(
  value: BreakpointRapidDiagnostic | PatientRapidDiagnosticResult | null | undefined,
) {
  if (!value) return null;
  return RAPID_DIAGNOSTIC_TO_PATHOGEN_ID[value] ?? null;
}

export function getDecisionSupportSiteHint(diseaseId: string, subcategoryId: string) {
  return SUBCATEGORY_SITE_HINTS[`${diseaseId}/${subcategoryId}`] ?? null;
}

export function buildPatientSignalState(
  patient: PatientContext,
  crcl: number | null,
  allergies: AllergyRecord[] = [],
): PatientSignalState {
  const platelets = patient.labs?.platelets;
  const ck = patient.labs?.ck;
  const ast = patient.labs?.ast;
  const alt = patient.labs?.alt;
  const bilirubin = patient.labs?.bilirubin;
  const qtc = patient.labs?.qtc;

  return {
    allergy_beta_lactam: allergies.length > 0 ? hasBetaLactamAllergy(allergies) : false,
    pregnancy: patient.pregnant ?? false,
    renal_impairment:
      patient.dialysis && patient.dialysis !== "none"
        ? true
        : crcl === null
          ? undefined
          : crcl < 50,
    dialysis: patient.dialysis === undefined ? undefined : patient.dialysis !== "none",
    poor_oral_route:
      patient.oralRoute === undefined
        ? undefined
        : patient.oralRoute !== "adequate",
    opat_limited:
      patient.opatSupport === undefined
        ? undefined
        : patient.opatSupport !== "adequate",
    bacteremia: patient.bacteremiaConcern ?? false,
    endovascular: patient.endovascularConcern ?? false,
    thrombocytopenia:
      typeof platelets === "number"
        ? platelets < 100
        : undefined,
    qtc_prolonged:
      patient.qtRisk === true
        ? true
        : typeof qtc === "number"
          ? qtc >= 500
          : patient.qtRisk === false
            ? false
            : undefined,
    ck_elevated:
      typeof ck === "number"
        ? ck >= 1000
        : undefined,
    neutropenia:
      patient.neutropenic === true
        ? true
        : typeof patient.labs?.anc === "number"
          ? patient.labs.anc < 1
          : patient.neutropenic === false
            ? false
            : undefined,
    transplant: patient.transplant ?? false,
    calcineurin_inhibitor: hasCalcineurinExposure(patient),
    arc:
      crcl === null
        ? undefined
        : crcl > 120,
    hepatic_injury:
      typeof bilirubin === "number" || typeof ast === "number" || typeof alt === "number"
        ? (bilirubin ?? 0) >= 2 || (ast ?? 0) >= 120 || (alt ?? 0) >= 120
        : undefined,
    line_access_limited:
      patient.lineAccess === undefined
        ? undefined
        : patient.lineAccess === "limited",
  };
}

function evaluateSignalRequirements(
  requiredSignals: PatientSignalKey[] | undefined,
  signalState: PatientSignalState,
  matchedCriteria: string[],
  blockedCriteria: string[],
) {
  if (!requiredSignals?.length) {
    return "matched" as const;
  }

  let unresolved = false;

  for (const signal of requiredSignals) {
    const state = signalState[signal];
    if (state === undefined) {
      unresolved = true;
      blockedCriteria.push(`Need ${PATIENT_SIGNAL_LABELS[signal]}`);
      continue;
    }

    if (!state) {
      blockedCriteria.push(`Requires ${PATIENT_SIGNAL_LABELS[signal]}`);
      return "not_applicable" as const;
    }

    matchedCriteria.push(PATIENT_SIGNAL_LABELS[signal]);
  }

  return unresolved ? ("needs_context" as const) : ("matched" as const);
}

function evaluateSignalExclusions(
  avoidSignals: PatientSignalKey[] | undefined,
  signalState: PatientSignalState,
  blockedCriteria: string[],
) {
  if (!avoidSignals?.length) {
    return "matched" as const;
  }

  let unresolved = false;

  for (const signal of avoidSignals) {
    const state = signalState[signal];
    if (state === undefined) {
      unresolved = true;
      blockedCriteria.push(`Need ${PATIENT_SIGNAL_LABELS[signal]} status`);
      continue;
    }

    if (state) {
      blockedCriteria.push(`Avoid if ${PATIENT_SIGNAL_LABELS[signal]}`);
      return "not_applicable" as const;
    }
  }

  return unresolved ? ("needs_context" as const) : ("matched" as const);
}

export function matchDecisionCriteria(
  criteria: DecisionMatchCriteria | undefined,
  context: DecisionSupportContext,
  signalState = buildPatientSignalState(context.patient, context.crcl, context.allergies ?? []),
): Omit<DecisionSupportMatch<DecisionMatchCriteria>, "item"> {
  const matchedCriteria: string[] = [];
  const blockedCriteria: string[] = [];
  let state: DecisionSupportMatchState = "matched";
  let score = 0;

  if (!criteria) {
    return { state, score, matchedCriteria, blockedCriteria };
  }

  if (criteria.pathogenIds?.length) {
    if (!context.pathogenId) {
      state = "needs_context";
      blockedCriteria.push("Need pathogen phenotype");
    } else if (!criteria.pathogenIds.includes(context.pathogenId)) {
      return { state: "not_applicable", score: 0, matchedCriteria, blockedCriteria: ["Pathogen does not match"] };
    } else {
      matchedCriteria.push("Pathogen match");
      score += 5;
    }
  }

  if (criteria.sites?.length) {
    if (!context.site) {
      state = "needs_context";
      blockedCriteria.push("Need infection site");
    } else if (!criteria.sites.includes(context.site)) {
      return { state: "not_applicable", score: 0, matchedCriteria, blockedCriteria: ["Site does not match"] };
    } else {
      matchedCriteria.push(`Site: ${context.site}`);
      score += 3;
    }
  }

  if (criteria.rapidDiagnostics?.length) {
    if (!context.rapidDiagnostic) {
      state = "needs_context";
      blockedCriteria.push("Need rapid diagnostic context");
    } else if (!criteria.rapidDiagnostics.includes(context.rapidDiagnostic)) {
      return { state: "not_applicable", score: 0, matchedCriteria, blockedCriteria: ["Rapid diagnostic does not match"] };
    } else {
      matchedCriteria.push(`Rapid dx: ${context.rapidDiagnostic}`);
      score += 2;
    }
  }

  const requiredState = evaluateSignalRequirements(
    criteria.requiresPatientSignals,
    signalState,
    matchedCriteria,
    blockedCriteria,
  );
  if (requiredState === "not_applicable") {
    return { state: "not_applicable", score: 0, matchedCriteria, blockedCriteria };
  }
  if (requiredState === "needs_context") {
    state = "needs_context";
  } else {
    score += criteria.requiresPatientSignals?.length ?? 0;
  }

  const avoidState = evaluateSignalExclusions(criteria.avoidPatientSignals, signalState, blockedCriteria);
  if (avoidState === "not_applicable") {
    return { state: "not_applicable", score: 0, matchedCriteria, blockedCriteria };
  }
  if (avoidState === "needs_context") {
    state = "needs_context";
  }

  return { state, score, matchedCriteria, blockedCriteria };
}

export function rankDecisionMatches<T extends { match?: DecisionMatchCriteria }>(
  items: T[] | undefined,
  context: DecisionSupportContext,
) {
  const signalState = buildPatientSignalState(context.patient, context.crcl, context.allergies ?? []);
  const matches = (items ?? []).map<DecisionSupportMatch<T>>((item) => ({
    item,
    ...matchDecisionCriteria(item.match, context, signalState),
  }));

  return matches.sort((left, right) => {
    const rank = (state: DecisionSupportMatchState) =>
      state === "matched" ? 0 : state === "needs_context" ? 1 : 2;
    const stateDelta = rank(left.state) - rank(right.state);
    if (stateDelta !== 0) return stateDelta;
    return right.score - left.score;
  });
}
