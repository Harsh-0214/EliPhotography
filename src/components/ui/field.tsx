"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "@/lib/utils";

/* shadcn/ui form primitives, restyled: no boxes, no rounded corners.
   Fields are ruled lines on paper — the underline is the only chrome, and it
   lights brass on focus. */

export function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      className={cn("kicker-sm block text-ink-muted", className)}
      {...props}
    />
  );
}

const fieldBase =
  "w-full border-0 border-b border-ink/20 bg-transparent px-0 pb-2.5 pt-2 font-sans text-base text-ink outline-none transition-[border-color] duration-200 ease-[var(--ease-shutter)] placeholder:text-ink-muted/55 hover:border-ink/40 focus:border-brass-deep focus-visible:outline-none disabled:opacity-50 aria-[invalid=true]:border-[#a1372b]";

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return <input className={cn(fieldBase, className)} {...props} />;
}

export function Textarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(fieldBase, "min-h-32 resize-y leading-relaxed", className)}
      {...props}
    />
  );
}

export function FieldError({ children }: { children?: React.ReactNode }) {
  if (!children) return null;
  return (
    <p className="mt-2 flex items-start gap-1.5 font-sans text-[0.8125rem] text-[#a1372b]">
      <span aria-hidden="true" className="mt-[0.35em] block h-1 w-1 shrink-0 bg-[#a1372b]" />
      {children}
    </p>
  );
}

export { fieldBase };
