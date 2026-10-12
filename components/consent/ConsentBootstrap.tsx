import {
  CONSENT_MAX_AGE_MS,
  CONSENT_STORAGE_KEY,
  CONSENT_VERSION,
  DEFAULT_POSTURE,
} from "@/lib/consent";

/**
 * Pre-paint consent gate (Server Component). Modelled on the welcome-splash
 * script in app/layout.tsx — one synchronous inline <script> that runs before
 * first paint.
 *
 * Five jobs, in order:
 *
 * 1. Define `window.dataLayer` and `window.gtag`. These used to live in
 *    GoogleAnalytics.tsx, but an `afterInteractive` script runs far too late to
 *    issue a `consent default` before anything else touches the dataLayer — and
 *    re-declaring `dataLayer` after a default has been pushed discards it.
 * 2. Read the stored record and validate version + age.
 * 3. Resolve effective categories: stored record → else GPC → else the posture
 *    default (see DEFAULT_POSTURE in lib/consent.ts).
 * 4. Push `gtag('consent', 'default', …)` as the FIRST dataLayer entry. This is
 *    why it is a raw inline script rather than next/script: `beforeInteractive`
 *    does not guarantee ordering ahead of a sibling inline script reliably
 *    enough to bet a compliance behavior on.
 * 5. Publish the in-memory mirror (`window.__elevateConsent`, read by
 *    `isGranted`) and stamp `<html data-consent="resolved|pending">` so a
 *    returning visitor's HTML never renders a notice, even for one frame.
 *
 * Budget: <1 KB inline, sub-millisecond parse.
 *
 * The constants are interpolated from lib/consent.ts so the script and the
 * TypeScript model cannot drift apart. Everything else is hand-minified ES5 —
 * it is not transpiled and must run in every browser that reaches the site.
 */
export function ConsentBootstrap() {
  const script = [
    "(function(){",
    "var d=document.documentElement;",
    "window.dataLayer=window.dataLayer||[];",
    "function gtag(){window.dataLayer.push(arguments);}",
    "if(!window.gtag){window.gtag=gtag;}",
    // Posture defaults. `optIn` is compiled in from DEFAULT_POSTURE.
    `var optIn=${DEFAULT_POSTURE === "opt-in" ? "true" : "false"};`,
    "var a=!optIn,m=false,f=!optIn,resolved=false;",
    "try{",
    `var raw=window.localStorage.getItem(${JSON.stringify(CONSENT_STORAGE_KEY)});`,
    "if(raw){var p=JSON.parse(raw);",
    `if(p&&p.v===${CONSENT_VERSION}&&typeof p.ts==='number'&&(Date.now()-p.ts)<${CONSENT_MAX_AGE_MS}&&p.categories){`,
    "a=p.categories.analytics===true;m=p.categories.marketing===true;f=p.categories.functional!==false;resolved=true;",
    "}}",
    "}catch(e){}",
    // GPC wins over both the stored record and the posture default: the browser
    // is asserting an opt-out from targeted advertising on the user's behalf.
    "var gpc=false;try{gpc=navigator.globalPrivacyControl===true;}catch(e){}",
    "if(gpc){m=false;}",
    "window.__elevateConsent={categories:{necessary:true,functional:f,analytics:a,marketing:m},resolved:resolved,gpc:gpc};",
    "try{d.dataset.consent=resolved?'resolved':'pending';}catch(e){}",
    "var g=function(v){return v?'granted':'denied';};",
    "window.gtag('consent','default',{",
    "ad_storage:g(m),ad_user_data:g(m),ad_personalization:g(m),",
    "analytics_storage:g(a),functionality_storage:g(f),personalization_storage:g(f),",
    // Reserved for the honeypot/reCAPTCHA path; never user-toggleable.
    "security_storage:'granted',",
    // Gives the pre-paint read a window before gtag commits, so a returning
    // visitor never gets a ping sent with the wrong state.
    "wait_for_update:500});",
    "window.gtag('set','ads_data_redaction',!m);",
    // Preserves gclid across client-side navigations while ad cookies are
    // denied. Complements the gclid handling in lib/analytics.ts.
    "window.gtag('set','url_passthrough',true);",
    "})();",
  ].join("");

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
