"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { GalleryProvider, useGallery } from "@/components/gallery/gallery-provider";
import MasonryGrid from "@/components/ui/masonry-grid";
import { categories, type CategorySlug } from "@/lib/site";
import type { GalleryImage } from "@/lib/media";

type Filter = "all" | CategorySlug;

function FilterBar({
  active,
  onChange,
  counts,
}: {
  active: Filter;
  onChange: (filter: Filter) => void;
  counts: Map<Filter, number>;
}) {
  const options: { slug: Filter; label: string }[] = [
    { slug: "all", label: "All" },
    ...categories.map((category) => ({ slug: category.slug, label: category.label })),
  ];

  return (
    <div
      role="tablist"
      aria-label="Filter by category"
      className="sticky top-[5.5rem] z-30 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 border-y border-charcoal-3 bg-charcoal/95 px-4 py-4 backdrop-blur-md md:px-10"
    >
      {options.map((option) => {
        const count = counts.get(option.slug) ?? 0;
        if (count === 0) return null;
        const selected = option.slug === active;
        return (
          <button
            key={option.slug}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(option.slug)}
            className={cn(
              "kicker group relative inline-flex cursor-pointer items-start gap-1.5 py-1 transition-[color] duration-200",
              selected ? "text-brass" : "text-paper-muted hover:text-cream",
            )}
          >
            {option.label}
            <span
              className={cn(
                "text-[0.7em] leading-[1.5] transition-[color] duration-200",
                selected ? "text-brass" : "text-brass/60",
              )}
            >
              {count}
            </span>
            <span
              aria-hidden="true"
              className={cn(
                "absolute -bottom-0.5 left-0 h-px bg-brass transition-[width] duration-300 ease-[var(--ease-shutter)]",
                selected ? "w-full" : "w-0 group-hover:w-full",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}

function GalleryTile({ photo }: { photo: GalleryImage }) {
  const { open, indexOf, total } = useGallery();

  return (
    <button
      type="button"
      onClick={() => open(photo.id)}
      aria-label={`Open ${photo.caption} full size — photograph ${indexOf(photo.id) + 1} of ${total}`}
      className="group relative block w-full cursor-pointer overflow-hidden rounded-lg bg-charcoal-2 shadow-md transition-shadow duration-300 ease-in-out hover:shadow-xl hover:shadow-black/40"
    >
      <Image
        src={photo.src}
        alt={photo.caption}
        width={photo.width}
        height={photo.height}
        sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, (max-width: 1279px) 33vw, 25vw"
        quality={90}
        className="h-auto w-full"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-charcoal-2/0 transition-[background-color] duration-500 group-hover:bg-charcoal-2/20"
      />
      <span className="kicker-sm pointer-events-none absolute inset-x-0 bottom-0 translate-y-1.5 bg-gradient-to-t from-charcoal-2/90 to-transparent px-4 pb-3 pt-10 text-left text-cream opacity-0 transition-[opacity,transform] duration-400 ease-[var(--ease-shutter)] group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
        {photo.caption}
      </span>
    </button>
  );
}

export function GalleryPageContent({ photos }: { photos: GalleryImage[] }) {
  const [filter, setFilter] = React.useState<Filter>("all");

  const counts = React.useMemo(() => {
    const map = new Map<Filter, number>([["all", photos.length]]);
    for (const category of categories) {
      map.set(
        category.slug,
        photos.filter((photo) => photo.category === category.slug).length,
      );
    }
    return map;
  }, [photos]);

  const filtered = React.useMemo(
    () => (filter === "all" ? photos : photos.filter((photo) => photo.category === filter)),
    [photos, filter],
  );

  return (
    <GalleryProvider photos={filtered}>
      <FilterBar active={filter} onChange={setFilter} counts={counts} />

      <div className="shell py-10 md:py-14">
        <MasonryGrid
          items={filtered}
          getKey={(photo) => photo.id}
          className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4"
          gap="1rem"
          renderItem={(photo) => <GalleryTile photo={photo} />}
        />
      </div>
    </GalleryProvider>
  );
}
