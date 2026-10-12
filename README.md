# Elevate HRG

The website of [Elevate HRG](https://elevatehrg.com), a home exterior and
insulation contractor in Wallington, New Jersey: roofing, siding, windows,
entry doors, gutters, soffit and fascia, and attic insulation.

Next.js 16, React 19, TypeScript and Tailwind CSS 4, hosted on Netlify.

- **Lead capture that holds up:** quote, contact and careers forms are
  validated with Zod on the server, and every submission is archived before
  any email is sent, so a delivery failure can't lose a lead.
- **Financing built in:** the lender's plans, a payment calculator and the
  required disclosures, on the financing page and on each service page.
- **Privacy-aware analytics:** Google Analytics runs in Consent Mode, with
  defaults set before the page paints and a consent banner.
- **Local SEO:** a page per service and per county served, structured data,
  and a generated sitemap and robots.txt.
- **One gate before anything ships:** `npm run verify` runs typecheck, lint,
  build and Playwright end-to-end tests across desktop and mobile browsers,
  before every push and in CI.

Developed by [Jeffrey Montoya](https://github.com/montjeffrey). This
repository is a clean snapshot of the production site.

**Not open source.** See [LICENSE](LICENSE).
