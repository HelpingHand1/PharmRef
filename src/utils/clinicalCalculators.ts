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
