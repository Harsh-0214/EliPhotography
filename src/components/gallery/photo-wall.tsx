"use client";

import * as React from "react";
import { PhotoFrame } from "@/components/gallery/photo-frame";
import { justifyRows, justifyRowsToFillHeight } from "@/components/gallery/justify";
import type { GalleryImage } from "@/lib/media";

const GAP_PX = 6; // matches gap-1.5 (0.375rem at the default 16px root)
const GAP_CLASS = "gap-1.5";

/** Row height the layout aims for at each breakpoint — actual row heights
 * vary around this so every photo can keep its own shape. */
function targetHeight(containerWidth: number) {
  if (containerWidth >= 1024) return 340;
  if (containerWidth >= 768) return 280;
  return 230;
}

/**
 * A justified wall of photographs: every photo keeps its real aspect ratio
 * (no crop, no letterboxing) while each row is scaled to exactly fill the
 * available width, the way a proper photo-wall grid does. Needs the
 * container's real pixel width, which depends on the sticky sidebar's
 * rendered size, so this measures itself after mount rather than guessing.
 */
export function PhotoWall({
  photos,
  fillHeight = 0,
}: {
  photos: GalleryImage[];
  /** The sidebar card's measured height (desktop only). When it's taller
   * than the wall's own natural rows, rows regroup to reach it — so no
   * bare background is left below the last row. */
  fillHeight?: number;
}) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [width, setWidth] = React.useState(0);

  React.useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      if (entry) setWidth(entry.contentRect.width);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const base = targetHeight(width);
  const rows =
    width >= 768 && fillHeight > 0
      ? justifyRowsToFillHeight(photos, width, fillHeight, GAP_PX, base)
      : justifyRows(photos, width, base, GAP_PX);

  return (
    <div ref={containerRef} className={`flex min-w-0 flex-1 flex-col ${GAP_CLASS}`}>
      {rows.map((row, index) => (
        <div key={index} className={`flex ${GAP_CLASS}`}>
          {row.map(({ photo, width: tileWidth, height: tileHeight }) => (
            <PhotoFrame
              key={photo.id}
              photo={photo}
              sizes="(max-width: 767px) 60vw, 34vw"
              style={{ width: tileWidth, height: tileHeight }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
