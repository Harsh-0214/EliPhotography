import { PhotoFrame } from "@/components/gallery/photo-frame";
import { ChapterCard } from "@/components/gallery/chapter-card";
import { isPortrait, splitIntoBlocks } from "@/components/gallery/compose";
import type { GalleryImage } from "@/lib/media";

/**
 * One category, shown when its tab is selected.
 *
 * The card holds the whole left edge of the section and stays there while
 * the photographs move past it — so the price, the session length and the
 * booking link are on screen for every frame in the chapter, not just the
 * first. The right side runs in blocks of two to four.
 */

const GAP = "gap-1.5";

/* The masthead (5.5rem) and the sticky category bar (3.5rem) both sit above
   the work, so a full-height panel is the screen minus both — 9rem. */
const PANEL = "h-[62svh] md:h-[calc(100svh-9rem)]";

const SIZES = {
  full: "(max-width: 767px) 100vw, 64vw",
  half: "(max-width: 767px) 50vw, 32vw",
  wide: "(max-width: 767px) 100vw, 64vw",
} as const;

function Block({
  photos,
  variant,
}: {
  photos: GalleryImage[];
  variant: number;
}) {
  const [a, b, c, d] = photos;

  if (photos.length === 1) {
    return (
      <div className={PANEL}>
        <PhotoFrame photo={a} sizes={SIZES.full} className="h-full w-full" />
      </div>
    );
  }

  if (photos.length === 2) {
    // Two landscapes read better stacked; anything upright wants its own column.
    const sideBySide = photos.some(isPortrait);
    return (
      <div className={`flex ${GAP} ${PANEL} ${sideBySide ? "" : "flex-col"}`}>
        <PhotoFrame
          photo={a}
          sizes={sideBySide ? SIZES.half : SIZES.wide}
          className="flex-1"
        />
        <PhotoFrame
          photo={b}
          sizes={sideBySide ? SIZES.half : SIZES.wide}
          className="flex-1"
        />
      </div>
    );
  }

  if (photos.length === 3) {
    // Alternated so consecutive blocks never share a shape.
    if (variant % 2 === 0) {
      return (
        <div className={`flex flex-col ${GAP} ${PANEL}`}>
          <PhotoFrame photo={a} sizes={SIZES.wide} className="flex-[1.15]" />
          <div className={`flex flex-1 ${GAP}`}>
            <PhotoFrame photo={b} sizes={SIZES.half} className="flex-1" />
            <PhotoFrame photo={c} sizes={SIZES.half} className="flex-1" />
          </div>
        </div>
      );
    }

    return (
      <div className={`flex ${GAP} ${PANEL}`}>
        <PhotoFrame photo={a} sizes={SIZES.half} className="w-[58%]" />
        <div className={`flex flex-1 flex-col ${GAP}`}>
          <PhotoFrame photo={b} sizes={SIZES.half} className="flex-1" />
          <PhotoFrame photo={c} sizes={SIZES.half} className="flex-1" />
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${GAP} ${PANEL}`}>
      <div className={`flex flex-1 ${GAP}`}>
        <PhotoFrame photo={a} sizes={SIZES.half} className="flex-1" />
        <PhotoFrame photo={b} sizes={SIZES.half} className="flex-1" />
      </div>
      <div className={`flex flex-1 ${GAP}`}>
        <PhotoFrame photo={c} sizes={SIZES.half} className="flex-1" />
        <PhotoFrame photo={d} sizes={SIZES.half} className="flex-1" />
      </div>
    </div>
  );
}

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

  const blocks = splitIntoBlocks(photos);

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

      <div className={`flex min-w-0 flex-1 flex-col ${GAP}`}>
        {blocks.map((block, index) => (
          <Block key={index} photos={block} variant={index} />
        ))}
      </div>
    </section>
  );
}
