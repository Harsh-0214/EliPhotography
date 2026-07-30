import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";

/**
 * One heading treatment for every section: brass kicker, serif head, optional
 * standfirst. Keeping it in one place is what stops the five sections from
 * quietly drifting apart.
 */
export function SectionHeading({
  kicker,
  title,
  standfirst,
  tone = "ink",
  align = "left",
  className,
}: {
  kicker: string;
  title: React.ReactNode;
  standfirst?: React.ReactNode;
  tone?: "ink" | "paper";
  align?: "left" | "center";
  className?: string;
}) {
  const onPaper = tone === "paper";

  return (
    <Reveal
      as="header"
      className={cn(
        "flex flex-col",
        align === "center" ? "items-center text-center" : "items-start",
        className,
      )}
    >
      <p
        className={cn(
          "kicker flex items-center gap-3",
          onPaper ? "text-brass" : "text-brass-deep",
        )}
      >
        <span
          aria-hidden="true"
          className={cn("h-px w-7", onPaper ? "bg-brass" : "bg-brass-deep")}
        />
        {kicker}
      </p>

      <h2
        className={cn(
          "display mt-5 max-w-[20ch] text-balance text-[2.1rem] sm:text-[2.6rem] md:text-[3.25rem]",
          onPaper ? "text-ivory" : "text-ink",
        )}
      >
        {title}
      </h2>

      {standfirst ? (
        <p
          className={cn(
            "mt-5 max-w-[52ch] text-pretty text-[1.0625rem] leading-relaxed",
            onPaper ? "text-paper-muted" : "text-ink-muted",
          )}
        >
          {standfirst}
        </p>
      ) : null}
    </Reveal>
  );
}
