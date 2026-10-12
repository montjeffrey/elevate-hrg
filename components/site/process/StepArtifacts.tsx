import { BadgeCheck, ClipboardList, FileText, MessageSquare, type LucideIcon } from "lucide-react";

type Artifact = {
  step: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

const artifacts: Artifact[] = [
  {
    step: "01 / Consultation",
    title: "Goals worksheet + site measurements",
    description:
      "We arrive with a written scope template. You leave with a written summary of what was discussed, measurements taken, and next steps.",
    icon: ClipboardList,
  },
  {
    step: "02 / Estimate",
    title: "Itemized PDF + materials spec sheet",
    description:
      "Line-by-line scope: materials, quantities, labor, timeline, and warranty terms. No ballpark figures.",
    icon: FileText,
  },
  {
    step: "03 / Installation",
    title: "Daily progress update + crew lead intro",
    description:
      "Your project manager texts you each morning with the day's plan. You have the crew lead's name and number before day one.",
    icon: MessageSquare,
  },
  {
    step: "04 / Walkthrough",
    title: "Signed sign-off + warranty registration",
    description:
      "We don't pack up until you've walked the job and signed off. Manufacturer warranty is registered the same day.",
    icon: BadgeCheck,
  },
];

export function StepArtifacts() {
  return (
    <section className="bg-brand-sandstone/30 py-20 sm:py-28" data-testid="process-step-artifacts">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
          <p className="mb-4 text-sm font-bold uppercase tracking-wider text-brand-bronze">
            WHAT YOU RECEIVE
          </p>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-brand-charcoal md:text-5xl">
            A deliverable at every step.
          </h2>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2">
          {artifacts.map((artifact) => {
            const Icon = artifact.icon;
            return (
              <article
                key={artifact.step}
                className="flex flex-col gap-4 rounded-2xl border border-brand-charcoal/10 bg-white p-7 shadow-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-sandstone/50 text-brand-charcoal">
                  <Icon aria-hidden className="h-5 w-5" />
                </div>
                <p className="text-xs font-bold uppercase tracking-wider text-brand-bronze">
                  {artifact.step}
                </p>
                <h3 className="font-display text-xl font-semibold text-brand-charcoal">
                  {artifact.title}
                </h3>
                <p className="text-sm leading-relaxed text-brand-warm-gray">
                  {artifact.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
