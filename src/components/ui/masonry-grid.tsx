import * as React from "react";
import { motion, useMotionValue, useTransform, useSpring } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Adapted from a 21st.dev community component. Original used the
 * `framer-motion` package; this project already ships `motion` (the same
 * library under its current name, same API via the `motion/react` entry
 * point), so the import was switched rather than installing a second,
 * redundant animation library.
 */

interface MasonryGridProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  /** Stable key per item — falls back to index if omitted. */
  getKey?: (item: T, index: number) => React.Key;
  className?: string;
  gap?: string;
  staggerDelay?: number;
}

const GridItem = ({ children }: { children: React.ReactNode }) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const mouseX = event.clientX - left;
    const mouseY = event.clientY - top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
      className="relative"
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        whileTap={{ scale: 0.95 }}
        className="h-full w-full"
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

const MasonryGrid = <T,>({
  items,
  renderItem,
  getKey,
  className,
  gap = "1rem",
  staggerDelay = 0.05,
}: MasonryGridProps<T>) => {
  return (
    <div className={cn("w-full", className)} style={{ columnGap: gap }} role="list">
      {items.map((item, index) => (
        <motion.div
          key={getKey ? getKey(item, index) : index}
          className="mb-4 break-inside-avoid"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          // Each item reveals on its own — a shared "is the whole (very
          // tall) grid in view" check can never pass for a long list, since
          // no scroll position can ever show enough of a multi-thousand-
          // pixel-tall element at once to clear a percentage threshold.
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.2, margin: "0px 0px -10% 0px" }}
          transition={{
            duration: 0.5,
            delay: Math.min(index, 11) * staggerDelay,
            ease: "easeOut",
          }}
          role="listitem"
        >
          <GridItem>{renderItem(item, index)}</GridItem>
        </motion.div>
      ))}
    </div>
  );
};

export default MasonryGrid;
