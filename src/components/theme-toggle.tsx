"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "theme";

function applyTheme(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark);
}

export function ThemeToggle({ className }: { className?: string }) {
  const [dark, setDark] = React.useState(false);

  React.useEffect(() => {
    // Reads the class the anti-flash script (in layout.tsx) already applied
    // to <html> before hydration, so the icon matches the real theme.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    applyTheme(next);
    window.localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={dark}
      className={cn(
        "flex h-11 w-11 items-center justify-center transition-[color,transform] duration-150 ease-[var(--ease-shutter)] active:scale-[0.94]",
        className,
      )}
    >
      {dark ? (
        <Sun aria-hidden="true" className="h-5 w-5" strokeWidth={1.5} />
      ) : (
        <Moon aria-hidden="true" className="h-5 w-5" strokeWidth={1.5} />
      )}
    </button>
  );
}
