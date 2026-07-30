"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/* shadcn/ui Button, restyled for this system: square corners, tracked caps,
   brass on press. `active:scale-[0.97]` is the press feedback — every
   pressable thing on the site acknowledges the press within a frame. */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-sans uppercase tracking-[0.18em] transition-[background-color,color,border-color,transform] duration-200 ease-[var(--ease-shutter)] active:scale-[0.97] disabled:pointer-events-none disabled:opacity-45",
  {
    variants: {
      variant: {
        solid:
          "bg-charcoal text-ivory hover:bg-brass-deep hover:text-ivory",
        outline:
          "border border-charcoal/25 bg-transparent text-ink hover:border-brass-deep hover:text-brass-deep",
        paper:
          "border border-ivory/25 bg-transparent text-ivory hover:border-brass hover:text-brass",
        quiet: "bg-transparent text-ink-muted hover:text-brass-deep",
      },
      size: {
        sm: "h-10 px-4 text-[0.625rem]",
        md: "h-12 px-7 text-[0.6875rem]",
        lg: "h-14 px-9 text-xs",
        icon: "h-11 w-11 p-0",
      },
    },
    defaultVariants: { variant: "solid", size: "md" },
  },
);

export type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean };

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { buttonVariants };
