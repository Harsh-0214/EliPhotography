import type { GalleryImage } from "@/lib/media";

/**
 * Splits a chapter's photographs into the blocks that stack down the right
 * of the section — two, three or four frames each, never a lone straggler.
 */

const PATTERN = [3, 4, 3, 2, 4];

export function splitIntoBlocks(photos: GalleryImage[]): GalleryImage[][] {
  const blocks: GalleryImage[][] = [];
  let cursor = 0;
  let step = 0;

  while (cursor < photos.length) {
    const remaining = photos.length - cursor;
    let size = Math.min(PATTERN[step % PATTERN.length], remaining);

    // Never leave a single photograph stranded in a block of its own.
    if (remaining - size === 1) size = Math.min(remaining, size + 1);

    blocks.push(photos.slice(cursor, cursor + size));
    cursor += size;
    step += 1;
  }

  return blocks;
}

export const isPortrait = (photo: GalleryImage) => photo.width / photo.height < 1;
