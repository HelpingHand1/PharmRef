import { useDeferredValue, useMemo } from "react";
import { SEARCH_INDEX } from "../data/derived";
import type { SearchResult } from "../types";

export function useSearch(query: string) {
  const deferredQuery = useDeferredValue(query.trim());

  const searchResults = useMemo<SearchResult | null>(() => {
    if (deferredQuery.length < 2) return null;

    const results: SearchResult = { diseases: [], drugs: [], organisms: [], subcategories: [] };
    const seenDiseases = new Set<string>();
    const seenDrugs = new Set<string>();
    const seenOrganisms = new Set<string>();
    const seenSubcategories = new Set<string>();
    const normalizedQuery = deferredQuery.toLowerCase();

    SEARCH_INDEX.forEach((entry) => {
      if (!entry.text.includes(normalizedQuery)) return;

      if (entry.type === "disease") {
        if (!seenDiseases.has(entry.disease.id)) {
          seenDiseases.add(entry.disease.id);
          results.diseases.push(entry.disease);
        }
        return;
      }

      if (entry.type === "drug") {
        if (!seenDrugs.has(entry.drug.id)) {
          seenDrugs.add(entry.drug.id);
          results.drugs.push({ ...entry.drug, parentDisease: entry.disease });
        }
        return;
      }

      if (entry.type === "organism") {
        const key = `${entry.disease.id}:${entry.subcategory.id}:${entry.organism.organism}`;
        if (!seenOrganisms.has(key)) {
          seenOrganisms.add(key);
          results.organisms.push({
            ...entry.organism,
            parentDisease: entry.disease,
            parentSubcategory: entry.subcategory,
          });
        }
        return;
      }

      const key = `${entry.disease.id}:${entry.subcategory.id}`;
      if (!seenSubcategories.has(key)) {
        seenSubcategories.add(key);
        results.subcategories.push({
          ...entry.subcategory,
          parentDisease: entry.disease,
          matchType: entry.matchClassify(normalizedQuery),
        });
      }
    });

    return results;
  }, [deferredQuery]);

  return {
    deferredQuery,
    searchResults,
  };
}
