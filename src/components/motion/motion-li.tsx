"use client";

import { motion } from "motion/react";

/**
 * `motion.li` on its own cannot be used from a Server Component. This is the
 * thin client boundary that lets server-rendered lists take stagger variants.
 */
export const MotionLi = motion.li;
