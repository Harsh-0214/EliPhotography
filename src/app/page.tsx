import { Fragment } from "react";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { RateCard } from "@/components/sections/rate-card";
import { Contact } from "@/components/sections/contact";
import { Chapter } from "@/components/gallery/chapter";
import { ChapterIndex } from "@/components/gallery/chapter-index";
import { GalleryProvider } from "@/components/gallery/gallery-provider";
import { getAboutImage, getGalleryImages, getHeroImage } from "@/lib/media";
import { categories } from "@/lib/site";

export default function HomePage() {
  const hero = getHeroImage();
  const portrait = getAboutImage();
  const gallery = getGalleryImages();

  // Only categories with work in them become chapters.
  const chapters = categories
    .map((category) => ({
      ...category,
      photos: gallery.filter((photo) => photo.category === category.slug),
    }))
    .filter((chapter) => chapter.photos.length > 0);

  // The lightbox walks the photographs in the order they appear down the page.
  const ordered = chapters.flatMap((chapter) => chapter.photos);

  /* The written sections sit between chapters rather than after them, so the
     page never stops being a gallery. */
  const aboutAfter = Math.min(1, chapters.length - 1);
  const ratesAfter = Math.min(3, chapters.length - 1);

  const standIn =
    gallery.find((photo) => photo.category === "portraits") ??
    gallery.find((photo) => photo.category === "family") ??
    gallery[0] ??
    null;

  return (
    <GalleryProvider photos={ordered}>
      <Hero photo={hero} />

      <ChapterIndex
        chapters={chapters.map((chapter) => ({
          slug: chapter.slug,
          label: chapter.label,
          count: chapter.photos.length,
        }))}
      />

      {chapters.map((chapter, index) => (
        <Fragment key={chapter.slug}>
          <Chapter
            slug={chapter.slug}
            label={chapter.label}
            blurb={chapter.blurb}
            photos={chapter.photos}
          />
          {index === aboutAfter ? (
            <About portrait={portrait} standIn={standIn} />
          ) : null}
          {index === ratesAfter && ratesAfter !== aboutAfter ? (
            <RateCard />
          ) : null}
        </Fragment>
      ))}

      {chapters.length === 0 ? (
        <>
          <About portrait={portrait} standIn={standIn} />
          <RateCard />
        </>
      ) : null}

      <Contact />
    </GalleryProvider>
  );
}
