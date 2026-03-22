import type {
  BreakpointRapidDiagnostic,
  BreakpointWorkspacePreset,
  NavigateToData,
  NavStateKey,
  SusceptibilityInterpretation,
} from "../types";

const RAPID_DIAGNOSTIC_OPTIONS: BreakpointRapidDiagnostic[] = [
  "none",
  "mssa",
  "mrsa",
  "esbl",
  "kpc",
  "mbl",
  "dtr-pseudomonas",
  "candida",
];

const INTERPRETATION_OPTIONS: SusceptibilityInterpretation[] = [
  "susceptible",
  "intermediate",
  "resistant",
  "sdd",
  "unknown",
];

function cleanPresetValue(value: string | null | undefined) {
  if (value === null || value === undefined) {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

function normalizeRapidDiagnostic(
  value: string | null | undefined,
): BreakpointRapidDiagnostic | null {
  const cleaned = cleanPresetValue(value);
  if (!cleaned || !RAPID_DIAGNOSTIC_OPTIONS.includes(cleaned as BreakpointRapidDiagnostic)) {
    return null;
  }
  return cleaned as BreakpointRapidDiagnostic;
}

function normalizeInterpretation(
  value: string | null | undefined,
): SusceptibilityInterpretation | null {
  const cleaned = cleanPresetValue(value);
  if (!cleaned || !INTERPRETATION_OPTIONS.includes(cleaned as SusceptibilityInterpretation)) {
    return null;
  }
  return cleaned as SusceptibilityInterpretation;
}

function normalizeBreakpointPreset(
  preset: BreakpointWorkspacePreset | null | undefined,
) {
  if (!preset) {
    return null;
  }

  const site = cleanPresetValue(preset.site);
  const rapidDiagnostic = normalizeRapidDiagnostic(preset.rapidDiagnostic ?? undefined);
  const interpretation = normalizeInterpretation(preset.interpretation ?? undefined);
  const mic = cleanPresetValue(preset.mic);

  if (!site && !rapidDiagnostic && !interpretation && !mic) {
    return null;
  }

  return {
    site: site ?? null,
    rapidDiagnostic,
    interpretation,
    mic: mic ?? null,
  } satisfies BreakpointWorkspacePreset;
}

function encodeQueryValue(value: string) {
  return encodeURIComponent(value).replace(/%20/g, "+");
}

function decodeQueryValue(value: string) {
  return decodeURIComponent(value.replace(/\+/g, "%20"));
}

function buildQueryString(
  entries: Array<[string, string]>,
) {
  return entries
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeQueryValue(value)}`)
    .join("&");
}

function parseQueryString(query: string) {
  const params = new Map<string, string>();

  query
    .split("&")
    .filter(Boolean)
    .forEach((entry) => {
      const [rawKey, ...rest] = entry.split("=");
      params.set(decodeURIComponent(rawKey), decodeQueryValue(rest.join("=")));
    });

  return params;
}

function appendBreakpointPresetParams(
  entries: Array<[string, string]>,
  preset: BreakpointWorkspacePreset | null,
) {
  if (!preset) {
    return;
  }

  if (preset.site) {
    entries.push(["site", preset.site]);
  }

  if (preset.rapidDiagnostic) {
    entries.push(["rapid", preset.rapidDiagnostic]);
  }

  if (preset.interpretation) {
    entries.push(["interp", preset.interpretation]);
  }

  if (preset.mic) {
    entries.push(["mic", preset.mic]);
  }
}

export interface NavigationHashState {
  nav: NavStateKey;
  diseaseId: string | null;
  subcategoryId: string | null;
  monographId: string | null;
  pathogenId: string | null;
  breakpointPreset: BreakpointWorkspacePreset | null;
}

export function stateToHash(
  navState: NavStateKey,
  diseaseId: string | null,
  subcategoryId: string | null,
  monographId: string | null,
  pathogenId: string | null,
  breakpointPreset: BreakpointWorkspacePreset | null = null,
): string {
  if (navState === "audit") return "#/audit";
  if (navState === "calculators") return "#/calculators";
  if (navState === "compare") return "#/compare";
  if (navState === "pathogen" && pathogenId) return `#/pathogen/${pathogenId}`;
  if (navState === "monograph" && diseaseId && monographId) return `#/${diseaseId}/drug/${monographId}`;
  if (navState === "subcategory" && diseaseId && subcategoryId) return `#/${diseaseId}/${subcategoryId}`;
  if (navState === "disease_overview" && diseaseId) return `#/${diseaseId}`;

  if (navState === "breakpoints") {
    const base = pathogenId ? `#/breakpoints/${pathogenId}` : "#/breakpoints";
    const entries: Array<[string, string]> = [];
    appendBreakpointPresetParams(entries, normalizeBreakpointPreset(breakpointPreset));
    const query = buildQueryString(entries);
    return query ? `${base}?${query}` : base;
  }

  return "#/";
}

export function hashToState(hash: string): NavigationHashState {
  const normalized = hash.replace(/^#\/?/, "");
  const [pathPart, queryPart = ""] = normalized.split("?");
  const parts = pathPart.split("/").filter(Boolean);

  if (parts.length === 0) {
    return {
      nav: "home",
      diseaseId: null,
      subcategoryId: null,
      monographId: null,
      pathogenId: null,
      breakpointPreset: null,
    };
  }

  if (parts[0] === "compare") {
    return {
      nav: "compare",
      diseaseId: null,
      subcategoryId: null,
      monographId: null,
      pathogenId: null,
      breakpointPreset: null,
    };
  }

  if (parts[0] === "audit") {
    return {
      nav: "audit",
      diseaseId: null,
      subcategoryId: null,
      monographId: null,
      pathogenId: null,
      breakpointPreset: null,
    };
  }

  if (parts[0] === "calculators") {
    return {
      nav: "calculators",
      diseaseId: null,
      subcategoryId: null,
      monographId: null,
      pathogenId: null,
      breakpointPreset: null,
    };
  }

  if (parts[0] === "breakpoints") {
    const params = parseQueryString(queryPart);
    return {
      nav: "breakpoints",
      diseaseId: null,
      subcategoryId: null,
      monographId: null,
      pathogenId: parts[1] ?? null,
      breakpointPreset: normalizeBreakpointPreset({
        site: params.get("site") ?? null,
        rapidDiagnostic: (params.get("rapid") ?? null) as BreakpointRapidDiagnostic | null,
        interpretation: (params.get("interp") ?? null) as SusceptibilityInterpretation | null,
        mic: params.get("mic") ?? null,
      }),
    };
  }

  if (parts[0] === "pathogen" && parts[1]) {
    return {
      nav: "pathogen",
      diseaseId: null,
      subcategoryId: null,
      monographId: null,
      pathogenId: parts[1],
      breakpointPreset: null,
    };
  }

  if (parts[1] === "drug" && parts[2]) {
    return {
      nav: "monograph",
      diseaseId: parts[0],
      subcategoryId: null,
      monographId: parts[2],
      pathogenId: null,
      breakpointPreset: null,
    };
  }

  if (parts[1]) {
    return {
      nav: "subcategory",
      diseaseId: parts[0],
      subcategoryId: parts[1],
      monographId: null,
      pathogenId: null,
      breakpointPreset: null,
    };
  }

  return {
    nav: "disease_overview",
    diseaseId: parts[0],
    subcategoryId: null,
    monographId: null,
    pathogenId: null,
    breakpointPreset: null,
  };
}

export function resolveBreakpointPreset(
  data: NavigateToData,
) {
  return normalizeBreakpointPreset(data.breakpointPreset ?? null);
}
