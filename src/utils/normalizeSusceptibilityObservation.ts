import type {
  NormalizedCombinationObservation,
  NormalizedSusceptibilityObservation,
  SusceptibilityComparator,
  SusceptibilityCombinationTestMethod,
  SusceptibilityInterpretation,
} from "../types";

interface AgentAlias {
  id: string;
  label: string;
  patterns: RegExp[];
}

interface CombinationAlias {
  id: string;
  label: string;
  memberAgentIds: string[];
  patterns: RegExp[];
}

const AGENT_ALIASES: AgentAlias[] = [
  {
    id: "ceftazidime-avibactam",
    label: "Ceftazidime-avibactam",
    patterns: [/\bcaz[ -]?avi\b/i, /\bceftazidime[ /-]?avibactam\b/i],
  },
  {
    id: "ceftolozane-tazobactam",
    label: "Ceftolozane-tazobactam",
    patterns: [/\bc\/?t\b/i, /\bceftolozane[ /-]?tazobactam\b/i],
  },
  {
    id: "imipenem-cilastatin-relebactam",
    label: "Imipenem-cilastatin-relebactam",
    patterns: [/\bimi[ -]?rele\b/i, /\bimipenem(?:[ /-]cilastatin)?[ /-]?relebactam\b/i],
  },
  {
    id: "meropenem-vaborbactam",
    label: "Meropenem-vaborbactam",
    patterns: [/\bmer[ -]?vab\b/i, /\bmeropenem[ /-]?vaborbactam\b/i],
  },
  {
    id: "pip-tazo",
    label: "Piperacillin-tazobactam",
    patterns: [/\bpip[ -]?tazo\b/i, /\bpiperacillin(?:[ /-]| and )tazobactam\b/i],
  },
  {
    id: "cefiderocol",
    label: "Cefiderocol",
    patterns: [/\bcefiderocol\b/i],
  },
  {
    id: "cefepime",
    label: "Cefepime",
    patterns: [/\bcefepime\b/i],
  },
  {
    id: "meropenem",
    label: "Meropenem",
    patterns: [/\bmeropenem\b/i, /\bmero\b/i],
  },
  {
    id: "aztreonam",
    label: "Aztreonam",
    patterns: [/\baztreonam\b/i, /\bazt\b/i],
  },
  {
    id: "vancomycin",
    label: "Vancomycin",
    patterns: [/\bvancomycin\b/i, /\bvanc\b/i],
  },
  {
    id: "daptomycin",
    label: "Daptomycin",
    patterns: [/\bdaptomycin\b/i, /\bdapto\b/i],
  },
  {
    id: "linezolid",
    label: "Linezolid",
    patterns: [/\blinezolid\b/i],
  },
  {
    id: "nitrofurantoin",
    label: "Nitrofurantoin",
    patterns: [/\bnitrofurantoin\b/i],
  },
];

export const SUSCEPTIBILITY_AGENT_OPTIONS = AGENT_ALIASES.map(({ id, label }) => ({
  id,
  label,
}));

const COMBINATION_ALIASES: CombinationAlias[] = [
  {
    id: "caz-avi-aztreonam",
    label: "Ceftazidime-avibactam + aztreonam",
    memberAgentIds: ["ceftazidime-avibactam", "aztreonam"],
    patterns: [
      /\b(?:caz[ -]?avi|ceftazidime[ /-]?avibactam)\b.*(?:\+|plus|with).*\b(?:aztreonam|azt)\b/i,
      /\b(?:aztreonam|azt)\b.*(?:\+|plus|with).*\b(?:caz[ -]?avi|ceftazidime[ /-]?avibactam)\b/i,
    ],
  },
];

export const SUSCEPTIBILITY_COMBINATION_OPTIONS = COMBINATION_ALIASES.map(({ id, label }) => ({
  id,
  label,
}));

const KEYWORD_PATTERNS = [
  { keyword: "restored", pattern: /\brestored\b|\bseesaw\b|\bsee[- ]?saw\b/i },
  { keyword: "borderline", pattern: /\bborderline\b|\bcreep(?:ing)?\b|\belevated\b/i },
  { keyword: "kpc-mutation", pattern: /\bomega[- ]?loop\b|\bd179y\b|\bt243m\b/i },
  { keyword: "broth-microdilution", pattern: /\bbroth microdilution\b|\bbmd\b/i },
];

function normalizeUnits(raw: string) {
  if (/\b(?:mcg\/ml|ug\/ml|µg\/ml)\b/i.test(raw)) {
    return "mcg/mL" as const;
  }
  if (/\bmg\/l\b/i.test(raw)) {
    return "mg/L" as const;
  }
  return undefined;
}

function normalizeReportedInterpretation(raw: string): SusceptibilityInterpretation | undefined {
  if (/\bsusceptible dose[- ]dependent\b|\bsdd\b/i.test(raw)) {
    return "sdd";
  }
  if (/\bresistant\b|\bnonsusceptible\b|\bnon-susceptible\b/i.test(raw)) {
    return "resistant";
  }
  if (/\bintermediate\b/i.test(raw)) {
    return "intermediate";
  }
  if (/\bsusceptible\b/i.test(raw)) {
    return "susceptible";
  }
  if (/\bunknown\b|\bpending\b/i.test(raw)) {
    return "unknown";
  }
  return undefined;
}

function normalizeCombinationTestMethod(raw: string): SusceptibilityCombinationTestMethod | undefined {
  if (/\bbroth disk elution\b|\bbde\b/i.test(raw)) {
    return "bde";
  }
  if (/\bcombo(?:ination)? (?:testing|ast|support)\b|\bsynergy\b/i.test(raw)) {
    return "local-combo";
  }
  if (/\bpaired\b|\bsimultaneous(?:ly)?\b|\bco-?infus/i.test(raw)) {
    return "reported-pair";
  }
  return undefined;
}

