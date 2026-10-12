import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    viewTransition: true,
    prefetchInlining: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  turbopack: {
    root: process.cwd(),
  },
  // Global security response headers — applied to every route.
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
          },
          // Deliberately NOT a full policy. `script-src` is the directive that
          // matters most, and it cannot be tightened here without nonce
          // plumbing: the app ships inline JSON-LD (components/seo/*), Next's
          // own hydration payload, and gtag.js. Adding `script-src` without
          // nonces would break all three in production, where a broken deploy
          // is invisible — Netlify keeps serving the last good build.
          //
          // These four are the high-value directives that break nothing:
          //   frame-ancestors — clickjacking; supersedes X-Frame-Options above
          //                     (kept for older browsers that ignore CSP)
          //   form-action     — a form can only post back to us. This is the
          //                     one that matters for /financing: it stops an
          //                     injected form from exfiltrating to a third
          //                     party under our brand. Outbound <a> links to
          //                     the lender are unaffected — form-action governs
          //                     form submission, not navigation.
          //   base-uri        — blocks <base> tag hijacking of relative URLs
          //   object-src      — no Flash/applet embedding surface
          //
          // Tightening to a nonce-based script-src is tracked separately; do it
          // behind a report-only header first and read the reports.
          {
            key: "Content-Security-Policy",
            value: [
              "frame-ancestors 'self'",
              "form-action 'self'",
              "base-uri 'self'",
              "object-src 'none'",
            ].join("; "),
          },
        ],
      },
    ];
  },
  // Redirect the deprecated /services/* IA to top-level service routes.
  // 308 (permanent) — search engines should re-index targets and drop sources.
  async redirects() {
    return [
      // ── Internal /services/* IA redirects (pre-existing) ─────────────────
      { source: "/services", destination: "/roofing", permanent: true },
      { source: "/services/roofing", destination: "/roofing", permanent: true },
      { source: "/services/windows", destination: "/windows", permanent: true },
      { source: "/services/siding", destination: "/siding", permanent: true },
      { source: "/services/gutters", destination: "/gutters", permanent: true },
      { source: "/services/doors", destination: "/entry-doors", permanent: true },
      { source: "/services/entry-doors", destination: "/entry-doors", permanent: true },
      { source: "/services/insulation", destination: "/attic-insulation", permanent: true },
      { source: "/services/attic-insulation", destination: "/attic-insulation", permanent: true },

      // ── Live elevatehrg.com slug redirects — preserve link equity on DNS cutover ──
      // NOTE: Before DNS cutover, export all indexed URLs from the live elevatehrg.com
      // property in Google Search Console and cross-check against this table.
      // Common uncovered candidates: old blog posts, legacy landing pages, older
      // service-area URL patterns.  Add those as additional entries here.
      { source: "/contact-us", destination: "/contact", permanent: true },
      { source: "/contact-us/", destination: "/contact", permanent: true },
      {
        source: "/attic-insulation-installation",
        destination: "/attic-insulation",
        permanent: true,
      },
      {
        source: "/attic-insulation-installation/",
        destination: "/attic-insulation",
        permanent: true,
      },
      { source: "/about/", destination: "/about", permanent: true },
      { source: "/roofing/", destination: "/roofing", permanent: true },
      { source: "/siding/", destination: "/siding", permanent: true },
      { source: "/windows/", destination: "/windows", permanent: true },
      { source: "/gutters/", destination: "/gutters", permanent: true },
      { source: "/entry-doors/", destination: "/entry-doors", permanent: true },
      { source: "/privacy/", destination: "/privacy", permanent: true },
      { source: "/terms/", destination: "/terms", permanent: true },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
