import type {
  DiseaseState,
  DrugSearchResult,
  RegimenSearchResult,
  Subcategory,
  SubcategorySearchResult,
} from "../types";
import {
  getInstitutionDrugAntibiogram,
  getInstitutionDrugNoteLines,
} from "./institution-profile";
import {
  flattenMonographMicrobiologyText,
  flattenSubcategoryMicrobiologyText,
} from "./microbiology";
import {
  flattenMonographStructuredText,
  flattenRegimenPlan,
  flattenSubcategoryStewardshipText,
  getPreferredRegimenNotes,
  getPreferredRegimenText,
} from "./stewardship";

interface SearchPreview {
  primary: string;
  secondary?: string;
}

interface Candidate {
  group: string;
  text: string;
}

function tokenizeQuery(query: string) {
  return query
    .toLowerCase()
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 1 && !["vs", "and", "or", "the", "for", "with", "to"].includes(token));
}

function normalizeLine(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

function candidateScore(text: string, query: string, tokens: string[]) {
  const lower = text.toLowerCase();
  if (!lower) return 0;
  const matchedTokenCount = tokens.filter((token) => lower.includes(token)).length;
  if (query && lower.includes(query)) return 100 + matchedTokenCount;
  if (tokens.length > 1 && matchedTokenCount === tokens.length) return 80 + matchedTokenCount;
  if (matchedTokenCount > 0) return 40 + matchedTokenCount;
  return 1;
}

function pickPreview(candidates: Candidate[], query: string): SearchPreview {
  const normalized = candidates
    .map((candidate, index) => ({
      ...candidate,
      index,
      text: normalizeLine(candidate.text),
    }))
    .filter((candidate) => candidate.text.length > 0);

  if (!normalized.length) {
    return { primary: "No structured preview available yet." };
  }

  const tokens = tokenizeQuery(query);
  const scored = normalized
    .map((candidate) => ({
      ...candidate,
      score: candidateScore(candidate.text, query.toLowerCase(), tokens),
    }))
    .sort((left, right) => right.score - left.score || left.index - right.index);

  const primary = scored[0];
  const secondary =
    scored.find((candidate) => candidate.text !== primary.text && candidate.group !== primary.group) ??
    scored.find((candidate) => candidate.text !== primary.text);

  return {
    primary: primary.text,
    ...(secondary ? { secondary: secondary.text } : {}),
  };
}

function getEmpiricTherapy(subcategory: Subcategory) {
  return subcategory.empiricTherapy ?? subcategory.empiricRegimens ?? [];
}

export function buildDrugSearchPreview(drug: DrugSearchResult, query: string): SearchPreview {
  return pickPreview(
    [
      ...flattenMonographStructuredText(drug).map((text) => ({ group: "structured", text })),
      ...flattenMonographMicrobiologyText(drug).map((text) => ({ group: "microbiology", text })),
      ...getInstitutionDrugNoteLines(drug).map((text) => ({ group: "local-policy", text })),
      ...getInstitutionDrugAntibiogram(drug.id).map((entry) => ({
        group: "local-antibiogram",
        text: `${entry.organism}: ${entry.susceptibility}${entry.note ? ` - ${entry.note}` : ""}`,
      })),
      ...(drug.pharmacistPearls ?? []).map((text) => ({ group: "pearls", text })),
      { group: "spectrum", text: drug.spectrum },
    ],
    query,
  );
}

export function buildRegimenSearchPreview(regimen: RegimenSearchResult, query: string): SearchPreview {
  return pickPreview(
    [
      { group: "rationale", text: regimen.notes ?? "" },
      { group: "indication", text: regimen.indication ? `Indication: ${regimen.indication}` : "" },
      { group: "site", text: regimen.site ? `Site: ${regimen.site}` : "" },
      {
        group: "pathogen",
        text: regimen.pathogenFocus?.length ? `Pathogen focus: ${regimen.pathogenFocus.join(" | ")}` : "",
      },
      {
        group: "risk",
        text: regimen.riskFactorTriggers?.length ? `Use when: ${regimen.riskFactorTriggers.join(" | ")}` : "",
      },
      {
        group: "avoid",
        text: regimen.avoidIf?.length ? `Avoid if: ${regimen.avoidIf.join(" | ")}` : "",
      },
      {
        group: "renal",
        text: [...(regimen.renalFlags ?? []), ...(regimen.dialysisFlags ?? [])].length
          ? `Renal / dialysis: ${[...(regimen.renalFlags ?? []), ...(regimen.dialysisFlags ?? [])].join(" | ")}`
          : "",
      },
      {
        group: "rapid",
        text: regimen.rapidDiagnosticActions?.length
          ? `Rapid diagnostics: ${regimen.rapidDiagnosticActions.join(" | ")}`
          : "",
      },
    ],
    query,
  );
}

export function buildSubcategorySearchPreview(subcategory: SubcategorySearchResult, query: string): SearchPreview {
  const empiricCandidates = getEmpiricTherapy(subcategory).flatMap((tier) =>
    tier.options.flatMap((option) => [
      {
        group: "empiric-regimen",
        text: `${tier.line}: ${getPreferredRegimenText(option.regimen, option.plan)}`,
      },
      {
        group: "empiric-rationale",
        text: getPreferredRegimenNotes(option.notes, option.plan) ?? "",
      },
      ...flattenRegimenPlan(option.plan).map((text) => ({ group: "empiric-structured", text })),
    ]),
  );

  const candidates =
    subcategory.matchType === "workflow"
      ? flattenSubcategoryStewardshipText(subcategory).map((text) => ({ group: "workflow", text }))
      : subcategory.matchType === "microbiology"
        ? flattenSubcategoryMicrobiologyText(subcategory).map((text) => ({ group: "microbiology", text }))
      : subcategory.matchType === "pearl"
          ? (subcategory.pearls ?? []).map((text) => ({ group: "pearl", text }))
          : subcategory.matchType === "empiric"
            ? [
                ...empiricCandidates,
                ...flattenSubcategoryMicrobiologyText(subcategory).map((text) => ({ group: "microbiology", text })),
                ...flattenSubcategoryStewardshipText(subcategory).map((text) => ({ group: "workflow", text })),
              ]
            : [
                { group: "definition", text: subcategory.definition },
                ...flattenSubcategoryStewardshipText(subcategory).map((text) => ({ group: "workflow", text })),
              ];

  return pickPreview(candidates, query);
}

export function buildDiseaseSearchPreview(disease: DiseaseState, query: string): SearchPreview {
  return pickPreview(
    [
      { group: "definition", text: disease.overview.definition },
      { group: "epidemiology", text: disease.overview.epidemiology ?? "" },
      { group: "risk-factors", text: disease.overview.riskFactors ?? "" },
      ...disease.overview.keyGuidelines.map((entry) => ({ group: "guideline", text: `${entry.name}: ${entry.detail}` })),
    ],
    query,
  );
}
