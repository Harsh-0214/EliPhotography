"use client";

import * as React from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { categories } from "@/lib/site";
import type { GalleryImage } from "@/lib/media";

/**
 * Holds the full collection so any photograph anywhere on the page can open
 * the lightbox, and so the arrow keys walk the whole body of work rather
 * than stopping at the end of a chapter.
 */

type GalleryContextValue = {
  open: (id: string) => void;
  indexOf: (id: string) => number;
  total: number;
};

const GalleryContext = React.createContext<GalleryContextValue | null>(null);

const labelFor = (slug: string) =>
  categories.find((category) => category.slug === slug)?.label ?? slug;

export function GalleryProvider({
  photos,
  children,
}: {
  photos: GalleryImage[];
  children: React.ReactNode;
}) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  const order = React.useMemo(
    () => new Map(photos.map((photo, index) => [photo.id, index])),
    [photos],
  );

  const step = React.useCallback(
    (direction: 1 | -1) => {
      setOpenIndex((current) =>
        current === null || photos.length === 0
          ? current
          : (current + direction + photos.length) % photos.length,
      );
    },
    [photos.length],
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

  const value = React.useMemo<GalleryContextValue>(
    () => ({
      open: (id) => {
        const index = order.get(id);
        if (index !== undefined) setOpenIndex(index);
      },
      indexOf: (id) => order.get(id) ?? 0,
      total: photos.length,
    }),
    [order, photos.length],
  );

  const active = openIndex === null ? null : photos[openIndex];

  return (
    <GalleryContext.Provider value={value}>
      {children}

      <Dialog
        open={openIndex !== null}
        onOpenChange={(next) => !next && setOpenIndex(null)}
      >
        <DialogContent aria-describedby={undefined}>
          {active ? (
            <>
              <DialogTitle className="sr-only">{active.caption}</DialogTitle>
              <DialogDescription className="sr-only">
                {labelFor(active.category)}, photograph {openIndex! + 1} of{" "}
                {photos.length}. Use the left and right arrow keys to move
                between photographs.
              </DialogDescription>

              <div className="flex items-center justify-between gap-4 px-5 py-4 md:px-8">
                <p className="kicker-sm text-brass">
                  {labelFor(active.category)}
                  <span className="ml-3 text-paper-muted">
                    {String(openIndex! + 1).padStart(2, "0")} /{" "}
                    {String(photos.length).padStart(2, "0")}
                  </span>
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
    </GalleryContext.Provider>
  );
}

export function useGallery() {
  const context = React.useContext(GalleryContext);
  if (!context) {
    throw new Error("useGallery must be used inside <GalleryProvider>");
  }
  return context;
}
