"use client";

import { motion } from "motion/react";
import { SectionHeading } from "@/components/section-heading";
import { staggerChild, StaggerGroup } from "@/components/motion/reveal";
import { ApertureMark } from "@/components/brand/aperture";

type Testimonial = {
  quote: string;
  name: string;
  date: string;
};

const testimonials: Testimonial[] = [
  {
    quote:
      "Elish did a great job capturing photos of us at our baby shower!",
    name: "Pooja & Jay",
    date: "May 2024",
  },
  {
    quote:
      "We wanted a candid photoshoot of our date in Kingston, ON and Elish captured high quality photos we can look back on.",
    name: "Pearly & Shikhar",
    date: "Jul 2023",
  },
];

export function Reviews() {
  return (
    <section
      id="reviews"
      className="on-charcoal bg-charcoal py-[var(--section-y)]"
    >
      <div className="shell">
        <SectionHeading
          kicker="Reviews"
          title="What clients say"
          tone="paper"
        />

        <StaggerGroup
          as="ul"
          className="mt-14 grid gap-8 sm:grid-cols-2 lg:gap-10"
        >
          {testimonials.map((testimonial) => (
            <motion.li
              key={testimonial.name}
              variants={staggerChild}
              className="flex h-full flex-col border border-charcoal-3 bg-charcoal-2 p-8 md:p-10"
            >
              <figure className="flex h-full flex-col">
                <ApertureMark
                  className="h-6 w-6 text-brass"
                  strokeWidth={3.5}
                />
                <blockquote className="display mt-6 flex-1 text-balance text-[1.35rem] leading-[1.32] text-cream md:text-[1.5rem]">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <figcaption className="kicker-sm mt-8 text-brass">
                  {testimonial.name}
                  <span className="ml-2.5 text-paper-muted">
                    {testimonial.date}
                  </span>
                </figcaption>
              </figure>
            </motion.li>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
