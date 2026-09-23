/**
 * In-memory sliding window rate limiter abstraction.
 * Provides a $0, zero-Redis rate limiting mechanism suitable for Phase 1.
 * Can be swapped for a distributed database or Redis implementation in high-scale phases.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();

export interface RateLimitOptions {
  windowMs: number;
  maxRequests: number;
}

export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = { windowMs: 60 * 1000, maxRequests: 60 }
): { allowed: boolean; remaining: number; resetMs: number } {
  const now = Date.now();
  const windowStart = now - options.windowMs;

  let record = rateLimitStore.get(identifier);
  if (!record) {
    record = { timestamps: [] };
    rateLimitStore.set(identifier, record);
  }

  // Filter out timestamps outside the current sliding window
  record.timestamps = record.timestamps.filter((ts) => ts > windowStart);

  if (record.timestamps.length >= options.maxRequests) {
    const oldestTimestamp = record.timestamps[0];
    const resetMs = oldestTimestamp + options.windowMs - now;
    return {
      allowed: false,
      remaining: 0,
      resetMs: Math.max(resetMs, 0),
    };
  }

  record.timestamps.push(now);
  return {
    allowed: true,
    remaining: options.maxRequests - record.timestamps.length,
    resetMs: options.windowMs,
  };
}
