import type { InteractionAction, PatientContext } from "../types";

export interface MatchedInteractionAction {
  action: InteractionAction;
  matchedMedications: string[];
  label: string;
}

interface MedicationAliasGroup {
  label: string;
  triggerKeywords: string[];
  aliases: string[];
}

const MEDICATION_ALIAS_GROUPS: MedicationAliasGroup[] = [
  { label: "Warfarin", triggerKeywords: ["warfarin"], aliases: ["warfarin", "coumadin", "jantoven"] },
  {
    label: "ACE inhibitors / ARBs / spironolactone",
    triggerKeywords: ["ace inhibitors", "ace inhibitor", "arbs", "arb", "spironolactone"],
    aliases: [
      "lisinopril",
      "enalapril",
      "ramipril",
      "benazepril",
      "losartan",
      "valsartan",
      "irbesartan",
      "candesartan",
      "olmesartan",
      "spironolactone",
      "eplerenone",
    ],
  },
  { label: "Methotrexate", triggerKeywords: ["methotrexate"], aliases: ["methotrexate"] },
  {
    label: "Cations / antacids / feeds",
    triggerKeywords: ["calcium", "iron", "magnesium", "antacids", "antacid", "enteral feeds", "tube feeds"],
    aliases: [
      "calcium",
      "tums",
      "iron",
      "ferrous",
      "ferric",
      "magnesium",
      "mag oxide",
      "maalox",
      "mylanta",
      "gaviscon",
      "tube feed",
      "tube feeds",
      "enteral",
      "jevity",
      "osmolite",
    ],
  },
  { label: "Tizanidine", triggerKeywords: ["tizanidine"], aliases: ["tizanidine"] },
  {
    label: "QT-prolonging drugs",
    triggerKeywords: ["qt-prolonging", "qt prolonging", "qt"],
    aliases: [
      "amiodarone",
      "sotalol",
      "dofetilide",
      "quinidine",
      "haloperidol",
      "ziprasidone",
      "quetiapine",
      "ondansetron",
      "methadone",
      "citalopram",
      "escitalopram",
      "chlorpromazine",
    ],
  },
  {
    label: "Insulin / sulfonylureas",
    triggerKeywords: ["insulin", "sulfonylureas", "sulfonylurea"],
    aliases: ["insulin", "glipizide", "glyburide", "glimepiride"],
  },
  {
    label: "Statins",
    triggerKeywords: ["statins", "statin"],
    aliases: ["atorvastatin", "simvastatin", "lovastatin", "rosuvastatin", "pravastatin", "pitavastatin", "fluvastatin"],
  },
  { label: "Alcohol / disulfiram", triggerKeywords: ["alcohol", "disulfiram"], aliases: ["alcohol", "ethanol", "disulfiram"] },
  { label: "Methadone", triggerKeywords: ["methadone"], aliases: ["methadone"] },
  {
    label: "Oral contraceptives",
    triggerKeywords: ["oral contraceptives", "contraceptives", "contraceptive"],
    aliases: ["ethinyl estradiol", "levonorgestrel", "norethindrone", "desogestrel", "drospirenone", "birth control"],
  },
  {
    label: "Calcineurin inhibitors",
    triggerKeywords: ["calcineurin inhibitors", "calcineurin inhibitor", "tacrolimus", "cyclosporine"],
    aliases: ["tacrolimus", "cyclosporine", "cyclosporin"],
  },
  {
    label: "Azoles",
    triggerKeywords: ["azoles", "azole"],
    aliases: ["fluconazole", "voriconazole", "posaconazole", "itraconazole", "isavuconazole"],
  },
  {
    label: "Rifampin / enzyme inducers",
    triggerKeywords: ["rifampin", "rifampicin", "enzyme inducers", "enzyme inducer"],
    aliases: ["rifampin", "rifampicin", "carbamazepine", "phenytoin", "phenobarbital"],
  },
  { label: "Vancomycin", triggerKeywords: ["vancomycin"], aliases: ["vancomycin"] },
  {
    label: "Aminoglycosides",
    triggerKeywords: ["aminoglycosides", "aminoglycoside"],
    aliases: ["gentamicin", "tobramycin", "amikacin"],
  },
  { label: "Allopurinol", triggerKeywords: ["allopurinol"], aliases: ["allopurinol"] },
  { label: "Valproic acid", triggerKeywords: ["valproic acid", "valproate"], aliases: ["valproic acid", "valproate", "divalproex"] },
  { label: "Sirolimus", triggerKeywords: ["sirolimus"], aliases: ["sirolimus"] },
  { label: "Nifedipine", triggerKeywords: ["nifedipine"], aliases: ["nifedipine"] },
  { label: "Digoxin", triggerKeywords: ["digoxin"], aliases: ["digoxin"] },
  {
    label: "Loop diuretics",
    triggerKeywords: ["loop diuretics", "loop diuretic"],
    aliases: ["furosemide", "bumetanide", "torsemide", "ethacrynic acid"],
  },
  {
    label: "Nephrotoxins",
    triggerKeywords: ["nephrotoxins", "nephrotoxin", "iv contrast"],
    aliases: ["tacrolimus", "vancomycin", "gentamicin", "tobramycin", "amikacin", "amphotericin", "contrast"],
  },
  { label: "Aztreonam", triggerKeywords: ["aztreonam"], aliases: ["aztreonam"] },
  { label: "Ganciclovir", triggerKeywords: ["ganciclovir"], aliases: ["ganciclovir", "valganciclovir"] },
  {
    label: "Neuromuscular blockers",
    triggerKeywords: ["neuromuscular blocking agents", "neuromuscular blockers", "neuromuscular blocking"],
    aliases: ["vecuronium", "rocuronium", "cisatracurium", "succinylcholine"],
  },
  { label: "Metoclopramide", triggerKeywords: ["metoclopramide"], aliases: ["metoclopramide", "reglan"] },
  {
    label: "Laxatives / bowel regimens",
    triggerKeywords: ["laxative", "laxatives", "bowel regimens", "bowel regimen"],
    aliases: ["senna", "bisacodyl", "polyethylene glycol", "miralax", "lactulose", "milk of magnesia"],
  },
  {
    label: "Cholestyramine / colestipol",
    triggerKeywords: ["cholestyramine", "colestipol"],
    aliases: ["cholestyramine", "colestipol"],
  },
  {
    label: "P-glycoprotein inhibitors",
    triggerKeywords: ["p-glycoprotein inhibitors", "p glycoprotein inhibitors", "p-gp"],
    aliases: ["cyclosporine", "verapamil", "amiodarone", "dronedarone", "clarithromycin"],
  },
  {
    label: "Concurrent CDI antibiotics",
    triggerKeywords: ["concurrent cdi antibiotics", "cdi antibiotics"],
    aliases: ["metronidazole", "fidaxomicin", "oral vancomycin", "vancomycin oral"],
  },
  {
    label: "Serotonergic drugs",
    triggerKeywords: ["serotonergic drugs", "serotonergic agents", "serotonergic"],
    aliases: ["sertraline", "fluoxetine", "paroxetine", "citalopram", "escitalopram", "venlafaxine", "duloxetine", "trazodone", "buspirone", "tramadol", "methadone"],
  },
];

