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
