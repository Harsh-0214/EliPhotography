import type { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";
import { GalleryPageContent } from "@/components/gallery/gallery-page-content";
import { getGalleryImages } from "@/lib/media";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "The full body of work in one place — every session, browsable and filterable by category.",
};

export default function GalleryPage() {
  const photos = getGalleryImages();

  return (
    <div className="bg-charcoal">
      <div className="shell pb-10 pt-[calc(5.5rem+var(--section-y))]">
        <SectionHeading
          kicker="Gallery"
          title="The full body of work"
          standfirst="Every session in one place. Filter by category below, or browse everything at once."
          tone="paper"
        />
      </div>

      <GalleryPageContent photos={photos} />
    </div>
  );
}
