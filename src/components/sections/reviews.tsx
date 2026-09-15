"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { staggerChild, StaggerGroup } from "@/components/motion/reveal";
import { ApertureMark } from "@/components/brand/aperture";
import { GalleryProvider, useGallery } from "@/components/gallery/gallery-provider";
import { getReviewAlbum } from "@/lib/media";

type Testimonial = {
  quote: string;
  name: string;
  date: string;
  /** Matches a folder under /public/images/reviews/<slug> — that session's
   * own photos, shown in the lightbox when someone opens this review. */
  slug: string;
};

const testimonials: Testimonial[] = [
  {
    quote:
      "Elish did a great job capturing photos of us at our baby shower!",
    name: "Pooja & Jay",
    date: "May 2024",
    slug: "pooja-jay",
  },
  {
    quote:
      "We wanted a candid photoshoot of our date in Kingston, ON and Elish captured high quality photos we can look back on.",
    name: "Pearly & Shikhar",
    date: "Jul 2023",
    slug: "pearly-shikhar",
  },
];

function ViewAlbumButton({ firstPhotoId }: { firstPhotoId: string }) {
  const { open } = useGallery();
  return (
    <button
      type="button"
      onClick={() => open(firstPhotoId)}
      className="kicker group mt-6 inline-flex cursor-pointer items-center gap-2.5 self-start text-brass transition-[color,transform] duration-200 ease-[var(--ease-shutter)] hover:text-cream active:scale-[0.97]"
    >
      View album
      <ArrowRight
        aria-hidden="true"
        className="h-3.5 w-3.5 transition-transform duration-300 ease-[var(--ease-shutter)] group-hover:translate-x-1"
        strokeWidth={2}
      />
    </button>
  );
}

function ReviewCard({ testimonial }: { testimonial: Testimonial }) {
  const album = getReviewAlbum(testimonial.slug);

  const card = (
    <motion.li
      variants={staggerChild}
      className="flex h-full flex-col border border-charcoal-3 bg-charcoal-2 p-8 md:p-10"
    >
      <figure className="flex h-full flex-col">
        <ApertureMark className="h-6 w-6 text-brass" strokeWidth={3.5} />
        <blockquote className="display mt-6 flex-1 text-balance text-[1.35rem] leading-[1.32] text-cream md:text-[1.5rem]">
          &ldquo;{testimonial.quote}&rdquo;
        </blockquote>
        <figcaption className="kicker-sm mt-8 text-brass">
          {testimonial.name}
          <span className="ml-2.5 text-paper-muted">{testimonial.date}</span>
        </figcaption>
        {album.length > 0 ? <ViewAlbumButton firstPhotoId={album[0].id} /> : null}
      </figure>
    </motion.li>
  );

  // Only wrap in a lightbox provider when there's something to show —
  // no point paying for the dialog machinery around an empty album.
  return album.length > 0 ? (
    <GalleryProvider photos={album} title={testimonial.name}>
      {card}
    </GalleryProvider>
  ) : (
    card
  );
}

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
            <ReviewCard key={testimonial.slug} testimonial={testimonial} />
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
