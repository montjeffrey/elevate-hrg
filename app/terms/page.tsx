import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

const canonical = new URL("/terms", siteConfig.url).toString();

export const metadata: Metadata = {
  title: `Terms & Conditions | ${siteConfig.name}`,
  description:
    "Terms and Conditions governing your use of the Elevate HRG website, including SMS communications terms.",
  alternates: { canonical },
  openGraph: {
    title: `Terms & Conditions | ${siteConfig.name}`,
    description: "Terms and Conditions governing your use of the Elevate HRG website.",
    url: canonical,
    siteName: siteConfig.name,
    type: "website",
  },
};

export default function TermsPage() {
  return (
    <main id="main-content" className="pt-24">
      <section className="bg-brand-charcoal text-white py-20 sm:py-24">
        <div className="container mx-auto max-w-4xl px-6 md:px-10">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand-gold">
            Legal
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Terms &amp; Conditions
          </h1>
          <p className="mt-4 text-sm text-white/70">Last Updated: July 12, 2025</p>
        </div>
      </section>

      <section className="bg-brand-cream py-16 sm:py-20">
        <article className="container mx-auto max-w-3xl px-6 md:px-10 text-brand-warm-gray leading-relaxed [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-brand-charcoal [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-brand-charcoal [&_p]:mb-4 [&_ul]:mb-6 [&_ul]:pl-6 [&_li]:mb-2 [&_li]:list-disc [&_a]:text-brand-gold-deep [&_a]:underline">
          <p>
            Welcome to {siteConfig.name}. These Terms and Conditions (&ldquo;Terms&rdquo;) outline
            the rules and regulations for the use of our website,{" "}
            <Link href={siteConfig.url}>{siteConfig.url.replace(/^https?:\/\//, "")}</Link> (the
            &ldquo;Website&rdquo;). By accessing or using this Website, you accept and agree to be
            bound by these Terms. If you do not agree with any part of these Terms, please refrain
            from using our Website.
          </p>

          <h2>1. Definitions</h2>
          <ul>
            <li>
              &ldquo;Company,&rdquo; &ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo; refers
              to {siteConfig.name}.
            </li>
            <li>
              &ldquo;User,&rdquo; &ldquo;you,&rdquo; or &ldquo;your&rdquo; refers to any individual
              or entity accessing our Website.
            </li>
            <li>
              &ldquo;Services&rdquo; refer to any offerings, information, resources, tools, or other
              features provided through our Website.
            </li>
          </ul>

          <h2>2. Use of the Website</h2>
          <ul>
            <li>You must be at least 18 years old to use this Website.</li>
            <li>
              You agree to use this Website only for lawful purposes and in a manner that does not
              violate the rights of others.
            </li>
            <li>
              You must not engage in any activity that could damage, disable, overburden, or impair
              the Website&rsquo;s functionality or interfere with any other party&rsquo;s use of the
              Website.
            </li>
          </ul>

          <h2>3. Intellectual Property Rights</h2>
          <ul>
            <li>
              All content on the Website&mdash;including text, graphics, logos, images, audio,
              video, and software&mdash;is the exclusive property of {siteConfig.name} or its
              licensors and is protected by copyright, trademark, and other intellectual-property
              laws.
            </li>
            <li>
              You may not copy, reproduce, modify, distribute, transmit, display, perform, or
              republish any content from this Website without our prior written consent, except as
              expressly permitted by applicable law.
            </li>
          </ul>

          <h2>4. User Content</h2>
          <ul>
            <li>
              If you submit or post any content (e.g., comments, feedback, information, or other
              materials) to the Website, you grant us a perpetual, irrevocable, non-exclusive,
              royalty-free, transferable, and worldwide license to use, reproduce, modify, adapt,
              publish, translate, create derivative works from, distribute, and display such
              content.
            </li>
            <li>
              You represent and warrant that any content you submit does not violate any third-party
              rights (including copyright, trademark, privacy, or other personal or proprietary
              rights) or any applicable laws.
            </li>
          </ul>

          <h2>5. Privacy Policy</h2>
          <p>
            Your use of the Website is also governed by our{" "}
            <Link href="/privacy">Privacy Policy</Link>, which explains how we collect, use,
            disclose, and safeguard your information. By using the Website, you consent to the
            practices described in the Privacy Policy.
          </p>

          <h2>6. Third-Party Links</h2>
          <p>
            The Website may contain links to third-party websites or resources. We are not
            responsible for the content, policies, or practices of any third-party sites. Your
            interactions with such sites are solely between you and the third party.
          </p>

          <h2>7. Limitation of Liability</h2>
          <ul>
            <li>
              We do not guarantee that the Website will always be available, uninterrupted, secure,
              or error-free.
            </li>
            <li>
              To the fullest extent permitted by law, {siteConfig.name} shall not be liable for any
              direct, indirect, incidental, consequential, special, punitive, or exemplary damages
              arising from or relating to your use of, or inability to use, the Website.
            </li>
            <li>
              The Website and all content are provided &ldquo;as is&rdquo; and &ldquo;as
              available,&rdquo; without warranties of any kind, whether express or implied.
            </li>
          </ul>

          <h2>8. Indemnification</h2>
          <p>
            You agree to indemnify, defend, and hold harmless {siteConfig.name} and its officers,
            directors, employees, contractors, agents, licensors, and affiliates from and against
            any and all claims, liabilities, damages, losses, costs, or expenses (including
            reasonable attorneys&rsquo; fees) arising out of or relating to (a) your use of the
            Website, (b) your violation of these Terms, or (c) your infringement of any rights of
            another person or entity.
          </p>

          <h2>9. Termination</h2>
          <p>
            We reserve the right, in our sole discretion and without notice, to suspend or terminate
            your access to the Website for any reason, including but not limited to violation of
            these Terms.
          </p>

          <h2>10. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the State
            of New Jersey, without regard to its conflict-of-law principles. Any dispute arising
            from or related to these Terms or the Website shall be resolved exclusively in the state
            or federal courts located in New Jersey, and you consent to the personal jurisdiction of
            such courts.
          </p>

          <h2>11. Changes to These Terms</h2>
          <p>
            We may update or modify these Terms at any time. Any changes will be effective
            immediately upon posting the revised Terms on this page. Your continued use of the
            Website after such posting constitutes your acceptance of the revised Terms.
          </p>

          <h2>12. SMS Terms &amp; Conditions</h2>
          <p>
            The following additional terms apply when you opt in to receive SMS (text message)
            communications from {siteConfig.name}.
          </p>

          <h3>12.1 SMS Consent &amp; Privacy</h3>
          <p>
            When you provide your phone number and expressly consent to receive SMS messages, the
            information collected (e.g., phone numbers) will be used solely for sending SMS
            communications and will not be shared with third parties for their marketing purposes.
          </p>

          <h3>12.2 Types of SMS Communications</h3>
          <p>
            If you consent to receive SMS messages from {siteConfig.name}, you may receive texts
            related to:
          </p>
          <ul>
            <li>
              <strong>Service Notifications</strong> &mdash; confirmations of services, onboarding
              steps, or documentation updates.
            </li>
            <li>
              <strong>Appointment &amp; Meeting Reminders</strong> &mdash; reminders for scheduled
              consultations, calls, or training sessions.
            </li>
            <li>
              <strong>Account or Policy Updates</strong> &mdash; notices about changes to your
              account, policies, or these Terms.
            </li>
            <li>
              <strong>Promotional Messages</strong> &mdash; occasional offers, newsletters, or event
              invitations relevant to our Services.
            </li>
          </ul>
          <p>
            Example: &ldquo;Hello! This is a reminder of your upcoming consultation with{" "}
            {siteConfig.name} on [Date] at [Time]. Reply STOP to opt out.&rdquo;
          </p>

          <h3>12.3 Message Frequency</h3>
          <p>
            Message frequency will vary based on your interaction with our Services, but you should
            expect no more than 4 SMS messages per month unless you initiate additional
            conversations.
          </p>

          <h3>12.4 Message &amp; Data Rates</h3>
          <p>
            Standard message and data rates may apply according to your wireless carrier&rsquo;s
            pricing plan. Fees may vary for domestic vs. international messages.
          </p>

          <h3>12.5 Opt-In Methods</h3>
          <p>You may opt in to receive SMS messages from {siteConfig.name} by:</p>
          <ul>
            <li>
              Checking the SMS consent checkbox on our online or paper forms and submitting your
              phone number; or
            </li>
            <li>
              Texting the keyword <strong>JOIN</strong> to {siteConfig.phone} (our dedicated SMS
              line) to enroll.
            </li>
          </ul>

          <h3>12.6 Opt-Out Methods</h3>
          <p>You can opt out of SMS communications at any time by:</p>
          <ul>
            <li>
              Replying <strong>STOP</strong> to any message; or
            </li>
            <li>
              Contacting us at <a href={siteConfig.phoneTel}>{siteConfig.phone}</a> or{" "}
              <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> and requesting removal.
            </li>
          </ul>

          <h3>12.7 Help &amp; Support</h3>
          <p>
            If you need assistance with our SMS program, reply <strong>HELP</strong> to any message
            or visit <Link href="/contact">our contact page</Link>.
          </p>

          <h3>12.8 Additional Disclosures</h3>
          <ul>
            <li>Message and data rates may apply.</li>
            <li>
              You can opt out at any time by texting <strong>STOP</strong>.
            </li>
            <li>
              For help, text <strong>HELP</strong> or call{" "}
              <a href={siteConfig.phoneTel}>{siteConfig.phone}</a>.
            </li>
            <li>Message frequency may vary.</li>
          </ul>

          <h2>13. Entire Agreement</h2>
          <p>
            These Terms, together with our <Link href="/privacy">Privacy Policy</Link> and any other
            legal notices or additional terms published on the Website, constitute the entire
            agreement between you and {siteConfig.name} regarding your use of the Website and the
            Services.
          </p>

          <h2>14. Contact Us</h2>
          <p>If you have any questions or concerns about these Terms, please contact us:</p>
          <p>
            <strong>{siteConfig.name}</strong>
            <br />
            {siteConfig.address}
            <br />
            Phone: <a href={siteConfig.phoneTel}>{siteConfig.phone}</a>
            <br />
            Email: <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
          </p>

          <p className="mt-12">Thank you for choosing {siteConfig.name}.</p>
        </article>
      </section>
    </main>
  );
}
