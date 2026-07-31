"use client";

import { ArrowRight } from "lucide-react";
import { ApertureMark } from "@/components/brand/aperture";
import { useBooking } from "@/components/booking-provider";
import { services } from "@/lib/site";

/**
 * The chapter's heading and its facts, set into the collage as a tile of
 * paper among the photographs.
 *
 * Putting the session length, what you get and the price here — beside the
 * work they describe — means the answer arrives with the pictures instead of
 * waiting for the rate card further down.
 */
export function ChapterCard({
  slug,
  label,
  blurb,
  detail,
  cta,
  count,
}: {
  slug: string;
  label: string;
  blurb: string;
  detail: string;
  cta: string;
  count: number;
}) {
  const { setShootType } = useBooking();
  const service = services.find((entry) => entry.slug === slug);

  const book = () => {
    setShootType(slug);
    document.getElementById("contact")?.scrollIntoView({ block: "start" });
  };

  return (
    <div className="flex h-full flex-col bg-ivory p-7 md:p-8 lg:p-10">
      <div>
        <div className="flex items-baseline justify-between gap-4">
          <span aria-hidden="true" className="block h-px w-12 bg-brass-deep" />
          <span className="kicker-sm shrink-0 text-ink-muted">
            {count} {count === 1 ? "frame" : "frames"}
          </span>
        </div>

        <h2
          id={`${slug}-title`}
          className="display mt-5 text-[clamp(2.1rem,3.4vw,3.25rem)] leading-[1.02] text-ink"
        >
          {label}
        </h2>

        <p className="display mt-5 max-w-[26ch] text-pretty text-[1.2rem] leading-[1.4] text-ink md:text-[1.35rem]">
          {blurb}
        </p>

        <p className="mt-5 max-w-[42ch] text-pretty text-[0.9375rem] leading-relaxed text-ink-muted">
          {detail}
        </p>
      </div>

      {/* Holds the column open on the taller chapters without leaving the
          space looking accidental. */}
      <div className="flex flex-1 items-center py-8">
        <ApertureMark
          className="h-7 w-7 text-brass-deep/30 md:h-8 md:w-8"
          strokeWidth={3}
        />
      </div>

      {service ? (
        <div>
          <ul className="space-y-2 border-t border-ink/15 pt-5">
            {service.meta.map((item) => (
              <li
                key={item}
                className="kicker-sm flex items-start gap-2.5 text-ink-muted"
              >
                <span
                  aria-hidden="true"
                  className="mt-[0.45em] block h-[3px] w-[3px] shrink-0 bg-brass-deep"
                />
                {item}
              </li>
            ))}
          </ul>

          <p className="mt-6 flex items-baseline gap-2.5">
            <span className="display text-[1.9rem] leading-none text-brass-deep">
              {service.price}
            </span>
            {service.priceNote ? (
              <span className="kicker-sm text-ink-muted">
                {service.priceNote}
              </span>
            ) : null}
          </p>

          <button
            type="button"
            onClick={book}
            className="kicker group mt-6 inline-flex cursor-pointer items-center gap-2.5 text-ink transition-[color,transform] duration-200 ease-[var(--ease-shutter)] hover:text-brass-deep active:scale-[0.97]"
          >
            {cta}
            <ArrowRight
              aria-hidden="true"
              className="h-3.5 w-3.5 transition-transform duration-300 ease-[var(--ease-shutter)] group-hover:translate-x-1"
              strokeWidth={2}
            />
          </button>
        </div>
      ) : null}
    </div>
  );
}
