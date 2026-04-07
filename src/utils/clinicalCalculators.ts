import type { PatientContext } from "../types";

export interface WeightMetrics {
  ibw: number;
  adjbw: number | null;
  bsa: number;
}

export interface Curb65Input {
  confusion: boolean;
  bun: boolean;
  rr: boolean;
  bp: boolean;
  age65: boolean;
}

export interface PsiInput {
  age: string;
  sex: "" | "male" | "female";
  nursingHome: boolean;
  neoplasm: boolean;
  liver: boolean;
  chf: boolean;
  cerebrovascular: boolean;
  renal: boolean;
  confusion: boolean;
  rr30: boolean;
  bp90: boolean;
  temp: boolean;
  hr125: boolean;
  ph735: boolean;
  bun30: boolean;
  na130: boolean;
  glucose250: boolean;
  hct30: boolean;
  po260: boolean;
  pleural: boolean;
}

export interface PsiResult {
  score: number;
  cls: number;
  mortality: string;
  setting: string;
}

export interface VancomycinEstimate {
  dose: number;
  interval: string;
  auc: string;
}

export interface HartfordEstimate {
  dose: number;
  interval: string;
  monitoring: string;
}

export interface ExtendedInfusionEstimate {
  agent: "cefepime" | "meropenem" | "pip-tazo";
  regimen: string;
  rationale: string;
}

export interface DaptomycinDoseEstimate {
  mgPerKg: number;
  totalDoseMg: number;
}

export interface TmpSmxDoseEstimate {
  totalTmpMgPerDay: number;
  tmpMgPerDose: number;
  dsTabsPerDose: number;
}

export type ColistinDoseUnit = "million_iu" | "cms_mg" | "cba_mg";

export interface ColistinDoseConversion {
  millionIU: number;
  cmsMg: number;
  cbaMg: number;
}

export interface AzoleTdmAssessment {
  goal: string;
  interpretation: string;
  action: string;
}

function roundToTenth(value: number) {
  return Math.round(value * 10) / 10;
}

export function calculateCreatinineClearance(patient: Pick<PatientContext, "age" | "weight" | "scr" | "sex">): number | null {
  const { age, weight, scr, sex } = patient;
  if (!age || !weight || !scr || !sex || scr <= 0) return null;
  const sexFactor = sex === "female" ? 0.85 : 1;
  const raw = ((140 - age) * weight * sexFactor) / (72 * scr);
  return Math.max(0, roundToTenth(raw));
}

export function calculateIdealBodyWeight(heightCm: number | undefined, sex: PatientContext["sex"]): number | null {
  if (!heightCm || !sex) return null;
  const heightInches = heightCm / 2.54;
  const excessInches = heightInches - 60;
  if (excessInches < -10) return null;
  const base = sex === "male" ? 50 : 45.5;
  return Math.max(0, roundToTenth(base + 2.3 * excessInches));
}

export function calculateAdjustedBodyWeight(weightKg: number | undefined, ibwKg: number | null): number | null {
  if (!weightKg || !ibwKg) return null;
  if (weightKg <= ibwKg * 1.3) return null;
  return roundToTenth(ibwKg + 0.4 * (weightKg - ibwKg));
}

export function calculateBodySurfaceArea(heightCm: number | undefined, weightKg: number | undefined): number | null {
  if (!heightCm || !weightKg) return null;
  return Math.round(Math.sqrt((heightCm * weightKg) / 3600) * 100) / 100;
}

export function calculateWeightMetrics(heightCm: number | undefined, weightKg: number | undefined, sex: PatientContext["sex"]): WeightMetrics | null {
  const ibw = calculateIdealBodyWeight(heightCm, sex);
  const bsa = calculateBodySurfaceArea(heightCm, weightKg);
  if (ibw === null || bsa === null) return null;
  return {
    ibw,
    adjbw: calculateAdjustedBodyWeight(weightKg, ibw),
    bsa,
  };
}

export function calculateCurb65(input: Curb65Input) {
  const score = Object.values(input).filter(Boolean).length;
  const risk = score <= 1
    ? "Low risk — outpatient treatment appropriate"
    : score === 2
      ? "Moderate risk — consider inpatient admission"
      : "High risk — ICU consideration warranted";
  const management = score <= 1
    ? "Consider outpatient therapy with amoxicillin ± azithromycin. Follow up in 24–48h."
    : score === 2
      ? "Consider short inpatient stay or hospital-supervised outpatient. IV to PO switch when stable."
      : "Inpatient required. Consider ICU if score ≥3 with sepsis criteria or hypoxia.";
  return { score, risk, management };
}

