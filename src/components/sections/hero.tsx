import Image from "next/image";
import { Logo } from "@/components/brand/logo";
import { ApertureDivider } from "@/components/brand/aperture";
import { ApertureReveal } from "@/components/aperture-reveal";
import { Plate } from "@/components/brand/plate";
import { Button } from "@/components/ui/button";
import { HeroIntro } from "@/components/sections/hero-intro";
import type { SiteImage } from "@/lib/media";

export function Hero({
  logo,
  photo,
}: {
  logo: SiteImage | null;
  photo: SiteImage | null;
}) {
  return (
    <section id="top" className="relative">
      <div className="shell pb-11 pt-[7.5rem] text-center md:pb-14 md:pt-[10.5rem]">
        <HeroIntro>
          <span className="mx-auto block h-20 w-fit text-[2rem] sm:h-24 sm:text-[2.5rem] md:h-28 md:text-[3rem]">
            <Logo logo={logo} priority />
          </span>

          <ApertureDivider className="mx-auto mt-9 max-w-[16rem] md:max-w-xs" />

          <h1 className="display mx-auto mt-9 max-w-[18ch] text-balance text-[2.4rem] leading-[1.04] sm:text-[3.1rem] md:text-[4rem] lg:text-[4.6rem]">
            Light, patience, and one honest frame.
          </h1>

          <p className="mx-auto mt-7 max-w-[46ch] text-pretty text-[1.0625rem] leading-relaxed text-ink-muted md:text-[1.125rem]">
            Newborn, family and portrait sessions photographed in natural
            light — unhurried, unposed, and delivered as prints you will still
            want on the wall in twenty years.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <a href="#contact">Book a session</a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#work">See the work</a>
            </Button>
          </div>
        </HeroIntro>
      </div>

      <ApertureReveal className="h-[54svh] min-h-[320px] w-full md:h-[62svh] md:min-h-[420px]">
        <div className="relative h-full w-full">
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
        </div>
      </ApertureReveal>
    </section>
  );
}
