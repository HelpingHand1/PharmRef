import { useCallback } from "react";
import { usePersistedState } from "../utils/persistence";

const MAX_BOOKMARKS = 12;

export function useBookmarks() {
  const [bookmarks, setBookmarks] = usePersistedState<string[]>("bookmarks", []);

  const isBookmarked = useCallback(
    (id: string) => bookmarks.includes(id),
    [bookmarks]
  );

  const toggleBookmark = useCallback(
    (id: string) => {
      setBookmarks((current) => {
        if (current.includes(id)) {
          return current.filter((b) => b !== id);
        }
        const next = [id, ...current];
        return next.slice(0, MAX_BOOKMARKS);
      });
    },
    [setBookmarks]
  );

  return { bookmarks, toggleBookmark, isBookmarked };
}
