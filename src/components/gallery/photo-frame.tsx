"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { useGallery } from "@/components/gallery/gallery-provider";
import { EASE } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
import type { GalleryImage } from "@/lib/media";

/**
 * One photograph in a collage block. The surrounding block sizes the frame;
 * this only fills it, opens the lightbox, and names itself on hover.
 */
export function PhotoFrame({
  photo,
  sizes,
  className,
}: {
  photo: GalleryImage;
  /** What share of the viewport this frame occupies, for srcset selection. */
  sizes: string;
  className?: string;
}) {
  const { open, indexOf, total } = useGallery();
  const reduceMotion = useReducedMotion();

  return (
    <motion.figure
      className={cn("relative min-h-0 min-w-0", className)}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-4% 0px -4% 0px" }}
      transition={{ duration: reduceMotion ? 0.3 : 0.65, ease: EASE }}
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
          sizes={sizes}
          className="object-cover transition-transform duration-700 ease-[var(--ease-shutter)] motion-safe:group-hover:scale-[1.035]"
        />

        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-charcoal-2/0 transition-[background-color] duration-500 group-hover:bg-charcoal-2/20"
        />

        <figcaption className="kicker-sm pointer-events-none absolute inset-x-0 bottom-0 translate-y-1.5 bg-gradient-to-t from-charcoal-2/85 to-transparent px-4 pb-3 pt-12 text-left text-ivory opacity-0 transition-[opacity,transform] duration-400 ease-[var(--ease-shutter)] group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
          {photo.caption}
        </figcaption>
      </button>
    </motion.figure>
  );
}
