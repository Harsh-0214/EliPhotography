"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------
   The signature moment.

   The logo's shutter opens across the page: a six-blade iris clipped over
   the hero, rotating as it widens, exactly the way a real aperture does.
   The clip rotates; the content inside counter-rotates by the same amount,
   so the photograph never tilts — only the opening does.

   The hexagon is measured against the panel's own aspect ratio, otherwise a
   percentage-based polygon would read as a squashed slot on a wide panel
   instead of an aperture.
   ------------------------------------------------------------------ */

const CLOSED_RADIUS = 7; // % of panel height
const OPEN_RADIUS = 240; // wide enough to clear the corners at any ratio
const START_ANGLE = 32; // degrees of blade travel

function hexagon(radiusY: number, aspect: number) {
  const radiusX = radiusY / aspect;
  const points = Array.from({ length: 6 }, (_, i) => {
    const angle = ((90 + i * 60) * Math.PI) / 180;
    const x = 50 + radiusX * Math.cos(angle);
    const y = 50 - radiusY * Math.sin(angle);
    return `${x.toFixed(2)}% ${y.toFixed(2)}%`;
  });
  return `polygon(${points.join(", ")})`;
}

export function ApertureReveal({
  children,
  className,
  duration = 1.5,
  delay = 0.15,
}: {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const [aspect, setAspect] = React.useState<number | null>(null);

  React.useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    const measure = () => {
      const { width, height } = element.getBoundingClientRect();
      if (width > 0 && height > 0) setAspect(width / height);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const ratio = aspect ?? 16 / 9;
  const transition = {
    duration,
    delay,
    ease: [0.22, 1, 0.36, 1] as const,
  };

  if (reduceMotion) {
    return (
      <div ref={ref} className={cn("relative overflow-hidden", className)}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="h-full w-full"
        >
          {children}
        </motion.div>
      </div>
    );
  }

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.div
        className="h-full w-full will-change-[clip-path,transform]"
        initial={{
          clipPath: hexagon(CLOSED_RADIUS, ratio),
          rotate: START_ANGLE,
        }}
        animate={
          aspect === null
            ? undefined
            : { clipPath: hexagon(OPEN_RADIUS, ratio), rotate: 0 }
        }
        transition={transition}
      >
        <motion.div
          className="h-full w-full will-change-transform"
          initial={{ rotate: -START_ANGLE, scale: 1.06 }}
          animate={aspect === null ? undefined : { rotate: 0, scale: 1 }}
          transition={transition}
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}
