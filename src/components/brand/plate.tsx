import { cn } from "@/lib/utils";
import { ApertureMark } from "@/components/brand/aperture";

/**
 * Stands in wherever a photograph has not been added yet.
 *
 * `solid` is exposed stock — it replaces a single photograph (hero, portrait).
 * `frame` is an unexposed one — a ruled brass outline used in the gallery,
 * where a dozen solid panels would swamp the page.
 */
export function Plate({
  label,
  className,
  markClassName,
  variant = "solid",
}: {
  label?: string;
  className?: string;
  markClassName?: string;
  variant?: "solid" | "frame";
}) {
  const solid = variant === "solid";

  return (
    <div
      className={cn(
        "relative flex h-full w-full flex-col items-center justify-center overflow-hidden",
        solid ? "grain bg-charcoal-2" : "border border-brass/25 bg-charcoal-2/40",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-0",
          solid
            ? "bg-[radial-gradient(ellipse_at_50%_38%,rgba(185,155,85,0.22),transparent_62%)]"
            : "bg-[radial-gradient(ellipse_at_50%_45%,rgba(185,155,85,0.08),transparent_70%)]",
        )}
      />
      <ApertureMark
        className={cn(
          "relative h-16 w-16 md:h-20 md:w-20",
          solid ? "text-brass/35" : "text-brass/45",
          markClassName,
        )}
        strokeWidth={2}
      />
      {label ? (
        <p className="kicker-sm relative mt-5 text-paper-muted/70">{label}</p>
      ) : null}
    </div>
  );
}
