type SizedPhoto = { width: number; height: number };

export type JustifiedTile<T> = { photo: T; width: number; height: number };

/**
 * Classic "justified row" layout (as used by Flickr/Google Photos walls):
 * groups photos into rows that exactly fill `containerWidth`, scaling each
 * row's height so every photo in it keeps its own aspect ratio — nothing is
 * ever cropped or padded, a row is just as tall as it needs to be for its
 * photos to meet edge to edge. The final row is left at the target height
 * (not stretched) when it doesn't come close to filling the width, rather
 * than blowing up a couple of stray photos to reach the edge.
 */
export function justifyRows<T extends SizedPhoto>(
  photos: T[],
  containerWidth: number,
  targetRowHeight: number,
  gap: number,
): JustifiedTile<T>[][] {
  if (containerWidth <= 0) {
    return photos.map((photo) => [
      { photo, width: targetRowHeight * (photo.width / photo.height), height: targetRowHeight },
    ]);
  }

  const availableWidth = (count: number) => containerWidth - gap * Math.max(count - 1, 0);
  const sizeRow = (row: T[], height: number): JustifiedTile<T>[] =>
    row.map((photo) => ({ photo, width: height * (photo.width / photo.height), height }));

  const rows: JustifiedTile<T>[][] = [];
  let current: T[] = [];
  let aspectSum = 0;

  for (const photo of photos) {
    current.push(photo);
    aspectSum += photo.width / photo.height;

    const heightToFill = availableWidth(current.length) / aspectSum;
    if (heightToFill <= targetRowHeight) {
      rows.push(sizeRow(current, heightToFill));
      current = [];
      aspectSum = 0;
    }
  }

  if (current.length > 0) {
    const naturalWidth = aspectSum * targetRowHeight + gap * (current.length - 1);
    rows.push(
      naturalWidth >= containerWidth * 0.55
        ? sizeRow(current, availableWidth(current.length) / aspectSum)
        : sizeRow(current, targetRowHeight),
    );
  }

  return rows;
}

export function totalHeight(rows: { height: number }[][], gap: number): number {
  return rows.reduce((sum, row) => sum + (row[0]?.height ?? 0), 0) + gap * Math.max(rows.length - 1, 0);
}

/**
 * Same layout as `justifyRows`, but tries to reach `desiredHeight` — used
 * when a sticky sidebar next to the wall is taller than the wall's own
 * rows, so no bare background is left showing below the last row.
 *
 * There's no single row height to solve for directly: as the target row
 * height rises, photos regroup into fewer, taller rows in discrete jumps
 * (adding one more photo to a row can change a row's fill height a lot),
 * so the achievable total heights are a scattered, non-continuous set
 * rather than a smooth curve. This scans a range of candidate target
 * heights and picks whichever real layout comes closest to (without
 * undershooting) the desired height, falling back to the tallest
 * achievable arrangement if none reach it — e.g. a category with only one
 * or two photos genuinely may not be able to reach a tall sidebar.
 */
export function justifyRowsToFillHeight<T extends SizedPhoto>(
  photos: T[],
  containerWidth: number,
  desiredHeight: number,
  gap: number,
  baseTargetHeight: number,
): JustifiedTile<T>[][] {
  const natural = justifyRows(photos, containerWidth, baseTargetHeight, gap);
  if (containerWidth <= 0 || photos.length === 0 || desiredHeight <= totalHeight(natural, gap)) {
    return natural;
  }

  const maxCandidate = Math.max(baseTargetHeight * 5, desiredHeight * 1.2);
  const step = Math.max(baseTargetHeight / 20, 4);

  const candidates = [natural];
  for (let target = baseTargetHeight + step; target <= maxCandidate; target += step) {
    candidates.push(justifyRows(photos, containerWidth, target, gap));
  }

  const reachesTarget = candidates.filter((rows) => totalHeight(rows, gap) >= desiredHeight);

  if (reachesTarget.length > 0) {
    // Smallest total height that still covers the sidebar — least overshoot.
    return reachesTarget.reduce((smallest, rows) =>
      totalHeight(rows, gap) < totalHeight(smallest, gap) ? rows : smallest,
    );
  }

  // Too few photos to ever reach the sidebar's height — best effort.
  return candidates.reduce((tallest, rows) =>
    totalHeight(rows, gap) > totalHeight(tallest, gap) ? rows : tallest,
  );
}
