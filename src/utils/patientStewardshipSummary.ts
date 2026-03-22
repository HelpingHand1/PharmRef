import type { PatientContext } from "../types";
import { summarizeActiveMedications } from "./patientMedicationInteractions";

export interface PatientStewardshipFocus {
  severity: "critical" | "warn" | "info";
  title: string;
  detail: string;
}

function addFocus(
  items: PatientStewardshipFocus[],
  next: PatientStewardshipFocus,
) {
  if (items.some((item) => item.title === next.title && item.detail === next.detail)) {
    return;
  }
  items.push(next);
}

function formatRapidDiagnostic(value: NonNullable<PatientContext["rapidDiagnosticResult"]>) {
  switch (value) {
    case "mrsa":
      return "MRSA";
    case "mssa":
      return "MSSA";
    case "esbl":
      return "ESBL";
    case "kpc":
      return "KPC";
    case "mbl":
      return "MBL";
    case "dtr-pseudomonas":
      return "DTR Pseudomonas";
    case "none":
    default:
      return "none";
  }
}

export function buildPatientContextTags(patient: PatientContext, crcl: number | null) {
  const tags: string[] = [];
  if (patient.age) tags.push(`Age ${patient.age}`);
  if (patient.sex === "male") tags.push("Male");
  if (patient.sex === "female") tags.push("Female");
  if (patient.height) tags.push(`${patient.height} cm`);
  if (patient.scr) tags.push(`SCr ${patient.scr} mg/dL`);
  if (crcl !== null) tags.push(`CrCl ${crcl} mL/min`);
  if (patient.dialysis && patient.dialysis !== "none") tags.push(patient.dialysis);
  if (patient.pregnant) tags.push("Pregnant");
  if (patient.weight) tags.push(`${patient.weight} kg`);
  if (patient.oralRoute === "adequate") tags.push("PO route adequate");
  if (patient.oralRoute === "limited") tags.push("PO route limited");
  if (patient.oralRoute === "none") tags.push("No PO route");
  if (patient.enteralFeeds) tags.push("Enteral feeds");
  if (patient.qtRisk) tags.push("QT risk");
  if (patient.serotonergicMeds) tags.push("Serotonergic meds");
  if (patient.opatSupport === "adequate") tags.push("OPAT support ready");
  if (patient.opatSupport === "uncertain") tags.push("OPAT support uncertain");
  if (patient.opatSupport === "limited") tags.push("OPAT support limited");
  if (patient.recentHospitalization) tags.push("Recent hospitalization");
  if (patient.recentIvAntibiotics) tags.push("Recent IV antibiotics");
  if (patient.priorMrsa) tags.push("Prior MRSA");
  if (patient.priorEsbl) tags.push("Prior ESBL");
  if (patient.priorCre) tags.push("Prior CRE");
  if (patient.priorDtrPseudomonas) tags.push("Prior DTR Pseudomonas");
  if (patient.mrsaNares === "negative") tags.push("MRSA nares negative");
  if (patient.mrsaNares === "positive") tags.push("MRSA nares positive");
  if (patient.mrsaNares === "pending") tags.push("MRSA nares pending");
  if (patient.cultureStatus === "not_sent") tags.push("Cultures not sent");
  if (patient.cultureStatus === "pending") tags.push("Cultures pending");
  if (patient.cultureStatus === "final") tags.push("Cultures final");
  if (patient.rapidDiagnosticResult) tags.push(`Rapid dx: ${formatRapidDiagnostic(patient.rapidDiagnosticResult)}`);
  if (patient.sourceControl === "achieved") tags.push("Source control achieved");
  if (patient.sourceControl === "pending") tags.push("Source control pending");
  if (patient.sourceControl === "not_applicable") tags.push("Source control N/A");
  if (patient.bacteremiaConcern) tags.push("Bacteremia concern");
  if (patient.endovascularConcern) tags.push("Endovascular concern");
  if (patient.immunocompromised) tags.push("Immunocompromised");
  if (patient.neutropenic) tags.push("Neutropenic");
  if (patient.transplant) tags.push("Transplant");
  if (patient.icuLevelCare) tags.push("ICU-level care");
  if (patient.vasopressors) tags.push("On vasopressors");
  if (patient.cultureCollectedOn) tags.push(`Cultures ${patient.cultureCollectedOn}`);
  if (patient.finalCultureOn) tags.push(`Final cx ${patient.finalCultureOn}`);
  if (patient.sourceControlOn) tags.push(`Source control ${patient.sourceControlOn}`);
  if (patient.activeMedications?.length) {
    tags.push(`Meds: ${summarizeActiveMedications(patient.activeMedications, 2)}`);
  }
  return tags;
}

