"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarDays } from "lucide-react";
import { m, useScroll, useTransform } from "motion/react";
import Link from "next/link";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { MaskReveal } from "@/components/motion/MaskReveal";
import { useMotionTier } from "@/components/motion/useMotionTier";
import { cn } from "@/lib/utils";

type ProcessStep = {
  num: string;
  title: string;
  body: string;
  stat: string;
  ctaHref?: string;
  ctaLabel?: string;
};

const steps: ProcessStep[] = [
  {
    num: "01",
    title: "Initial Consultation",
    body: "On-site walkthrough. We measure, photograph, and listen. No commitment.",
    stat: "No commitment required",
    ctaHref: "/quote",
    ctaLabel: "Schedule Now",
  },
  {
    num: "02",
    title: "Detailed Proposal",
    body: "Itemized scope, materials, manufacturer warranty terms, and financing options on paper. No hidden line items.",
    stat: "Full itemization, no surprises",
  },
  {
    num: "03",
    title: "Material Selection",
    body: "GAF and ProVia options matched to the house and the budget. We show you actual product samples, not catalog pages.",
    stat: "Real samples, not catalog pages",
  },
  {
    num: "04",
    title: "Quality Assurance",
    body: "Pre-close-out inspection and a final walkthrough with the project manager. Workmanship guarantee and manufacturer warranties registered the same day.",
    stat: "Same-day warranty registration",
  },
];

function Header() {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-16 md:mb-20">
      <MaskReveal>
        <p className="mb-4 text-sm font-bold uppercase tracking-wider text-brand-bronze">
          OUR PROCESS
        </p>
      </MaskReveal>
      <SplitHeading as="h2" text="How it works." />
      <MaskReveal delay={0.1}>
        <p className="mt-6 text-lg leading-8 text-brand-charcoal/80">
          Four steps, no surprises. Most projects go from first call to final walkthrough in three
          to five weeks.
        </p>
      </MaskReveal>
    </div>
  );
}

type ProcessProps = {
  hideHeading?: boolean;
};

function StepCard({
  state = "compact",
  step,
  testId,
}: {
  state?: "active" | "compact" | "upcoming";
  step: ProcessStep;
  testId: string;
}) {
  const isActive = state === "active";

  return (
    <div
      className={cn(
        "group relative z-10 min-w-0 border border-brand-charcoal/10 bg-white shadow-sm",
        "flex flex-row items-start gap-6 rounded-lg p-5 transition-all duration-500 md:p-7",
        isActive && "border-brand-gold-deep/40 shadow-md shadow-brand-charcoal/5",
        !isActive && "border-transparent bg-transparent shadow-none",
        state === "compact" && "opacity-85",
        state === "upcoming" && "opacity-90"
      )}
      data-process-card
      data-process-state={state}
      data-process-variant="vertical"
      data-testid={testId}
    >
      <div
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full border-2 font-bold shadow-sm",
          "transition-all duration-500",
          "h-16 w-16 text-xl md:h-24 md:w-24 md:text-3xl",
          isActive
            ? "border-brand-gold-deep bg-brand-gold-deep text-white shadow-md shadow-brand-gold-deep/25"
            : "border-brand-sandstone bg-white text-brand-gold-deep"
        )}
        style={
          isActive
            ? {
                backgroundColor: "var(--color-brand-gold-deep)",
                borderColor: "var(--color-brand-gold-deep)",
                color: "#fff",
              }
            : undefined
        }
        data-process-card-marker
      >
        {step.num}
      </div>

      <div className="pt-2 transition-opacity duration-500 md:pt-8" data-process-content>
        <h3 className="mb-3 text-xl font-semibold text-brand-charcoal">{step.title}</h3>
        <p
          className={cn(
            "text-sm leading-relaxed text-brand-charcoal/70 transition-opacity duration-500",
            state === "compact" && "opacity-70",
            state === "upcoming" && "opacity-80"
          )}
          data-process-description
        >
          {step.body}
        </p>
        <p className="mt-3 text-xs font-medium text-brand-gold-deep/80" data-process-stat>
          {step.stat}
        </p>
        {step.ctaHref && step.ctaLabel ? (
          <Link
            href={step.ctaHref}
            className="mt-5 inline-flex h-11 w-fit items-center justify-center gap-2 rounded-full bg-brand-gold-deep px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-espresso focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold-deep"
          >
            <CalendarDays className="h-4 w-4" />
            {step.ctaLabel}
          </Link>
        ) : null}
      </div>
    </div>
  );
}

function ProcessStepRow({
  index,
  minimal,
  step,
}: {
  index: number;
  minimal: boolean;
  step: ProcessStep;
}) {
  const stepRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"active" | "compact" | "upcoming">(
    index === 0 ? "active" : "upcoming"
  );

  useEffect(() => {
    if (minimal) return;

    let frame = 0;
    const updateState = () => {
      frame = 0;
      const element = stepRef.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const activeLine = window.innerHeight * 0.58;
      const nextState =
        rect.bottom < activeLine ? "compact" : rect.top > activeLine ? "upcoming" : "active";

      setState((current) => (current === nextState ? current : nextState));
    };
    const scheduleUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateState);
    };

    updateState();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [minimal]);

  if (minimal) {
    return (
      <m.div
        ref={stepRef}
        data-process-step={index + 1}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <StepCard state="active" step={step} testId={`process-step-card-${step.num}`} />
      </m.div>
    );
  }

  return (
    <m.div
      ref={stepRef}
      data-process-step={index + 1}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <StepCard state={state} step={step} testId={`process-step-card-${step.num}`} />
    </m.div>
  );
}

function ProcessScene({ minimal = false }: { minimal?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div
      ref={containerRef}
      data-motion-disabled={minimal ? "true" : undefined}
      data-testid="process-scene"
    >
      <div className="relative mx-auto max-w-5xl">
        <div
          className="absolute bottom-0 left-[52px] top-0 w-px bg-brand-charcoal/10 md:left-[76px]"
          data-testid="process-vertical-path-line"
        />
        {!minimal && (
          <m.div
            className="absolute left-[51px] top-0 bottom-0 w-[2px] origin-top bg-brand-gold-deep md:left-[75px]"
            style={{ scaleY }}
            data-testid="process-vertical-path-fill"
          />
        )}

        <div className="grid grid-cols-1 gap-8 sm:gap-10 md:gap-12">
          {steps.map((step, index) => (
            <ProcessStepRow key={step.num} index={index} minimal={minimal} step={step} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function Process({ hideHeading = false }: ProcessProps = {}) {
  const tier = useMotionTier();

  return (
    <section
      className="overflow-x-clip bg-brand-cream py-24 sm:py-32"
      data-testid="process-section"
    >
      <div className="container mx-auto px-4 md:px-8">
        {!hideHeading && <Header />}
        <ProcessScene minimal={tier === "minimal"} />
      </div>
    </section>
  );
}
