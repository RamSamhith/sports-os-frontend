/**
 * Typed environment access. Server-only values must never be imported into client components.
 */

const isServer = typeof window === 'undefined';

function readPublic(name: string, fallback?: string): string {
  const value = process.env[name];
  if (value === undefined) {
    if (fallback !== undefined) return fallback;
    return '';
  }
  return value;
}

export const publicEnv = {
  siteUrl: readPublic('NEXT_PUBLIC_SITE_URL', 'http://localhost:3000'),
  siteName: readPublic('NEXT_PUBLIC_SITE_NAME', 'SportsOS'),
  analyticsEnabled: readPublic('NEXT_PUBLIC_ANALYTICS_ENABLED', 'false') === 'true',
  analyticsEndpoint: readPublic('NEXT_PUBLIC_ANALYTICS_ENDPOINT', ''),
  enableAdmin: readPublic('NEXT_PUBLIC_ENABLE_ADMIN', 'false') === 'true',
  enableAi: readPublic('NEXT_PUBLIC_ENABLE_AI', 'false') === 'true',
} as const;

// Server-only env (placeholder — no real secrets in scaffold)
export const serverEnv = isServer
  ? {
      // Wire up secrets/DB keys here when backend lands
    }
  : {};