export function getPatientReassessmentFocus(patient: PatientContext) {
  const items: PatientStewardshipFocus[] = [];

  if (patient.recentHospitalization || patient.recentIvAntibiotics) {
    addFocus(items, {
      severity: "warn",
      title: "Recent healthcare exposure",
      detail: "Recent hospitalization or IV antibiotics raises MDR pressure. Recheck empiric breadth against local epidemiology and prior cultures.",
    });
  }

  if (patient.priorMrsa) {
    addFocus(items, {
      severity: "warn",
      title: "Prior MRSA history",
      detail: "Prior MRSA increases the threshold for dropping anti-MRSA coverage until the current syndrome, cultures, and response are clearer.",
    });
  }

  if (patient.priorEsbl) {
    addFocus(items, {
      severity: "warn",
      title: "Prior ESBL history",
      detail: "Prior ESBL history should slow de-escalation to non-ESBL-reliable beta-lactams until the current isolate and syndrome support it.",
    });
  }

  if (patient.priorCre) {
    addFocus(items, {
      severity: "critical",
      title: "Prior CRE history",
      detail: "Prior CRE makes premature narrowing risky. Confirm current carbapenemase data and reserve-agent fit before stepping down.",
    });
  }

  if (patient.priorDtrPseudomonas) {
    addFocus(items, {
      severity: "warn",
      title: "Prior DTR Pseudomonas history",
      detail: "Prior difficult-to-treat Pseudomonas should keep antipseudomonal activity on the radar until current cultures clearly support narrowing.",
    });
  }

  if (patient.mrsaNares === "negative") {
    addFocus(items, {
      severity: "info",
      title: "MRSA nares supports de-escalation",
      detail: "Negative MRSA nares makes ongoing anti-MRSA pneumonia coverage a strong reassessment question when lower-respiratory infection is the working syndrome.",
    });
  }

  if (patient.mrsaNares === "positive") {
    addFocus(items, {
      severity: "warn",
      title: "MRSA nares is positive",
      detail: "Positive MRSA nares raises pretest probability but does not prove invasive disease. Pair it with syndrome severity and culture data.",
    });
  }

  if (patient.mrsaNares === "pending") {
    addFocus(items, {
      severity: "info",
      title: "MRSA nares still pending",
      detail: "Pending nares screening can help decide whether ongoing empiric anti-MRSA therapy is still justified once the result returns.",
    });
  }

  if (patient.cultureStatus === "not_sent") {
    addFocus(items, {
      severity: "warn",
      title: "Cultures were not sent",
      detail: "Definitive narrowing data may be limited. Reassessment will depend more heavily on source control, syndrome response, and non-culture diagnostics.",
    });
  }

  if (patient.cultureStatus === "pending") {
    addFocus(items, {
      severity: "info",
      title: "Culture review still pending",
      detail: "A formal 48 to 72 hour timeout is still due once cultures finalize and early clinical response is clearer.",
    });
  }

  if (patient.cultureStatus === "final") {
    addFocus(items, {
      severity: "warn",
      title: "Cultures are final",
      detail: "Today is the right moment to narrow, stop duplicate coverage, and lock a duration anchor rather than leaving empiric therapy in place.",
    });
  }

  if (patient.rapidDiagnosticResult === "mrsa") {
    addFocus(items, {
      severity: "critical",
      title: "Rapid diagnostic MRSA signal",
      detail: "Ensure active anti-MRSA therapy is on board while cultures and syndrome-level confirmation continue.",
    });
  }

  if (patient.rapidDiagnosticResult === "mssa") {
    addFocus(items, {
      severity: "warn",
      title: "Rapid diagnostic MSSA signal",
      detail: "If syndrome and allergy history allow it, reassess whether an anti-staphylococcal beta-lactam should replace broader MRSA-directed therapy.",
    });
  }

  if (patient.rapidDiagnosticResult === "esbl") {
    addFocus(items, {
      severity: "critical",
      title: "Rapid diagnostic ESBL signal",
      detail: "Use ESBL-reliable therapy and do not anchor on non-ESBL beta-lactams while final susceptibility data are pending.",
    });
  }

  if (patient.rapidDiagnosticResult === "kpc") {
    addFocus(items, {
      severity: "critical",
      title: "Rapid diagnostic KPC signal",
      detail: "Prioritize a KPC-active agent now and verify that the chosen regimen matches local formulary policy and syndrome penetration needs.",
    });
  }

  if (patient.rapidDiagnosticResult === "mbl") {
    addFocus(items, {
      severity: "critical",
      title: "Rapid diagnostic MBL signal",
      detail: "Avoid avibactam monotherapy here. Reassess immediately for cefiderocol or a deliberate aztreonam-based pairing strategy.",
    });
  }

  if (patient.rapidDiagnosticResult === "dtr-pseudomonas") {
    addFocus(items, {
      severity: "critical",
      title: "Rapid diagnostic DTR Pseudomonas signal",
      detail: "Recheck whether the current regimen has realistic activity against difficult-to-treat Pseudomonas before continuing routine antipseudomonal therapy.",
    });
  }

  if (patient.sourceControl === "pending") {
    addFocus(items, {
      severity: "critical",
      title: "Source control still pending",
      detail: "Drainage, debridement, decompression, or device removal may be the main reason the patient is not improving yet. Tie antibiotic changes to that timeline.",
    });
  }

  if (patient.sourceControl === "achieved") {
    addFocus(items, {
      severity: "info",
      title: "Source control achieved",
      detail: "Now is a good time to review IV-to-PO transition, OPAT readiness, and the correct duration anchor instead of leaving the plan on autopilot.",
    });
  }

  if (patient.bacteremiaConcern) {
    addFocus(items, {
      severity: "warn",
      title: "Bacteremia concern remains active",
      detail: "Favor bloodstream-active therapy, verify repeat cultures when relevant, and be cautious about low-serum oral-only options.",
    });
  }

  if (patient.endovascularConcern) {
    addFocus(items, {
      severity: "critical",
      title: "Endovascular infection concern",
      detail: "Delay oral-only step-down and confirm that the current regimen is appropriate for endovascular disease until that workup is settled.",
    });
  }

  if (patient.immunocompromised || patient.transplant) {
    addFocus(items, {
      severity: "warn",
      title: "Host immunocompromise",
      detail: "Be slower to shorten, narrow, or convert to oral therapy until source control and microbiology are unusually clear.",
    });
  }

  if (patient.neutropenic) {
    addFocus(items, {
      severity: "critical",
      title: "Neutropenia keeps thresholds high",
      detail: "De-escalation and oral transition should stay conservative until the microbiology, host recovery, and syndrome trajectory all make sense together.",
    });
  }

  if (patient.vasopressors || patient.icuLevelCare) {
    addFocus(items, {
      severity: "warn",
      title: "Critical illness still active",
      detail: "While ICU-level instability or vasopressor support is present, use a higher bar for narrowing and keep PK/PD execution tight.",
    });
  }

  const rank: Record<PatientStewardshipFocus["severity"], number> = { critical: 0, warn: 1, info: 2 };
  return items.sort((left, right) => rank[left.severity] - rank[right.severity]);
}
