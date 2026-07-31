import { PhotoFrame } from "@/components/gallery/photo-frame";
import { ChapterCard } from "@/components/gallery/chapter-card";
import { composeChapter, type Block } from "@/components/gallery/compose";
import type { GalleryImage } from "@/lib/media";

/**
 * One category, packed as a collage.
 *
 * Every block below fills its own width exactly — flex shares, not grid
 * spans — so no arrangement of photographs can leave a hole. Block heights
 * differ so the chapter reads as a composition rather than a filmstrip, and
 * each block collapses to a shallower stack on phones.
 */

const GAP = "gap-1.5";

/** Panel heights. Deliberately shorter than a full screen so a chapter is
    read in two or three scrolls rather than ten. */
const HEIGHT: Record<Block["kind"], string> = {
  card: "md:h-[54svh] md:min-h-[28rem]",
  bigLeft: "h-[46svh] md:h-[54svh]",
  quad: "h-[52svh] md:h-[58svh]",
  pair: "h-[36svh] md:h-[46svh]",
  solo: "h-[34svh] md:h-[42svh]",
};

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

  const blocks = composeChapter(photos);

  return (
    <section
      id={slug}
      aria-labelledby={`${slug}-title`}
      className={`scroll-mt-[5.5rem] bg-charcoal flex flex-col ${GAP}`}
    >
      {blocks.map((block, index) => {
        const [a, b, c, d] = block.photos;

        if (block.kind === "card") {
          return (
            <div
              key={index}
              className={`flex flex-col ${GAP} ${HEIGHT.card} md:flex-row`}
            >
              <div className="md:w-[40%] lg:w-[34%]">
                <ChapterCard
                  slug={slug}
                  label={label}
                  blurb={blurb}
                  count={photos.length}
                />
              </div>
              <PhotoFrame
                photo={a}
                sizes="(max-width: 767px) 100vw, 62vw"
                className="h-[38svh] md:h-auto md:flex-1"
              />
            </div>
          );
        }

        if (block.kind === "bigLeft") {
          return (
            <div key={index} className={`flex ${GAP} ${HEIGHT.bigLeft}`}>
              <PhotoFrame
                photo={a}
                sizes="(max-width: 767px) 58vw, 60vw"
                className="w-[58%] md:w-[60%]"
              />
              <div className={`flex flex-1 flex-col ${GAP}`}>
                <PhotoFrame
                  photo={b}
                  sizes="(max-width: 767px) 42vw, 40vw"
                  className="flex-1"
                />
                <PhotoFrame
                  photo={c}
                  sizes="(max-width: 767px) 42vw, 40vw"
                  className="flex-1"
                />
              </div>
            </div>
          );
        }

        if (block.kind === "quad") {
          return (
            <div key={index} className={`flex ${GAP} ${HEIGHT.quad}`}>
              <PhotoFrame
                photo={a}
                sizes="(max-width: 767px) 40vw, 38vw"
                className="w-[40%] md:w-[38%]"
              />
              <div className={`flex flex-1 flex-col ${GAP}`}>
                <PhotoFrame
                  photo={b}
                  sizes="(max-width: 767px) 60vw, 62vw"
                  className="flex-1"
                />
                <div className={`flex flex-1 ${GAP}`}>
                  <PhotoFrame
                    photo={c}
                    sizes="(max-width: 767px) 30vw, 31vw"
                    className="w-1/2"
                  />
                  <PhotoFrame
                    photo={d}
                    sizes="(max-width: 767px) 30vw, 31vw"
                    className="w-1/2"
                  />
                </div>
              </div>
            </div>
          );
        }

        if (block.kind === "pair") {
          return (
            <div key={index} className={`flex ${GAP} ${HEIGHT.pair}`}>
              <PhotoFrame
                photo={a}
                sizes="(max-width: 767px) 55vw, 55vw"
                className="w-[55%]"
              />
              <PhotoFrame
                photo={b}
                sizes="(max-width: 767px) 45vw, 45vw"
                className="flex-1"
              />
            </div>
          );
        }

        return (
          <div key={index} className={HEIGHT.solo}>
            <PhotoFrame photo={a} sizes="100vw" className="h-full w-full" />
          </div>
        );
      })}
    </section>
  );
}
