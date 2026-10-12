import { Fragment } from "react";
import { MaskReveal } from "@/components/motion/MaskReveal";
import { SplitHeading } from "@/components/motion/SplitHeading";

type ServiceIntroCallout =
  | {
      kind: "stat";
      stats: { value: string; label: string }[];
    }
  | {
      kind: "badges";
      badges: string[];
    }
  | {
      kind: "style-grid";
      styleLabels: string[];
    };

type ServiceIntroProps = {
  eyebrow: string;
  heading: string;
  paragraphs: string[];
  callout?: ServiceIntroCallout;
};

export function ServiceIntro({ eyebrow, heading, paragraphs, callout }: ServiceIntroProps) {
  return (
    <section className="bg-brand-cream py-20 sm:py-28" data-testid="service-intro-section">
      <div className="container mx-auto max-w-4xl px-4 md:px-8">
        <MaskReveal>
          <p className="mb-4 text-sm font-bold uppercase tracking-wider text-brand-bronze">
            {eyebrow}
          </p>
        </MaskReveal>
        <SplitHeading as="h2" text={heading} />
        <div className="mt-8 flex flex-col gap-6">
          {paragraphs.map((paragraph, index) => (
            <MaskReveal key={index} delay={0.08 + index * 0.06}>
              <p className="text-lg leading-relaxed text-brand-warm-gray">{paragraph}</p>
            </MaskReveal>
          ))}
        </div>

        {callout ? (
          <aside
            className="mt-12 border-t border-brand-charcoal/10 pt-10"
            data-testid="service-intro-callout"
          >
            <IntroCallout callout={callout} />
          </aside>
        ) : null}
      </div>
    </section>
  );
}

function IntroCallout({ callout }: { callout: ServiceIntroCallout }) {
  if (callout.kind === "stat") {
    const stats = callout.stats;

    if (stats.length === 1) {
      return (
        <div className="flex flex-col items-start gap-3 rounded-2xl border border-brand-charcoal/10 bg-brand-sandstone/20 px-7 py-6 sm:flex-row sm:items-baseline sm:gap-5">
          <p className="shrink-0 font-display text-5xl font-semibold text-brand-charcoal">
            {stats[0].value}
          </p>
          <p className="max-w-md text-sm text-brand-warm-gray">{stats[0].label}</p>
        </div>
      );
    }

    if (stats.length === 2) {
      return (
        <div className="grid grid-cols-1 divide-brand-charcoal/10 rounded-2xl border border-brand-charcoal/10 bg-brand-sandstone/20 sm:grid-cols-2 sm:divide-x">
          {stats.map((stat) => (
            <div key={stat.value} className="flex items-baseline gap-5 px-7 py-6">
              <p className="shrink-0 font-display text-4xl font-semibold text-brand-charcoal">
                {stat.value}
              </p>
              <p className="text-sm text-brand-warm-gray">{stat.label}</p>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-y-6 rounded-2xl bg-brand-charcoal px-7 py-6 text-brand-cream sm:grid-cols-3 sm:gap-x-8 sm:divide-x sm:divide-brand-cream/15">
        {stats.map((stat, index) => (
          <div key={stat.value} className={index === 0 ? "sm:pl-0" : "sm:pl-8"}>
            <p className="font-display text-3xl font-semibold text-brand-gold sm:text-4xl">
              {stat.value}
            </p>
            <p className="mt-2 text-xs uppercase tracking-wider text-brand-cream/70">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    );
  }

  if (callout.kind === "badges") {
    return (
      <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-brand-charcoal/10 bg-white px-6 py-5">
        {callout.badges.map((badge, i) => (
          <Fragment key={badge}>
            {i > 0 ? (
              <span aria-hidden="true" className="h-px w-6 rotate-90 bg-brand-gold-deep/60" />
            ) : null}
            <span className="text-xs font-bold uppercase tracking-wider text-brand-bronze">
              {badge}
            </span>
          </Fragment>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {callout.styleLabels.map((label) => (
        <div
          key={label}
          className="flex aspect-[3/4] items-end rounded-md bg-brand-sandstone/30 p-3"
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-charcoal">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
