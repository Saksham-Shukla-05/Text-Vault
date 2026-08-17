/**
 * Reads the client IP from proxy headers. NextRequest.ip is unreliable/removed
 * across Next.js versions and hosts, so headers are the portable option -
 * these are set by Vercel and most reverse proxies (nginx, Cloudflare, etc).
 *
 * Accepts a standard Headers instance (Route Handlers) or a plain header
 * object (NextAuth's authorize() gets a plain Record, not a Headers).
 */
export function getClientIp(
  headers: Headers | Record<string, unknown> | undefined
): string {
  const read = (name: string): string | undefined => {
    if (!headers) return undefined;
    if (headers instanceof Headers) return headers.get(name) ?? undefined;
    const value = headers[name];
    return Array.isArray(value) ? value[0] : (value as string | undefined);
  };

  const forwardedFor = read("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();

  const realIp = read("x-real-ip");
  if (realIp) return realIp.trim();

  // No proxy header present (e.g. local dev) - every request shares one
  // bucket, which is an acceptable degradation for a best-effort limiter.
  return "unknown";
}
