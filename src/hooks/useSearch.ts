import { useDeferredValue, useMemo } from "react";
import type { SearchEntry } from "../data/derived";
import { getContentSearchBoost, getMonographContentKey, getSubcategoryContentKey, resolveContentMeta } from "../data/metadata";
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

export function useSearch(query: string, searchIndex: SearchEntry[] | null) {
  const deferredQuery = useDeferredValue(query.trim());
  const isSearchActive = deferredQuery.length >= 2;

  const searchResults = useMemo<SearchResult | null>(() => {
    if (!isSearchActive || !searchIndex) return null;

    const q = deferredQuery.toLowerCase();

    const diseaseMap = new Map<string, { payload: SearchResult["diseases"][number]; score: number }>();
    const drugMap = new Map<string, { payload: SearchResult["drugs"][number]; score: number }>();
    const organismMap = new Map<string, { payload: SearchResult["organisms"][number]; score: number }>();
    const regimenMap = new Map<string, { payload: SearchResult["regimens"][number]; score: number }>();
    const subcatMap = new Map<string, { payload: SearchResult["subcategories"][number]; score: number }>();

    searchIndex.forEach((entry) => {
      if (entry.type === "disease") {
        const textScore = Math.max(
          scoreName(entry.disease.name, q),
          fieldScore(entry.disease.overview?.definition, 30, q),
          fieldScore(entry.disease.category, 10, q),
          fieldScore(entry.text, 55, q),
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
        const textScore = Math.max(
          scoreName(entry.drug.name, q),
          fieldScore(entry.drug.brandNames, 55, q),
          fieldScore(entry.drug.drugClass, 55, q),
          fieldScore(entry.drug.spectrum, 30, q),
          fieldScore(entry.drug.mechanismOfAction, 30, q),
          fieldScore(entry.text, 45, q),
          arrayScore(entry.drug.pharmacistPearls, 20, q),
          arrayScore(entry.drug.drugInteractions, 10, q),
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
          fieldScore(entry.organism.preferred, 20, q),
          fieldScore(entry.organism.alternative, 10, q),
          fieldScore(entry.organism.notes, 10, q),
          fieldScore(entry.text, 25, q),
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
          fieldScore(entry.regimen.regimen, 80, q),
          fieldScore(entry.regimen.notes, 30, q),
          fieldScore(entry.regimen.line, 25, q),
          fieldScore(entry.subcategory.name, 25, q),
          fieldScore(entry.disease.name, 15, q),
          fieldScore(entry.text, 45, q),
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

      // subcategory
      const textScore = Math.max(
        scoreName(entry.subcategory.name, q),
        fieldScore(entry.subcategory.definition, 30, q),
        arrayScore(entry.subcategory.pearls, 20, q),
        fieldScore(entry.text, 25, q),
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
  }, [deferredQuery, isSearchActive, searchIndex]);

  return { deferredQuery, isSearchActive, searchResults };
}
