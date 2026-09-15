import type { Metadata, Viewport } from "next";
import { Marcellus, Jost } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BookingProvider } from "@/components/booking-provider";
import { getHeroImage, getLogo } from "@/lib/media";
import { site } from "@/lib/site";

const heroImage = getHeroImage();

/* Display face: Marcellus. Inscriptional Roman capitals — the same
   letterform tradition as the "ELISH MODI" wordmark in the logo. */
const marcellus = Marcellus({
  variable: "--font-marcellus",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

/* Utility face: Jost. Geometric sans that sets beautifully in the
   wide-tracked capitals of the logo's "PHOTOGRAPHY" line. */
const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: "website",
    images: heroImage
      ? [{ url: heroImage.src, width: heroImage.width, height: heroImage.height }]
      : undefined,
  },
  twitter: {
    card: heroImage ? "summary_large_image" : "summary",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: heroImage ? [heroImage.src] : undefined,
  },
};

export const viewport: Viewport = {
  // Static light default for the very first paint, before the inline
  // script below can run. Dark mode here is a manual toggle rather than
  // `prefers-color-scheme`, so that script (and ThemeToggle, on switching)
  // update this tag's content directly instead of relying on a media query.
  themeColor: "#f3efe1",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const logo = getLogo();
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <html
      lang="en"
      className={`${marcellus.variable} ${jost.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-ivory">
        <script
          nonce={nonce}
          // Runs before hydration so the correct theme is set before first
          // paint — otherwise the page would flash light before switching.
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");var d=t?t==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",d);var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content",d?"#17181a":"#f3efe1");}catch(e){}})();`,
          }}
        />
        <a
          href="#main"
          className="kicker sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-100 focus-visible:bg-charcoal focus-visible:px-4 focus-visible:py-3 focus-visible:text-cream"
        >
          Skip to content
        </a>
        <BookingProvider>
          <SiteHeader logo={logo} />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter logo={logo} />
        </BookingProvider>
      </body>
    </html>
  );
}
