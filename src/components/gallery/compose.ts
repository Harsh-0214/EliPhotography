import type { GalleryImage } from "@/lib/media";

/**
 * Splits a chapter into collage blocks.
 *
 * An earlier version let CSS grid pack tiles with `auto-flow: dense`, which
 * left charcoal holes wherever a tall tile blocked a column. These blocks
 * tessellate by construction instead: each one is a self-contained flex
 * composition that fills its own width exactly, so a chapter can never end
 * up with a gap in it.
 */

export type BlockKind = "card" | "bigLeft" | "quad" | "pair" | "solo";

export type Block = {
  kind: BlockKind;
  photos: GalleryImage[];
};

/** How many photographs each block consumes. */
const SIZE: Record<BlockKind, number> = {
  card: 1,
  bigLeft: 3,
  quad: 4,
  pair: 2,
  solo: 1,
};

/** Cycled after the opening card block, for variety down the chapter. */
const CYCLE: BlockKind[] = ["bigLeft", "quad", "pair", "quad", "bigLeft"];

/** The slot in each block that is tallest, and so wants the most upright frame. */
const TALL_SLOT: Partial<Record<BlockKind, number>> = {
  bigLeft: 0,
  quad: 0,
};

const ratio = (photo: GalleryImage) => photo.width / photo.height;

/** Moves the most upright photograph of the block into its tallest slot. */
function seat(kind: BlockKind, photos: GalleryImage[]): GalleryImage[] {
  const slot = TALL_SLOT[kind];
  if (slot === undefined || photos.length < 2) return photos;

  let tallest = 0;
  photos.forEach((photo, index) => {
    if (ratio(photo) < ratio(photos[tallest])) tallest = index;
  });
  if (tallest === slot) return photos;

  const seated = [...photos];
  [seated[slot], seated[tallest]] = [seated[tallest], seated[slot]];
  return seated;
}

export function composeChapter(photos: GalleryImage[]): Block[] {
  if (photos.length === 0) return [];

  // The chapter opens on the information card beside one lead photograph.
  const blocks: Block[] = [{ kind: "card", photos: photos.slice(0, 1) }];

  let cursor = 1;
  let step = 0;

  while (cursor < photos.length) {
    const remaining = photos.length - cursor;
    let kind = CYCLE[step % CYCLE.length];

    if (SIZE[kind] > remaining) {
      kind =
        remaining >= 4
          ? "quad"
          : remaining === 3
            ? "bigLeft"
            : remaining === 2
              ? "pair"
              : "solo";
    }

    const take = photos.slice(cursor, cursor + SIZE[kind]);
    blocks.push({ kind, photos: seat(kind, take) });
    cursor += SIZE[kind];
    step += 1;
  }

  return blocks;
}
