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
import { flattenMonographStructuredText, flattenSubcategoryStewardshipText } from "../data/stewardship";
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
  const regimenMap = new Map<string, { payload: SearchResult["regimens"][number]; score: number }>();
  const subcatMap = new Map<string, { payload: SearchResult["subcategories"][number]; score: number }>();

  searchIndex.forEach((entry) => {
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
      const structuredText = flattenMonographStructuredText(entry.drug).join(" ");
      const microbiologyText = flattenMonographMicrobiologyText(entry.drug).join(" ");
      const metaText = flattenContentMetaText(entry.drug.contentMeta).join(" ");
      const textScore = Math.max(
        scoreName(entry.drug.name, q),
        fieldScore(entry.drug.brandNames, 55, q, tokens),
        fieldScore(entry.drug.drugClass, 55, q, tokens),
        fieldScore(entry.drug.spectrum, 30, q, tokens),
        fieldScore(entry.drug.mechanismOfAction, 30, q, tokens),
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

    const workflowText = flattenSubcategoryStewardshipText(entry.subcategory).join(" ");
    const microbiologyText = flattenSubcategoryMicrobiologyText(entry.subcategory).join(" ");
    const metaText = flattenContentMetaText(entry.subcategory.contentMeta).join(" ");
    const textScore = Math.max(
      scoreName(entry.subcategory.name, q),
      fieldScore(entry.subcategory.definition, 30, q, tokens),
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
    regimens: [...regimenMap.values()].sort((a, b) => b.score - a.score).map((x) => x.payload),
    subcategories: [...subcatMap.values()].sort((a, b) => b.score - a.score).map((x) => x.payload),
  };
}
