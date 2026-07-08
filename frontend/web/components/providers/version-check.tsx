'use client';

import { useEffect } from 'react';
import {
  logVersionBanner,
  checkAndRefreshOnVersionChange,
  cleanupAbandonedKeys,
} from '@/lib/version';

/**
 * Client-side version gate.
 *
 * Renders nothing. On mount it:
 *  1. Logs the branded version banner to the console.
 *  2. Cleans up abandoned localStorage keys from legacy versions.
 *  3. Checks the persisted build hash — if the deployment changed,
 *     performs a one-time hard reload so the user never sees stale JS/CSS.
 */
export function VersionCheck() {
  useEffect(() => {
    logVersionBanner();
    cleanupAbandonedKeys();
    checkAndRefreshOnVersionChange();
  }, []);

  return null;
}
