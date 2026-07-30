import Image from "next/image";
import { SectionHeading } from "@/components/section-heading";
import { ClipReveal } from "@/components/motion/clip-reveal";
import { Reveal } from "@/components/motion/reveal";
import { ApertureMark } from "@/components/brand/aperture";
import { Plate } from "@/components/brand/plate";
import type { SiteImage } from "@/lib/media";
import { site } from "@/lib/site";

export function About({ portrait }: { portrait: SiteImage | null }) {
  return (
    <section
      id="about"
      className="border-t border-ivory-3 py-[var(--section-y)]"
    >
      <div className="shell grid gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:items-start lg:gap-20">
        <ClipReveal className="relative aspect-[4/5] w-full lg:sticky lg:top-32">
          {portrait ? (
            <Image
              src={portrait.src}
              alt="Elish Modi"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
          ) : (
            <Plate label="Portrait of Elish" />
          )}
        </ClipReveal>

        <div>
          <SectionHeading kicker="About" title="How I work" />

          <div className="mt-8 space-y-5 text-[1.0625rem] leading-relaxed text-ink-muted">
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
              <blockquote className="display mt-5 text-balance text-[1.6rem] leading-[1.28] text-ink sm:text-[1.9rem] md:text-[2.15rem]">
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
