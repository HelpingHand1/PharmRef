import type {
  BreakpointRapidDiagnostic,
  BreakpointWorkspacePreset,
  PathogenReference,
  SusceptibilityInterpretation,
} from "../types";

const RAPID_DIAGNOSTIC_BY_PATHOGEN_ID: Record<string, BreakpointRapidDiagnostic | null> = {
  mssa: "mssa",
  mrsa: "mrsa",
  "esbl-enterobacterales": "esbl",
  "kpc-cre": "kpc",
  "mbl-cre": "mbl",
  "dtr-pseudomonas": "dtr-pseudomonas",
  crab: null,
  "enterococcus-faecalis-faecium": null,
  "candida-species": "candida",
};

function cleanPresetValue<T extends string | null | undefined>(value: T) {
  if (value === null || value === undefined) {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

export function getBreakpointRapidDiagnosticForPathogenId(
  pathogenId: string | null | undefined,
) {
  if (!pathogenId) {
    return null;
  }

  return RAPID_DIAGNOSTIC_BY_PATHOGEN_ID[pathogenId] ?? null;
}

export function normalizeBreakpointSitePreset(siteLabel: string | null | undefined) {
  const normalized = cleanPresetValue(siteLabel)?.toLowerCase();
  if (!normalized) {
    return null;
  }

  if (normalized.includes("bloodstream")) {
    return "bloodstream";
  }

  if (normalized.includes("bacteremia") || normalized.includes("candidemia")) {
    return "bloodstream";
  }

  if (normalized.includes("endovascular") || normalized.includes("endocarditis")) {
    return "endovascular";
  }

  if (normalized.includes("pneumonia") || normalized.includes("lung")) {
    return "lung";
  }

  if (normalized.includes("pyelonephritis") || normalized.includes("kidney")) {
    return "kidney";
  }

  if (
    normalized.includes("bladder") ||
    normalized.includes("cystitis") ||
    normalized.includes("lower tract")
  ) {
    return "bladder";
  }

  if (
    normalized.includes("urine") ||
    normalized.includes("urinary") ||
    normalized.includes("uti")
  ) {
    return "urine";
  }

  if (normalized.includes("sepsis") || normalized.includes("systemic") || normalized.includes("invasive")) {
    return "systemic";
  }

  return null;
}

export function buildPathogenBreakpointPreset(
  pathogen: Pick<PathogenReference, "id"> | null | undefined,
  overrides: BreakpointWorkspacePreset = {},
) {
  const rapidDiagnostic = getBreakpointRapidDiagnosticForPathogenId(pathogen?.id);
  const baseInterpretation: SusceptibilityInterpretation | undefined = rapidDiagnostic ? "unknown" : undefined;
  const normalizedSite = normalizeBreakpointSitePreset(overrides.site ?? undefined);

  return {
    site: normalizedSite ?? cleanPresetValue(overrides.site) ?? null,
    rapidDiagnostic: overrides.rapidDiagnostic ?? rapidDiagnostic ?? null,
    interpretation: overrides.interpretation ?? baseInterpretation ?? null,
    mic: cleanPresetValue(overrides.mic) ?? null,
  } satisfies BreakpointWorkspacePreset;
}
