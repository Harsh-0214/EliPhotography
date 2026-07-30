"use client";

import * as React from "react";
import { motion } from "motion/react";
import { EASE } from "@/components/motion/reveal";

/* The masthead settles first, then the shutter opens beneath it — one
   orchestrated page-load sequence rather than five separate effects. */
export function HeroIntro({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial="hidden"
      animate="shown"
      variants={{
        hidden: {},
        shown: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
      }}
    >
      {React.Children.map(children, (child) => (
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 14 },
            shown: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
