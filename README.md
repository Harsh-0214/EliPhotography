# Elish Modi Photography

Portfolio and booking site for Elish Modi. Next.js (App Router) + TypeScript +
Tailwind CSS v4 + Motion (Framer Motion) + shadcn/ui primitives on Radix.

---

## Running it

```bash
npm install
npm run dev        # http://localhost:3000
```

Other scripts: `npm run build`, `npm run start`, `npm run lint`, `npm run typecheck`.

---

## Adding the logo

Drop the logo file in at:

```
public/logo/elish-modi-logo.png
```

That exact path is already wired into the header, the hero masthead and the
footer. Nothing else needs changing — restart the dev server (or rebuild) and it
appears everywhere.

Until that file exists, the site renders a typeset version of the same lockup
(aperture mark + `ELISH MODI` / `PHOTOGRAPHY`) so nothing looks broken. `.jpg`,
`.webp` and `.avif` work too — the filename just has to be `elish-modi-logo`.

---

## Adding photographs

### Gallery

Put photos in `public/images/gallery/`. Two layouts work, pick whichever is
easier — no code changes for either:

**A. One folder per category** (recommended)

```
public/images/gallery/baby/first-light.jpg
public/images/gallery/family/01-beach-morning.jpg
public/images/gallery/portraits/window-seat.jpg
```

**B. Flat folder, category as the filename prefix**

```
public/images/gallery/baby-first-light.jpg
public/images/gallery/family-beach-morning.jpg
```

The six category names are fixed: `baby`, `family`, `portraits`, `children`,
`vehicles`, `landscape`.

Filename rules:

- A leading number sets the order — `01-`, `02-` — and is stripped from the caption.
- The rest of the filename becomes the caption and the alt text, so
  `01-beach-morning.jpg` reads as **Beach Morning**. Name files the way you would
  title a print.
- Supported: `.jpg` `.jpeg` `.png` `.webp` `.avif`

Each category becomes a **chapter** down the page: a named opener followed by
that category's photographs laid edge to edge in rows of varying height and
width. A category with no photographs in it is skipped entirely — nothing
renders as an empty section. Until any photos exist at all, the page falls back
to reserved brass frames.

### Hero and portrait

```
public/images/hero.jpg      # the full-screen opening frame
public/images/about.jpg     # portrait of Elish in the About section
```

Both are optional, and they behave differently when missing:

- **Hero** — falls back to a photograph from the gallery. Which one is set by
  `HERO_PICK` at the top of `scripts/scan-media.mjs`; change that path fragment
  to open on a different frame, or drop a file at `public/images/hero.jpg` to
  override it outright.
- **About portrait** — never borrowed. That image is captioned as Elish, so
  until a real portrait exists the section shows a photograph from the work
  under its own title instead.

> **Restart `npm run dev`** (or rebuild) after adding files. `scripts/scan-media.mjs`
> runs automatically as a `predev` / `prebuild` step, scans `public/`, and writes
> `src/lib/media-manifest.json`. Dimensions are read with sharp — including the
> EXIF orientation tag, so a portrait-orientation file lays out as a portrait —
> which keeps true aspect ratios with no layout shift.
>
> `npm run scan:media` re-runs the scan on its own if you want to see what it
> picked up without a full build.

---

## Things to fill in before launch

Everything below is a placeholder. All of it lives in **`src/lib/site.ts`**:

- `email` — currently `hello@elishmodi.com`
- `phone` — currently `+1 (000) 000-0000`
- `location` — currently "Available for travel"
- `social` — Instagram and Facebook both point at the bare domains
- `url` — used for metadata and Open Graph; currently `https://elishmodi.com`

Session prices, durations and the shoot-type dropdown all come from the
`services` array in the same file. Editing a price there updates the rate card
and the booking form together.

### Wiring up the form

The booking form validates on the server and shows a confirmation, but **it does
not send anything yet**. Enquiries are written to the server log only.

To connect it, open `src/app/actions.ts` and replace the `console.info` call
(marked `TODO(client)`) with a call to an email provider — Resend, Postmark, or a
form service like Formspree. The enquiry object is already validated and typed at
that point.

---

## How it is put together

```
src/
  app/
    layout.tsx        fonts, metadata, header + footer
    page.tsx          assembles the chapters and written sections
    actions.ts        booking Server Action
    globals.css       design tokens, base styles, keyframes
    icon.svg          favicon (the aperture mark)
  components/
    brand/            aperture mark, divider, logo, placeholder plate
    gallery/          chapters, the mosaic layout, the shared lightbox
    motion/           scroll reveal + clip reveal wrappers
    sections/         hero, about, rate card, contact
    ui/               shadcn/ui primitives, restyled
  lib/
    site.ts               client details, services, categories  ← edit this
    media.ts              typed access to the media manifest
    media-manifest.json   generated — do not edit by hand
scripts/
  scan-media.mjs      scans /public before dev and build
```

The scan deliberately happens **before** the build rather than inside a Server
Component. Reading the filesystem from the page's own module graph makes Next's
file tracer pull the whole project into the route's file list, and Vercel then
ships a deployment with no `/` route — it builds clean locally and 404s in
production. Keeping the scan in a `prebuild` step leaves the page a pure static
render.

### Design notes

The palette and the type both come from the logo:

| Token | Value | From |
| --- | --- | --- |
| `ivory` | `#F3EFE1` | logo background |
| `charcoal` | `#23272B` | camera body |
| `brass` | `#B99B55` | shutter blades |
| `brass-deep` | `#86682C` | brass darkened to pass AA on ivory |

Display face is **Marcellus** — inscriptional Roman capitals, the same letterform
tradition as the wordmark. Utility face is **Jost**, a geometric sans that sets
well in the wide-tracked capitals of the logo's "PHOTOGRAPHY" line. Brass is
reserved for accents, rules and hovers; it is never a background.

The whole page is the gallery. It opens on a full-screen photograph, lists the
categories, then runs each chapter edge to edge — no gutters, no container, row
heights and column spans varying so no two rows repeat. Written sections sit
*between* chapters rather than after them, so the page never stops being a
gallery. Within a row the widest cell takes the widest photograph, which drops
portrait-orientation frames into the narrow columns where they belong; on phones
every photo reverts to its own aspect ratio so nothing is cropped.

The signature element is the aperture. It opens across the opening frame on
load, marks every section divider, and stands in as the logo mark.

Accessibility and motion are handled globally: a skip link, a single brass focus
ring that no utility class can cancel, 44px minimum touch targets, and
`prefers-reduced-motion` respected via `MotionConfig reducedMotion="user"` —
fades are kept, movement is dropped.
