import type { DrugMonograph, PatientContext } from "../types";
import { hasAnyPatientSignals } from "./regimenGuidance";
import {
  findMatchedInteractionActions,
  getMatchedInteractionSeverity,
} from "./patientMedicationInteractions";

export interface MonographPatientGuidanceItem {
  severity: "critical" | "warn" | "info";
  title: string;
  detail: string;
  calculatorLabel?: string;
}

const ORAL_ONLY_IDS = new Set([
  "amoxicillin",
  "fidaxomicin",
  "fosfomycin",
  "nitrofurantoin",
  "vancomycin-oral",
]);

const WEIGHT_BASED_IDS = new Set([
  "amikacin",
  "amphotericin-b",
  "cefiderocol",
  "colistin",
  "daptomycin",
  "gentamicin",
  "liposomal-amphotericin-b",
  "micafungin",
  "tobramycin",
  "vancomycin",
]);

const LEVEL_GUIDED_IDS = new Set([
  "amikacin",
  "gentamicin",
  "posaconazole",
  "tobramycin",
  "vancomycin",
  "voriconazole",
]);

const LOW_SERUM_FIT_IDS = new Set([
  "fidaxomicin",
  "fosfomycin",
  "nitrofurantoin",
  "vancomycin-oral",
]);

const BROAD_SPECTRUM_IDS = new Set([
  "cefepime",
  "cefiderocol",
  "ceftazidime-avibactam",
  "ceftolozane-tazobactam",
  "ertapenem",
  "imipenem-cilastatin-relebactam",
  "linezolid",
  "meropenem",
  "meropenem-vaborbactam",
  "pip-tazo",
  "vancomycin",
]);

const MRSA_ACTIVE_IDS = new Set([
  "daptomycin",
  "linezolid",
  "tedizolid",
  "vancomycin",
]);

const ESBL_RELIABLE_IDS = new Set([
  "cefiderocol",
  "ertapenem",
  "imipenem-cilastatin-relebactam",
  "meropenem",
  "meropenem-vaborbactam",
]);

const KPC_ACTIVE_IDS = new Set([
  "cefiderocol",
  "ceftazidime-avibactam",
  "imipenem-cilastatin-relebactam",
  "meropenem-vaborbactam",
]);

const MBL_ACTIVE_IDS = new Set([
  "cefiderocol",
]);

const DTR_PSEUDOMONAS_ACTIVE_IDS = new Set([
  "cefiderocol",
  "ceftazidime-avibactam",
  "ceftolozane-tazobactam",
  "imipenem-cilastatin-relebactam",
]);

function includesAny(text: string, needles: string[]) {
  return needles.some((needle) => text.includes(needle));
}

function addItem(
  items: MonographPatientGuidanceItem[],
  next: MonographPatientGuidanceItem,
) {
  if (items.some((item) => item.title === next.title && item.detail === next.detail)) {
    return;
  }
  items.push(next);
}

