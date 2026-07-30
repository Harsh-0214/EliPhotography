"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SiteImage } from "@/lib/media";
import { nav } from "@/lib/site";
import { EASE } from "@/components/motion/reveal";

const SECTION_IDS = ["about", "rates", "work", "contact"];

export function SiteHeader({ logo }: { logo: SiteImage | null }) {
  const [scrolled, setScrolled] = React.useState(false);
  const [active, setActive] = React.useState<string | null>(null);
  const [menuOpen, setMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll spy: whichever section owns the band just below the masthead wins.
  React.useEffect(() => {
    const sections = SECTION_IDS.map((id) =>
      document.getElementById(id),
    ).filter((element): element is HTMLElement => Boolean(element));

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // Body scroll lock while the mobile menu is open.
  React.useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 h-[5.5rem] transition-[background-color,box-shadow,border-color] duration-300 ease-[var(--ease-shutter)]",
        // Over the opening frame the bar is glass; once past it, paper.
        scrolled
          ? "border-b border-ivory-3 bg-ivory/92 backdrop-blur-md"
          : "on-charcoal border-b border-transparent bg-transparent",
      )}
    >
      <div className="shell flex h-full items-center justify-between gap-6">
        {/* The masthead carries the logo at full size, so the header only
            claims it once you have scrolled past that. */}
        <a
          href="#top"
          aria-label="Elish Modi Photography — back to top"
          aria-hidden={!scrolled}
          tabIndex={scrolled ? undefined : -1}
          className={cn(
            "block h-11 shrink-0 py-1 text-[1.35rem] transition-[opacity,transform] duration-400 ease-[var(--ease-shutter)] hover:opacity-80 md:h-12",
            scrolled
              ? "translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-1 opacity-0",
          )}
        >
          <Logo logo={logo} priority />
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-9 md:flex">
          {nav.map((item) => {
            const id = item.href.slice(1);
            const isActive = active === id;
            return (
              <a
                key={item.href}
                href={item.href}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "kicker group relative py-2 transition-[color] duration-200",
                  scrolled
                    ? isActive
                      ? "text-brass-deep"
                      : "text-ink hover:text-brass-deep"
                    : isActive
                      ? "text-brass"
                      : "text-ivory hover:text-brass",
                )}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute -bottom-0.5 left-0 h-px transition-[width] duration-300 ease-[var(--ease-shutter)]",
                    scrolled ? "bg-brass-deep" : "bg-brass",
                    isActive ? "w-full" : "w-0 group-hover:w-full",
                  )}
                />
              </a>
            );
          })}
          <Button asChild size="sm" variant={scrolled ? "solid" : "paper"}>
            <a href="#contact">Book a session</a>
          </Button>
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          aria-expanded={menuOpen}
          className={cn(
            "-mr-2 flex h-11 w-11 items-center justify-center transition-[color,transform] duration-150 ease-[var(--ease-shutter)] active:scale-[0.94] md:hidden",
            scrolled ? "text-ink" : "text-ivory",
          )}
        >
          <Menu aria-hidden="true" className="h-5 w-5" strokeWidth={1.5} />
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: EASE }}
            className="fixed inset-0 z-50 flex flex-col bg-ivory md:hidden"
          >
            <div className="shell flex h-[5.5rem] shrink-0 items-center justify-between">
              <span className="block h-11 py-1 text-[1.35rem]">
                <Logo logo={logo} />
              </span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                autoFocus
                className="-mr-2 flex h-11 w-11 items-center justify-center text-ink transition-transform duration-150 ease-[var(--ease-shutter)] active:scale-[0.94]"
              >
                <X aria-hidden="true" className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>

            <nav
              aria-label="Primary"
              className="shell flex flex-1 flex-col justify-center gap-1 pb-24"
            >
              {[...nav, { label: "Contact", href: "#contact" }].map(
                (item, index) => (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.06 + index * 0.05,
                      ease: EASE,
                    }}
                    className="display border-b border-ivory-3 py-5 text-[2.25rem] text-ink transition-[color] duration-200 active:text-brass-deep"
                  >
                    {item.label}
                  </motion.a>
                ),
              )}

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.26, ease: EASE }}
                className="mt-10"
              >
                <Button
                  asChild
                  size="lg"
                  className="w-full"
                  onClick={() => setMenuOpen(false)}
                >
                  <a href="#contact">Book a session</a>
                </Button>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
