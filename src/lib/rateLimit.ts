type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

let callsSinceSweep = 0;
function maybeSweep() {
  if (++callsSinceSweep < 500) return;
  callsSinceSweep = 0;
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (now > bucket.resetAt) buckets.delete(key);
  }
}

export type RateLimitResult = {
  success: boolean;
  remaining: number;
  resetAt: number;
};

/**
 * Best-effort, in-memory fixed-window rate limiter. Resets on cold start and
 * does not sync across multiple server instances - acceptable for this app's
 * scale, but not a hard guarantee under a multi-instance/serverless deployment.
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  maybeSweep();

  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || now > existing.resetAt) {
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    return { success: true, remaining: limit - 1, resetAt };
  }

  if (existing.count >= limit) {
    return { success: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  return {
    success: true,
    remaining: limit - existing.count,
    resetAt: existing.resetAt,
  };
}
