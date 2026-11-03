import type { SearchEntry } from "../data/derived";
import {
  flattenContentMetaText,
  getContentSearchBoost,
  getMonographContentKey,
  getSubcategoryContentKey,
  resolveContentMeta,
} from "../data/metadata";
import {
  flattenMonographMicrobiologyText,
  flattenSubcategoryMicrobiologyText,
} from "../data/microbiology";
import {
  flattenMonographDecisionSupportText,
  flattenMonographStructuredText,
  flattenSubcategoryDecisionSupportText,
  flattenSubcategoryStewardshipText,
} from "../data/stewardship";
import type { SearchResult } from "../types";

function scoreName(name: string, q: string): number {
  const lower = name.toLowerCase();
  if (lower === q) return 100;
  if (lower.startsWith(q)) return 80;
  if (lower.includes(q)) return 60;
  return 0;
}

function getQueryTokens(q: string) {
  return q
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 1 && !["vs", "and", "or", "the", "for", "with", "to"].includes(token));
}

function tokenAwareMatch(text: string | undefined, q: string, tokens: string[]) {
  if (!text) return false;
  const lower = text.toLowerCase();
  return lower.includes(q) || (tokens.length > 0 && tokens.every((token) => lower.includes(token)));
}

function fieldScore(text: string | undefined, score: number, q: string, tokens: string[]): number {
  if (!text) return 0;
  const lower = text.toLowerCase();
  if (lower.includes(q)) return score;
  return tokens.length > 1 && tokens.every((token) => lower.includes(token)) ? Math.max(10, Math.round(score * 0.7)) : 0;
}

function arrayScore(items: string[] | undefined, score: number, q: string, tokens: string[]): number {
  if (!items?.length) return 0;
  return items.some((item) => tokenAwareMatch(item, q, tokens)) ? score : 0;
}

