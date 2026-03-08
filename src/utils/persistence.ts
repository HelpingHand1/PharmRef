// ============================================================
// PERSISTENT STORAGE UTILITY
// ============================================================
// Sync React state to localStorage so user preferences survive refreshes.
import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";

const PREFIX = "pharmref_";

function safeGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable — fail silently
  }
}

export function usePersistedState<T>(key: string, defaultValue: T) {
  const [state, setState] = useState<T>(() => safeGet(key, defaultValue));

  useEffect(() => {
    safeSet(key, state);
  }, [key, state]);

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === PREFIX + key) {
        setState(safeGet(key, defaultValue));
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [key, defaultValue]);

  return [state, setState] as [T, Dispatch<SetStateAction<T>>];
}
