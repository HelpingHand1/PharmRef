import { useDeferredValue, useMemo } from "react";
import type { SearchEntry } from "../data/derived";
import { countSearchResults, searchCatalog, suggestSearchQuery } from "../utils/searchCatalog";
import type { SearchResult } from "../types";

export function useSearch(query: string, searchIndex: SearchEntry[] | null) {
  const deferredQuery = useDeferredValue(query.trim());
  const isSearchActive = deferredQuery.length >= 2;

  const searchResults = useMemo<SearchResult | null>(() => {
    return searchCatalog(isSearchActive ? deferredQuery : "", searchIndex);
  }, [deferredQuery, isSearchActive, searchIndex]);

  const searchSuggestion = useMemo(() => {
    if (!searchResults || countSearchResults(searchResults) > 0) return null;
    return suggestSearchQuery(deferredQuery, searchIndex);
  }, [deferredQuery, searchIndex, searchResults]);

  return { deferredQuery, isSearchActive, searchResults, searchSuggestion };
}
