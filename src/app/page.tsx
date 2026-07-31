import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { RateCard } from "@/components/sections/rate-card";
import { Contact } from "@/components/sections/contact";
import { Chapter } from "@/components/gallery/chapter";
import { ChapterTabs } from "@/components/gallery/chapter-tabs";
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

  const standIn =
    gallery.find((photo) => photo.category === "portraits") ??
    gallery.find((photo) => photo.category === "family") ??
    gallery[0] ??
    null;

  return (
    <>
      <Hero photo={hero} />

      {/* The chapters are rendered here on the server and handed to the tab
          bar, which mounts one at a time. */}
      <ChapterTabs
        tabs={chapters.map((chapter) => ({
          slug: chapter.slug,
          label: chapter.label,
          photos: chapter.photos,
        }))}
        panels={chapters.map((chapter) => (
          <Chapter
            key={chapter.slug}
            slug={chapter.slug}
            label={chapter.label}
            blurb={chapter.blurb}
            detail={chapter.detail}
            cta={chapter.cta}
            photos={chapter.photos}
          />
        ))}
      />

      <About portrait={portrait} standIn={standIn} />
      <RateCard />
      <Contact />
    </>
  );
}
