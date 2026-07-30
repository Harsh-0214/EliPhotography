/**
 * Minimal intrinsic-dimension reader for the formats a photographer will
 * realistically drop into /public/images.
 *
 * We read dimensions at build/request time so the gallery can lay photos out
 * at their true aspect ratio — real masonry, no cropping, and no layout shift
 * while they load. Only the file header is parsed, never the pixel data.
 */

export type Dimensions = { width: number; height: number };

export function readImageSize(buffer: Buffer): Dimensions | null {
  return png(buffer) ?? gif(buffer) ?? webp(buffer) ?? jpeg(buffer);
}

function png(b: Buffer): Dimensions | null {
  if (b.length < 24) return null;
  if (b.readUInt32BE(0) !== 0x89504e47) return null;
  if (b.toString("ascii", 12, 16) !== "IHDR") return null;
  return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
}

function gif(b: Buffer): Dimensions | null {
  if (b.length < 10) return null;
  if (b.toString("ascii", 0, 3) !== "GIF") return null;
  return { width: b.readUInt16LE(6), height: b.readUInt16LE(8) };
}

function webp(b: Buffer): Dimensions | null {
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
    return {
      width: (bits & 0x3fff) + 1,
      height: ((bits >> 14) & 0x3fff) + 1,
    };
  }

  return null;
}

function jpeg(b: Buffer): Dimensions | null {
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

    // Start-of-frame markers hold the dimensions. SOF4/SOF8/SOF12 are not
    // frame headers (they're DHT/JPG/DAC) so they're excluded.
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

    // Otherwise skip the segment by its declared length.
    const length = b.readUInt16BE(offset + 2);
    if (length < 2) return null;
    offset += 2 + length;
  }

  return null;
}
