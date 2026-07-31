"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { GalleryProvider } from "@/components/gallery/gallery-provider";
import { EASE } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
import type { GalleryImage } from "@/lib/media";

/**
 * The category bar and the panel it controls.
 *
 * Pressing a category swaps the work below in place — it does not scroll the
 * page. The bar itself sticks under the masthead so it stays reachable from
 * anywhere in a chapter, which is what makes swapping usable at all; without
 * it you would have to scroll back to the top to change category.
 *
 * Only the selected chapter is mounted, so the other categories' photographs
 * are never requested.
 */

export type Tab = {
  slug: string;
  label: string;
  photos: GalleryImage[];
};

export function ChapterTabs({
  tabs,
  panels,
}: {
  tabs: Tab[];
  /** Server-rendered chapters, in the same order as `tabs`. */
  panels: React.ReactNode[];
}) {
  const [active, setActive] = React.useState(0);
  const refs = React.useRef<(HTMLButtonElement | null)[]>([]);

  if (tabs.length === 0) return null;

  // The tablist keyboard contract: arrows move, Home/End jump.
  const onKeyDown = (event: React.KeyboardEvent) => {
    const moves: Record<string, number> = {
      ArrowRight: active + 1,
      ArrowLeft: active - 1,
      Home: 0,
      End: tabs.length - 1,
    };
    const next = moves[event.key];
    if (next === undefined) return;

    event.preventDefault();
    const index = (next + tabs.length) % tabs.length;
    setActive(index);
    refs.current[index]?.focus();
  };

  return (
    <section id="work" aria-label="The work, by category">
      <div className="sticky top-[5.5rem] z-30 border-y border-charcoal-3 bg-charcoal/95 backdrop-blur-md">
        <div
          role="tablist"
          aria-label="Photography categories"
          onKeyDown={onKeyDown}
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-0.5 px-4 py-2.5 md:h-14 md:gap-x-12 md:px-10 md:py-0"
        >
          {tabs.map((tab, index) => {
            const selected = index === active;
            return (
              <button
                key={tab.slug}
                ref={(node) => {
                  refs.current[index] = node;
                }}
                type="button"
                role="tab"
                id={`tab-${tab.slug}`}
                aria-selected={selected}
                aria-controls="chapter-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(index)}
                className={cn(
                  "kicker group relative inline-flex cursor-pointer items-start gap-1.5 py-2 transition-[color] duration-200",
                  selected
                    ? "text-brass"
                    : "text-paper-muted hover:text-ivory",
                )}
              >
                {tab.label}
                <span
                  className={cn(
                    "text-[0.7em] leading-[1.5] transition-[color] duration-200",
                    selected ? "text-brass" : "text-brass/60",
                  )}
                >
                  {tab.photos.length}
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
      </div>

      <GalleryProvider photos={tabs[active].photos}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={tabs[active].slug}
            id="chapter-panel"
            role="tabpanel"
            aria-labelledby={`tab-${tabs[active].slug}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.12 } }}
            transition={{ duration: 0.26, ease: EASE }}
          >
            {panels[active]}
          </motion.div>
        </AnimatePresence>
      </GalleryProvider>
    </section>
  );
}
