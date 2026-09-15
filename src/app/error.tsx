"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ApertureMark } from "@/components/brand/aperture";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="shell flex flex-col items-center justify-center py-[var(--section-y)] text-center">
      <ApertureMark className="h-10 w-10 text-brass-deep/40" strokeWidth={3} />
      <p className="kicker mt-8 text-brass-deep">Something went wrong</p>
      <h1 className="display mt-4 text-[clamp(2rem,5vw,3.25rem)] text-ink">
        That didn&rsquo;t load properly.
      </h1>
      <p className="mt-5 max-w-[42ch] text-pretty text-[1.0625rem] leading-relaxed text-ink-muted">
        Give it another try, or head back to the homepage.
      </p>
      <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
        <Button size="lg" onClick={reset}>
          Try again
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/">Back to the homepage</Link>
        </Button>
      </div>
    </div>
  );
}
