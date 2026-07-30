import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { RateCard } from "@/components/sections/rate-card";
import { Gallery } from "@/components/sections/gallery";
import { Contact } from "@/components/sections/contact";
import { getAboutImage, getGalleryImages, getHeroImage, getLogo } from "@/lib/media";

export default function HomePage() {
  // Read from /public at render time so photographs can be dropped in
  // without touching a line of code.
  const logo = getLogo();
  const hero = getHeroImage();
  const portrait = getAboutImage();
  const gallery = getGalleryImages();

  return (
    <>
      <Hero logo={logo} photo={hero} />
      <About portrait={portrait} />
      <RateCard />
      <Gallery images={gallery} />
      <Contact />
    </>
  );
}
