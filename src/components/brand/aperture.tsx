import { cn } from "@/lib/utils";

/* The six-blade iris from the logo's shutter, rebuilt as geometry so it can
   be set at any size and stroke weight. This mark is the site's signature:
   it opens the hero, divides the sections, and closes the footer. */

const CENTER = 50;
const R_OUTER = 45;
const R_OPENING = 19;

function point(angleDeg: number, radius: number) {
  const a = (angleDeg * Math.PI) / 180;
  return { x: CENTER + radius * Math.cos(a), y: CENTER - radius * Math.sin(a) };
}

const vertices = Array.from({ length: 6 }, (_, i) =>
  point(90 + i * 60, R_OPENING),
);

/* Each blade edge runs along a hexagon edge and continues to the barrel. */
const blades = vertices.map((v, i) => {
  const next = vertices[(i + 1) % 6];
  const length = Math.hypot(next.x - v.x, next.y - v.y);
  const ux = (next.x - v.x) / length;
  const uy = (next.y - v.y) / length;

  const px = v.x - CENTER;
  const py = v.y - CENTER;
  const b = 2 * (px * ux + py * uy);
  const c = px * px + py * py - R_OUTER * R_OUTER;
  const t = (-b + Math.sqrt(b * b - 4 * c)) / 2;

  return {
    x1: Number(v.x.toFixed(3)),
    y1: Number(v.y.toFixed(3)),
    x2: Number((v.x + t * ux).toFixed(3)),
    y2: Number((v.y + t * uy).toFixed(3)),
  };
});

export function ApertureMark({
  className,
  strokeWidth = 3,
}: {
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={cn("h-5 w-5", className)}
    >
      <g stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round">
        <circle cx={CENTER} cy={CENTER} r={R_OUTER} />
        {blades.map((blade, i) => (
          <line key={i} {...blade} />
        ))}
      </g>
    </svg>
  );
}

/** Hairline rule interrupted by the aperture. Used between sections. */
export function ApertureDivider({
  className,
  tone = "ivory",
}: {
  className?: string;
  tone?: "ivory" | "charcoal";
}) {
  const rule = tone === "ivory" ? "bg-brass/45" : "bg-brass/35";
  const mark = tone === "ivory" ? "text-brass-deep/70" : "text-brass";

  return (
    <div
      aria-hidden="true"
      className={cn("flex w-full items-center gap-4", className)}
    >
      <span className={cn("h-px flex-1", rule)} />
      <ApertureMark
        className={cn("h-4 w-4 shrink-0", mark)}
        strokeWidth={6}
      />
      <span className={cn("h-px flex-1", rule)} />
    </div>
  );
}
