import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import { readImageSize } from "@/lib/image-size";
import { categories, type CategorySlug } from "@/lib/site";

/* Every read below is scoped to /public and happens while the page is being
   rendered — the home page is fully static, so this runs at build time. */
const PUBLIC_DIR = path.join(process.cwd(), "public");
const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".avif"];

export type SiteImage = {
  src: string;
  width: number;
  height: number;
};

export type GalleryImage = SiteImage & {
  id: string;
  category: CategorySlug;
  /** Derived from the filename, used as the lightbox caption and alt text. */
  caption: string;
};

const CATEGORY_SLUGS = new Set<string>(categories.map((c) => c.slug));

function measure(relativePath: string): SiteImage | null {
  const absolute = path.join(PUBLIC_DIR, relativePath);
  try {
    // Headers live in the first few KB; there is no need to read the photo.
    const handle = fs.openSync(absolute, "r");
    const head = Buffer.alloc(65536);
    const bytes = fs.readSync(handle, head, 0, head.length, 0);
    fs.closeSync(handle);

    const size = readImageSize(head.subarray(0, bytes));
    if (!size || !size.width || !size.height) return null;

    return { src: `/${relativePath.split(path.sep).join("/")}`, ...size };
  } catch {
    return null;
  }
}

/** First readable image matching `<dir>/<basename>.<ext>`, or null. */
function findNamed(dir: string, basename: string): SiteImage | null {
  for (const extension of IMAGE_EXTENSIONS) {
    const relative = path.join(dir, `${basename}${extension}`);
    if (fs.existsSync(path.join(PUBLIC_DIR, relative))) {
      const image = measure(relative);
      if (image) return image;
    }
  }
  return null;
}

/**
 * The client's logo, dropped in at /public/logo/elish-modi-logo.png.
 * Returns null until the file exists so the UI can fall back to the
 * typeset wordmark instead of rendering a broken image.
 */
export const getLogo = cache((): SiteImage | null =>
  findNamed("logo", "elish-modi-logo"),
);

/** Optional hero photograph: /public/images/hero.jpg */
export const getHeroImage = cache((): SiteImage | null =>
  findNamed("images", "hero"),
);

/** Optional portrait of Elish for the About section: /public/images/about.jpg */
export const getAboutImage = cache((): SiteImage | null =>
  findNamed("images", "about"),
);

function toCaption(filename: string): string {
  return filename
    .replace(/\.[^.]+$/, "")
    .replace(/^\d+[-_]/, "") // strip an ordering prefix like "01-"
    .replace(/[-_]+/g, " ")
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function listImageFiles(dir: string): string[] {
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

/**
 * Reads /public/images/gallery. Two layouts are supported so photos can be
 * dropped in whichever way is convenient — no code changes either way:
 *
 *   gallery/family/beach-morning.jpg      → category "family"
 *   gallery/family-beach-morning.jpg      → category "family"
 *
 * A leading number ("01-") controls order and is stripped from the caption.
 */
export const getGalleryImages = cache((): GalleryImage[] => {
  const images: GalleryImage[] = [];

  const push = (relativePath: string, category: CategorySlug, name: string) => {
    const measured = measure(relativePath);
    if (!measured) return;
    images.push({
      ...measured,
      id: measured.src,
      category,
      caption: toCaption(name),
    });
  };

  // Layout A: one folder per category.
  for (const { slug } of categories) {
    for (const name of listImageFiles(path.join("images", "gallery", slug))) {
      push(path.join("images", "gallery", slug, name), slug, name);
    }
  }

  // Layout B: flat folder, category taken from the filename prefix.
  for (const name of listImageFiles(path.join("images", "gallery"))) {
    const prefix = name.split(/[-_]/)[0]?.toLowerCase() ?? "";
    if (!CATEGORY_SLUGS.has(prefix)) continue;
    push(
      path.join("images", "gallery", name),
      prefix as CategorySlug,
      name.slice(prefix.length + 1) || name,
    );
  }

  return images;
});
