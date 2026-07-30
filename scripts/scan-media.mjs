#!/usr/bin/env node
/**
 * Scans /public for the logo and photographs and writes src/lib/media-manifest.json.
 *
 * This runs as a `predev` / `prebuild` step rather than inside a Server
 * Component. Reading the filesystem from the page's own module graph makes
 * Next's file tracer walk the entire project, and Vercel then drops the
 * route from the build output — the page builds fine locally and 404s in
 * production. Scanning up front keeps the page a pure static render.
 *
 * Only file headers are read, never pixel data, so dimensions are cheap.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

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

/* ------------------------------------------------------------------
   Intrinsic dimensions from file headers
   ------------------------------------------------------------------ */

function png(b) {
  if (b.length < 24) return null;
  if (b.readUInt32BE(0) !== 0x89504e47) return null;
  if (b.toString("ascii", 12, 16) !== "IHDR") return null;
  return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
}

function gif(b) {
  if (b.length < 10) return null;
  if (b.toString("ascii", 0, 3) !== "GIF") return null;
  return { width: b.readUInt16LE(6), height: b.readUInt16LE(8) };
}

function webp(b) {
  if (b.length < 30) return null;
  if (b.toString("ascii", 0, 4) !== "RIFF") return null;
  if (b.toString("ascii", 8, 12) !== "WEBP") return null;

  const chunk = b.toString("ascii", 12, 16);

  if (chunk === "VP8X") {
    return {
      width: 1 + (b.readUIntLE(24, 3) & 0xffffff),
      height: 1 + (b.readUIntLE(27, 3) & 0xffffff),
    };
  }
  if (chunk === "VP8 ") {
    return {
      width: b.readUInt16LE(26) & 0x3fff,
      height: b.readUInt16LE(28) & 0x3fff,
    };
  }
  if (chunk === "VP8L") {
    const bits = b.readUInt32LE(21);
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
  }
  return null;
}

function avif(b) {
  // ISO-BMFF: walk the meta/iprp/ipco boxes for the ispe entry.
  if (b.length < 12) return null;
  if (b.toString("ascii", 4, 8) !== "ftyp") return null;

  const marker = b.indexOf("ispe", 0, "ascii");
  if (marker < 0 || marker + 16 > b.length) return null;

  return {
    width: b.readUInt32BE(marker + 8),
    height: b.readUInt32BE(marker + 12),
  };
}

function jpeg(b) {
  if (b.length < 4 || b.readUInt16BE(0) !== 0xffd8) return null;

  let offset = 2;
  while (offset + 9 < b.length) {
    if (b[offset] !== 0xff) {
      offset += 1;
      continue;
    }

    const marker = b[offset + 1];

    // Standalone markers carry no payload.
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      offset += 2;
      continue;
    }

    // Start-of-frame markers hold the dimensions. 0xC4 / 0xC8 / 0xCC are
    // DHT / JPG / DAC, not frame headers.
    const isFrameHeader =
      marker >= 0xc0 &&
      marker <= 0xcf &&
      marker !== 0xc4 &&
      marker !== 0xc8 &&
      marker !== 0xcc;

    if (isFrameHeader) {
      return {
        height: b.readUInt16BE(offset + 5),
        width: b.readUInt16BE(offset + 7),
      };
    }

    const length = b.readUInt16BE(offset + 2);
    if (length < 2) return null;
    offset += 2 + length;
  }

  return null;
}

function readImageSize(buffer) {
  return (
    png(buffer) ??
    gif(buffer) ??
    webp(buffer) ??
    avif(buffer) ??
    jpeg(buffer)
  );
}

/* ------------------------------------------------------------------
   Scanning
   ------------------------------------------------------------------ */

function measure(relativePath) {
  const absolute = path.join(PUBLIC_DIR, relativePath);
  let handle;
  try {
    handle = fs.openSync(absolute, "r");
    const head = Buffer.alloc(65536);
    const bytes = fs.readSync(handle, head, 0, head.length, 0);
    const size = readImageSize(head.subarray(0, bytes));
    if (!size?.width || !size?.height) {
      console.warn(`[media] could not read dimensions: ${relativePath}`);
      return null;
    }
    return { src: `/${relativePath.split(path.sep).join("/")}`, ...size };
  } catch {
    return null;
  } finally {
    if (handle !== undefined) fs.closeSync(handle);
  }
}

function findNamed(dir, basename) {
  for (const extension of IMAGE_EXTENSIONS) {
    const relative = path.join(dir, `${basename}${extension}`);
    if (fs.existsSync(path.join(PUBLIC_DIR, relative))) {
      const image = measure(relative);
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

function scanGallery() {
  const images = [];

  const push = (relativePath, category, name) => {
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
  for (const slug of CATEGORIES) {
    for (const name of listImageFiles(path.join("images", "gallery", slug))) {
      push(path.join("images", "gallery", slug, name), slug, name);
    }
  }

  // Layout B: flat folder, category taken from the filename prefix.
  for (const name of listImageFiles(path.join("images", "gallery"))) {
    const prefix = name.split(/[-_]/)[0]?.toLowerCase() ?? "";
    if (!CATEGORIES.includes(prefix)) continue;
    push(
      path.join("images", "gallery", name),
      prefix,
      name.slice(prefix.length + 1) || name,
    );
  }

  return images;
}

const manifest = {
  logo: findNamed("logo", "elish-modi-logo"),
  hero: findNamed("images", "hero"),
  about: findNamed("images", "about"),
  gallery: scanGallery(),
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
