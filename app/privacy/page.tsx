import type { Metadata } from "next";
import Link from "next/link";
import { ConsentPreferencesLink } from "@/components/consent/ConsentPreferencesLink";
import { siteConfig } from "@/lib/site-config";

const canonical = new URL("/privacy", siteConfig.url).toString();

export const metadata: Metadata = {
  title: `Privacy Policy | ${siteConfig.name}`,
  description:
    "How Elevate HRG collects, uses, discloses, and protects your personal information when you use our website.",
  alternates: { canonical },
  openGraph: {
    title: `Privacy Policy | ${siteConfig.name}`,
    description:
      "How Elevate HRG collects, uses, discloses, and protects your personal information.",
    url: canonical,
    siteName: siteConfig.name,
    type: "website",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <main id="main-content" className="pt-24">
      <section className="bg-brand-charcoal text-white py-20 sm:py-24">
        <div className="container mx-auto max-w-4xl px-6 md:px-10">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand-gold">
            Legal
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Privacy Policy</h1>
          <p className="mt-4 text-sm text-white/70">Last Updated: August 17, 2026</p>
        </div>
      </section>

      <section className="bg-brand-cream py-16 sm:py-20">
        <article className="container mx-auto max-w-3xl px-6 md:px-10 text-brand-warm-gray leading-relaxed [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-brand-charcoal [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-brand-charcoal [&_p]:mb-4 [&_ul]:mb-6 [&_ul]:pl-6 [&_li]:mb-2 [&_li]:list-disc [&_a]:text-brand-gold-deep [&_a]:underline">
          <p>
            Welcome to {siteConfig.name}. Your privacy is important to us. This Privacy Policy
            explains how we collect, use, disclose, and protect your personal information when you
            visit our website,{" "}
            <Link href={siteConfig.url}>{siteConfig.url.replace(/^https?:\/\//, "")}</Link>{" "}
            (&ldquo;Website&rdquo;). By using our Website, you consent to the practices described in
            this Privacy Policy.
          </p>

          <h2>1. Information We Collect</h2>
          <p>
            SMS opt-in and phone numbers collected for SMS communication purposes will not be shared
            with any third party or affiliates for marketing purposes. We may collect the following
            types of information when you use our Website:
          </p>

          <h3>a) Personal Information</h3>
          <ul>
            <li>Name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Company name (if applicable)</li>
            <li>Any other information you provide voluntarily through forms or communications</li>
          </ul>

          <h3>b) Non-Personal Information</h3>
          <ul>
            <li>IP address</li>
            <li>Browser type</li>
            <li>Device information</li>
            <li>Pages visited</li>
            <li>Time spent on our Website</li>
            <li>Cookies and tracking technologies (see Section 5)</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We use the information collected to:</p>
          <ul>
            <li>Provide, operate, and improve our Website and services</li>
            <li>Respond to inquiries, questions, and customer support requests</li>
            <li>Send marketing and promotional materials (you may opt-out at any time)</li>
            <li>Personalize your experience on our Website</li>
            <li>Analyze Website traffic and improve usability</li>
            <li>Detect, prevent, and address security threats or fraudulent activities</li>
          </ul>

          <h2>3. Sharing and Disclosure of Information</h2>
          <p>
            We do not sell or rent your personal information to third parties. However, we may share
            your information in the following circumstances:
          </p>
          <ul>
            <li>
              <strong>Service Providers:</strong> We may share data with trusted third-party vendors
              who assist us in operating our Website and providing services (e.g., payment
              processors, hosting providers, analytics tools).
            </li>
            <li>
              <strong>Legal Compliance:</strong> We may disclose information if required by law,
              regulation, legal process, or government request.
            </li>
            <li>
              <strong>Business Transfers:</strong> If {siteConfig.name} undergoes a merger,
              acquisition, or asset sale, your information may be transferred as part of that
              transaction.
            </li>
          </ul>

          <h2>4. Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information.
            However, no data transmission over the internet is completely secure. While we strive to
            protect your data, we cannot guarantee absolute security.
          </p>

          <h2>5. Cookies and Tracking Technologies</h2>
          <p>
            We keep this deliberately small. We do not use a third-party consent platform, we do not
            run session recording, and we do not run any advertising or retargeting tags today. Here
            is the complete list of what this Website stores in your browser:
          </p>

          <div className="mb-6 overflow-x-auto">
            <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-brand-sandstone">
                  <th className="py-2 pr-4 font-semibold text-brand-charcoal">Name</th>
                  <th className="py-2 pr-4 font-semibold text-brand-charcoal">Type</th>
                  <th className="py-2 pr-4 font-semibold text-brand-charcoal">Category</th>
                  <th className="py-2 font-semibold text-brand-charcoal">Purpose</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-brand-sandstone/50">
                  <td className="py-2 pr-4 align-top">
                    <code>_ga</code>, <code>_ga_*</code>
                  </td>
                  <td className="py-2 pr-4 align-top">Cookie (Google)</td>
                  <td className="py-2 pr-4 align-top">Analytics</td>
                  <td className="py-2 align-top">Google Analytics 4 measurement</td>
                </tr>
                <tr className="border-b border-brand-sandstone/50">
                  <td className="py-2 pr-4 align-top">
                    <code>elevate-consent-v1</code>
                  </td>
                  <td className="py-2 pr-4 align-top">localStorage</td>
                  <td className="py-2 pr-4 align-top">Strictly necessary</td>
                  <td className="py-2 align-top">Stores your cookie choice</td>
                </tr>
                <tr className="border-b border-brand-sandstone/50">
                  <td className="py-2 pr-4 align-top">
                    <code>elevate-hrg-attribution</code>
                  </td>
                  <td className="py-2 pr-4 align-top">sessionStorage</td>
                  <td className="py-2 pr-4 align-top">Strictly necessary</td>
                  <td className="py-2 align-top">
                    Remembers which campaign or link brought you here, so a quote request you submit
                    is routed and followed up correctly
                  </td>
                </tr>
                <tr className="border-b border-brand-sandstone/50">
                  <td className="py-2 pr-4 align-top">
                    <code>elevate-hrg-quote-form</code>
                  </td>
                  <td className="py-2 pr-4 align-top">sessionStorage</td>
                  <td className="py-2 pr-4 align-top">Functional</td>
                  <td className="py-2 align-top">Restores an in-progress quote form</td>
                </tr>
                <tr className="border-b border-brand-sandstone/50">
                  <td className="py-2 pr-4 align-top">
                    <code>elevate-join-club-dismissed</code>
                  </td>
                  <td className="py-2 pr-4 align-top">localStorage</td>
                  <td className="py-2 pr-4 align-top">Functional</td>
                  <td className="py-2 align-top">
                    Remembers that you dismissed or joined our text-message list
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 align-top">
                    <code>elevate-splash-suppress</code>
                  </td>
                  <td className="py-2 pr-4 align-top">sessionStorage</td>
                  <td className="py-2 pr-4 align-top">Strictly necessary</td>
                  <td className="py-2 align-top">Skips the site intro animation (testing/debug)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>Categories and defaults</h3>
          <ul>
            <li>
              <strong>Strictly necessary</strong> — always on. Required for the Website to work.
            </li>
            <li>
              <strong>Functional</strong> — on by default. Convenience features such as restoring an
              in-progress form.
            </li>
            <li>
              <strong>Analytics</strong> — <strong>on unless you turn it off.</strong> Google
              Analytics 4, used to understand which pages and services homeowners actually use.
            </li>
            <li>
              <strong>Advertising</strong> — <strong>off unless you turn it on.</strong> We run no
              advertising tags today; this category is reserved so that if we ever do, it stays off
              by default.
            </li>
          </ul>

          <h3>How to change your choice</h3>
          <p>
            Use the{" "}
            <ConsentPreferencesLink
              testId="consent-preferences-link-policy"
              className="inline-flex min-h-11 items-center font-semibold text-brand-gold-deep underline"
            >
              Cookie Preferences
            </ConsentPreferencesLink>{" "}
            control — available here and in the footer of every page — at any time. Turning
            Analytics off also removes the Google Analytics cookies already set on this device. Your
            browser&rsquo;s own cookie and tracking settings remain available to you as well.
          </p>

          <h3>Global Privacy Control</h3>
          <p>
            We honor Global Privacy Control (GPC) signals. If your browser or extension sends one,
            advertising cookies are turned off automatically and cannot be re-enabled through the
            controls on this Website.
          </p>

          <h2>6. Your Rights and Choices</h2>
          <p>
            Depending on your location, you may have the following rights regarding your personal
            data:
          </p>
          <ul>
            <li>Access, update, or delete your personal information</li>
            <li>Opt-out of marketing communications</li>
            <li>Restrict processing of your data</li>
            <li>Request a copy of your data</li>
          </ul>
          <p>
            To exercise these rights, contact us at{" "}
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
          </p>

          <h3>Your New Jersey Privacy Rights</h3>
          <p>
            {siteConfig.name} is a New Jersey business serving New Jersey homeowners. If you are a
            New Jersey resident, you may:
          </p>
          <ul>
            <li>Opt out of the processing of your personal data for targeted advertising</li>
            <li>Opt out of the sale of your personal data (we do not sell it)</li>
            <li>Opt out of profiling in furtherance of decisions with legal or similar effects</li>
            <li>Confirm whether we process your personal data, and obtain a copy of it</li>
            <li>Correct inaccuracies in, or request deletion of, your personal data</li>
          </ul>
          <p>
            The advertising opt-out is available directly through the Cookie Preferences control
            described in Section 5, and is applied automatically when your browser sends a Global
            Privacy Control signal. For every other request, email us at{" "}
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> and we will respond within
            the time frame the law requires.
          </p>

          <h2>7. Third-Party Links</h2>
          <p>
            Our Website may contain links to external websites. We are not responsible for their
            privacy practices, and we encourage you to review their privacy policies before
            providing any personal information.
          </p>

          <h2>8. Children&rsquo;s Privacy</h2>
          <p>
            Our Website is not intended for children under 13, and we do not knowingly collect
            personal information from minors. If we become aware of such data collection, we will
            take steps to delete the information.
          </p>

          <h2>9. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes will be effective when
            posted on this page. We encourage you to review this policy periodically.
          </p>

          <h2>10. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy or how we handle your data, please
            contact us:
          </p>
          <p>
            <strong>{siteConfig.name}</strong>
            <br />
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
            <br />
            <a href={siteConfig.phoneTel}>{siteConfig.phone}</a>
            <br />
            {siteConfig.address}
          </p>

          <p className="mt-12">Thank you for trusting {siteConfig.name} with your privacy.</p>
        </article>
      </section>
    </main>
  );
}
