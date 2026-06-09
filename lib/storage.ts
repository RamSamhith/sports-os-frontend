/**
 * Safe localStorage wrapper.
 *
 * - Handles quota exceeded errors gracefully.
 * - Validates JSON on read.
 * - Logs warnings instead of silently failing.
 * - Provides a consistent API for all storage operations.
 */

const PREFIX = 'sportsos:';

interface StorageResult<T> {
  ok: boolean;
  value: T | null;
  error?: string;
}

/**
 * Read and parse JSON from localStorage with schema validation.
 * Returns null if the key doesn't exist, is invalid JSON, or fails validation.
 */
export function readStorage<T>(
  key: string,
  validate: (data: unknown) => data is T,
): StorageResult<T> {
  if (typeof window === 'undefined') {
    return { ok: true, value: null };
  }
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) {
      return { ok: true, value: null };
    }
    const parsed = JSON.parse(raw);
    if (validate(parsed)) {
      return { ok: true, value: parsed };
    }
    // Schema validation failed — clear the corrupted key.
    console.warn(`[SportsOS] Invalid data in "${key}", clearing.`);
    window.localStorage.removeItem(key);
    return { ok: true, value: null, error: 'schema_mismatch' };
  } catch (e) {
    // JSON parse failed — clear the corrupted key.
    console.warn(`[SportsOS] Corrupted data in "${key}", clearing.`);
    try {
      window.localStorage.removeItem(key);
    } catch {
      // ignore
    }
    return { ok: false, value: null, error: e instanceof Error ? e.message : 'unknown' };
  }
}

/**
 * Write JSON to localStorage with quota error handling.
 * Returns false if the write failed (quota exceeded, storage disabled).
 */
export function writeStorage<T>(key: string, value: T): boolean {
  if (typeof window === 'undefined') return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    // Quota exceeded or storage disabled.
    console.warn(`[SportsOS] Failed to write "${key}":`, e);
    return false;
  }
}

/**
 * Remove a key from localStorage.
 */
export function removeStorage(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

/**
 * Generate a prefixed storage key.
 */
export function storageKey(name: string): string {
  return `${PREFIX}${name}`;
}
