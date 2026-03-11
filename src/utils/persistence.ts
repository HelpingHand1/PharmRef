// ============================================================
// PERSISTENT STORAGE UTILITY
// ============================================================
// Sync React state to localStorage so user preferences survive refreshes.
import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";
import {
  buildPersistedEnvelope,
  type PersistenceOptions,
  type PersistenceScope,
  readPersistedEnvelope,
} from "./persistenceEnvelope";

const PREFIX = "pharmref_";

function getStorage(scope: PersistenceScope = "local") {
  return scope === "session" ? window.sessionStorage : window.localStorage;
}

function safeGet<T>(key: string, fallback: T, options: PersistenceOptions = {}): T {
  try {
    const storage = getStorage(options.scope);
    const storageKey = PREFIX + key;
    const { value, expired } = readPersistedEnvelope(storage.getItem(storageKey), fallback);
    if (expired) {
      storage.removeItem(storageKey);
    }
    return value;
  } catch {
    return fallback;
  }
}

function safeSet<T>(key: string, value: T, options: PersistenceOptions = {}): void {
  try {
    const storage = getStorage(options.scope);
    storage.setItem(PREFIX + key, JSON.stringify(buildPersistedEnvelope(value, options)));
  } catch {
    // Storage full or unavailable — fail silently
  }
}

export function clearPersistedState(key: string, options: PersistenceOptions = {}) {
  try {
    getStorage(options.scope).removeItem(PREFIX + key);
  } catch {
    // Ignore storage access failures.
  }
}

export function usePersistedState<T>(key: string, defaultValue: T, options: PersistenceOptions = {}) {
  const scope = options.scope ?? "local";
  const ttlMs = options.ttlMs;
  const [state, setState] = useState<T>(() => safeGet(key, defaultValue, { scope, ttlMs }));

  useEffect(() => {
    safeSet(key, state, { scope, ttlMs });
  }, [key, scope, state, ttlMs]);

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.storageArea === getStorage(scope) && e.key === PREFIX + key) {
        setState(safeGet(key, defaultValue, { scope, ttlMs }));
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [defaultValue, key, scope, ttlMs]);

  return [state, setState] as [T, Dispatch<SetStateAction<T>>];
}
