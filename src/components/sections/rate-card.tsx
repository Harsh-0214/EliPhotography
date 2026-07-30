"use client";

import { motion } from "motion/react";
import { SectionHeading } from "@/components/section-heading";
import { staggerChild, StaggerGroup } from "@/components/motion/reveal";
import { useBooking } from "@/components/booking-provider";
import { services } from "@/lib/site";

/* A rate card, not a grid of cards: each service is a ruled line with the
   price set at the far margin, the way a menu or a printed price list does
   it. The rule between name and price fills with brass on hover — the row's
   own leader line doubling as its hover state. */

export function RateCard() {
  const { setShootType } = useBooking();

  const book = (slug: string) => {
    setShootType(slug);
    document.getElementById("contact")?.scrollIntoView({ block: "start" });
  };

  return (
    <section
      id="rates"
      className="scroll-mt-[5.5rem] bg-ivory-2 py-[var(--section-y)]"
    >
      <div className="shell">
        <SectionHeading
          kicker="Rate card"
          title="What a session costs"
          standfirst="Prices cover the session itself. Edited images are delivered within two weeks; prints and albums are quoted separately."
        />

        <StaggerGroup as="ul" className="mt-14 border-t border-ink/15">
          {services.map((service) => (
            <motion.li key={service.slug} variants={staggerChild}>
              <button
                type="button"
                onClick={() => book(service.slug)}
                aria-label={`Book ${service.name} — ${service.price}${
                  service.priceNote ? ` ${service.priceNote}` : ""
                }`}
                className="group block w-full cursor-pointer border-b border-ink/15 py-6 text-left transition-[background-color] duration-200 ease-[var(--ease-shutter)] hover:bg-ink/[0.025] active:bg-ink/[0.05] md:py-7"
              >
                <span className="flex items-baseline gap-4 md:gap-6">
                  <span className="display min-w-0 text-[1.3rem] text-ink transition-[color] duration-200 group-hover:text-brass-deep sm:shrink-0 sm:text-[1.6rem] md:text-[1.9rem]">
                    {service.name}
                  </span>

                  <span
                    aria-hidden="true"
                    className="relative top-[-0.35em] hidden h-px flex-1 bg-ink/20 sm:block"
                  >
                    <span className="absolute inset-0 origin-left scale-x-0 bg-brass-deep transition-transform duration-500 ease-[var(--ease-shutter)] group-hover:scale-x-100" />
                  </span>

                  <span className="ml-auto shrink-0 text-right sm:ml-0">
                    <span className="display block text-[1.35rem] text-brass-deep sm:text-[1.6rem] md:text-[1.9rem]">
                      {service.price}
                    </span>
                    {service.priceNote ? (
                      <span className="kicker-sm mt-1 block text-ink-muted">
                        {service.priceNote}
                      </span>
                    ) : null}
                  </span>
                </span>

                <span className="kicker-sm mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-ink-muted">
                  {service.meta.map((item, index) => (
                    <span key={item} className="flex items-center gap-3">
                      {index > 0 ? (
                        <span
                          aria-hidden="true"
                          className="h-[3px] w-[3px] bg-brass-deep/60"
                        />
                      ) : null}
                      {item}
                    </span>
                  ))}
                </span>
              </button>
            </motion.li>
          ))}
        </StaggerGroup>

        <p className="mt-8 max-w-[58ch] text-[0.9375rem] leading-relaxed text-ink-muted">
          Choose a line to start a booking — the form below will already know
          which session you mean.
        </p>
      </div>
    </section>
  );
}
