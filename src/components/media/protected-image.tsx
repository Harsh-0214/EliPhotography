"use client";

import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

/**
 * A drop-in `next/image` for actual photography (not branding/UI chrome):
 * blocks the easy, casual ways a visitor could save the file — right-click
 * "Save image as", dragging it out to the desktop, and iOS Safari's
 * long-press "Save to Photos" popup (the only fix for that one is the
 * `-webkit-touch-callout` rule below; there is no JS equivalent).
 *
 * This is a deterrent, not a lock: a browser has to download the image
 * bytes to display them, so anyone using devtools' Network tab (or curl)
 * can still get the file. Every photography platform (SmugMug, Pixieset,
 * Squarespace, ...) has this same ceiling — see SECURITY.md.
 */
export function ProtectedImage({ className, alt, ...props }: ImageProps) {
  return (
    <Image
      {...props}
      alt={alt}
      draggable={false}
      onContextMenu={(event) => event.preventDefault()}
      className={cn(
        "select-none [-webkit-touch-callout:none] [-webkit-user-drag:none]",
        className,
      )}
    />
  );
}
