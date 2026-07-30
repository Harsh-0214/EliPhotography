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

A category filter only appears once that category has at least one photo. Until
any photos exist, the gallery shows reserved brass frames instead.

### Hero and portrait

```
public/images/hero.jpg      # full-bleed photograph under the masthead
public/images/about.jpg     # portrait of Elish in the About section
```

Both are optional. The hero is worth adding first — it is the frame the aperture
opens onto.

> The home page is statically rendered, so **restart `npm run dev`** (or rebuild)
> after adding files. Sizes are read from each file's header, so the gallery lays
> out at true aspect ratios with no cropping and no layout shift.

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
    page.tsx          reads /public, renders the five sections
    actions.ts        booking Server Action
    globals.css       design tokens, base styles, keyframes
    icon.svg          favicon (the aperture mark)
  components/
    brand/            aperture mark, divider, logo, placeholder plate
    motion/           scroll reveal + clip reveal wrappers
    sections/         hero, about, rate card, gallery, contact
    ui/               shadcn/ui primitives, restyled
  lib/
    site.ts           client details, services, categories  ← edit this
    media.ts          reads /public/images and /public/logo
    image-size.ts     intrinsic dimensions from file headers
```

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

The signature element is the aperture. It opens across the hero on load, marks
every section divider, and stands in as the logo mark.

Accessibility and motion are handled globally: a skip link, a single brass focus
ring that no utility class can cancel, 44px minimum touch targets, and
`prefers-reduced-motion` respected via `MotionConfig reducedMotion="user"` —
fades are kept, movement is dropped.
