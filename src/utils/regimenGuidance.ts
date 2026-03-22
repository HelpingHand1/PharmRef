import type { InteractionAction, PatientContext, RegimenPlan } from "../types";
import {
  findMatchedInteractionActions,
  getMatchedInteractionSeverity,
} from "./patientMedicationInteractions";

export interface RegimenPatientWarning {
  severity: "critical" | "warn" | "info";
  title: string;
  detail: string;
  calculatorLabel?: string;
}

function includesAny(text: string, needles: string[]) {
  return needles.some((needle) => text.includes(needle));
}

function buildPlanText(plan?: RegimenPlan | null) {
  if (!plan) return "";
  return [
    plan.indication ?? "",
    plan.site ?? "",
    plan.role ?? "",
    plan.rationale ?? "",
    ...(plan.pathogenFocus ?? []),
    ...(plan.riskFactorTriggers ?? []),
    ...(plan.avoidIf ?? []),
    ...(plan.renalFlags ?? []),
    ...(plan.dialysisFlags ?? []),
    ...(plan.rapidDiagnosticActions ?? []),
  ]
    .map((value) => value.trim())
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function extractQtInteractionText(text: string) {
  const sentences = text
    .split(/[.]/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
  return sentences.find((sentence) => sentence.includes("qt")) ?? null;
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
      patient.oralRoute ||
      patient.enteralFeeds ||
      patient.qtRisk ||
      patient.serotonergicMeds ||
      patient.opatSupport ||
      patient.recentHospitalization ||
      patient.recentIvAntibiotics ||
      patient.priorMrsa ||
      patient.priorEsbl ||
      patient.priorCre ||
      patient.priorDtrPseudomonas ||
      patient.mrsaNares ||
      patient.cultureStatus ||
      patient.rapidDiagnosticResult ||
      patient.sourceControl ||
      patient.bacteremiaConcern ||
      patient.endovascularConcern ||
      patient.immunocompromised ||
      patient.neutropenic ||
      patient.transplant ||
      patient.icuLevelCare ||
      patient.vasopressors ||
      patient.cultureCollectedOn ||
      patient.rapidDiagnosticOn ||
      patient.finalCultureOn ||
      patient.sourceControlOn ||
      patient.operativeSourceControlOn ||
      (patient.activeMedications && patient.activeMedications.length > 0) ||
      (patient.dialysis && patient.dialysis !== "none"),
  );
}

export function getRegimenPatientWarnings(
  regimen: string,
  drugId: string | undefined,
  patient: PatientContext,
  crcl: number | null,
  plan?: RegimenPlan | null,
  interactionActions?: InteractionAction[],
) {
  const warnings: RegimenPatientWarning[] = [];
  const planText = buildPlanText(plan);
  const text = `${drugId ?? ""} ${regimen} ${planText}`.toLowerCase();
  const hasPatientContext = hasAnyPatientSignals(patient);
  const dialysisActive = Boolean(patient.dialysis && patient.dialysis !== "none");
  const healthcareExposure = Boolean(patient.recentHospitalization || patient.recentIvAntibiotics);
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
  const oralOnly = includesAny(text, [
    "nitrofurantoin",
    "fosfomycin",
    "fidaxomicin",
    "oral vancomycin",
    "vancomycin oral",
    "amoxicillin",
  ]);
  const enteralSensitive = includesAny(text, [
    "ciprofloxacin",
    "levofloxacin",
    "moxifloxacin",
    "doxycycline",
    "minocycline",
    "tetracycline",
    "voriconazole",
    "posaconazole",
  ]);
  const qtSensitive = includesAny(text, [
    "qt",
    "azithromycin",
    "ciprofloxacin",
    "levofloxacin",
    "moxifloxacin",
    "voriconazole",
    "fluconazole",
    "posaconazole",
  ]);
  const serotonergicSensitive = includesAny(text, [
    "linezolid",
    "tedizolid",
    "serotonergic",
    "maoi",
  ]);
  const mrsaActive = includesAny(text, [
    "vancomycin",
    "linezolid",
    "tedizolid",
    "daptomycin",
  ]);
  const esblReliable = includesAny(text, [
    "meropenem",
    "ertapenem",
    "imipenem",
    "meropenem-vaborbactam",
    "imipenem-cilastatin-relebactam",
    "cefiderocol",
  ]);
  const kpcActive = includesAny(text, [
    "meropenem-vaborbactam",
    "ceftazidime-avibactam",
    "imipenem-cilastatin-relebactam",
    "cefiderocol",
  ]);
  const mblActive =
    includesAny(text, ["cefiderocol"]) ||
    (includesAny(text, ["ceftazidime-avibactam"]) && includesAny(text, ["aztreonam"]));
  const dtrPseudoActive = includesAny(text, [
    "cefiderocol",
    "ceftolozane-tazobactam",
    "ceftazidime-avibactam",
    "imipenem-cilastatin-relebactam",
  ]);
  const broadEmpiric = includesAny(text, [
    "cefepime",
    "meropenem",
    "ertapenem",
    "imipenem",
    "piperacillin-tazobactam",
    "pip-tazo",
    "ceftazidime-avibactam",
    "ceftolozane-tazobactam",
    "imipenem-cilastatin-relebactam",
    "cefiderocol",
    "vancomycin",
    "linezolid",
  ]);
  const lowSerumFit = includesAny(text, [
    "nitrofurantoin",
    "fosfomycin",
    "fidaxomicin",
    "oral vancomycin",
    "vancomycin oral",
  ]);
  const pneumoniaContext = includesAny(text, ["pneumonia", "cap", "hap", "vap"]);
  const sourceControlContext = includesAny(text, [
    "intra-abdominal",
    "abdominal",
    "abscess",
    "ssti",
    "soft tissue",
    "wound",
    "diabetic foot",
    "joint",
    "osteomyel",
    "source control",
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

  if (patient.oralRoute === "none") {
    if (oralOnly) {
      addWarning(warnings, {
        severity: "critical",
        title: "Oral route unavailable",
        detail: "This regimen relies on oral-only therapy. Choose an IV or non-oral alternative until enteral access is reliable.",
      });
    } else if (includesAny(text, ["step-down", "switch", "po", "oral"])) {
      addWarning(warnings, {
        severity: "info",
        title: "IV to PO not yet feasible",
        detail: "The oral route is currently unavailable, so keep therapy IV until gut access and absorption are reliable.",
      });
    }
  }

  if (patient.oralRoute === "limited" && oralOnly) {
    addWarning(warnings, {
      severity: "warn",
      title: "Oral route reliability limited",
      detail: "This regimen depends on oral delivery. Confirm absorption and adherence before relying on it as the primary plan.",
    });
  }

  if (patient.enteralFeeds && enteralSensitive) {
    addWarning(warnings, {
      severity: "warn",
      title: "Enteral feed interaction",
      detail: "This regimen may need feed holds or cation separation to avoid reduced oral exposure.",
    });
  }

  if (patient.qtRisk && qtSensitive) {
    const qtDetail = extractQtInteractionText(text);
    addWarning(warnings, {
      severity: "warn",
      title: "QT risk present",
      detail: qtDetail
        ? `${qtDetail.charAt(0).toUpperCase()}${qtDetail.slice(1)}. Recheck ECG and electrolytes before relying on this option.`
        : "This regimen includes QT-active therapy. Recheck ECG and electrolytes before relying on this option.",
    });
  }

  if (patient.serotonergicMeds && serotonergicSensitive) {
    addWarning(warnings, {
      severity: includesAny(text, ["linezolid"]) ? "critical" : "warn",
      title: "Serotonergic interaction risk",
      detail: "This regimen can interact with serotonergic medications. Confirm whether a washout, monitoring plan, or alternative is needed.",
    });
  }

  if (patient.opatSupport === "limited" && includesAny(text, ["opat", "outpatient", "once daily", "daily"])) {
    addWarning(warnings, {
      severity: "warn",
      title: "OPAT logistics limited",
      detail: "Home infusion, line care, or follow-up support is limited. Favor the simplest monitored option or an inpatient bridge plan.",
    });
  }

  if (healthcareExposure && !broadEmpiric && includesAny(text, ["sepsis", "pneumonia", "hospital", "healthcare", "shock", "bacteremia"])) {
    addWarning(warnings, {
      severity: "warn",
      title: "Healthcare exposure raises MDR pressure",
      detail: "Recent hospitalization or IV antibiotics increases MDR risk. Recheck whether this regimen is too narrow for the current syndrome.",
    });
  }

  if ((patient.priorMrsa || patient.mrsaNares === "positive" || patient.rapidDiagnosticResult === "mrsa") && pneumoniaContext && !mrsaActive) {
    addWarning(warnings, {
      severity: patient.rapidDiagnosticResult === "mrsa" ? "critical" : "warn",
      title: "MRSA coverage gap",
      detail: "MRSA risk or a positive MRSA signal is present. Confirm whether empiric anti-MRSA therapy should be included here.",
    });
  }

  if (patient.mrsaNares === "negative" && pneumoniaContext && mrsaActive) {
    addWarning(warnings, {
      severity: "warn",
      title: "MRSA de-escalation candidate",
      detail: "Negative MRSA nares lowers the probability of MRSA pneumonia. Reassess whether anti-MRSA coverage is still needed at 48 to 72 hours.",
    });
  }

  if ((patient.priorEsbl || patient.rapidDiagnosticResult === "esbl") && !esblReliable) {
    addWarning(warnings, {
      severity: patient.rapidDiagnosticResult === "esbl" ? "critical" : "warn",
      title: "ESBL-directed therapy needed",
      detail: "ESBL risk or an ESBL signal is present. Recheck whether this regimen is reliable enough for definitive or continued empiric therapy.",
    });
  }

  if ((patient.priorCre || patient.rapidDiagnosticResult === "kpc") && !kpcActive) {
    addWarning(warnings, {
      severity: patient.rapidDiagnosticResult === "kpc" ? "critical" : "warn",
      title: "KPC-directed therapy needed",
      detail: "CRE or KPC risk is present. Confirm whether this regimen covers KPC-producing Enterobacterales before continuing it.",
    });
  }

  if (patient.rapidDiagnosticResult === "mbl" && !mblActive) {
    addWarning(warnings, {
      severity: "critical",
      title: "MBL-directed therapy needed",
      detail: "An MBL signal is present. Avibactam monotherapy is not enough here, so use cefiderocol or synchronized aztreonam pairing if appropriate.",
    });
  }

  if ((patient.priorDtrPseudomonas || patient.rapidDiagnosticResult === "dtr-pseudomonas") && !dtrPseudoActive) {
    addWarning(warnings, {
      severity: patient.rapidDiagnosticResult === "dtr-pseudomonas" ? "critical" : "warn",
      title: "DTR Pseudomonas coverage gap",
      detail: "Difficult-to-treat Pseudomonas risk is present. Confirm whether this regimen still has a realistic chance of activity.",
    });
  }

  if (patient.cultureStatus === "final" && broadEmpiric) {
    addWarning(warnings, {
      severity: "warn",
      title: "Culture final - de-escalation due",
      detail: "Cultures are final. Reassess whether this empiric-spectrum regimen should be narrowed or stopped today.",
    });
  }

  if (patient.sourceControl === "pending" && sourceControlContext) {
    addWarning(warnings, {
      severity: "warn",
      title: "Source control pending",
      detail: "Source control is still pending, so antibiotic changes should be interpreted alongside drainage, debridement, or device removal timing.",
    });
  }

  if (patient.sourceControl === "achieved" && includesAny(text, ["step-down", "switch", "po", "oral"])) {
    addWarning(warnings, {
      severity: "info",
      title: "Source control achieved",
      detail: "Source control is documented, so this is a good moment to reassess IV-to-PO transition, duration anchor, and discharge readiness.",
    });
  }

  if (patient.bacteremiaConcern && lowSerumFit) {
    addWarning(warnings, {
      severity: "critical",
      title: "Poor bloodstream fit",
      detail: "This regimen depends on agents with poor serum or tissue exposure and is a poor fit when bacteremia is a realistic concern.",
    });
  }

  if (patient.endovascularConcern && (lowSerumFit || oralOnly)) {
    addWarning(warnings, {
      severity: "critical",
      title: "Poor endovascular fit",
      detail: "Endovascular infection concern is active. Favor bloodstream-active therapy and delay oral-only strategies until that workup is resolved.",
    });
  }

  findMatchedInteractionActions(interactionActions, patient).forEach((match) => {
    addWarning(warnings, {
      severity: getMatchedInteractionSeverity(match.action),
      title: `Active medication interaction: ${match.label}`,
      detail: `${match.action.effect} ${match.action.management}`.trim(),
    });
  });

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
