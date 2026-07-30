"use client";

import * as React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { useGallery } from "@/components/gallery/gallery-provider";
import { cellSizes } from "@/components/gallery/mosaic-layout";
import { EASE } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
import type { GalleryImage } from "@/lib/media";

/**
 * One photograph in the wall.
 *
 * On phones the frame takes the photo's own aspect ratio so nothing is
 * cropped; from `md` up it fills whatever cell the mosaic gave it. The
 * ratio rides in on a custom property rather than an inline `aspect-ratio`,
 * because an inline style would outrank the breakpoint that clears it.
 */
export function PhotoFrame({
  photo,
  span,
  priority = false,
}: {
  photo: GalleryImage;
  span: number;
  priority?: boolean;
}) {
  const { open, indexOf, total } = useGallery();
  const reduceMotion = useReducedMotion();

  const spanClass: Record<number, string> = {
    4: "md:col-span-4",
    5: "md:col-span-5",
    6: "md:col-span-6",
    7: "md:col-span-7",
    8: "md:col-span-8",
    12: "md:col-span-12",
  };

  return (
    <motion.figure
      style={{ "--ar": String(photo.width / photo.height) } as React.CSSProperties}
      className={cn(
        "relative aspect-[var(--ar)] md:aspect-auto md:h-full",
        spanClass[span] ?? "md:col-span-12",
      )}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-5% 0px -5% 0px" }}
      transition={{ duration: reduceMotion ? 0.3 : 0.7, ease: EASE }}
    >
      <button
        type="button"
        onClick={() => open(photo.id)}
        aria-label={`Open ${photo.caption} full size — photograph ${
          indexOf(photo.id) + 1
        } of ${total}`}
        className="group absolute inset-0 block h-full w-full cursor-pointer overflow-hidden bg-charcoal-2"
      >
        <Image
          src={photo.src}
          alt={photo.caption}
          fill
          sizes={cellSizes(span)}
          priority={priority}
          className="object-cover transition-transform duration-700 ease-[var(--ease-shutter)] motion-safe:group-hover:scale-[1.035]"
        />

        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-charcoal-2/0 transition-[background-color] duration-500 group-hover:bg-charcoal-2/20"
        />

        <figcaption className="kicker-sm pointer-events-none absolute inset-x-0 bottom-0 translate-y-1.5 bg-gradient-to-t from-charcoal-2/85 to-transparent px-5 pb-4 pt-14 text-left text-ivory opacity-0 transition-[opacity,transform] duration-400 ease-[var(--ease-shutter)] group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
          {photo.caption}
        </figcaption>
      </button>
    </motion.figure>
  );
}
