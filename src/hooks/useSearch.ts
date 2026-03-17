import { useDeferredValue, useMemo } from "react";
import type { SearchEntry } from "../data/derived";
import { searchCatalog } from "../utils/searchCatalog";
import type { SearchResult } from "../types";

export function useSearch(query: string, searchIndex: SearchEntry[] | null) {
  const deferredQuery = useDeferredValue(query.trim());
  const isSearchActive = deferredQuery.length >= 2;

  const searchResults = useMemo<SearchResult | null>(() => {
    return searchCatalog(isSearchActive ? deferredQuery : "", searchIndex);
  }, [deferredQuery, isSearchActive, searchIndex]);

  return { deferredQuery, isSearchActive, searchResults };
}
