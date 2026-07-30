import type { GalleryImage } from "@/lib/media";

/**
 * Lays a chapter's photographs into full-bleed rows of varying height and
 * width so the page reads as a hung wall rather than a uniform grid.
 *
 * Two rules do most of the work:
 *   1. Row shapes cycle, so no two adjacent rows are the same size.
 *   2. Within a row, the widest cell gets the widest photograph — portrait
 *      frames fall into the narrow columns, where they belong.
 */

export type MosaicCell = { photo: GalleryImage; span: number };
export type MosaicRow = { cells: MosaicCell[]; height: string };

/** Twelve-column patterns, cycled in order. Heights are viewport-relative. */
const PATTERNS: { spans: number[]; height: string }[] = [
  { spans: [12], height: "86svh" },
  { spans: [8, 4], height: "66svh" },
  { spans: [4, 4, 4], height: "52svh" },
  { spans: [5, 7], height: "72svh" },
  { spans: [6, 6], height: "60svh" },
  { spans: [4, 8], height: "66svh" },
  { spans: [4, 4, 4], height: "46svh" },
  { spans: [7, 5], height: "70svh" },
];

/** Used when the tail of a chapter is shorter than the next pattern. */
const TAILS: Record<number, { spans: number[]; height: string }> = {
  1: { spans: [12], height: "78svh" },
  2: { spans: [6, 6], height: "62svh" },
  3: { spans: [4, 4, 4], height: "50svh" },
};

const ratio = (photo: GalleryImage) => photo.width / photo.height;

function assign(photos: GalleryImage[], spans: number[]): MosaicCell[] {
  // Widest span takes the widest photo, so tall frames land in narrow cells.
  const byWidth = [...photos].sort((a, b) => ratio(b) - ratio(a));
  const spanOrder = spans
    .map((span, index) => ({ span, index }))
    .sort((a, b) => b.span - a.span);

  const cells: MosaicCell[] = new Array(spans.length);
  spanOrder.forEach((entry, position) => {
    cells[entry.index] = { photo: byWidth[position], span: entry.span };
  });
  return cells;
}

export function buildMosaic(photos: GalleryImage[]): MosaicRow[] {
  const rows: MosaicRow[] = [];
  let cursor = 0;
  let pattern = 0;

  while (cursor < photos.length) {
    const remaining = photos.length - cursor;
    const candidate = PATTERNS[pattern % PATTERNS.length];
    const shape =
      candidate.spans.length <= remaining
        ? candidate
        : (TAILS[remaining] ?? { spans: [12], height: "72svh" });

    const take = photos.slice(cursor, cursor + shape.spans.length);
    rows.push({ cells: assign(take, shape.spans), height: shape.height });

    cursor += shape.spans.length;
    pattern += 1;
  }

  return rows;
}

/** Tells the browser how wide this cell will actually be rendered. */
export function cellSizes(span: number): string {
  return `(max-width: 767px) 100vw, ${Math.round((span / 12) * 100)}vw`;
}
