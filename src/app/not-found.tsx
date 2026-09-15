import Link from "next/link";
import { ApertureMark } from "@/components/brand/aperture";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="shell flex flex-col items-center justify-center py-[var(--section-y)] text-center">
      <ApertureMark className="h-10 w-10 text-brass-deep/40" strokeWidth={3} />
      <p className="kicker mt-8 text-brass-deep">404</p>
      <h1 className="display mt-4 text-[clamp(2rem,5vw,3.25rem)] text-ink">
        This page isn&rsquo;t in the gallery.
      </h1>
      <p className="mt-5 max-w-[42ch] text-pretty text-[1.0625rem] leading-relaxed text-ink-muted">
        The page you&rsquo;re looking for doesn&rsquo;t exist, or has moved.
      </p>
      <Button asChild size="lg" className="mt-9">
        <Link href="/">Back to the homepage</Link>
      </Button>
    </div>
  );
}