function getSearchText(monograph: DrugMonograph) {
  return [
    monograph.id,
    monograph.name,
    monograph.drugClass,
    monograph.renalAdjustment,
    monograph.monitoring,
    monograph.pregnancyLactation,
    monograph.therapeuticDrugMonitoring?.target,
    monograph.therapeuticDrugMonitoring?.sampling,
    monograph.therapeuticDrugMonitoring?.adjustment,
    monograph.therapeuticDrugMonitoring?.pearls?.join(" "),
    monograph.administration?.infusion,
    monograph.administration?.oralAbsorption,
    monograph.ivToPoSwitch?.poBioavailability,
    monograph.ivToPoSwitch?.switchCriteria,
    monograph.opatEligibility?.administration,
    monograph.opatEligibility?.monitoring,
    monograph.opatEligibility?.considerations?.join(" "),
    ...(monograph.drugInteractions ?? []),
    ...(monograph.interactionActions ?? []).map((entry) => `${entry.interactingAgent} ${entry.effect} ${entry.management}`),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function isRenalReviewNeeded(monograph: DrugMonograph) {
  const text = monograph.renalAdjustment.toLowerCase();
  return !includesAny(text, [
    "no adjustment",
    "no renal adjustment",
    "not required",
    "none required",
    "unchanged in renal",
  ]);
}

function getDialysisGuidance(monograph: DrugMonograph, dialysis: NonNullable<PatientContext["dialysis"]>) {
  if (!monograph.renalReplacement?.length || dialysis === "none") {
    return null;
  }
  return monograph.renalReplacement.find((entry) => entry.modality === dialysis) ?? null;
}

function findSentence(text: string, needles: string[]) {
  const sentences = text
    .split(/[.]/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
  return sentences.find((sentence) => needles.some((needle) => sentence.includes(needle))) ?? null;
}

export function getMonographPatientGuidance(
  monograph: DrugMonograph,
  patient: PatientContext,
  crcl: number | null,
  ibw: number | null,
  adjbw: number | null,
) {
  const items: MonographPatientGuidanceItem[] = [];
  const hasSignals = hasAnyPatientSignals(patient);
  const dialysis = patient.dialysis ?? "none";
  const dialysisActive = dialysis !== "none";
  const searchText = getSearchText(monograph);
  const oralAbsorption = monograph.administration?.oralAbsorption ?? "";
  const oralOnly = ORAL_ONLY_IDS.has(monograph.id) || searchText.includes("oral only");
  const weightBased = WEIGHT_BASED_IDS.has(monograph.id) || includesAny(searchText, [
    "mg/kg",
    "weight-based",
    "actual body weight",
    "adjusted body weight",
  ]);
  const qtSensitive = includesAny(searchText, ["qt", "torsades", "qtc"]);
  const serotonergicSensitive = includesAny(searchText, ["seroton", "linezolid", "tedizolid", "maoi"]);
  const tdmSensitive = LEVEL_GUIDED_IDS.has(monograph.id);
  const enteralSensitive = Boolean(oralAbsorption) && includesAny(
    oralAbsorption.toLowerCase(),
    ["enteral", "tube", "feed", "cation", "calcium", "magnesium", "iron", "zinc", "separate", "hold"],
  );
  const obesityLikely = Boolean(patient.weight && ibw && patient.weight > ibw * 1.2 && adjbw !== null);
  const lowSerumFit = LOW_SERUM_FIT_IDS.has(monograph.id);
  const broadEmpiric = BROAD_SPECTRUM_IDS.has(monograph.id);
  const mrsaActive = MRSA_ACTIVE_IDS.has(monograph.id);
  const esblReliable = ESBL_RELIABLE_IDS.has(monograph.id);
  const kpcActive = KPC_ACTIVE_IDS.has(monograph.id);
  const mblActive =
    MBL_ACTIVE_IDS.has(monograph.id) ||
    (monograph.id === "ceftazidime-avibactam" && searchText.includes("aztreonam"));
  const dtrPseudoActive = DTR_PSEUDOMONAS_ACTIVE_IDS.has(monograph.id);

  if (!hasSignals) {
    return items;
  }

  if (patient.pregnant) {
    if (includesAny(monograph.id, ["doxycycline", "minocycline", "tetracycline"])) {
      addItem(items, {
        severity: "critical",
        title: "Pregnancy caution",
        detail: "Tetracyclines are usually avoided in pregnancy because of fetal bone and tooth effects.",
      });
    }

    if (includesAny(monograph.id, ["ciprofloxacin", "levofloxacin", "moxifloxacin"])) {
      addItem(items, {
        severity: "warn",
        title: "Pregnancy caution",
        detail: "Fluoroquinolones are generally avoided in pregnancy unless no safer alternative fits the infection.",
      });
    }

    if (includesAny(monograph.id, ["tmp-smx"])) {
      addItem(items, {
        severity: "warn",
        title: "Pregnancy caution",
        detail: "TMP-SMX needs trimester-specific risk review in pregnancy because of folate antagonism and near-term bilirubin displacement.",
      });
    }

    if (includesAny(monograph.id, ["gentamicin", "tobramycin", "amikacin"])) {
      addItem(items, {
        severity: "warn",
        title: "Pregnancy caution",
        detail: "Aminoglycosides carry fetal ototoxicity risk and should be confirmed against indication and alternatives.",
        calculatorLabel: "Aminoglycoside",
      });
    }

    if (includesAny(monograph.id, ["voriconazole"])) {
      addItem(items, {
        severity: "critical",
        title: "Pregnancy caution",
        detail: "Voriconazole is generally avoided in pregnancy because of fetal toxicity concerns unless no acceptable alternative fits the infection.",
      });
    }
  }

  if (crcl === null) {
    if ((patient.age || patient.sex || patient.weight || patient.scr || dialysisActive) && isRenalReviewNeeded(monograph)) {
      addItem(items, {
        severity: "info",
        title: "Renal review pending",
        detail: "CrCl is not available yet. Confirm the renal dosing section before finalizing this agent.",
        calculatorLabel: "CrCl",
      });
    }
  } else {
    if (monograph.id === "nitrofurantoin" && crcl < 30) {
      addItem(items, {
        severity: "critical",
        title: "Renal cutoff",
        detail: "Nitrofurantoin is generally avoided when CrCl is below 30 mL/min.",
        calculatorLabel: "CrCl",
      });
    } else if (crcl < 50 && isRenalReviewNeeded(monograph)) {
      addItem(items, {
        severity: "warn",
        title: "Renal adjustment likely",
        detail: `Current CrCl is ${crcl} mL/min. Review the renal dosing section before verifying dose and interval.`,
        calculatorLabel: "CrCl",
      });
    }

    if (monograph.therapeuticDrugMonitoring && tdmSensitive && crcl < 60) {
      addItem(items, {
        severity: "warn",
        title: "Monitoring intensity increases",
        detail: `Current CrCl is ${crcl} mL/min. Therapeutic drug monitoring and individualized reassessment should happen early in therapy.`,
        calculatorLabel: includesAny(monograph.id, ["vancomycin"]) ? "Vancomycin AUC" : includesAny(monograph.id, ["gentamicin", "tobramycin", "amikacin"]) ? "Aminoglycoside" : "CrCl",
      });
    }
  }

  if (dialysisActive) {
    const dialysisGuidance = getDialysisGuidance(monograph, dialysis);
    addItem(items, {
      severity: "warn",
      title: "Dialysis-specific dosing",
      detail: dialysisGuidance
        ? `${dialysis}: ${dialysisGuidance.guidance}`
        : `This agent needs ${dialysis}-specific timing or interval review before final verification.`,
      calculatorLabel: "CrCl",
    });
  }

  if (weightBased && !patient.weight) {
    addItem(items, {
      severity: "info",
      title: "Weight missing",
      detail: "This agent uses weight-based dosing. Add actual body weight before verifying the regimen.",
      calculatorLabel: includesAny(monograph.id, ["vancomycin"]) ? "Vancomycin AUC" : includesAny(monograph.id, ["gentamicin", "tobramycin", "amikacin"]) ? "Aminoglycoside" : "IBW / AdjBW",
    });
  }

  if (weightBased && obesityLikely) {
    addItem(items, {
      severity: "info",
      title: "Weight scalar matters",
      detail: `AdjBW is ${adjbw} kg. Confirm whether this agent should use actual, ideal, or adjusted body weight in obesity.`,
      calculatorLabel: "IBW / AdjBW",
    });
  }

  if (patient.oralRoute === "none") {
    if (oralOnly) {
      addItem(items, {
        severity: "critical",
        title: "Oral route unavailable",
        detail: "This agent is oral-only in routine use here. Choose an IV or non-oral alternative until enteral access is reliable.",
      });
    } else if (monograph.ivToPoSwitch) {
      addItem(items, {
        severity: "info",
        title: "IV to PO not yet feasible",
        detail: "The oral route is currently unavailable, so continue IV therapy until gut access and absorption are reliable.",
      });
    }
  }

  if (patient.oralRoute === "limited") {
    if (oralOnly) {
      addItem(items, {
        severity: "warn",
        title: "Oral route reliability limited",
        detail: "This agent depends on enteral delivery. Confirm absorption and adherence before using it as the main plan.",
      });
    } else if (monograph.ivToPoSwitch) {
      addItem(items, {
        severity: "warn",
        title: "PO step-down needs a reliability check",
        detail: "This drug has a switch pathway, but oral delivery is only partly reliable right now. Confirm GI access before stepping down.",
      });
    }
  }

  if (patient.oralRoute === "adequate") {
    if (oralOnly) {
      addItem(items, {
        severity: "info",
        title: "PO-first fit",
        detail: monograph.ivToPoSwitch?.switchCriteria ?? "The oral route is available, so this oral-first agent is operationally feasible if the syndrome matches.",
      });
    } else if (monograph.ivToPoSwitch) {
      addItem(items, {
        severity: "info",
        title: "PO step-down candidate",
        detail: monograph.ivToPoSwitch.switchCriteria,
      });
    }
  }

  if (patient.enteralFeeds && enteralSensitive) {
    addItem(items, {
      severity: "warn",
      title: "Enteral feed interaction",
      detail: monograph.administration?.oralAbsorption ?? "This agent may need feed holds or cation separation to preserve oral exposure.",
    });
  }

  if (patient.qtRisk && qtSensitive) {
    const sentence = findSentence(searchText, ["qt", "torsades", "qtc"]);
    addItem(items, {
      severity: "warn",
      title: "QT risk present",
      detail: sentence
        ? `${sentence.charAt(0).toUpperCase()}${sentence.slice(1)}. Recheck ECG and electrolytes before relying on this agent.`
        : "This agent carries QT-prolongation risk. Recheck ECG and electrolytes before relying on this agent.",
    });
  }

  if (patient.serotonergicMeds && serotonergicSensitive) {
    addItem(items, {
      severity: includesAny(monograph.id, ["linezolid"]) ? "critical" : "warn",
      title: "Serotonergic interaction risk",
      detail: "This agent can interact with serotonergic medications. Confirm whether a washout, monitoring plan, or alternative is needed.",
    });
  }

  findMatchedInteractionActions(monograph.interactionActions, patient).forEach((match) => {
    addItem(items, {
      severity: getMatchedInteractionSeverity(match.action),
      title: `Active medication interaction: ${match.label}`,
      detail: `${match.action.effect} ${match.action.management}`.trim(),
    });
  });

  if ((patient.priorMrsa || patient.rapidDiagnosticResult === "mrsa") && !mrsaActive) {
    addItem(items, {
      severity: patient.rapidDiagnosticResult === "mrsa" ? "critical" : "warn",
      title: "MRSA activity may be needed",
      detail: "MRSA risk or a rapid MRSA signal is present. Confirm whether this drug has enough anti-MRSA activity for the active syndrome.",
    });
  }

  if ((patient.priorEsbl || patient.rapidDiagnosticResult === "esbl") && !esblReliable) {
    addItem(items, {
      severity: patient.rapidDiagnosticResult === "esbl" ? "critical" : "warn",
      title: "ESBL-directed therapy needed",
      detail: "ESBL risk or a rapid ESBL signal is present. Recheck whether this agent is reliable enough for continued therapy.",
    });
  }

  if ((patient.priorCre || patient.rapidDiagnosticResult === "kpc") && !kpcActive) {
    addItem(items, {
      severity: patient.rapidDiagnosticResult === "kpc" ? "critical" : "warn",
      title: "KPC-directed therapy needed",
      detail: "CRE or KPC risk is present. Confirm whether this monograph represents a KPC-active option before relying on it.",
    });
  }

  if (patient.rapidDiagnosticResult === "mbl" && !mblActive) {
    addItem(items, {
      severity: "critical",
      title: "MBL-directed therapy needed",
      detail: "An MBL signal is present. Avibactam monotherapy is not enough here, so reassess for cefiderocol or deliberate aztreonam pairing if appropriate.",
    });
  }

  if ((patient.priorDtrPseudomonas || patient.rapidDiagnosticResult === "dtr-pseudomonas") && !dtrPseudoActive) {
    addItem(items, {
      severity: patient.rapidDiagnosticResult === "dtr-pseudomonas" ? "critical" : "warn",
      title: "DTR Pseudomonas activity gap",
      detail: "Difficult-to-treat Pseudomonas risk is present. Confirm whether this agent still has a realistic chance of activity.",
    });
  }

  if (patient.cultureStatus === "final" && broadEmpiric) {
    addItem(items, {
      severity: "warn",
      title: "Culture final - narrowing review",
      detail: "Cultures are final. Reassess whether this broad-spectrum drug should be narrowed, stopped, or moved into a cleaner definitive role today.",
    });
  }

  if (patient.sourceControl === "pending" && (monograph.ivToPoSwitch || monograph.opatEligibility)) {
    addItem(items, {
      severity: "warn",
      title: "Source control pending",
      detail: "Source control is still pending, so antibiotic response and step-down decisions should be interpreted alongside drainage, debridement, or device management timing.",
    });
  }

  if (patient.sourceControl === "achieved" && (monograph.ivToPoSwitch || monograph.opatEligibility)) {
    addItem(items, {
      severity: "info",
      title: "Source control achieved",
      detail: "Source control is documented, so this is a good moment to recheck IV-to-PO timing, OPAT readiness, and the right duration anchor.",
    });
  }

  if (patient.bacteremiaConcern && lowSerumFit) {
    addItem(items, {
      severity: "critical",
      title: "Poor bloodstream fit",
      detail: "This agent has poor serum exposure for invasive bloodstream infection and is a poor fit while bacteremia is still a real concern.",
    });
  }

  if (patient.endovascularConcern && (lowSerumFit || oralOnly)) {
    addItem(items, {
      severity: "critical",
      title: "Poor endovascular fit",
      detail: "Endovascular infection concern is active. Favor bloodstream-active therapy and delay oral-only strategies until that workup is resolved.",
    });
  }

  if (patient.opatSupport && monograph.opatEligibility) {
    if (dialysis === "CRRT") {
      addItem(items, {
        severity: "critical",
        title: "CRRT is not routine OPAT",
        detail: "Continuous renal replacement usually requires inpatient-level monitoring, even when the drug itself has OPAT-friendly logistics.",
      });
    } else if (patient.opatSupport === "limited") {
      addItem(items, {
        severity: "warn",
        title: "OPAT logistics limited",
        detail: "Home infusion, line care, or follow-up support is limited. Favor the simplest monitored option or an inpatient bridge plan.",
      });
    } else if (monograph.opatEligibility.eligible === "no") {
      addItem(items, {
        severity: "warn",
        title: "Poor OPAT fit",
        detail: monograph.opatEligibility.monitoring,
      });
    } else if (monograph.opatEligibility.eligible === "conditional" || patient.opatSupport === "uncertain") {
      addItem(items, {
        severity: "warn",
        title: "Conditional OPAT fit",
        detail: monograph.opatEligibility.considerations?.join(" ") ?? monograph.opatEligibility.monitoring,
      });
    } else {
      addItem(items, {
        severity: "info",
        title: "Operational OPAT fit",
        detail: `${monograph.opatEligibility.administration} ${monograph.opatEligibility.monitoring}`.trim(),
      });
    }
  }

  const rank: Record<MonographPatientGuidanceItem["severity"], number> = { critical: 0, warn: 1, info: 2 };
  return items.sort((left, right) => rank[left.severity] - rank[right.severity]);
}
