// ============================================================
// PERSISTENT STORAGE UTILITY
// ============================================================
// Syncs React state to localStorage so favorites, recents,
// allergies, theme, and renal filter survive page refresh.
//
// Usage in App.jsx:
//   const [favorites, setFavorites] = usePersistedState("pr-favorites", []);
//   const [theme, setTheme] = usePersistedState("pr-theme", "dark");
import { useState, useEffect, useCallback } from "react";

const PREFIX = "pharmref_";

function safeGet(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable — fail silently
  }
}

/**
 * Drop-in replacement for useState that persists to localStorage.
 * Same API: const [val, setVal] = usePersistedState(key, default)
 */
export function usePersistedState(key, defaultValue) {
  const [state, setState] = useState(() => safeGet(key, defaultValue));

  useEffect(() => {
    safeSet(key, state);
  }, [key, state]);

  // Listen for changes in other tabs
  useEffect(() => {
    const handler = (e) => {
      if (e.key === PREFIX + key) {
        setState(safeGet(key, defaultValue));
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [key, defaultValue]);

  return [state, setState];
}

/**
 * Clear all PharmRef persisted data (for a "reset" button).
 */
export function clearAllPersistedData() {
  Object.keys(localStorage)
    .filter(k => k.startsWith(PREFIX))
    .forEach(k => localStorage.removeItem(k));
}