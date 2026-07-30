import Image from "next/image";
import { cn } from "@/lib/utils";
import { ApertureMark } from "@/components/brand/aperture";
import type { SiteImage } from "@/lib/media";
import { site } from "@/lib/site";

/**
 * Renders the client's logo from /public/logo/elish-modi-logo.png.
 * Until that file exists, it falls back to a typeset lockup built from the
 * same two faces, so the site never shows a broken image.
 */
export function Logo({
  logo,
  className,
  priority = false,
  tone = "ink",
}: {
  logo: SiteImage | null;
  className?: string;
  priority?: boolean;
  tone?: "ink" | "paper";
}) {
  if (logo) {
    return (
      <Image
        src={logo.src}
        alt={`${site.name} ${site.tagline}`}
        width={logo.width}
        height={logo.height}
        priority={priority}
        sizes="(max-width: 768px) 160px, 220px"
        className={cn("h-full w-auto object-contain", className)}
      />
    );
  }

  return (
    <span
      className={cn(
        "flex h-full items-center gap-2.5",
        tone === "paper" ? "text-ivory" : "text-ink",
        className,
      )}
    >
      <ApertureMark
        className={cn(
          "h-[1.7em] w-[1.7em] shrink-0",
          tone === "paper" ? "text-brass" : "text-brass-deep",
        )}
        strokeWidth={4}
      />
      <span className="flex flex-col justify-center leading-none">
        <span className="display text-[1.05em] uppercase tracking-[0.13em]">
          {site.name}
        </span>
        <span
          className={cn(
            "kicker-sm mt-[0.35em] text-[0.42em]",
            tone === "paper" ? "text-brass" : "text-brass-deep",
          )}
        >
          {site.tagline}
        </span>
      </span>
    </span>
  );
}
