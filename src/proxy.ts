import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Security headers + a nonce-based Content-Security-Policy, following
 * Next.js's own documented CSP pattern (nonce generated per request, read
 * back in layout.tsx via `headers()` for the one inline script the app
 * ships). See SECURITY.md for why `style-src` needs 'unsafe-inline' —
 * Motion and Radix set inline `style` attributes for animation/positioning,
 * and there's no per-inline-style nonce story that works with a component
 * library doing that dynamically.
 */
export function proxy(request: NextRequest) {
  const nonce = crypto.randomUUID();

  // React's dev-mode debugging tools use eval() to reconstruct stack
  // traces across environments — harmless (React never uses eval() in
  // production), but it needs 'unsafe-eval' or every dev-mode page logs a
  // CSP violation. Production keeps the strict nonce-only script-src.
  const scriptSrc =
    process.env.NODE_ENV === "development"
      ? `'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-eval'`
      : `'self' 'nonce-${nonce}' 'strict-dynamic'`;

  const csp = `
    default-src 'self';
    script-src ${scriptSrc};
    style-src 'self' 'unsafe-inline';
    img-src 'self' data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `
    .replace(/\s{2,}/g, " ")
    .trim();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({ request: { headers: requestHeaders } });

  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload",
  );

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|images/).*)",
  ],
};