export function calculatePsiClass(input: PsiInput): PsiResult {
  const age = Number(input.age) || 0;
  let score = input.sex === "female" ? age - 10 : age;
  if (input.nursingHome) score += 10;
  if (input.neoplasm) score += 30;
  if (input.liver) score += 20;
  if (input.chf) score += 10;
  if (input.cerebrovascular) score += 10;
  if (input.renal) score += 10;
  if (input.confusion) score += 20;
  if (input.rr30) score += 20;
  if (input.bp90) score += 20;
  if (input.temp) score += 15;
  if (input.hr125) score += 10;
  if (input.ph735) score += 30;
  if (input.bun30) score += 20;
  if (input.na130) score += 20;
  if (input.glucose250) score += 10;
  if (input.hct30) score += 10;
  if (input.po260) score += 10;
  if (input.pleural) score += 10;

  if (score <= 50) return { score, cls: 1, mortality: "<0.1%", setting: "Outpatient" };
  if (score <= 70) return { score, cls: 2, mortality: "0.6%", setting: "Outpatient" };
  if (score <= 90) return { score, cls: 3, mortality: "2.8%", setting: "Brief inpatient or outpatient" };
  if (score <= 130) return { score, cls: 4, mortality: "8.2%", setting: "Inpatient" };
  return { score, cls: 5, mortality: "29.2%", setting: "Inpatient / ICU" };
}

export function estimateVancomycinRegimen(crcl: number, weightKg: number, mic: number): VancomycinEstimate | null {
  if (!crcl || !weightKg || !mic || crcl <= 0 || weightKg <= 0 || mic <= 0) return null;
  const vd = 0.7 * weightKg;
  const clVanc = (0.695 * crcl + 0.05) * 0.06 * weightKg;
  const tdd = Math.round((500 * clVanc) / 250) * 250;
  const halflife = (vd * 0.693) / clVanc;
  const interval = halflife < 6 ? "q6h" : halflife < 9 ? "q8h" : halflife < 14 ? "q12h" : halflife < 20 ? "q24h" : "q48h";
  const aucEstimate = `${Math.round(500 - 60)}–${Math.round(500 + 60)}`;
  return {
    dose: Math.max(500, Math.min(tdd, 4500)),
    interval,
    auc: aucEstimate,
  };
}

export function calculateHartfordAminoglycoside(crcl: number, weightKg: number): HartfordEstimate | null {
  if (!crcl || !weightKg || crcl <= 0 || weightKg <= 0) return null;
  const dose = Math.round(7 * weightKg);
  if (crcl >= 60) {
    return { dose, interval: "q24h", monitoring: "Check level 6–14h post-dose; use Hartford nomogram" };
  }
  if (crcl >= 40) {
    return { dose, interval: "q36h", monitoring: "Check level 6–14h post-dose; adjust to nomogram" };
  }
  if (crcl >= 20) {
    return { dose, interval: "q48h", monitoring: "Check level 6–14h post-dose; extended interval may not be safe" };
  }
  return {
    dose,
    interval: "Conventional dosing preferred",
    monitoring: "CrCl <20 — consult clinical pharmacokinetics; avoid extended interval",
  };
}

export function estimateExtendedInfusionBetaLactam(
  agent: ExtendedInfusionEstimate["agent"],
  crcl: number,
  hasArc = false,
): ExtendedInfusionEstimate | null {
  if (!crcl || crcl <= 0) return null;

  const arc = hasArc || crcl >= 120;

  if (agent === "meropenem") {
    if (arc) {
      return {
        agent,
        regimen: "Meropenem 2 g IV q8h over 3 hours",
        rationale: "ARC or CrCl >=120 mL/min increases the risk of underexposure; preserve full prolonged-infusion exposure.",
      };
    }
    if (crcl >= 60) {
      return {
        agent,
        regimen: "Meropenem 1-2 g IV q8h over 3 hours",
        rationale: "Extended infusion improves time above MIC in serious gram-negative infection.",
      };
    }
    if (crcl >= 30) {
      return {
        agent,
        regimen: "Meropenem 1 g IV q12h over 3 hours",
        rationale: "Moderate renal impairment still supports prolonged infusion, but maintenance intervals usually widen.",
      };
    }
    return {
      agent,
      regimen: "Meropenem 1 g IV q24h over 3 hours",
      rationale: "Severe renal dysfunction requires individualized PK review; verify same-day dosing if renal replacement changes.",
    };
  }

  if (agent === "cefepime") {
    if (arc) {
      return {
        agent,
        regimen: "Cefepime 2 g IV q8h over 3-4 hours",
        rationale: "ARC and higher MIC gram-negative disease need full q8h extended-infusion exposure.",
      };
    }
    if (crcl >= 60) {
      return {
        agent,
        regimen: "Cefepime 2 g IV q8-12h over 3-4 hours",
        rationale: "Use the q8h end of the range for severe infection, pneumonia, or higher-MIC organisms.",
      };
    }
    if (crcl >= 30) {
      return {
        agent,
        regimen: "Cefepime 2 g IV q12h over 3-4 hours",
        rationale: "Moderate renal impairment usually shifts maintenance to q12h while preserving prolonged infusion.",
      };
    }
    return {
      agent,
      regimen: "Cefepime 1 g IV q24h over 3 hours",
      rationale: "Severe renal dysfunction needs close neurotoxicity review and individualized escalation if the syndrome is high risk.",
    };
  }

  if (arc) {
    return {
      agent,
      regimen: "Piperacillin-tazobactam 4.5 g IV q6h over 4 hours",
      rationale: "ARC and serious infection favor aggressive q6h extended infusion instead of convenience dosing.",
    };
  }
  if (crcl >= 60) {
    return {
      agent,
      regimen: "Piperacillin-tazobactam 4.5 g IV q8h over 4 hours",
      rationale: "Standard severe-infection prolonged infusion schedule.",
    };
  }
  if (crcl >= 20) {
    return {
      agent,
      regimen: "Piperacillin-tazobactam 3.375-4.5 g IV q8-12h over 4 hours",
      rationale: "Moderate renal impairment still supports prolonged infusion, but interval reduction is usually needed.",
    };
  }
  return {
    agent,
    regimen: "Piperacillin-tazobactam 2.25-3.375 g IV q8-12h over 4 hours",
    rationale: "Severe renal dysfunction or dialysis needs modality-specific review before finalizing the schedule.",
  };
}

