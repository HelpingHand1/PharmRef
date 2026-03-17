import type {
  EmpiricOption,
  DrugMonograph,
  RegimenPlan,
  Subcategory,
  WorkflowBlock,
} from "../types";

export const PRIORITY_WORKFLOW_DISEASE_IDS = new Set([
  "cap",
  "hap-vap",
  "uti",
  "sepsis",
  "bacteremia-endocarditis",
  "iai",
  "ssti",
  "febrile-neutropenia",
]);

export const PRIORITY_STRUCTURED_MONOGRAPH_IDS = new Set([
  "vancomycin",
  "meropenem",
  "cefepime",
  "linezolid",
]);

export const PRIORITY_EXECUTION_MONOGRAPH_IDS = new Set([
  "amoxicillin",
  "ampicillin",
  "azithromycin",
  "aztreonam",
  "bezlotoxumab",
  "cefepime",
  "clindamycin",
  "vancomycin",
  "linezolid",
  "meropenem",
  "pip-tazo",
  "ceftriaxone",
  "cefazolin",
  "ciprofloxacin",
  "doxycycline",
  "levofloxacin",
  "tmp-smx",
  "nitrofurantoin",
  "metronidazole",
  "daptomycin",
  "rifampin",
  "ampicillin-sulbactam",
  "ampicillin-sulbactam-iai",
  "ertapenem",
  "nafcillin",
  "micafungin",
  "amphotericin-b",
  "liposomal-amphotericin-b",
  "fidaxomicin",
  "fosfomycin",
  "gentamicin",
  "ceftazidime-avibactam",
  "meropenem-vaborbactam",
  "cefiderocol",
  "ceftolozane-tazobactam",
  "imipenem-cilastatin-relebactam",
  "colistin",
  "fluconazole",
  "moxifloxacin",
  "posaconazole",
  "tedizolid",
  "vancomycin-oral",
  "voriconazole",
]);

export const PRIORITY_REGIMEN_PLAN_OPTION_KEYS = new Set([
  "cap/cap-icu/First-Line (ALWAYS Combination for Severe CAP)/ceftriaxone",
  "cap/cap-icu/Add-On for MRSA Risk Factors/vancomycin",
  "cap/cap-icu/Add-On for Pseudomonas Risk Factors/meropenem",
  "hap-vap/hap-mdr-risk/Empiric — Anti-Pseudomonal Beta-Lactam (choose one)/meropenem-mdr",
  "hap-vap/hap-mdr-risk/ADD MRSA Coverage (if risk factors present)/vancomycin",
  "uti/complicated-uti/First-Line — cUTI WITHOUT Sepsis/ceftriaxone",
  "uti/complicated-uti/First-Line — cUTI WITH Sepsis/meropenem",
  "uti/complicated-uti/IV-to-PO Step-Down (IDSA 2025 — Formally Endorsed)/iv-po-switch",
  "sepsis/septic-shock/Immediate Broad-Spectrum Empiric — Septic Shock (Within 1 Hour)/vanco-meropenem",
  "iai/ha-iai/Empiric — Post-Operative / Healthcare-Associated cIAI/pip-tazo-ha-iai",
  "iai/ha-iai/ADD Antifungal If Candida Risk Factors/fluconazole-iai",
  "febrile-neutropenia/high-risk-fn/Monotherapy — Antipseudomonal Beta-Lactam (IDSA 2010 First-Line, A-I)/cefepime",
  "febrile-neutropenia/high-risk-fn/ADD Vancomycin — Only If Specific Indications Present (IDSA 2010, A-I)/vancomycin-fn",
  "bacteremia-endocarditis/sab-workup/Empiric — Pending Susceptibilities/vancomycin",
  "bacteremia-endocarditis/sab-workup/MSSA Definitive Therapy/cefazolin",
  "bacteremia-endocarditis/sab-workup/MRSA Definitive Therapy/daptomycin",
  "bacteremia-endocarditis/gram-negative-bacteremia/Empiric — Community-Acquired, Low Resistance Risk/ceftriaxone",
  "bacteremia-endocarditis/gram-negative-bacteremia/Empiric — Healthcare-Associated or MDR Risk Factors/meropenem",
]);

export const WORKFLOW_FIELD_CONFIG = [
  { key: "diagnosticWorkup", id: "workflow-diagnostics", label: "Before Antibiotics", icon: "🧪", accentColor: "#38bdf8" },
  { key: "severitySignals", id: "workflow-diagnostics", label: "Severity Signals", icon: "🚨", accentColor: "#ef4444" },
  { key: "mdroRiskFactors", id: "workflow-diagnostics", label: "MDRO Risk Gates", icon: "🛡", accentColor: "#a78bfa" },
  { key: "sourceControl", id: "workflow-reassessment", label: "Source Control", icon: "🩹", accentColor: "#34d399" },
  { key: "deEscalation", id: "workflow-reassessment", label: "48-72h Reassessment", icon: "🔄", accentColor: "#f59e0b" },
  { key: "failureEscalation", id: "workflow-reassessment", label: "Failure / Escalation", icon: "📈", accentColor: "#ef4444" },
  { key: "consultTriggers", id: "workflow-reassessment", label: "Consult Triggers", icon: "📞", accentColor: "#0284c7" },
  { key: "ivToPoPlan", id: "workflow-transition", label: "IV-to-PO / Discharge", icon: "💊", accentColor: "#34d399" },
  { key: "durationAnchor", id: "workflow-transition", label: "Duration Anchor", icon: "⏱", accentColor: "#fbbf24" },
] as const;

