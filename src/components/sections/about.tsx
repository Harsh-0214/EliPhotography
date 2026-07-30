import Image from "next/image";
import { ClipReveal } from "@/components/motion/clip-reveal";
import { Reveal } from "@/components/motion/reveal";
import { ApertureMark } from "@/components/brand/aperture";
import { Plate } from "@/components/brand/plate";
import type { GalleryImage, SiteImage } from "@/lib/media";
import { site } from "@/lib/site";

/**
 * The first breath of paper in the gallery run.
 *
 * `portrait` is a real photograph of Elish and is captioned as such.
 * `standIn` is borrowed from the work when no portrait has been supplied —
 * it keeps its own caption, because labelling someone else's picture as the
 * photographer would be a lie.
 */
export function About({
  portrait,
  standIn,
}: {
  portrait: SiteImage | null;
  standIn: GalleryImage | null;
}) {
  const image = portrait ?? standIn;
  const isPortraitOfElish = Boolean(portrait);

  return (
    <section
      id="about"
      className="scroll-mt-[5.5rem] bg-ivory"
    >
      <div className="grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)]">
        <ClipReveal className="relative aspect-[4/5] w-full lg:aspect-auto lg:min-h-[42rem]">
          {image ? (
            <Image
              src={image.src}
              alt={
                isPortraitOfElish
                  ? "Elish Modi"
                  : (standIn?.caption ?? "A photograph by Elish Modi")
              }
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
          ) : (
            <Plate label="Portrait of Elish" />
          )}

          {!isPortraitOfElish && standIn ? (
            <p className="kicker-sm absolute bottom-4 left-5 text-ivory/85 [text-shadow:0_1px_6px_rgba(26,30,33,0.7)] md:bottom-6 md:left-8">
              {standIn.caption}
            </p>
          ) : null}
        </ClipReveal>

        <div className="flex flex-col justify-center px-6 py-20 md:px-14 md:py-28 lg:px-20">
          <Reveal>
            <p className="kicker flex items-center gap-3 text-brass-deep">
              <span aria-hidden="true" className="h-px w-7 bg-brass-deep" />
              About
            </p>
            <h2 className="display mt-6 text-[clamp(2.25rem,5vw,3.5rem)] text-ink">
              How I work
            </h2>
          </Reveal>

          <div className="mt-8 max-w-[52ch] space-y-5 text-[1.0625rem] leading-relaxed text-ink-muted">
            <Reveal as="p" delay={0.05}>
              I photograph people the way I would want my own family
              photographed: quietly, with room to breathe. No countdowns, no
              forced smiles. Just enough direction to get everyone comfortable,
              and then a lot of patience while the real moment shows up.
            </Reveal>
            <Reveal as="p" delay={0.1}>
              Sessions run on natural light, indoors or out. You will see a
              first gallery within two weeks, edited by hand, and I will help
              you decide which frames are worth printing rather than leaving you
              with four hundred files and no idea where to start.
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <figure className="mt-12 border-l border-brass/50 pl-6 md:pl-8">
              <ApertureMark
                className="h-5 w-5 text-brass-deep"
                strokeWidth={4}
              />
              <blockquote className="display mt-5 max-w-[24ch] text-balance text-[1.55rem] leading-[1.28] text-ink sm:text-[1.85rem] md:text-[2.1rem]">
                “A good photograph isn’t posed into being. You wait for it, and
                you’re ready when it arrives.”
              </blockquote>
              <figcaption className="kicker-sm mt-6 text-brass-deep">
                {site.name}
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
