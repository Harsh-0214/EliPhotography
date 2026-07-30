import Image from "next/image";
import { Logo } from "@/components/brand/logo";
import { ApertureDivider } from "@/components/brand/aperture";
import { ApertureReveal } from "@/components/aperture-reveal";
import { Plate } from "@/components/brand/plate";
import { Button } from "@/components/ui/button";
import { HeroIntro } from "@/components/sections/hero-intro";
import type { SiteImage } from "@/lib/media";

/**
 * The opening frame fills the viewport. The shutter opens on the photograph
 * and the masthead settles on top of it — the site starts inside the work
 * rather than introducing it.
 */
export function Hero({ photo }: { photo: SiteImage | null }) {
  return (
    <section
      id="top"
      className="relative h-svh min-h-[34rem] w-full overflow-hidden bg-charcoal-2"
    >
      <ApertureReveal className="absolute inset-0">
        {photo ? (
          <Image
            src={photo.src}
            alt="A photograph by Elish Modi"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <Plate />
        )}
      </ApertureReveal>

      {/* Scrim: dark enough to carry ivory type, light enough to leave the
          photograph legible underneath. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(26,30,33,0.66)_0%,rgba(26,30,33,0.42)_38%,rgba(26,30,33,0.56)_78%,rgba(26,30,33,0.8)_100%)]"
      />
      {/* A soft pool of shadow under the masthead so the type stays legible
          even when the frame behind it is blown out — a sun flare landing
          behind the wordmark is exactly the case this has to survive. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_60%_46%_at_50%_46%,rgba(26,30,33,0.5),transparent_72%)]"
      />

      <div className="on-charcoal relative flex h-full flex-col items-center justify-center px-6 pb-16 pt-[5.5rem] text-center [text-shadow:0_1px_22px_rgba(26,30,33,0.55)]">
        <HeroIntro>
          {/* Always the typeset lockup here, never the logo file: that
              artwork carries its own cream background and would sit on the
              photograph as a pale box. The header shows the real logo once
              you have scrolled onto paper. */}
          <span className="mx-auto block h-16 w-fit text-[1.6rem] sm:h-20 sm:text-[2.1rem] md:h-24 md:text-[2.6rem]">
            <Logo logo={null} tone="paper" />
          </span>

          <ApertureDivider
            tone="charcoal"
            className="mx-auto mt-7 max-w-[14rem] md:mt-9 md:max-w-xs"
          />

          <h1 className="display mx-auto mt-7 max-w-[18ch] text-balance text-[2.3rem] leading-[1.04] text-ivory sm:text-[3rem] md:mt-9 md:text-[3.9rem] lg:text-[4.5rem]">
            Light, patience, and one honest frame.
          </h1>

          <p className="mx-auto mt-6 max-w-[44ch] text-pretty text-[1.0625rem] leading-relaxed text-ivory/85 md:text-[1.125rem]">
            Newborn, family and portrait sessions photographed in natural
            light — unhurried, unposed, and made to be printed.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <a href="#contact">Book a session</a>
            </Button>
            <Button asChild size="lg" variant="paper">
              <a href="#work">See the work</a>
            </Button>
          </div>
        </HeroIntro>
      </div>
    </section>
  );
}
