# Security

Technical record of the site's security posture: what's in place, why, and
what's intentionally deferred. This is the developer-facing companion to
the client-facing report — see `docs/client-report.md` for the plain-
language version.

Last reviewed: 2026-09-15. Stack: Next.js 16.3.5, React 19.2.4, deployed on
Vercel (`vercel.json`).

## Security headers & Content-Security-Policy

Set in `src/proxy.ts` (Next.js's current file convention for what used to
be called `middleware.ts` — see the deprecation note in that file's
history) on every document request, excluded from `_next/static`,
`_next/image`, `favicon.ico`, `icon.svg`, and everything under `/images/`
(no reason to run this on every photo request):

- **`Content-Security-Policy`** — nonce-based, following [Next.js's own
  documented pattern](https://nextjs.org/docs/app/guides/content-security-policy):
  a fresh random nonce is generated per request, attached to the app's one
  inline `<script>` (the dark-mode anti-flash script in `src/app/layout.tsx`),
  and `script-src` only trusts that nonce plus `'strict-dynamic'` — no
  `'unsafe-inline'`, no allowlisted third-party script hosts.
  - `style-src 'self' 'unsafe-inline'` is the one deliberate loosening.
    Motion (animation) and Radix (Dialog/Popover positioning) both set
    inline `style="..."` attributes at runtime — there is no practical
    per-inline-style nonce mechanism that works with a component library
    doing this dynamically, and this exact trade-off is called out in
    Next.js's own CSP guide. It does **not** weaken `script-src`, which is
    where CSP's real XSS protection lives.
  - `img-src 'self' data:`, `font-src 'self'`, `object-src 'none'`,
    `base-uri 'self'`, `form-action 'self'`, `frame-ancestors 'none'`,
    `upgrade-insecure-requests`.
  - In development only, `'unsafe-eval'` is added to `script-src` — React's
    dev-mode tooling uses `eval()` to reconstruct cross-environment stack
    traces. React never uses `eval()` in production, so this never applies
    to the deployed site.
- **`X-Frame-Options: DENY`** and CSP's **`frame-ancestors 'none'`** —
  clickjacking protection (the two overlap deliberately; `frame-ancestors`
  is what modern browsers actually honor, `X-Frame-Options` is the older
  fallback).
- **`X-Content-Type-Options: nosniff`** — stops the browser from
  MIME-sniffing responses into an executable type.
- **`Referrer-Policy: strict-origin-when-cross-origin`** — full URL sent
  same-origin, only the origin sent cross-origin.
- **`Permissions-Policy: camera=(), microphone=(), geolocation=()`** — the
  site never needs any of these; explicitly denying them closes off a class
  of embedded-third-party abuse.
- **`Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`**
  — Vercel already forces HTTPS and sends its own HSTS header for custom
  domains; this is set explicitly too as defense-in-depth / documentation
  of intent.

**Trade-off worth knowing about**: reading the per-request nonce via
`headers()` in `src/app/layout.tsx` makes the entire app render dynamically
(server-rendered per request) rather than statically at build time — this
is the documented cost of nonce-based CSP in Next.js, not a bug. For a
portfolio site at this traffic level it's a non-issue; if traffic grows
enough that this specific cost matters, the trade-off to revisit is nonce
CSP vs. a static `'unsafe-inline'`-based CSP with a weaker `script-src`.

## Image protection (the photos themselves)

**What's in place**: every photograph on the site (`src/components/media/protected-image.tsx`,
used everywhere a real photo renders — hero, about, the gallery wall, the
lightbox, review albums) disables the casual ways a visitor could save a
file:
- Right-click → "Save image as" is blocked (`onContextMenu` prevented).
- Drag-out-to-desktop is blocked (`draggable={false}`).
- **iOS Safari's long-press → "Save to Photos" popup is blocked** via
  `-webkit-touch-callout: none` — this is the only mechanism that suppresses
  it; there is no JavaScript equivalent. Chrome on Android fires a
  `contextmenu` DOM event on long-press too, so the same `onContextMenu`
  handler covers that case as well.
- Text/image selection is disabled on photos specifically (Tailwind's
  `select-none`), not globally — contact info and testimonial text remain
  selectable.

**What this is not**: a way to make the files undownloadable. A browser
has to receive the actual image bytes to display them, so anyone opening
devtools' Network tab, or running `curl <image-url>`, can still retrieve
the original file — full resolution, exactly as published. This ceiling
applies to every photography platform that displays images in a browser
(SmugMug, Pixieset, Squarespace, this site, all of them); there is no
client-side or even server-side fix within a normal public website that
changes this, short of never publishing full-resolution files (adding a
resolution cap and/or a visible watermark) — a design choice the client
explicitly declined for now, in favor of keeping current photo quality on
the live site.

## Booking form

`src/app/actions.ts` (`submitBooking`, the only Server Action in the app):
- Server-side validation on every field (name length, email format via
  regex, shoot type checked against the real service list, date sanity,
  message length) — errors are returned to the form, nothing is trusted
  from the client.
- Delivered via Resend (`RESEND_API_KEY`); if the key isn't set, the
  enquiry is logged server-side only (documented in `README.md`).
- A send failure is logged (`console.error`) but still shown as success to
  the visitor — they filled out the form correctly, and the client's
  email/phone are on the page as a backup, so a delivery hiccup on Resend's
  end shouldn't strand them.

**Known gap — deferred by client request, not yet implemented**: there is
no rate limiting, no CAPTCHA, and no honeypot field. A script could submit
this form repeatedly. Next.js Server Actions do carry a same-origin check
by default, which blocks the simplest cross-site abuse, but nothing here
stops a same-origin scripted flood. Recommended next steps, in order of
effort:
1. **Turn on Vercel's Attack Challenge Mode** (Vercel dashboard → Firewall)
   — no code change, free, mitigates volumetric abuse at the edge.
2. **Add a honeypot field** to the booking form — a hidden input real users
   never fill in; if it's non-empty, silently reject.
3. **Real per-IP rate limiting** — requires an external store (e.g. Upstash
   Redis via `@upstash/ratelimit`), a new dependency and env vars. Worth it
   only if abuse is actually observed.

## Dependencies

- `npm audit`: 0 vulnerabilities as of this review.
- `.github/dependabot.yml` — weekly automated PRs for npm dependency
  updates, so this doesn't silently drift.
- Versions are current (Next 16.3.5, React 19.2.4) — no stale/EOL packages.

## Secrets

`RESEND_API_KEY` and `BOOKING_FROM_EMAIL` are the only environment
variables the app reads (`.env.example` documents both). Both are
server-only — never exposed to the browser, never prefixed `NEXT_PUBLIC_`.
Set them in Vercel's project settings, never commit a real `.env` file.

## What Vercel already gives you for free

Automatic HTTPS/TLS certificate management and renewal, HSTS on custom
domains, a global CDN, and DDoS mitigation at the edge — none of this
needs any code in this repo. The one additional toggle worth turning on
manually is **Attack Challenge Mode** (see the booking-form section above).

## Other findings noted during this review (not fixed — out of scope)

- A handful of `next/image` components using `fill` sit inside a wrapper
  div that Next flags in dev-mode console output as not having an explicit
  `position` — cosmetic (the image still renders correctly; confirmed
  visually), unrelated to security, not touched here to keep this change
  scoped to security/image-protection work.
