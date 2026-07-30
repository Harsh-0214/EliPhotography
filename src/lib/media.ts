import manifest from "@/lib/media-manifest.json";
import type { CategorySlug } from "@/lib/site";

/**
 * Typed view over the media manifest that `scripts/scan-media.mjs` writes
 * during `predev` / `prebuild`.
 *
 * Deliberately free of `node:fs`: reading the filesystem from inside a
 * Server Component makes Next's tracer pull the whole project into the
 * route's file list, and Vercel then ships a deployment with no `/` route.
 * Scanning happens once, before the build, and the page stays a pure
 * static render.
 */

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

type MediaManifest = {
  logo: SiteImage | null;
  hero: SiteImage | null;
  about: SiteImage | null;
  gallery: GalleryImage[];
};

const media = manifest as MediaManifest;

/**
 * The client's logo, dropped in at /public/logo/elish-modi-logo.png.
 * Null until that file exists, so the UI can fall back to the typeset
 * wordmark instead of rendering a broken image.
 */
export function getLogo(): SiteImage | null {
  return media.logo;
}

/** Optional hero photograph: /public/images/hero.jpg */
export function getHeroImage(): SiteImage | null {
  return media.hero;
}

/** Optional portrait of Elish for the About section: /public/images/about.jpg */
export function getAboutImage(): SiteImage | null {
  return media.about;
}

/**
 * Photographs found under /public/images/gallery. Two layouts are supported
 * so files can be dropped in whichever way is convenient — see the README.
 */
export function getGalleryImages(): GalleryImage[] {
  return media.gallery;
}
