import { Clock, Phone, Sparkles, type LucideIcon } from "lucide-react";

type Commitment = {
  icon: LucideIcon;
  label: string;
  sub: string;
};

const commitments: Commitment[] = [
  { icon: Clock, label: "Crews arrive at 8:00", sub: "on the scheduled day" },
  {
    icon: Sparkles,
    label: "Driveway swept before we leave",
    sub: "every single day on site",
  },
  {
    icon: Phone,
    label: "Your PM responds same-day",
    sub: "call or text, 7 days a week",
  },
];

export function OnSiteCommitments() {
  return (
    <section className="bg-brand-charcoal py-16 sm:py-24" data-testid="process-on-site-commitments">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-12 text-center sm:grid-cols-3">
          {commitments.map((commitment) => {
            const Icon = commitment.icon;
            return (
              <div key={commitment.label} className="flex flex-col items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-gold/15 text-brand-gold">
                  <Icon aria-hidden className="h-5 w-5" />
                </div>
                <p className="mt-4 font-display text-xl font-semibold text-brand-cream">
                  {commitment.label}
                </p>
                <p className="mt-1 text-sm text-brand-cream/60">{commitment.sub}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
