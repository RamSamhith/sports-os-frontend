/**
 * Placeholder in-memory token bucket. Real implementation will be a Redis-backed limiter
 * at the edge. This is a structural placeholder so server routes can call `rateLimit()`.
 */
interface Bucket {
  count: number;
  expiresAt: number;
}

const buckets = new Map<string, Bucket>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export function rateLimit(opts: {
  key: string;
  limit: number;
  windowMs: number;
}): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(opts.key);
  if (!existing || existing.expiresAt < now) {
    const fresh: Bucket = { count: 1, expiresAt: now + opts.windowMs };
    buckets.set(opts.key, fresh);
    return { allowed: true, remaining: opts.limit - 1, resetAt: fresh.expiresAt };
  }
  if (existing.count >= opts.limit) {
    return { allowed: false, remaining: 0, resetAt: existing.expiresAt };
  }
  existing.count += 1;
  return { allowed: true, remaining: opts.limit - existing.count, resetAt: existing.expiresAt };
}
