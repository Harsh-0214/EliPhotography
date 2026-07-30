"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { fieldBase } from "@/components/ui/field";

/* shadcn/ui Select on Radix, restyled to match the ruled-line fields.
   The menu scales in from the trigger rather than from its own centre —
   Radix exposes the origin as a CSS variable for exactly this. */

export const Select = SelectPrimitive.Root;
export const SelectValue = SelectPrimitive.Value;
export const SelectGroup = SelectPrimitive.Group;

export function SelectTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger
      className={cn(
        fieldBase,
        "group flex items-center justify-between gap-3 text-left data-[placeholder]:text-ink-muted/55 [&>span]:truncate",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown
          aria-hidden="true"
          className="h-4 w-4 shrink-0 text-ink-muted transition-transform duration-200 ease-[var(--ease-shutter)] group-data-[state=open]:rotate-180"
        />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

export function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        position={position}
        sideOffset={6}
        className={cn(
          "relative z-50 max-h-72 min-w-[var(--radix-select-trigger-width)] overflow-hidden border border-ink/15 bg-ivory shadow-[0_18px_50px_-24px_rgba(35,39,43,0.5)]",
          "origin-[var(--radix-select-content-transform-origin)] transition-[opacity,transform]",
          "data-[state=open]:animate-[selectIn_180ms_var(--ease-shutter)] data-[state=closed]:animate-[selectOut_120ms_ease-out]",
          className,
        )}
        {...props}
      >
        <SelectPrimitive.Viewport className="p-1.5">
          {children}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

export function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      className={cn(
        "relative flex cursor-pointer select-none items-center justify-between gap-3 px-3 py-2.5 font-sans text-[0.9375rem] text-ink outline-none transition-[color,background-color] duration-150",
        "data-[highlighted]:bg-ivory-2 data-[highlighted]:text-brass-deep data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator>
        <Check aria-hidden="true" className="h-3.5 w-3.5 text-brass-deep" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
}
