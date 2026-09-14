import { ChapterCard } from "@/components/gallery/chapter-card";
import { PhotoWall } from "@/components/gallery/photo-wall";
import type { GalleryImage } from "@/lib/media";

/**
 * One category, shown when its tab is selected.
 *
 * The card holds the whole left edge of the section and stays there while
 * the photographs move past it — so the price, the session length and the
 * booking link are on screen for every frame in the chapter, not just the
 * first. The right side is a justified wall of photographs (see PhotoWall):
 * every photo keeps its own real shape — nothing is ever cropped or padded
 * out to fit a shape it isn't — while rows still fill edge to edge, and the
 * wall keeps working exactly the same way as more photos of any shape are
 * added.
 */

const GAP = "gap-1.5";

export function Chapter({
  slug,
  label,
  blurb,
  detail,
  cta,
  photos,
}: {
  slug: string;
  label: string;
  blurb: string;
  detail: string;
  cta: string;
  photos: GalleryImage[];
}) {
  if (photos.length === 0) return null;

  return (
    <section
      id={slug}
      aria-labelledby={`${slug}-title`}
      className={`flex flex-col bg-charcoal ${GAP} md:flex-row md:items-start`}
    >
      {/* self-stretch gives the column the full height of the section, which
          is what the sticky panel inside it needs to travel against. */}
      <div className="md:w-[36%] md:shrink-0 md:self-stretch lg:w-[32%]">
        <div className="md:sticky md:top-[9rem] md:h-[calc(100svh-9rem)]">
          <ChapterCard
            slug={slug}
            label={label}
            blurb={blurb}
            detail={detail}
            cta={cta}
            count={photos.length}
          />
        </div>
      </div>

      <PhotoWall photos={photos} />
    </section>
  );
}
