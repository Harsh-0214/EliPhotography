"use client";

import * as React from "react";
import { motion } from "motion/react";
import { ArrowRight, X } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { staggerChild, StaggerGroup } from "@/components/motion/reveal";
import { ApertureMark } from "@/components/brand/aperture";
import { GalleryProvider, useGallery } from "@/components/gallery/gallery-provider";
import { ProtectedImage } from "@/components/media/protected-image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import MasonryGrid from "@/components/ui/masonry-grid";
import { getReviewAlbum, type AlbumImage } from "@/lib/media";

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

function AlbumTile({ photo }: { photo: AlbumImage }) {
  const { open, indexOf, total } = useGallery();
  return (
    <button
      type="button"
      onClick={() => open(photo.id)}
      aria-label={`Open photograph ${indexOf(photo.id) + 1} of ${total} full size`}
      className="group relative block w-full cursor-pointer overflow-hidden rounded-lg bg-charcoal-3 shadow-md transition-shadow duration-300 ease-in-out hover:shadow-xl hover:shadow-black/40"
    >
      <ProtectedImage
        src={photo.src}
        alt={photo.caption}
        width={photo.width}
        height={photo.height}
        sizes="(max-width: 639px) 100vw, (max-width: 767px) 50vw, 33vw"
        quality={90}
        className="h-auto w-full"
      />
    </button>
  );
}

/**
 * The grid a review's "View album" button opens: every photo in the
 * session at once, in the same justified/masonry language as the main
 * /gallery page. Picking a photo here opens the single-photo lightbox
 * (GalleryProvider's own Dialog, stacked on top) for one-by-one viewing.
 */
function AlbumDialog({
  photos,
  title,
  open,
  onOpenChange,
}: {
  photos: AlbumImage[];
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-charcoal" aria-describedby={undefined}>
        <DialogTitle className="sr-only">{title} — photo album</DialogTitle>
        <DialogDescription className="sr-only">
          {photos.length} photograph{photos.length === 1 ? "" : "s"}. Select one to
          view it full size.
        </DialogDescription>

        <div className="flex items-center justify-between gap-4 border-b border-charcoal-3 px-5 py-5 md:px-10">
          <div>
            <p className="kicker-sm text-paper-muted">Photo Album</p>
            <h3 className="display mt-1 text-[1.75rem] text-brass md:text-[2.25rem]">
              {title}
            </h3>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Close album"
            className="-mr-2 flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center text-paper-muted transition-[color,transform] duration-150 ease-[var(--ease-shutter)] hover:text-cream active:scale-[0.94]"
          >
            <X aria-hidden="true" className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-8 md:px-10">
          <MasonryGrid
            items={photos}
            getKey={(photo) => photo.id}
            className="columns-1 gap-4 sm:columns-2 lg:columns-3"
            gap="1rem"
            renderItem={(photo) => <AlbumTile photo={photo} />}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ViewAlbumButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
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
  const [albumOpen, setAlbumOpen] = React.useState(false);

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
        {album.length > 0 ? (
          <ViewAlbumButton onClick={() => setAlbumOpen(true)} />
        ) : null}
      </figure>
    </motion.li>
  );

  // Only wrap in a lightbox provider when there's something to show —
  // no point paying for the dialog machinery around an empty album.
  return album.length > 0 ? (
    <GalleryProvider photos={album} title={testimonial.name}>
      {card}
      <AlbumDialog
        photos={album}
        title={testimonial.name}
        open={albumOpen}
        onOpenChange={setAlbumOpen}
      />
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
