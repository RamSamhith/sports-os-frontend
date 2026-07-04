/**
 * Build version utility.
 *
 * - Logs "SportsOS Frontend vX.X.X" to the console on every page load.
 * - Exposes the current version for staleness checks.
 * - Uses a build-time hash so each deployment is unique.
 * - Cleans up abandoned localStorage keys from legacy versions.
 */

export const APP_VERSION: string =
  process.env.NEXT_PUBLIC_APP_VERSION ?? '0.0.0';

/**
 * Stable build hash.
 *
 * In production, NEXT_PUBLIC_BUILD_HASH is set at build time by next.config.mjs
 * and is identical across all page loads within the same deployment.
 *
 * The fallback (`'local'`) is deliberately STATIC (not Date.now()) so that
 * versioned envelopes in localStorage are stable across refreshes in dev.
 * If the fallback changed on every load, every versioned envelope would fail
 * the version check and wipe compare/shortlist state on every navigation.
 */
export const BUILD_HASH: string =
  process.env.NEXT_PUBLIC_BUILD_HASH ?? 'local';

/** localStorage key for the persisted build hash (used for auto-refresh). */
export const VERSION_STORAGE_KEY = 'sportsos:build-version';

/**
 * Abandoned localStorage keys from legacy versions.
 * Cleaned up on every page load to prevent stale state.
 */
const ABANDONED_KEYS = [
  'sportsos:auth',
  'sportsos:onboarding-role',
];

/**
 * Log the branded banner to the console.
 * Safe to call multiple times — only logs once per page load.
 */
let _logged = false;
export function logVersionBanner(): void {
  if (_logged || typeof window === 'undefined') return;
  _logged = true;
  if (process.env.NODE_ENV === 'production') return;
  console.log(
    `%c SportsOS Frontend v${APP_VERSION} %c build ${BUILD_HASH} `,
    'background:#2563eb;color:#fff;padding:2px 6px;border-radius:3px 0 0 3px;font-weight:600',
    'background:#1e40af;color:#fff;padding:2px 6px;border-radius:0 3px 3px 0',
  );
}

/**
 * Remove any abandoned localStorage keys from legacy versions.
 */
export function cleanupAbandonedKeys(): void {
  if (typeof window === 'undefined') return;
  try {
    for (const key of ABANDONED_KEYS) {
      window.localStorage.removeItem(key);
    }
  } catch {
    // ignore
  }
}

/**
 * Check whether the running version differs from the stored version.
 * If it does, the user has a stale cached page — trigger a one-time refresh.
 * Returns `true` if a refresh was triggered.
 */
export function checkAndRefreshOnVersionChange(): boolean {
  if (typeof window === 'undefined') return false;

  const currentHash = `${APP_VERSION}-${BUILD_HASH}`;
  const storedHash = window.localStorage.getItem(VERSION_STORAGE_KEY);

  if (storedHash === null) {
    // First visit on this deployment — store and continue.
    window.localStorage.setItem(VERSION_STORAGE_KEY, currentHash);
    return false;
  }

  if (storedHash !== currentHash) {
    // Version changed — update stored hash and force a hard reload.
    window.localStorage.setItem(VERSION_STORAGE_KEY, currentHash);
    window.location.reload();
    return true;
  }

  return false;
}
