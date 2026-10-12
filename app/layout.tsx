import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SkipLink } from "@/components/layout/SkipLink";
import { StickyMobileCTA } from "@/components/layout/StickyMobileCTA";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { WelcomeSplash } from "@/components/motion/WelcomeSplash";
import { LocalBusinessJsonLd } from "@/components/seo/LocalBusinessJsonLd";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { AttributionCapture } from "@/components/analytics/AttributionCapture";
import { PhoneClickTracker } from "@/components/analytics/PhoneClickTracker";
import { ConsentBootstrap } from "@/components/consent/ConsentBootstrap";
import { ConsentManagerLazy } from "@/components/consent/ConsentManagerLazy";
import { JoinTheClubModalLazy } from "@/components/sms/JoinTheClubModalLazy";
import { TooltipProvider } from "@/components/ui/tooltip";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
  variable: "--font-display-loaded",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
  variable: "--font-sans-loaded",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  // Favicons are provided by the app/ file conventions:
  // icon.svg (vector, primary), icon.png (raster fallback), apple-icon.png.
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: "en_US",
    images: [
      {
        url: "/brand/og-default.jpg",
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — veteran-owned exterior renovations across New Jersey`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/brand/og-default.jpg"],
  },
  // Google Search Console ownership verification.
  //
  // Set GOOGLE_SITE_VERIFICATION in Netlify to the token Search Console issues
  // for the HTML-tag method; Next renders it as
  // <meta name="google-site-verification" content="...">. Left unset the key is
  // omitted entirely, so a missing env var renders no tag at all rather than an
  // empty one, which fails verification in a confusing way.
  //
  // Prefer the DNS TXT method on Cloudflare where practical: it verifies a
  // Domain property (apex + www + every subdomain, http and https) in one go,
  // where this tag only verifies the https://elevatehrg.com URL-prefix
  // property. This tag is the fast path and the fallback, not the first choice.
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full ${fraunces.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-background text-foreground antialiased">
        {/*
          Welcome-splash gate. Runs before paint (first body child). The splash
          is the brand moment and plays on EVERY full page load (owner
          decision) — client-side navigations never re-run it because the
          document doesn't reload.

          Two jobs:
          1. Suppression: `?intro=skip` (used by Lighthouse CI to measure the
             pure content path — see lighthouserc.cjs — and handy for
             debugging) or the `elevate-splash-suppress` sessionStorage key
             (set by e2e tests) hides the splash before first paint.
          2. Paint sync: otherwise the choreography is held paused via
             `.splash-wait` and released on the second animation frame — i.e.
             once a frame has actually been presented — so the intro's clock
             starts when it is truly visible. Without this, CSS animations
             start when styles resolve, and on slow devices/networks part of
             the intro burned off before the first pixel appeared. Without JS
             the class is never added and the pure-CSS timeline runs as before.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){var d=document.documentElement;try{var skip=location.search.indexOf('intro=skip')>-1;try{skip=skip||sessionStorage.getItem('elevate-splash-suppress')==='1';}catch(e){}if(skip){d.classList.add('splash-hidden');}else{d.classList.add('splash-wait');requestAnimationFrame(function(){requestAnimationFrame(function(){d.classList.remove('splash-wait');});});}}catch(e){d.classList.remove('splash-wait');}try{var t='full';if(matchMedia('(prefers-reduced-motion: reduce)').matches){t='minimal';}else if(matchMedia('(max-width:1023px)').matches||matchMedia('(pointer:coarse)').matches){t='mobile';}d.setAttribute('data-motion',t);}catch(e){d.setAttribute('data-motion','full');}})();",
          }}
        />
        {/*
          Consent gate. Must run AFTER the splash/motion script above (so
          `data-motion` already exists) and BEFORE anything that touches
          `dataLayer` — it defines window.dataLayer/window.gtag and pushes the
          `consent default` signals as the first dataLayer entry.
        */}
        <ConsentBootstrap />
        <TooltipProvider>
          <MotionProvider>
            <WelcomeSplash />
            <SmoothScroll>
              <SkipLink />
              <Header />
              {children}
              <Footer />
              <StickyMobileCTA />
              <JoinTheClubModalLazy />
              <LocalBusinessJsonLd />
              <GoogleAnalytics />
              <AttributionCapture />
              <PhoneClickTracker />
            </SmoothScroll>
          </MotionProvider>
        </TooltipProvider>
        {/*
          LAST CHILD OF <body>, deliberately — and outside TooltipProvider/
          SmoothScroll. Not cosmetic: tests/e2e/accessibility.spec.ts asserts
          that the skip link is the FIRST focusable element in DOCUMENT ORDER.
          The cookie notice carries three buttons, so mounting it anywhere
          earlier in the tree would put one of them ahead of the skip link and
          break that test (and the keyboard experience it protects). See also
          the accessibility note on DEFAULT_POSTURE in lib/consent.ts.
        */}
        <ConsentManagerLazy />
      </body>
    </html>
  );
}
