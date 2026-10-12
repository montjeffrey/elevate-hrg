import { Check, Layers, type LucideIcon } from "lucide-react";
import { MaskReveal } from "@/components/motion/MaskReveal";
import { SplitHeading } from "@/components/motion/SplitHeading";

type SubServiceItem = {
  title: string;
  description: string;
};

type SubServiceStyle = "cards" | "checklist" | "icon-cards";

type ServiceSubServicesProps = {
  heading: string;
  items: SubServiceItem[];
  style?: SubServiceStyle;
  iconMap?: Record<string, LucideIcon>;
};

export function ServiceSubServices({
  heading,
  items,
  style = "cards",
  iconMap,
}: ServiceSubServicesProps) {
  if (items.length === 0) return null;

  return (
    <section
      className="bg-brand-sandstone/15 py-20 sm:py-28"
      data-testid="service-sub-services-section"
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <MaskReveal>
            <p className="mb-4 text-sm font-bold uppercase tracking-wider text-brand-bronze">
              WHAT&rsquo;S INCLUDED
            </p>
          </MaskReveal>
          <SplitHeading as="h2" text={heading} />
        </div>

        {style === "checklist" ? (
          <div className="mx-auto mt-14 max-w-3xl divide-y divide-brand-charcoal/10 rounded-2xl border border-brand-charcoal/10 bg-white p-8">
            {items.map((item, index) => (
              <MaskReveal key={item.title} delay={0.06 + index * 0.06}>
                <div className="flex items-start gap-4 py-5">
                  <Check
                    aria-hidden="true"
                    className="mt-1 h-5 w-5 shrink-0 text-brand-gold-deep"
                  />
                  <div>
                    <h3 className="text-base font-semibold text-brand-charcoal">{item.title}</h3>
                    <p className="mt-1 text-sm text-brand-warm-gray">{item.description}</p>
                  </div>
                </div>
              </MaskReveal>
            ))}
          </div>
        ) : (
          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item, index) => {
              const Icon = iconMap?.[item.title] ?? Layers;
              return (
                <MaskReveal key={item.title} delay={0.08 + index * 0.1}>
                  <article className="h-full rounded-2xl border border-brand-charcoal/10 bg-white p-7 shadow-sm transition-shadow hover:shadow-md">
                    {style === "icon-cards" ? (
                      <div
                        aria-hidden="true"
                        className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-brand-gold/15 text-brand-gold-deep"
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                    ) : null}
                    <div className="mb-4 h-0.5 w-10 bg-brand-gold-deep/70" aria-hidden="true" />
                    <h3 className="font-display text-xl font-semibold leading-snug text-brand-charcoal">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-brand-warm-gray">
                      {item.description}
                    </p>
                  </article>
                </MaskReveal>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
