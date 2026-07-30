import { PhotoFrame } from "@/components/gallery/photo-frame";
import { buildMosaic } from "@/components/gallery/mosaic-layout";
import { Reveal } from "@/components/motion/reveal";
import type { GalleryImage } from "@/lib/media";

/**
 * One category: a named opener, then that category's photographs laid
 * edge to edge in rows of varying height and width.
 */
export function Chapter({
  slug,
  label,
  blurb,
  photos,
}: {
  slug: string;
  label: string;
  blurb: string;
  photos: GalleryImage[];
}) {
  if (photos.length === 0) return null;

  const rows = buildMosaic(photos);

  return (
    <section
      id={slug}
      aria-labelledby={`${slug}-title`}
      className="scroll-mt-[5.5rem] bg-charcoal"
    >
      <Reveal
        as="header"
        className="flex flex-col gap-6 px-6 pb-12 pt-14 sm:flex-row sm:items-end sm:justify-between md:px-10 md:pb-14 md:pt-20"
      >
        <div>
          <span
            aria-hidden="true"
            className="block h-px w-14 bg-brass"
          />
          <h2
            id={`${slug}-title`}
            className="display mt-6 text-[clamp(2.75rem,8vw,6.5rem)] leading-[0.95] text-ivory"
          >
            {label}
          </h2>
          <p className="mt-5 max-w-[44ch] text-pretty text-[1.0625rem] leading-relaxed text-paper-muted">
            {blurb}
          </p>
        </div>

        <p className="kicker shrink-0 text-brass sm:pb-3">
          {photos.length} {photos.length === 1 ? "frame" : "frames"}
        </p>
      </Reveal>

      <div className="flex flex-col gap-1.5">
        {rows.map((row, index) => (
          <div
            key={index}
            style={{ "--row-h": row.height } as React.CSSProperties}
            className="grid grid-cols-1 gap-1.5 md:h-[var(--row-h)] md:grid-cols-12"
          >
            {row.cells.map((cell) => (
              <PhotoFrame
                key={cell.photo.id}
                photo={cell.photo}
                span={cell.span}
              />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
