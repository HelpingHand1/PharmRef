import { useCallback } from "react";
import { usePersistedState } from "../utils/persistence";

const MAX_BOOKMARKS = 24;

// Bookmark ids are "<kind>:<key>". Pathways need both the topic and the pathway.
export const topicBookmarkId = (diseaseId: string) => `disease:${diseaseId}`;
export const monographBookmarkId = (monographId: string) => `monograph:${monographId}`;
export const pathwayBookmarkId = (diseaseId: string, subcategoryId: string) => `pathway:${diseaseId}/${subcategoryId}`;

export type ParsedBookmark =
  | { kind: "disease"; diseaseId: string }
  | { kind: "monograph"; monographId: string }
  | { kind: "pathway"; diseaseId: string; subcategoryId: string };

export function parseBookmarkId(id: string): ParsedBookmark | null {
  const separator = id.indexOf(":");
  if (separator < 1) return null;
  const kind = id.slice(0, separator);
  const key = id.slice(separator + 1);
  if (!key) return null;

  if (kind === "disease") return { kind, diseaseId: key };
  if (kind === "monograph") return { kind, monographId: key };
  if (kind === "pathway") {
    const [diseaseId, subcategoryId] = key.split("/");
    return diseaseId && subcategoryId ? { kind, diseaseId, subcategoryId } : null;
  }
  return null;
}

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
