import { Logo } from "@/components/brand/logo";
import { ApertureDivider } from "@/components/brand/aperture";
import type { SiteImage } from "@/lib/media";
import { nav, site } from "@/lib/site";

export function SiteFooter({ logo }: { logo: SiteImage | null }) {
  return (
    <footer className="on-charcoal bg-charcoal-2 text-ivory">
      <div className="shell flex flex-col items-center py-16 text-center md:py-20">
        {/* The logo is a cream-stock mark, so it is mounted on its own plate
            rather than dropped straight onto charcoal. */}
        <div className="flex h-[4.5rem] items-center bg-ivory px-7 text-[1.6rem] md:h-20 md:px-9">
          <Logo logo={logo} />
        </div>

        <ApertureDivider
          tone="charcoal"
          className="mt-11 max-w-sm"
        />

        <nav
          aria-label="Footer"
          className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
        >
          {[...nav, { label: "Contact", href: "#contact" }].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="kicker text-paper-muted transition-[color] duration-200 hover:text-brass"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {site.social.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                target="_blank"
                rel="noreferrer noopener"
                className="kicker-sm text-paper-muted transition-[color] duration-200 hover:text-brass"
              >
                {item.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href={`mailto:${site.email}`}
              className="kicker-sm text-paper-muted transition-[color] duration-200 hover:text-brass"
            >
              {site.email}
            </a>
          </li>
        </ul>

        <p className="kicker-sm mt-12 text-paper-muted/60">
          © {new Date().getFullYear()} {site.name} {site.tagline}. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