function findMatchedAgent(raw: string) {
  let bestMatch:
    | {
        alias: AgentAlias;
        index: number;
        matchLength: number;
      }
    | undefined;

  AGENT_ALIASES.forEach((alias) => {
    alias.patterns.forEach((pattern) => {
      const match = pattern.exec(raw);
      if (!match || match.index === undefined) {
        return;
      }
      if (
        !bestMatch ||
        match.index < bestMatch.index ||
        (match.index === bestMatch.index && match[0].length > bestMatch.matchLength)
      ) {
        bestMatch = { alias, index: match.index, matchLength: match[0].length };
      }
    });
  });

  return bestMatch;
}

function findMatchedCombination(raw: string) {
  let bestMatch:
    | {
        alias: CombinationAlias;
        index: number;
        matchLength: number;
      }
    | undefined;

  COMBINATION_ALIASES.forEach((alias) => {
    alias.patterns.forEach((pattern) => {
      const match = pattern.exec(raw);
      if (!match || match.index === undefined) {
        return;
      }
      if (
        !bestMatch ||
        match.index < bestMatch.index ||
        (match.index === bestMatch.index && match[0].length > bestMatch.matchLength)
      ) {
        bestMatch = { alias, index: match.index, matchLength: match[0].length };
      }
    });
  });

  return bestMatch;
}

function parseComparatorAndValue(raw: string, agentIndex?: number, agentMatchLength?: number) {
  const micMatch = /\bmic\b\s*(<=|>=|<|>|=)?\s*(\d+(?:\.\d+)?)/i.exec(raw);
  if (micMatch) {
    return {
      comparator: (micMatch[1] as SusceptibilityComparator | undefined) ?? "=",
      value: Number(micMatch[2]),
    };
  }

  if (agentIndex === undefined || agentMatchLength === undefined) {
    return null;
  }

  const afterAgent = raw.slice(agentIndex + agentMatchLength, agentIndex + agentMatchLength + 24);
  const directValueMatch = /(?:^|[\s:(])(?:mic\s*)?(<=|>=|<|>|=)?\s*(\d+(?:\.\d+)?)(?:\s*(?:mg\/l|mcg\/ml|ug\/ml|µg\/ml))?/i.exec(
    afterAgent,
  );

  if (!directValueMatch) {
    return null;
  }

  return {
    comparator: (directValueMatch[1] as SusceptibilityComparator | undefined) ?? "=",
    value: Number(directValueMatch[2]),
  };
}

export function normalizeSusceptibilityObservation(
  rawInput?: string | null,
): NormalizedSusceptibilityObservation | null {
  const raw = rawInput?.trim();
  if (!raw) {
    return null;
  }

  const agentMatch = findMatchedAgent(raw);
  const parsedValue = parseComparatorAndValue(raw, agentMatch?.index, agentMatch?.matchLength);
  const keywords = Array.from(
    new Set(
      KEYWORD_PATTERNS.filter((entry) => entry.pattern.test(raw)).map((entry) => entry.keyword),
    ),
  );

  return {
    raw,
    normalizedAgentId: agentMatch?.alias.id,
    agentLabel: agentMatch?.alias.label,
    interpretation: normalizeReportedInterpretation(raw),
    comparator: parsedValue?.comparator,
    value: parsedValue?.value,
    units: normalizeUnits(raw),
    keywords: keywords.length ? keywords : undefined,
  };
}

export function normalizeCombinationObservation(
  rawInput?: string | null,
): NormalizedCombinationObservation | null {
  const raw = rawInput?.trim();
  if (!raw) {
    return null;
  }

  const comboMatch = findMatchedCombination(raw);
  if (!comboMatch) {
    return null;
  }

  const keywords = Array.from(
    new Set(
      KEYWORD_PATTERNS.filter((entry) => entry.pattern.test(raw)).map((entry) => entry.keyword),
    ),
  );

  return {
    raw,
    comboId: comboMatch.alias.id,
    comboLabel: comboMatch.alias.label,
    memberAgentIds: comboMatch.alias.memberAgentIds,
    interpretation: normalizeReportedInterpretation(raw),
    testMethod: normalizeCombinationTestMethod(raw),
    keywords: keywords.length ? keywords : undefined,
  };
}

export function formatNormalizedSusceptibilityObservation(
  observation: NormalizedSusceptibilityObservation,
) {
  const segments: string[] = [];

  if (observation.agentLabel) {
    segments.push(observation.agentLabel);
  }

  if (observation.interpretation) {
    segments.push(observation.interpretation);
  }

  if (observation.value !== undefined) {
    const comparator = observation.comparator && observation.comparator !== "=" ? `${observation.comparator} ` : "";
    const unit = observation.units ? ` ${observation.units}` : "";
    segments.push(`MIC ${comparator}${observation.value}${unit}`);
  }

  if (observation.keywords?.length) {
    segments.push(observation.keywords.join(", "));
  }

  return segments.length ? segments.join(" · ") : observation.raw;
}

export function formatNormalizedCombinationObservation(
  observation: NormalizedCombinationObservation,
) {
  const segments: string[] = [observation.comboLabel];

  if (observation.interpretation) {
    segments.push(observation.interpretation);
  }

  if (observation.testMethod) {
    const methodLabel =
      observation.testMethod === "bde"
        ? "BDE"
        : observation.testMethod === "local-combo"
          ? "local combo AST"
          : observation.testMethod === "reported-pair"
            ? "paired execution"
            : "method not stated";
    segments.push(methodLabel);
  }

  if (observation.keywords?.length) {
    segments.push(observation.keywords.join(", "));
  }

  return segments.join(" · ");
}
