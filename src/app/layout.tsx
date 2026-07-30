import type { Metadata, Viewport } from "next";
import { Marcellus, Jost } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BookingProvider } from "@/components/booking-provider";
import { getLogo } from "@/lib/media";
import { site } from "@/lib/site";

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
  },
};

export const viewport: Viewport = {
  themeColor: "#f3efe1",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const logo = getLogo();

  return (
    <html
      lang="en"
      className={`${marcellus.variable} ${jost.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-ivory">
        <a
          href="#main"
          className="kicker sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-100 focus-visible:bg-charcoal focus-visible:px-4 focus-visible:py-3 focus-visible:text-ivory"
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