export function searchCatalog(query: string, searchIndex: SearchEntry[] | null): SearchResult | null {
  const normalizedQuery = query.trim();
  if (normalizedQuery.length < 2 || !searchIndex) return null;

  const q = normalizedQuery.toLowerCase();
  const tokens = getQueryTokens(q);

  const diseaseMap = new Map<string, { payload: SearchResult["diseases"][number]; score: number }>();
  const drugMap = new Map<string, { payload: SearchResult["drugs"][number]; score: number }>();
  const organismMap = new Map<string, { payload: SearchResult["organisms"][number]; score: number }>();
  const pathogenMap = new Map<string, { payload: SearchResult["pathogens"][number]; score: number }>();
  const regimenMap = new Map<string, { payload: SearchResult["regimens"][number]; score: number }>();
  const subcatMap = new Map<string, { payload: SearchResult["subcategories"][number]; score: number }>();

  searchIndex.forEach((entry) => {
    if (entry.type === "pathogen") {
      const therapyText = entry.pathogen.preferredTherapyBySite
        .flatMap((recommendation) => [
          recommendation.site,
          recommendation.preferred,
          recommendation.rationale,
          ...(recommendation.alternatives ?? []),
          ...(recommendation.avoid ?? []),
        ])
        .join(" ");
      const breakpointText = entry.pathogen.breakpointRules
        ?.flatMap((rule) => [rule.title, rule.detail, ...(rule.site ?? []), ...(rule.interpretation ?? [])])
        .join(" ");
      const textScore = Math.max(
        scoreName(entry.pathogen.name, q),
        fieldScore(entry.pathogen.phenotype, 55, q, tokens),
        fieldScore(entry.pathogen.summary, 40, q, tokens),
        arrayScore(entry.pathogen.likelySyndromes, 35, q, tokens),
        fieldScore(therapyText, 45, q, tokens),
        fieldScore(breakpointText, 45, q, tokens),
        fieldScore(entry.text, 45, q, tokens),
      );
      if (textScore === 0) return;
      const existing = pathogenMap.get(entry.pathogen.id);
      if (!existing || textScore > existing.score) {
        pathogenMap.set(entry.pathogen.id, { payload: entry.pathogen, score: textScore });
      }
      return;
    }

    if (entry.type === "disease") {
      const textScore = Math.max(
        scoreName(entry.disease.name, q),
        fieldScore(entry.disease.overview?.definition, 30, q, tokens),
        fieldScore(entry.disease.category, 10, q, tokens),
        fieldScore(entry.text, 55, q, tokens),
      );
      if (textScore === 0) return;
      const score = textScore + getContentSearchBoost(resolveContentMeta(entry.disease).meta);
      const key = entry.disease.id;
      const existing = diseaseMap.get(key);
      if (!existing || score > existing.score) {
        diseaseMap.set(key, { payload: entry.disease, score });
      }
      return;
    }

    if (entry.type === "drug") {
      const decisionSupportText = flattenMonographDecisionSupportText(entry.drug).join(" ");
      const structuredText = flattenMonographStructuredText(entry.drug).join(" ");
      const microbiologyText = flattenMonographMicrobiologyText(entry.drug).join(" ");
      const metaText = flattenContentMetaText(entry.drug.contentMeta).join(" ");
      const textScore = Math.max(
        scoreName(entry.drug.name, q),
        fieldScore(entry.drug.brandNames, 55, q, tokens),
        fieldScore(entry.drug.drugClass, 55, q, tokens),
        fieldScore(entry.drug.spectrum, 30, q, tokens),
        fieldScore(entry.drug.mechanismOfAction, 30, q, tokens),
        fieldScore(decisionSupportText, 52, q, tokens),
        fieldScore(structuredText, 40, q, tokens),
        fieldScore(microbiologyText, 45, q, tokens),
        fieldScore(metaText, 18, q, tokens),
        fieldScore(entry.text, 45, q, tokens),
        arrayScore(entry.drug.pharmacistPearls, 20, q, tokens),
        arrayScore(entry.drug.drugInteractions, 10, q, tokens),
      );
      if (textScore === 0) return;
      const score = textScore + getContentSearchBoost(
        resolveContentMeta(entry.drug, entry.disease, {
          contentKey: getMonographContentKey(entry.disease.id, entry.drug.id),
        }).meta,
      );
      const key = entry.drug.id;
      const existing = drugMap.get(key);
      if (!existing || score > existing.score) {
        drugMap.set(key, { payload: { ...entry.drug, parentDisease: entry.disease }, score });
      }
      return;
    }

    if (entry.type === "organism") {
      const textScore = Math.max(
        scoreName(entry.organism.organism, q),
        fieldScore(entry.organism.preferred, 20, q, tokens),
        fieldScore(entry.organism.alternative, 10, q, tokens),
        fieldScore(entry.organism.notes, 10, q, tokens),
        fieldScore(entry.text, 25, q, tokens),
      );
      if (textScore === 0) return;
      const score = textScore + getContentSearchBoost(
        resolveContentMeta(entry.subcategory, entry.disease, {
          contentKey: getSubcategoryContentKey(entry.disease.id, entry.subcategory.id),
        }).meta,
      );
      const key = `${entry.disease.id}:${entry.subcategory.id}:${entry.organism.organism}`;
      const existing = organismMap.get(key);
      if (!existing || score > existing.score) {
        organismMap.set(key, {
          payload: {
            ...entry.organism,
            parentDisease: entry.disease,
            parentSubcategory: entry.subcategory,
          },
          score,
        });
      }
      return;
    }

    if (entry.type === "regimen") {
      const textScore = Math.max(
        fieldScore(entry.regimen.regimen, 80, q, tokens),
        fieldScore(entry.regimen.notes, 30, q, tokens),
        fieldScore(entry.regimen.line, 25, q, tokens),
        fieldScore(entry.regimen.indication, 30, q, tokens),
        fieldScore(entry.regimen.site, 25, q, tokens),
        fieldScore(entry.regimen.role, 20, q, tokens),
        arrayScore(entry.regimen.pathogenFocus, 25, q, tokens),
        arrayScore(entry.regimen.riskFactorTriggers, 20, q, tokens),
        arrayScore(entry.regimen.avoidIf, 18, q, tokens),
        arrayScore(entry.regimen.renalFlags, 18, q, tokens),
        arrayScore(entry.regimen.dialysisFlags, 18, q, tokens),
        arrayScore(entry.regimen.rapidDiagnosticActions, 22, q, tokens),
        arrayScore(entry.regimen.linkedMonographIds, 12, q, tokens),
        fieldScore(entry.subcategory.name, 25, q, tokens),
        fieldScore(entry.disease.name, 15, q, tokens),
        fieldScore(entry.text, 45, q, tokens),
      );
      if (textScore === 0) return;
      const score = textScore + getContentSearchBoost(
        resolveContentMeta(entry.subcategory, entry.disease, {
          contentKey: getSubcategoryContentKey(entry.disease.id, entry.subcategory.id),
        }).meta,
      );
      const key = entry.regimen.id;
      const existing = regimenMap.get(key);
      if (!existing || score > existing.score) {
        regimenMap.set(key, {
          payload: {
            ...entry.regimen,
            parentDisease: entry.disease,
            parentSubcategory: entry.subcategory,
          },
          score,
        });
      }
      return;
    }

    const decisionSupportText = flattenSubcategoryDecisionSupportText(entry.subcategory).join(" ");
    const workflowText = flattenSubcategoryStewardshipText(entry.subcategory, entry.disease).join(" ");
    const microbiologyText = flattenSubcategoryMicrobiologyText(entry.subcategory).join(" ");
    const metaText = flattenContentMetaText(entry.subcategory.contentMeta).join(" ");
    const textScore = Math.max(
      scoreName(entry.subcategory.name, q),
      fieldScore(entry.subcategory.definition, 30, q, tokens),
      fieldScore(decisionSupportText, 52, q, tokens),
      fieldScore(workflowText, 40, q, tokens),
      fieldScore(microbiologyText, 45, q, tokens),
      fieldScore(metaText, 18, q, tokens),
      arrayScore(entry.subcategory.pearls, 20, q, tokens),
      fieldScore(entry.text, 25, q, tokens),
    );
    if (textScore === 0) return;
    const score = textScore + getContentSearchBoost(
      resolveContentMeta(entry.subcategory, entry.disease, {
        contentKey: getSubcategoryContentKey(entry.disease.id, entry.subcategory.id),
      }).meta,
    );
    const key = `${entry.disease.id}:${entry.subcategory.id}`;
    const existing = subcatMap.get(key);
    if (!existing || score > existing.score) {
      subcatMap.set(key, {
        payload: {
          ...entry.subcategory,
          parentDisease: entry.disease,
          matchType: entry.matchClassify(q),
        },
        score,
      });
    }
  });

  return {
    diseases: [...diseaseMap.values()].sort((a, b) => b.score - a.score).map((x) => x.payload),
    drugs: [...drugMap.values()].sort((a, b) => b.score - a.score).map((x) => x.payload),
    organisms: [...organismMap.values()].sort((a, b) => b.score - a.score).map((x) => x.payload),
    pathogens: [...pathogenMap.values()].sort((a, b) => b.score - a.score).map((x) => x.payload),
    regimens: [...regimenMap.values()].sort((a, b) => b.score - a.score).map((x) => x.payload),
    subcategories: [...subcatMap.values()].sort((a, b) => b.score - a.score).map((x) => x.payload),
  };
}

