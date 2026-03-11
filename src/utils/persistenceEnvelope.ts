export type PersistenceScope = "local" | "session";

export interface PersistenceOptions {
  scope?: PersistenceScope;
  ttlMs?: number;
}

export interface PersistedEnvelope<T> {
  value: T;
  savedAt: number;
  expiresAt?: number;
}

export const WORK_SESSION_TTL_MS = 12 * 60 * 60 * 1000;
export const WORK_SESSION_PERSISTENCE: PersistenceOptions = {
  scope: "session",
  ttlMs: WORK_SESSION_TTL_MS,
};

export function buildPersistedEnvelope<T>(value: T, options: PersistenceOptions = {}, now = Date.now()): PersistedEnvelope<T> {
  return {
    value,
    savedAt: now,
    expiresAt: options.ttlMs ? now + options.ttlMs : undefined,
  };
}

export function readPersistedEnvelope<T>(
  raw: string | null,
  fallback: T,
  now = Date.now(),
): { value: T; expired: boolean } {
  if (raw === null) {
    return { value: fallback, expired: false };
  }

  try {
    const parsed = JSON.parse(raw);

    if (
      parsed &&
      typeof parsed === "object" &&
      "value" in parsed &&
      "savedAt" in parsed &&
      typeof parsed.savedAt === "number"
    ) {
      const envelope = parsed as PersistedEnvelope<T>;
      if (typeof envelope.expiresAt === "number" && envelope.expiresAt <= now) {
        return { value: fallback, expired: true };
      }
      return { value: envelope.value, expired: false };
    }

    return { value: parsed as T, expired: false };
  } catch {
    return { value: fallback, expired: false };
  }
}