export function calculateDaptomycinDose(weightKg: number, mgPerKg: number): DaptomycinDoseEstimate | null {
  if (!weightKg || !mgPerKg || weightKg <= 0 || mgPerKg <= 0) return null;
  return {
    mgPerKg: roundToTenth(mgPerKg),
    totalDoseMg: Math.round((weightKg * mgPerKg) / 50) * 50,
  };
}

export function calculateTmpSmxDose(
  weightKg: number,
  tmpMgPerKgPerDay: number,
  dosesPerDay: number,
): TmpSmxDoseEstimate | null {
  if (!weightKg || !tmpMgPerKgPerDay || !dosesPerDay || weightKg <= 0 || tmpMgPerKgPerDay <= 0 || dosesPerDay <= 0) {
    return null;
  }

  const totalTmpMgPerDay = roundToTenth(weightKg * tmpMgPerKgPerDay);
  const tmpMgPerDose = roundToTenth(totalTmpMgPerDay / dosesPerDay);
  return {
    totalTmpMgPerDay,
    tmpMgPerDose,
    dsTabsPerDose: roundToTenth(tmpMgPerDose / 160),
  };
}

export function convertColistinDose(value: number, unit: ColistinDoseUnit): ColistinDoseConversion | null {
  if (!value || value <= 0) return null;

  if (unit === "million_iu") {
    return {
      millionIU: roundToTenth(value),
      cmsMg: roundToTenth(value * 80),
      cbaMg: roundToTenth(value * 33),
    };
  }

  if (unit === "cms_mg") {
    return {
      millionIU: roundToTenth(value / 80),
      cmsMg: roundToTenth(value),
      cbaMg: roundToTenth((value * 33) / 80),
    };
  }

  return {
    millionIU: roundToTenth(value / 33),
    cmsMg: roundToTenth((value * 80) / 33),
    cbaMg: roundToTenth(value),
  };
}

export function assessAzoleTrough(
  agent: "voriconazole" | "posaconazole-prophylaxis" | "posaconazole-treatment",
  trough: number,
): AzoleTdmAssessment | null {
  if (!trough || trough <= 0) return null;

  if (agent === "voriconazole") {
    if (trough < 1) {
      return {
        goal: "1-5.5 mcg/mL",
        interpretation: "Likely underexposed",
        action: "Confirm adherence, timing, interactions, and consider maintenance escalation with repeat trough review.",
      };
    }
    if (trough <= 5.5) {
      return {
        goal: "1-5.5 mcg/mL",
        interpretation: "In target range",
        action: "Continue current dosing if liver tests, neuro-visual symptoms, and QT profile remain acceptable.",
      };
    }
    return {
      goal: "1-5.5 mcg/mL",
      interpretation: "High exposure / toxicity risk",
      action: "Evaluate for hepatotoxicity or neurotoxicity and consider dose reduction or alternate azole strategy.",
    };
  }

  if (agent === "posaconazole-prophylaxis") {
    return trough >= 0.7
      ? {
          goal: ">=0.7 mcg/mL",
          interpretation: "At prophylaxis goal",
          action: "Maintain regimen if absorption, formulation, and interaction plan remain stable.",
        }
      : {
          goal: ">=0.7 mcg/mL",
          interpretation: "Below prophylaxis goal",
          action: "Reassess formulation, food/acid suppression effects, and consider dose/formulation adjustment.",
        };
  }

  return trough >= 1
    ? {
        goal: ">=1 mcg/mL",
        interpretation: "At treatment goal",
        action: "Maintain regimen if clinical response and tolerability are acceptable.",
      }
    : {
        goal: ">=1 mcg/mL",
        interpretation: "Below treatment goal",
        action: "Reassess formulation, administration conditions, and interactions before adjusting therapy.",
      };
}