export function countSearchResults(results: SearchResult): number {
  return results.diseases.length + results.drugs.length + results.organisms.length
    + results.pathogens.length + results.regimens.length + results.subcategories.length;
}

const suggestionVocabularyCache = new WeakMap<SearchEntry[], string[]>();

// Words from names only (drugs, brands, topics, pathogens, pathways, regimens), so suggestions stay recognizable.
function getSuggestionVocabulary(searchIndex: SearchEntry[]): string[] {
  const cached = suggestionVocabularyCache.get(searchIndex);
  if (cached) return cached;

  const words = new Set<string>();
  const addWords = (text: string | undefined) => {
    text?.toLowerCase().split(/[^a-z0-9]+/).forEach((word) => {
      if (word.length >= 4) words.add(word);
    });
  };

  searchIndex.forEach((entry) => {
    if (entry.type === "drug") {
      addWords(entry.drug.name);
      addWords(entry.drug.brandNames);
      addWords(entry.drug.drugClass);
    } else if (entry.type === "disease") {
      addWords(entry.disease.name);
    } else if (entry.type === "pathogen") {
      addWords(entry.pathogen.name);
      addWords(entry.pathogen.phenotype);
    } else if (entry.type === "organism") {
      addWords(entry.organism.organism);
    } else if (entry.type === "subcategory") {
      addWords(entry.subcategory.name);
    } else {
      addWords(entry.regimen.regimen);
    }
  });

  const vocabulary = [...words];
  suggestionVocabularyCache.set(searchIndex, vocabulary);
  return vocabulary;
}

// Optimal string alignment distance (counts adjacent transpositions as one edit); stops early past maxDistance.
function editDistance(a: string, b: string, maxDistance: number): number {
  if (Math.abs(a.length - b.length) > maxDistance) return maxDistance + 1;
  let previousRow: number[] = [];
  let row = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i += 1) {
    const nextRow = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j += 1) {
      let value = Math.min(row[j] + 1, nextRow[j - 1] + 1, row[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        value = Math.min(value, previousRow[j - 2] + 1);
      }
      nextRow[j] = value;
      rowMin = Math.min(rowMin, value);
    }
    if (rowMin > maxDistance) return maxDistance + 1;
    previousRow = row;
    row = nextRow;
  }
  return row[b.length];
}

export function suggestSearchQuery(query: string, searchIndex: SearchEntry[] | null): string | null {
  const q = query.trim().toLowerCase();
  if (q.length < 4 || !searchIndex) return null;

  const vocabulary = getSuggestionVocabulary(searchIndex);
  let changed = false;
  const corrected = q.split(/\s+/).map((token) => {
    if (token.length < 4 || vocabulary.some((word) => word.includes(token))) return token;
    const maxDistance = token.length >= 8 ? 2 : 1;
    let best: string | null = null;
    let bestDistance = maxDistance + 1;
    for (const word of vocabulary) {
      const distance = editDistance(token, word, maxDistance);
      if (distance < bestDistance || (distance === bestDistance && best !== null && word[0] === token[0] && best[0] !== token[0])) {
        best = word;
        bestDistance = distance;
      }
    }
    if (best === null) return token;
    changed = true;
    return best;
  }).join(" ");

  if (!changed) return null;
  const results = searchCatalog(corrected, searchIndex);
  return results && countSearchResults(results) > 0 ? corrected : null;
}
