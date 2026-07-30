#!/usr/bin/env node
/**
 * Scans /public for the logo and photographs and writes src/lib/media-manifest.json.
 *
 * This runs as a `predev` / `prebuild` step rather than inside a Server
 * Component. Reading the filesystem from the page's own module graph makes
 * Next's file tracer walk the entire project, and Vercel then drops the
 * route from the build output — the page builds fine locally and 404s in
 * production. Scanning up front keeps the page a pure static render.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC_DIR = path.join(ROOT, "public");
const OUTPUT = path.join(ROOT, "src", "lib", "media-manifest.json");

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".avif"];

/** Must stay in step with `categories` in src/lib/site.ts. */
const CATEGORIES = [
  "baby",
  "family",
  "portraits",
  "children",
  "vehicles",
  "landscape",
];

/**
 * Which photograph opens the site when no dedicated /public/images/hero.*
 * file exists. Any path fragment under images/gallery works; if it matches
 * nothing, the rules below pick the first wide frame instead.
 */
const HERO_PICK = "family/05-sunset-on-the-cliff";
const HERO_FALLBACK_ORDER = ["family", "landscape", "baby", "children", "portraits"];

/* ------------------------------------------------------------------
   Scanning
   ------------------------------------------------------------------ */

function pickHero(gallery) {
  const named = gallery.find((photo) => photo.src.includes(HERO_PICK));
  if (named) return named;

  for (const category of HERO_FALLBACK_ORDER) {
    const inCategory = gallery.filter((photo) => photo.category === category);
    const wide = inCategory.find((photo) => photo.width / photo.height >= 1.35);
    if (wide) return wide;
    if (inCategory[0]) return inCategory[0];
  }
  return gallery[0] ?? null;
}

/**
 * Dimensions come from sharp rather than hand-parsed headers: camera JPEGs
 * bury the frame header behind EXIF blocks big enough to defeat a fixed-size
 * read, and they carry an orientation tag that decides whether the file is
 * actually portrait or landscape. Browsers and Next's optimiser both honour
 * that tag, so the layout has to use the rotated dimensions.
 */
async function measure(relativePath) {
  const absolute = path.join(PUBLIC_DIR, relativePath);
  try {
    const { width, height, orientation } = await sharp(absolute).metadata();
    if (!width || !height) {
      console.warn(`[media] could not read dimensions: ${relativePath}`);
      return null;
    }
    const rotated = typeof orientation === "number" && orientation >= 5;
    return {
      src: `/${relativePath.split(path.sep).join("/")}`,
      width: rotated ? height : width,
      height: rotated ? width : height,
    };
  } catch (error) {
    console.warn(`[media] skipped ${relativePath}: ${error.message}`);
    return null;
  }
}

async function findNamed(dir, basename) {
  for (const extension of IMAGE_EXTENSIONS) {
    const relative = path.join(dir, `${basename}${extension}`);
    if (fs.existsSync(path.join(PUBLIC_DIR, relative))) {
      const image = await measure(relative);
      if (image) return image;
    }
  }
  return null;
}

function listImageFiles(dir) {
  const absolute = path.join(PUBLIC_DIR, dir);
  if (!fs.existsSync(absolute)) return [];
  return fs
    .readdirSync(absolute, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isFile() &&
        IMAGE_EXTENSIONS.includes(path.extname(entry.name).toLowerCase()),
    )
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, "en", { numeric: true }));
}

function toCaption(filename) {
  return filename
    .replace(/\.[^.]+$/, "")
    .replace(/^\d+[-_]/, "") // strip an ordering prefix like "01-"
    .replace(/[-_]+/g, " ")
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

async function scanGallery() {
  const images = [];

  const push = async (relativePath, category, name) => {
    const measured = await measure(relativePath);
    if (!measured) return;
    images.push({
      ...measured,
      id: measured.src,
      category,
      caption: toCaption(name),
    });
  };

  // Layout A: one folder per category.
  for (const slug of CATEGORIES) {
    for (const name of listImageFiles(path.join("images", "gallery", slug))) {
      await push(path.join("images", "gallery", slug, name), slug, name);
    }
  }

  // Layout B: flat folder, category taken from the filename prefix.
  for (const name of listImageFiles(path.join("images", "gallery"))) {
    const prefix = name.split(/[-_]/)[0]?.toLowerCase() ?? "";
    if (!CATEGORIES.includes(prefix)) continue;
    await push(
      path.join("images", "gallery", name),
      prefix,
      name.slice(prefix.length + 1) || name,
    );
  }

  return images;
}

const gallery = await scanGallery();

const manifest = {
  logo: await findNamed("logo", "elish-modi-logo"),
  /* A dedicated file wins; otherwise the gallery lends the opening frame. */
  hero: (await findNamed("images", "hero")) ?? pickHero(gallery),
  /* Never borrowed — this one is captioned as Elish, so it stays null until
     a real portrait is supplied. */
  about: await findNamed("images", "about"),
  gallery,
};

fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
fs.writeFileSync(OUTPUT, `${JSON.stringify(manifest, null, 2)}\n`);

console.log(
  `[media] logo: ${manifest.logo ? "found" : "none"} · hero: ${
    manifest.hero ? "found" : "none"
  } · portrait: ${manifest.about ? "found" : "none"} · gallery: ${
    manifest.gallery.length
  } photo(s)`,
);
