import { Reveal } from "@/components/motion/reveal";

/**
 * A slim, centred bar of the categories — a nav rather than a statement.
 * It sits between the opening frame and the first chapter, quiet enough to
 * be scrolled past and useful enough to be clicked.
 */
export function ChapterIndex({
  chapters,
}: {
  chapters: { slug: string; label: string; count: number }[];
}) {
  if (chapters.length === 0) return null;

  return (
    <Reveal
      as="section"
      className="border-y border-charcoal-3 bg-charcoal px-6 py-5 md:px-10"
    >
      <nav aria-label="The work, by category">
        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 md:gap-x-12">
          {chapters.map((chapter) => (
            <li key={chapter.slug}>
              <a
                href={`#${chapter.slug}`}
                className="kicker group inline-flex items-start gap-1.5 py-1 text-paper-muted transition-[color] duration-200 hover:text-brass"
              >
                {chapter.label}
                <span className="text-[0.7em] leading-[1.5] text-brass/80 transition-[color] duration-200 group-hover:text-brass">
                  {chapter.count}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </Reveal>
  );
}
