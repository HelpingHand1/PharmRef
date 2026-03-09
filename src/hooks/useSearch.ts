import { useDeferredValue, useMemo } from "react";
import { SEARCH_INDEX } from "../data/derived";
import type { SearchResult } from "../types";

function scoreName(name: string, q: string): number {
  const lower = name.toLowerCase();
  if (lower === q) return 100;
  if (lower.startsWith(q)) return 80;
  if (lower.includes(q)) return 60;
  return 0;
}

function fieldScore(text: string | undefined, score: number, q: string): number {
  return text && text.toLowerCase().includes(q) ? score : 0;
}

function arrayScore(items: string[] | undefined, score: number, q: string): number {
  return items?.some((s) => s.toLowerCase().includes(q)) ? score : 0;
}

export function useSearch(query: string) {
  const deferredQuery = useDeferredValue(query.trim());

  const searchResults = useMemo<SearchResult | null>(() => {
    if (deferredQuery.length < 2) return null;

    const q = deferredQuery.toLowerCase();

    const diseaseMap = new Map<string, { payload: SearchResult["diseases"][number]; score: number }>();
    const drugMap = new Map<string, { payload: SearchResult["drugs"][number]; score: number }>();
    const organismMap = new Map<string, { payload: SearchResult["organisms"][number]; score: number }>();
    const subcatMap = new Map<string, { payload: SearchResult["subcategories"][number]; score: number }>();

    SEARCH_INDEX.forEach((entry) => {
      if (entry.type === "disease") {
        const score = Math.max(
          scoreName(entry.disease.name, q),
          fieldScore(entry.disease.overview?.definition, 30, q),
          fieldScore(entry.disease.category, 10, q),
        );
        if (score === 0) return;
        const key = entry.disease.id;
        const existing = diseaseMap.get(key);
        if (!existing || score > existing.score) {
          diseaseMap.set(key, { payload: entry.disease, score });
        }
        return;
      }

      if (entry.type === "drug") {
        const score = Math.max(
          scoreName(entry.drug.name, q),
          fieldScore(entry.drug.brandNames, 55, q),
          fieldScore(entry.drug.drugClass, 55, q),
          fieldScore(entry.drug.spectrum, 30, q),
          fieldScore(entry.drug.mechanismOfAction, 30, q),
          arrayScore(entry.drug.pharmacistPearls, 20, q),
          arrayScore(entry.drug.drugInteractions, 10, q),
        );
        if (score === 0) return;
        const key = entry.drug.id;
        const existing = drugMap.get(key);
        if (!existing || score > existing.score) {
          drugMap.set(key, { payload: { ...entry.drug, parentDisease: entry.disease }, score });
        }
        return;
      }

      if (entry.type === "organism") {
        const score = Math.max(
          scoreName(entry.organism.organism, q),
          fieldScore(entry.organism.preferred, 20, q),
          fieldScore(entry.organism.alternative, 10, q),
          fieldScore(entry.organism.notes, 10, q),
        );
        if (score === 0) return;
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

      // subcategory
      const score = Math.max(
        scoreName(entry.subcategory.name, q),
        fieldScore(entry.subcategory.definition, 30, q),
        arrayScore(entry.subcategory.pearls, 20, q),
        entry.text.includes(q) ? 10 : 0,
      );
      if (score === 0) return;
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
      subcategories: [...subcatMap.values()].sort((a, b) => b.score - a.score).map((x) => x.payload),
    };
  }, [deferredQuery]);

  return { deferredQuery, searchResults };
}