export type WorkflowFieldKey = (typeof WORKFLOW_FIELD_CONFIG)[number]["key"];

export function getWorkflowBlock(subcategory: Subcategory, key: WorkflowFieldKey): WorkflowBlock | undefined {
  return subcategory[key];
}

export function hasWorkflowBlockContent(block?: WorkflowBlock | null) {
  if (!block) return false;
  if (block.status === "not_applicable") return true;
  return Boolean(block.summary?.trim() || block.bullets?.some((bullet) => bullet.trim()));
}

export function flattenWorkflowBlock(block?: WorkflowBlock | null): string[] {
  if (!block) return [];
  return [block.summary ?? "", ...(block.bullets ?? []), block.status === "not_applicable" ? "not applicable" : ""]
    .map((value) => value.trim())
    .filter(Boolean);
}

export function getSubcategoryWorkflowEntries(subcategory: Subcategory) {
  return WORKFLOW_FIELD_CONFIG
    .map((config) => ({
      ...config,
      block: getWorkflowBlock(subcategory, config.key),
    }))
    .filter((entry) => hasWorkflowBlockContent(entry.block));
}

export function getEmpiricOptionContentKey(option: Pick<EmpiricOption, "drug" | "monographId" | "regimen">) {
  return option.drug?.trim() || option.monographId?.trim() || option.regimen.trim();
}

export function getPriorityRegimenPlanKey(
  diseaseId: string,
  subcategoryId: string,
  line: string,
  option: Pick<EmpiricOption, "drug" | "monographId" | "regimen">,
) {
  return `${diseaseId}/${subcategoryId}/${line}/${getEmpiricOptionContentKey(option)}`;
}

export function flattenRegimenPlan(plan?: RegimenPlan | null): string[] {
  if (!plan) return [];
  return [
    plan.regimen,
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
    ...(plan.linkedMonographIds ?? []),
  ]
    .map((value) => value.trim())
    .filter(Boolean);
}

export function flattenSubcategoryStewardshipText(subcategory: Subcategory): string[] {
  return getSubcategoryWorkflowEntries(subcategory).flatMap((entry) => [entry.label, ...flattenWorkflowBlock(entry.block)]);
}

export function flattenMonographStructuredText(monograph: DrugMonograph): string[] {
  return [
    ...(monograph.ivToPoSwitch
      ? [
          monograph.ivToPoSwitch.poBioavailability,
          monograph.ivToPoSwitch.switchCriteria,
          monograph.ivToPoSwitch.note ?? "",
        ]
      : []),
    ...(monograph.opatEligibility
      ? [
          monograph.opatEligibility.eligible,
          monograph.opatEligibility.administration,
          monograph.opatEligibility.monitoring,
          ...(monograph.opatEligibility.considerations ?? []),
        ]
      : []),
    ...(monograph.dosingByIndication?.flatMap((entry) => [entry.label, entry.regimen, entry.notes ?? ""]) ?? []),
    ...(monograph.renalReplacement?.flatMap((entry) => [entry.modality, entry.guidance]) ?? []),
    ...(monograph.specialPopulations?.flatMap((entry) => [entry.population, entry.guidance]) ?? []),
    ...(monograph.therapeuticDrugMonitoring
      ? [
          monograph.therapeuticDrugMonitoring.target,
          monograph.therapeuticDrugMonitoring.sampling,
          monograph.therapeuticDrugMonitoring.adjustment,
          ...(monograph.therapeuticDrugMonitoring.pearls ?? []),
        ]
      : []),
    ...(monograph.administration
      ? [
          monograph.administration.infusion ?? "",
          monograph.administration.compatibility ?? "",
          monograph.administration.stability ?? "",
          monograph.administration.oralAbsorption ?? "",
          monograph.administration.note ?? "",
        ]
      : []),
    ...(monograph.penetration?.flatMap((entry) => [entry.site, entry.detail]) ?? []),
    ...(monograph.tissuePenetration
      ? Object.entries(monograph.tissuePenetration).flatMap(([key, value]) => [key, value ?? ""])
      : []),
    ...(monograph.interactionActions?.flatMap((entry) => [entry.interactingAgent, entry.effect, entry.management, entry.severity ?? ""]) ?? []),
    ...(monograph.stewardshipUseCases?.flatMap((entry) => [entry.scenario, entry.role, entry.notes ?? ""]) ?? []),
  ]
    .map((value) => value.trim())
    .filter(Boolean);
}

export function getPreferredRegimenText(regimen: string, plan?: RegimenPlan | null) {
  return plan?.regimen?.trim() || regimen;
}

export function getPreferredRegimenNotes(notes?: string, plan?: RegimenPlan | null) {
  return plan?.rationale?.trim() || notes;
}
