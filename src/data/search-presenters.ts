import type {
  DiseaseState,
  DrugSearchResult,
  PathogenSearchResult,
  RegimenSearchResult,
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
  flattenMonographDecisionSupportText,
  flattenMonographStructuredText,
  flattenRegimenPlan,
  flattenSubcategoryDecisionSupportText,
  flattenSubcategoryStewardshipText,
  getPreferredRegimenNotes,
  getPreferredRegimenText,
} from "./stewardship";
import { getTreatmentTiers } from "./topic-surface";

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

function summarizeList(items: Array<string | undefined> | undefined, max = 2) {
  const normalized = (items ?? []).map((item) => normalizeLine(item ?? "")).filter(Boolean);
  if (!normalized.length) return "";
  if (normalized.length <= max) return normalized.join(" | ");
  return `${normalized.slice(0, max).join(" | ")} | +${normalized.length - max} more`;
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

function buildDrugDecisionSupportCandidates(drug: DrugSearchResult): Candidate[] {
  return [
    ...(drug.specialPopulationMatrix?.map((entry) => ({
      group: "special-population",
      text: normalizeLine(
        `Special population (${entry.population}): ${entry.doseStrategy}${
          summarizeList(
            [
              entry.weightBasis ? `Weight basis: ${entry.weightBasis}` : "",
              entry.infusionStrategy ? `Infusion: ${entry.infusionStrategy}` : "",
              entry.tdmTarget ? `TDM: ${entry.tdmTarget}` : "",
              entry.whenToConsult ? `Consult: ${entry.whenToConsult}` : "",
            ],
            3,
          )
            ? ` ${summarizeList(
                [
                  entry.weightBasis ? `Weight basis: ${entry.weightBasis}` : "",
                  entry.infusionStrategy ? `Infusion: ${entry.infusionStrategy}` : "",
                  entry.tdmTarget ? `TDM: ${entry.tdmTarget}` : "",
                  entry.whenToConsult ? `Consult: ${entry.whenToConsult}` : "",
                ],
                3,
              )}`
            : ""
        }`,
      ),
    })) ?? []),
    ...(drug.monitoringSchedule?.map((entry) => ({
      group: "monitoring-schedule",
      text: normalizeLine(
        `Monitoring (${entry.phase}): ${entry.cadence}${
          summarizeList(
            [
              entry.labs?.length ? `Labs: ${entry.labs.join(", ")}` : "",
              entry.clinical?.length ? `Clinical: ${entry.clinical.join(", ")}` : "",
              entry.actionThresholds?.length ? `Action threshold: ${entry.actionThresholds[0]}` : "",
            ],
            2,
          )
            ? ` ${summarizeList(
                [
                  entry.labs?.length ? `Labs: ${entry.labs.join(", ")}` : "",
                  entry.clinical?.length ? `Clinical: ${entry.clinical.join(", ")}` : "",
                  entry.actionThresholds?.length ? `Action threshold: ${entry.actionThresholds[0]}` : "",
                ],
                2,
              )}`
            : ""
        }`,
      ),
    })) ?? []),
    ...(drug.executionBurden
      ? [
          {
            group: "execution-burden",
            text: normalizeLine(`Execution burden: ${drug.executionBurden.comparatorSummary}`),
          },
          {
            group: "opat-fit",
            text: normalizeLine(
              `Operational fit: OPAT ${drug.executionBurden.opatFit}; infusion burden ${drug.executionBurden.infusionBurden}; line access ${drug.executionBurden.lineAccess}. ${
                drug.executionBurden.homeInfusionNote ?? ""
              }`,
            ),
          },
        ]
      : []),
    ...flattenMonographDecisionSupportText(drug).map((text) => ({ group: "decision-support", text })),
  ];
}

function buildSubcategoryDecisionSupportCandidates(subcategory: SubcategorySearchResult): Candidate[] {
  return [
    ...(subcategory.definitiveTherapy?.flatMap((entry) => [
      {
        group: "definitive-therapy",
        text: normalizeLine(`Preferred definitive therapy (${entry.title}): ${entry.preferred.regimen}. ${entry.preferred.why}`),
      },
      ...(entry.acceptable?.map((branch) => ({
        group: "definitive-acceptable",
        text: normalizeLine(`Acceptable definitive therapy (${entry.title}): ${branch.regimen}. ${branch.why}`),
      })) ?? []),
      ...(entry.rescue?.map((branch) => ({
        group: "definitive-rescue",
        text: normalizeLine(`Rescue definitive therapy (${entry.title}): ${branch.regimen}. ${branch.why}`),
      })) ?? []),
      ...(entry.avoid?.map((branch) => ({
        group: "definitive-avoid",
        text: normalizeLine(`Avoid in definitive therapy (${entry.title}): ${branch.regimen}. ${branch.why}`),
      })) ?? []),
      ...(entry.monitoringFocus?.map((focus) => ({
        group: "definitive-monitoring",
        text: normalizeLine(`Definitive therapy monitoring (${entry.title}): ${focus}`),
      })) ?? []),
    ]) ?? []),
    ...(subcategory.oralStepDown?.map((entry) => ({
      group: "oral-stepdown",
      text: normalizeLine(
        `Oral step-down #${entry.rank} (${entry.label}): ${entry.regimen}. ${entry.bioavailability} ${entry.penetration}${
          summarizeList(entry.barrierNotes, 1) ? ` Barrier: ${summarizeList(entry.barrierNotes, 1)}` : ""
        }`,
      ),
    })) ?? []),
    ...(subcategory.durationRules?.map((entry) => ({
      group: "duration-rule",
      text: normalizeLine(
        `Duration (${entry.label}): ${entry.defaultDuration} from ${entry.anchorEvent}${
          summarizeList(entry.exceptions, 1) ? ` Exception: ${summarizeList(entry.exceptions, 1)}` : ""
        }`,
      ),
    })) ?? []),
    ...(subcategory.failureEscalationPath?.map((entry) => ({
      group: "failure-escalation",
      text: normalizeLine(
        `${entry.checkpoint} escalation (${entry.title}): ${entry.trigger} ${
          summarizeList([...entry.actions, ...(entry.broadenTo ?? [])], 2)
        }`,
      ),
    })) ?? []),
    ...flattenSubcategoryDecisionSupportText(subcategory).map((text) => ({ group: "decision-support", text })),
  ];
}

export function buildDrugSearchPreview(drug: DrugSearchResult, query: string): SearchPreview {
  return pickPreview(
    [
      ...buildDrugDecisionSupportCandidates(drug),
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
  const decisionSupportCandidates = buildSubcategoryDecisionSupportCandidates(subcategory);
  const empiricCandidates = getTreatmentTiers(subcategory).flatMap((tier) =>
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
    subcategory.matchType === "workflow" || subcategory.matchType === "decision-support"
      ? [
          ...decisionSupportCandidates,
          ...flattenSubcategoryStewardshipText(subcategory, subcategory.parentDisease).map((text) => ({ group: "workflow", text })),
        ]
      : subcategory.matchType === "microbiology"
        ? flattenSubcategoryMicrobiologyText(subcategory).map((text) => ({ group: "microbiology", text }))
      : subcategory.matchType === "pearl"
          ? (subcategory.pearls ?? []).map((text) => ({ group: "pearl", text }))
          : subcategory.matchType === "empiric"
            ? [
                ...decisionSupportCandidates,
                ...empiricCandidates,
                ...flattenSubcategoryMicrobiologyText(subcategory).map((text) => ({ group: "microbiology", text })),
                ...flattenSubcategoryStewardshipText(subcategory, subcategory.parentDisease).map((text) => ({ group: "workflow", text })),
              ]
            : [
                { group: "definition", text: subcategory.definition },
                ...decisionSupportCandidates,
                ...flattenSubcategoryStewardshipText(subcategory, subcategory.parentDisease).map((text) => ({ group: "workflow", text })),
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

export function buildPathogenSearchPreview(pathogen: PathogenSearchResult, query: string): SearchPreview {
  return pickPreview(
    [
      { group: "summary", text: pathogen.summary },
      { group: "phenotype", text: pathogen.phenotype },
      ...pathogen.likelySyndromes.map((text) => ({ group: "syndrome", text })),
      ...pathogen.breakpointCaveats.map((entry) => ({ group: "breakpoint", text: `${entry.title}: ${entry.detail}` })),
      ...pathogen.preferredTherapyBySite.map((entry) => ({
        group: "therapy",
        text: `${entry.site}: ${entry.preferred}. ${entry.rationale}`,
      })),
    ],
    query,
  );
}
