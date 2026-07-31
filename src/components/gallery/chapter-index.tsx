import { Reveal, StaggerGroup, staggerChild } from "@/components/motion/reveal";
import { MotionLi } from "@/components/motion/motion-li";

/**
 * The contents page. Names every category that has work in it and jumps to
 * that chapter — the site's table of contents, sitting directly under the
 * opening frame.
 */
export function ChapterIndex({
  chapters,
}: {
  chapters: { slug: string; label: string; count: number }[];
}) {
  if (chapters.length === 0) return null;

  return (
    <section
      id="work"
      aria-label="The work, by category"
      className="bg-charcoal px-6 pb-11 pt-16 md:px-10 md:pb-14 md:pt-24"
    >
      <Reveal>
        <p className="kicker flex items-center gap-3 text-brass">
          <span aria-hidden="true" className="h-px w-7 bg-brass" />
          The work, by category
        </p>
      </Reveal>

      <StaggerGroup
        as="ul"
        className="mt-9 flex flex-wrap items-baseline gap-x-10 gap-y-5 md:mt-11 md:gap-x-16"
      >
        {chapters.map((chapter) => (
          <MotionLi key={chapter.slug} variants={staggerChild}>
            <a
              href={`#${chapter.slug}`}
              className="display group flex items-baseline gap-2.5 text-[clamp(1.75rem,4vw,3rem)] text-ivory transition-[color] duration-200 hover:text-brass"
            >
              {chapter.label}
              <span className="kicker-sm text-brass/70 transition-[color] duration-200 group-hover:text-brass">
                {String(chapter.count).padStart(2, "0")}
              </span>
            </a>
          </MotionLi>
        ))}
      </StaggerGroup>
    </section>
  );
}
