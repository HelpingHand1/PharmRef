import type { PatientContext } from "../types";

export interface RegimenPatientWarning {
  severity: "critical" | "warn" | "info";
  title: string;
  detail: string;
  calculatorLabel?: string;
}

function includesAny(text: string, needles: string[]) {
  return needles.some((needle) => text.includes(needle));
}

function addWarning(
  warnings: RegimenPatientWarning[],
  next: RegimenPatientWarning,
) {
  if (warnings.some((warning) => warning.title === next.title && warning.detail === next.detail)) {
    return;
  }
  warnings.push(next);
}

export function hasAnyPatientSignals(patient: PatientContext) {
  return Boolean(
    patient.age ||
      patient.weight ||
      patient.height ||
      patient.scr ||
      patient.sex ||
      patient.pregnant ||
      (patient.dialysis && patient.dialysis !== "none"),
  );
}

export function getRegimenPatientWarnings(
  regimen: string,
  drugId: string | undefined,
  patient: PatientContext,
  crcl: number | null,
) {
  const warnings: RegimenPatientWarning[] = [];
  const text = `${drugId ?? ""} ${regimen}`.toLowerCase();
  const hasPatientContext = hasAnyPatientSignals(patient);
  const dialysisActive = Boolean(patient.dialysis && patient.dialysis !== "none");
  const weightBased = includesAny(text, [
    "vancomycin",
    "gentamicin",
    "tobramycin",
    "amikacin",
    "daptomycin",
  ]);
  const aminoglycoside = includesAny(text, ["gentamicin", "tobramycin", "amikacin"]);
  const renalSensitive = includesAny(text, [
    "nitrofurantoin",
    "tmp-smx",
    "bactrim",
    "ciprofloxacin",
    "levofloxacin",
    "cefepime",
    "piperacillin-tazobactam",
    "pip-tazo",
    "meropenem",
    "ertapenem",
    "imipenem",
    "vancomycin",
    "gentamicin",
    "tobramycin",
    "amikacin",
    "fluconazole",
  ]);

  if (patient.pregnant) {
    if (includesAny(text, ["doxycycline", "minocycline", "tetracycline"])) {
      addWarning(warnings, {
        severity: "critical",
        title: "Pregnancy caution",
        detail: "Tetracyclines are usually avoided in pregnancy because of fetal bone and tooth effects.",
      });
    }

    if (includesAny(text, ["ciprofloxacin", "levofloxacin", "moxifloxacin", "fluoroquinolone"])) {
      addWarning(warnings, {
        severity: "warn",
        title: "Pregnancy caution",
        detail: "Fluoroquinolones are generally avoided in pregnancy unless no safer alternative fits the infection.",
      });
    }

    if (includesAny(text, ["tmp-smx", "bactrim"])) {
      addWarning(warnings, {
        severity: "warn",
        title: "Pregnancy caution",
        detail: "TMP-SMX needs trimester-specific risk review in pregnancy because of folate antagonism and near-term bilirubin displacement.",
      });
    }

    if (aminoglycoside) {
      addWarning(warnings, {
        severity: "warn",
        title: "Pregnancy caution",
        detail: "Aminoglycosides carry fetal ototoxicity risk and should be confirmed against indication and alternatives.",
        calculatorLabel: "Aminoglycoside",
      });
    }
  }

  if (dialysisActive && renalSensitive) {
    addWarning(warnings, {
      severity: "warn",
      title: "Dialysis-specific dosing",
      detail: `This regimen includes renally cleared therapy and usually needs ${patient.dialysis} timing or post-dialysis dose planning.`,
      calculatorLabel: "CrCl",
    });
  }

  if (crcl === null) {
    if (hasPatientContext && renalSensitive) {
      addWarning(warnings, {
        severity: "info",
        title: "Renal context incomplete",
        detail: "CrCl is not available yet. Confirm renal dosing before finalizing this regimen.",
        calculatorLabel: "CrCl",
      });
    }
  } else {
    if (includesAny(text, ["nitrofurantoin"]) && crcl < 30) {
      addWarning(warnings, {
        severity: "critical",
        title: "Renal cutoff",
        detail: "Nitrofurantoin is generally avoided when CrCl is below 30 mL/min.",
        calculatorLabel: "CrCl",
      });
    }

    if (includesAny(text, ["ciprofloxacin", "levofloxacin", "tmp-smx", "cefepime", "piperacillin-tazobactam", "pip-tazo", "meropenem", "ertapenem", "imipenem"]) && crcl < 50) {
      addWarning(warnings, {
        severity: "warn",
        title: "Renal adjustment likely",
        detail: `Current CrCl is ${crcl} mL/min. This regimen commonly needs dose or interval adjustment below 50 mL/min.`,
        calculatorLabel: "CrCl",
      });
    }

    if ((includesAny(text, ["vancomycin"]) && crcl < 60) || (aminoglycoside && crcl < 60)) {
      addWarning(warnings, {
        severity: "warn",
        title: "PK-guided dosing",
        detail: `Current CrCl is ${crcl} mL/min. Therapeutic drug monitoring and individualized interval selection are recommended here.`,
        calculatorLabel: includesAny(text, ["vancomycin"]) ? "Vancomycin AUC" : "Aminoglycoside",
      });
    }
  }

  if (weightBased && !patient.weight && hasPatientContext) {
    addWarning(warnings, {
      severity: "info",
      title: "Weight missing",
      detail: "This regimen includes a weight-based agent. Add actual weight to verify the dose.",
      calculatorLabel: includesAny(text, ["vancomycin"]) ? "Vancomycin AUC" : aminoglycoside ? "Aminoglycoside" : "IBW / AdjBW",
    });
  }

  const rank: Record<RegimenPatientWarning["severity"], number> = { critical: 0, warn: 1, info: 2 };
  return warnings.sort((left, right) => rank[left.severity] - rank[right.severity]);
}
