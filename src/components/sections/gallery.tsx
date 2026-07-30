"use client";

import * as React from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { SectionHeading } from "@/components/section-heading";
import { Plate } from "@/components/brand/plate";
import { EASE } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
import { categories, type CategorySlug } from "@/lib/site";
import type { GalleryImage } from "@/lib/media";

type Filter = "all" | CategorySlug;

/* Shown until real photographs land in /public/images/gallery. The ratios
   are deliberately mixed so the magazine grid, the filters and the reveals
   are all visible in an empty build. */
const PLACEHOLDER_RATIOS: Record<CategorySlug, number> = {
  baby: 4 / 5,
  family: 3 / 2,
  portraits: 2 / 3,
  children: 4 / 5,
  vehicles: 3 / 2,
  landscape: 16 / 9,
};

const placeholderFrames = categories.map(({ slug, label }) => ({
  id: slug,
  category: slug,
  label,
  ratio: PLACEHOLDER_RATIOS[slug],
}));

export function Gallery({ images }: { images: GalleryImage[] }) {
  const isEmpty = images.length === 0;
  const [filter, setFilter] = React.useState<Filter>("all");
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  const available = React.useMemo(() => {
    const present = new Set(images.map((image) => image.category));
    return categories.filter(({ slug }) => present.has(slug));
  }, [images]);

  const shown = React.useMemo(
    () =>
      filter === "all"
        ? images
        : images.filter((image) => image.category === filter),
    [images, filter],
  );

  const shownPlaceholders = React.useMemo(
    () =>
      filter === "all"
        ? placeholderFrames
        : placeholderFrames.filter((frame) => frame.category === filter),
    [filter],
  );

  const filters: { slug: Filter; label: string }[] = [
    { slug: "all", label: "All" },
    ...(isEmpty ? [...categories] : available).map(({ slug, label }) => ({
      slug: slug as Filter,
      label,
    })),
  ];

  const active = openIndex === null ? null : shown[openIndex];

  const step = React.useCallback(
    (direction: 1 | -1) => {
      setOpenIndex((current) => {
        if (current === null || shown.length === 0) return current;
        return (current + direction + shown.length) % shown.length;
      });
    },
    [shown.length],
  );

  React.useEffect(() => {
    if (openIndex === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openIndex, step]);

  return (
    <section
      id="work"
      className="on-charcoal bg-charcoal py-[var(--section-y)] text-ivory"
    >
      <div className="shell">
        <SectionHeading
          kicker="Selected work"
          title="The gallery"
          standfirst="A working selection across sessions. Filter by the kind of shoot you have in mind."
          tone="paper"
        />

        <div
          role="group"
          aria-label="Filter photographs by category"
          className="mt-11 flex flex-wrap items-center gap-x-7 gap-y-3 border-b border-charcoal-3 pb-5"
        >
          {filters.map((item) => {
            const isActive = filter === item.slug;
            return (
              <button
                key={item.slug}
                type="button"
                onClick={() => setFilter(item.slug)}
                aria-pressed={isActive}
                className={cn(
                  "kicker group relative cursor-pointer py-2 transition-[color,transform] duration-200 ease-[var(--ease-shutter)] active:scale-[0.97]",
                  isActive
                    ? "text-brass"
                    : "text-paper-muted hover:text-ivory",
                )}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute -bottom-[1.35rem] left-0 h-px bg-brass transition-[width] duration-300 ease-[var(--ease-shutter)]",
                    isActive ? "w-full" : "w-0 group-hover:w-full",
                  )}
                />
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={filter}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6, transition: { duration: 0.14 } }}
            transition={{ duration: 0.28, ease: EASE }}
            className="mt-10 columns-1 gap-5 sm:columns-2 lg:columns-3"
          >
            {isEmpty
              ? shownPlaceholders.map((frame) => (
                  <div
                    key={frame.id}
                    className="mb-5 break-inside-avoid"
                    style={{ aspectRatio: frame.ratio }}
                  >
                    <Plate
                      variant="frame"
                      label={frame.label}
                      markClassName="h-10 w-10 md:h-12 md:w-12"
                    />
                  </div>
                ))
              : shown.map((image, index) => (
                  <figure key={image.id} className="mb-5 break-inside-avoid">
                    <button
                      type="button"
                      onClick={() => setOpenIndex(index)}
                      className="group relative block w-full cursor-pointer overflow-hidden bg-charcoal-2 transition-transform duration-200 ease-[var(--ease-shutter)] active:scale-[0.985]"
                      aria-label={`Open ${image.caption} at full size`}
                    >
                      <Image
                        src={image.src}
                        alt={image.caption}
                        width={image.width}
                        height={image.height}
                        sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
                        className="h-auto w-full object-cover transition-[transform,filter] duration-500 ease-[var(--ease-shutter)] motion-safe:group-hover:scale-[1.03]"
                      />
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 bg-charcoal-2/0 transition-[background-color] duration-300 group-hover:bg-charcoal-2/25"
                      />
                      <span className="kicker-sm pointer-events-none absolute bottom-0 left-0 right-0 translate-y-2 bg-gradient-to-t from-charcoal-2/85 to-transparent px-4 pb-3 pt-10 text-left text-ivory opacity-0 transition-[opacity,transform] duration-300 ease-[var(--ease-shutter)] group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                        {image.caption}
                      </span>
                    </button>
                  </figure>
                ))}
          </motion.div>
        </AnimatePresence>

        {isEmpty ? (
          <p className="mt-6 max-w-[62ch] text-[0.9375rem] leading-relaxed text-paper-muted">
            Frames reserved. Photographs added to{" "}
            <code className="font-sans text-brass">
              /public/images/gallery
            </code>{" "}
            appear here automatically, sorted into these categories.
          </p>
        ) : null}
      </div>

      <Dialog
        open={openIndex !== null}
        onOpenChange={(next) => !next && setOpenIndex(null)}
      >
        <DialogContent aria-describedby={undefined}>
          {active ? (
            <>
              <DialogTitle className="sr-only">{active.caption}</DialogTitle>
              <DialogDescription className="sr-only">
                Photograph {openIndex! + 1} of {shown.length}. Use the left and
                right arrow keys to move between photographs.
              </DialogDescription>

              <div className="flex items-center justify-between gap-4 px-5 py-4 md:px-8">
                <p className="kicker-sm text-paper-muted">
                  {String(openIndex! + 1).padStart(2, "0")} /{" "}
                  {String(shown.length).padStart(2, "0")}
                </p>
                <button
                  type="button"
                  onClick={() => setOpenIndex(null)}
                  aria-label="Close"
                  className="-mr-2 flex h-11 w-11 cursor-pointer items-center justify-center text-paper-muted transition-[color,transform] duration-150 ease-[var(--ease-shutter)] hover:text-ivory active:scale-[0.94]"
                >
                  <X aria-hidden="true" className="h-5 w-5" strokeWidth={1.5} />
                </button>
              </div>

              <div className="min-h-0 flex-1 px-5 md:px-20">
                {/* `fill` measures the border box, so the padding needs its
                    own positioned wrapper or the photo runs to the edges. */}
                <div className="relative h-full w-full">
                  <Image
                    key={active.id}
                    src={active.src}
                    alt={active.caption}
                    fill
                    sizes="100vw"
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 px-5 py-4 md:px-8">
                <p className="kicker-sm truncate text-ivory">
                  {active.caption}
                </p>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    aria-label="Previous photograph"
                    className="flex h-11 w-11 cursor-pointer items-center justify-center text-paper-muted transition-[color,transform] duration-150 ease-[var(--ease-shutter)] hover:text-brass active:scale-[0.94]"
                  >
                    <ArrowLeft
                      aria-hidden="true"
                      className="h-5 w-5"
                      strokeWidth={1.5}
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    aria-label="Next photograph"
                    className="flex h-11 w-11 cursor-pointer items-center justify-center text-paper-muted transition-[color,transform] duration-150 ease-[var(--ease-shutter)] hover:text-brass active:scale-[0.94]"
                  >
                    <ArrowRight
                      aria-hidden="true"
                      className="h-5 w-5"
                      strokeWidth={1.5}
                    />
                  </button>
                </div>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
}
