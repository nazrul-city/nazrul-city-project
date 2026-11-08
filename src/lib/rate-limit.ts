import 'server-only';

import { headers } from 'next/headers';

export type TRateLimitOptions = {
  key: string;
  limit: number;
  windowMs: number;
};

export type TRateLimitResult = {
  allowed: boolean;
  limit: number;
  remaining: number;
  retryAfterMs: number;
  resetAt: number;
};

const GLOBAL_RATE_LIMIT_KEY = '__nc_rate_limit_store__';
const MAX_TRACKED_KEYS = 5000;

function getStore(): Map<string, number[]> {
  const globalObj = globalThis as unknown as Record<string, unknown>;

  if (!globalObj[GLOBAL_RATE_LIMIT_KEY]) {
    globalObj[GLOBAL_RATE_LIMIT_KEY] = new Map<string, number[]>();
  }

  return globalObj[GLOBAL_RATE_LIMIT_KEY] as Map<string, number[]>;
}

/**
 * Periodically prunes expired timestamps and stale keys to keep memory footprint bounded.
 */
function pruneExpiredEntries(store: Map<string, number[]>, now: number): void {
  for (const [key, timestamps] of store.entries()) {
    // Keep entries that have at least one timestamp within the last hour
    const recent = timestamps.filter((timestamp) => now - timestamp < 60 * 60 * 1000);

    if (recent.length === 0) {
      store.delete(key);
    } else if (recent.length !== timestamps.length) {
      store.set(key, recent);
    }
  }
}

/**
 * Checks and records a request attempt against a sliding window rate limit.
 *
 * Why sliding window:
 * A fixed window (e.g. 00:00 - 00:15) allows burst attacks at the boundary (5 requests at 00:14
 * plus 5 requests at 00:15). A sliding window smoothly looks back exactly `windowMs` from now.
 */
export function checkRateLimit(options: TRateLimitOptions): TRateLimitResult {
  const store = getStore();
  const now = Date.now();

  // If map grows large, run a quick cleanup
  if (store.size > MAX_TRACKED_KEYS) {
    pruneExpiredEntries(store, now);
  }

  const windowStart = now - options.windowMs;
  const existing = store.get(options.key) ?? [];
  const timestamps = existing.filter((timestamp) => timestamp > windowStart);

  if (timestamps.length >= options.limit) {
    const oldestTimestamp = timestamps[0] ?? now;
    const resetAt = oldestTimestamp + options.windowMs;
    const retryAfterMs = Math.max(0, resetAt - now);

    return {
      allowed: false,
      limit: options.limit,
      remaining: 0,
      retryAfterMs,
      resetAt,
    };
  }

  timestamps.push(now);
  store.set(options.key, timestamps);

  return {
    allowed: true,
    limit: options.limit,
    remaining: Math.max(0, options.limit - timestamps.length),
    retryAfterMs: 0,
    resetAt: now + options.windowMs,
  };
}

/**
 * Clears recorded attempts for a key (e.g. upon a successful login).
 */
export function resetRateLimit(key: string): void {
  const store = getStore();
  store.delete(key);
}

/**
 * Resolves the client's IP address from incoming request headers.
 */
export async function getClientIp(): Promise<string> {
  const headerStore = await headers();

  const forwardedFor = headerStore.get('x-forwarded-for');
  if (forwardedFor) {
    const firstIp = forwardedFor.split(',')[0]?.trim();
    if (firstIp) {
      return firstIp;
    }
  }

  const realIp = headerStore.get('x-real-ip');
  if (realIp?.trim()) {
    return realIp.trim();
  }

  return '127.0.0.1';
}
