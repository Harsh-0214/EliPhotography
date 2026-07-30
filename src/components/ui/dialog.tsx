"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

/* shadcn/ui Dialog on Radix, restyled as a darkroom: the overlay is the
   deepest charcoal in the palette rather than the default translucent black,
   so a photograph sits on brand-coloured shadow. Modals keep a centre
   transform-origin — they are not anchored to a trigger. */

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;
export const DialogTitle = DialogPrimitive.Title;
export const DialogDescription = DialogPrimitive.Description;

export function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      className={cn(
        "fixed inset-0 z-50 bg-charcoal-2",
        "data-[state=open]:animate-[fadeIn_220ms_var(--ease-shutter)] data-[state=closed]:animate-[fadeOut_140ms_ease-out]",
        className,
      )}
      {...props}
    />
  );
}

export function DialogContent({
  className,
  children,
  overlayClassName,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  overlayClassName?: string;
}) {
  return (
    <DialogPrimitive.Portal>
      <DialogOverlay className={overlayClassName} />
      <DialogPrimitive.Content
        className={cn(
          "on-charcoal fixed inset-0 z-50 flex flex-col outline-none",
          "data-[state=open]:animate-[dialogIn_260ms_var(--ease-shutter)] data-[state=closed]:animate-[dialogOut_150ms_ease-out]",
          className,
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