const GENERIC_SEGMENTS = new Set([
  "agents",
  "agent",
  "drugs",
  "drug",
  "other",
  "concurrent",
  "strong",
  "sensitive",
  "heavy",
  "active",
  "medications",
  "medication",
  "such as",
]);

function unique<T>(values: T[]) {
  return [...new Set(values)];
}

export function normalizeMedicationText(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function parseActiveMedicationsInput(value: string) {
  return unique(
    value
      .split(/[\n,]/)
      .map((entry) => entry.trim())
      .filter(Boolean),
  );
}

export function serializeActiveMedicationsInput(values?: string[]) {
  return (values ?? []).join("\n");
}

export function summarizeActiveMedications(values?: string[], limit = 3) {
  const meds = (values ?? []).map((entry) => entry.trim()).filter(Boolean);
  const shown = meds.slice(0, limit);
  const remaining = meds.length - shown.length;
  return [...shown, remaining > 0 ? `+${remaining} more` : ""].filter(Boolean).join(" | ");
}

function buildInteractionSegments(interactingAgent: string) {
  return unique(
    normalizeMedicationText(interactingAgent)
      .split(/\bor\b|\band\b|,|\/|;/)
      .map((entry) => entry.trim())
      .filter((entry) => entry.length >= 4 && !GENERIC_SEGMENTS.has(entry)),
  );
}

function includesAliasMatch(agentText: string, medication: string) {
  return MEDICATION_ALIAS_GROUPS.some((group) => {
    if (!group.triggerKeywords.some((keyword) => agentText.includes(keyword))) {
      return false;
    }
    return group.aliases.some((alias) => medication.includes(alias));
  });
}

function buildMatchedMedications(
  action: InteractionAction,
  patient: PatientContext,
) {
  const medications = unique(
    (patient.activeMedications ?? [])
      .map((entry) => entry.trim())
      .filter(Boolean),
  );

  if (!medications.length) {
    return [];
  }

  const normalizedAgent = normalizeMedicationText(action.interactingAgent);
  const segments = buildInteractionSegments(action.interactingAgent);

  return medications.filter((entry) => {
    const normalizedEntry = normalizeMedicationText(entry);

    if (normalizedAgent && (normalizedAgent.includes(normalizedEntry) || normalizedEntry.includes(normalizedAgent))) {
      return true;
    }

    if (segments.some((segment) => normalizedEntry.includes(segment) || segment.includes(normalizedEntry))) {
      return true;
    }

    return includesAliasMatch(normalizedAgent, normalizedEntry);
  });
}

function formatMatchLabel(action: InteractionAction, matchedMedications: string[]) {
  if (matchedMedications.length === 1) {
    return `${matchedMedications[0]} matched`;
  }
  if (matchedMedications.length > 1) {
    return `${matchedMedications.slice(0, 2).join(" + ")}${matchedMedications.length > 2 ? ` +${matchedMedications.length - 2}` : ""}`;
  }
  return action.interactingAgent;
}

export function findMatchedInteractionActions(
  actions: InteractionAction[] | undefined,
  patient: PatientContext,
) {
  if (!actions?.length) {
    return [];
  }

  return actions
    .map((action) => {
      const matchedMedications = buildMatchedMedications(action, patient);
      if (!matchedMedications.length) {
        return null;
      }
      return {
        action,
        matchedMedications,
        label: formatMatchLabel(action, matchedMedications),
      } satisfies MatchedInteractionAction;
    })
    .filter((entry): entry is MatchedInteractionAction => Boolean(entry));
}

export function getMatchedInteractionSeverity(action: InteractionAction) {
  const text = normalizeMedicationText(`${action.effect} ${action.management}`);
  if (
    text.includes("contraindicated") ||
    text.includes("avoid the combination") ||
    text.includes("avoid co administration") ||
    text.includes("pick another antibiotic") ||
    text.includes("avoid the combination whenever possible")
  ) {
    return "critical" as const;
  }

  if (action.severity === "major" || action.severity === "moderate") {
    return "warn" as const;
  }

  return "info" as const;
}
