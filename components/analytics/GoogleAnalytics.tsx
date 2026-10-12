import Script from "next/script";

/**
 * GA4 loader, gated on NEXT_PUBLIC_GA4_ID. Renders nothing until the measurement
 * ID (e.g. "G-XXXXXXXX") is present in the environment — env-gating remains the
 * master on/off switch for the whole tag.
 *
 * WHAT RUNS WHERE
 * ---------------
 * `window.dataLayer` and `window.gtag` are NOT defined here. They are defined
 * pre-paint by components/consent/ConsentBootstrap.tsx, which also pushes the
 * `consent default` signals — that has to be the first dataLayer entry, and an
 * `afterInteractive` script is far too late. Re-declaring `dataLayer` here would
 * discard the defaults it pushed, so this file only issues `js` + `config`.
 *
 * WHAT GATES WHAT
 * ---------------
 * gtag.js loads unconditionally once the ID is set; Consent Mode v2 signals do
 * the gating (see lib/consent.ts, GA4_LOAD_WHEN_ANALYTICS_DENIED). Custom
 * events flow through lib/analytics.ts, which additionally refuses to push to
 * dataLayer/gtag while analytics consent is denied.
 *
 * NEXT_PUBLIC_ANALYTICS_TRAFFIC_TYPE tags the session so a GA4 Internal Traffic
 * data filter can exclude it. CI sets it to "internal" because the CI workflow
 * builds with the real measurement ID (so Lighthouse measures gtag.js's true
 * cost) and that traffic must not pollute the production property. The owner
 * must create the matching filter in GA4 Admin → Data Filters — see .env.example.
 *
 * SPA route-change page views rely on GA4 Enhanced Measurement's History
 * trigger, which fires on pushState. Verify in DebugView after launch; App
 * Router navigations are a known soft spot. If per-route page views are missing,
 * add a `usePathname()`-driven `page_view` in a small client component.
 *
 * If a Content-Security-Policy is added later, allow
 * https://www.googletagmanager.com.
 */
export function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA4_ID;
  if (!gaId) return null;

  const trafficType = process.env.NEXT_PUBLIC_ANALYTICS_TRAFFIC_TYPE;
  const configArg = trafficType ? `, { traffic_type: ${JSON.stringify(trafficType)} }` : "";

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.gtag('js', new Date());
window.gtag('config', '${gaId}'${configArg});`}
      </Script>
    </>
  );
}
