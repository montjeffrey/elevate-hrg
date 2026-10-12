"use client";

import { useId, useMemo, useState } from "react";
import { Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  calculatorConfig,
  disclosures,
  monthlyPayment,
  rateFromStep,
  ratesConfirmedAsApr,
} from "@/lib/financing-plans";

const currency0 = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const currency2 = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Strip everything but digits and a decimal point, then clamp to the ceiling. */
function parseAmount(raw: string): number {
  const cleaned = raw.replace(/[^\d.]/g, "");
  const value = Number(cleaned);
  if (!Number.isFinite(value) || value < 0) return 0;
  return Math.min(value, calculatorConfig.maxAmount);
}

/**
 * Payment estimator. Pure client-side arithmetic — no network, no storage,
 * nothing typed here leaves the browser. Mirrors the lender's own calculator so
 * our number never disagrees with theirs.
 */
export function FinancingCalculator() {
  const amountId = useId();
  const rateId = useId();
  const termId = useId();

  const [amountInput, setAmountInput] = useState(String(calculatorConfig.defaultAmount));
  // Annotated as `number`: `calculatorConfig` is `as const`, so the defaults
  // are literal types and useState would otherwise infer `3` for both.
  const [rateStep, setRateStep] = useState<number>(calculatorConfig.defaultRateStep);
  const [termIndex, setTermIndex] = useState<number>(calculatorConfig.defaultTermIndex);

  const amount = parseAmount(amountInput);
  const rate = rateFromStep(rateStep);
  const termMonths = calculatorConfig.termOptions[termIndex];

  const belowMinimum = amount > 0 && amount < calculatorConfig.minAmount;

  // An amount under the minimum is not financeable, so we must not answer with
  // a confident monthly payment for it — showing "Financing starts at $2,500"
  // and "$21.23/mo" side by side advertises terms for a loan this program will
  // not write. No estimate at all is the honest output.
  const eligible = amount >= calculatorConfig.minAmount;

  const payment = useMemo(
    () => (eligible ? monthlyPayment(amount, rate, termMonths) : 0),
    [eligible, amount, rate, termMonths]
  );

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-brand-charcoal/5 sm:p-8 md:p-10">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-semibold text-brand-charcoal">
            Estimate your monthly payment
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-brand-warm-gray">
            An estimate only. Your actual rate and term come from the lender.
          </p>
        </div>

        <Dialog>
          <DialogTrigger
            aria-label="About this estimate"
            className="mt-1 shrink-0 rounded-full p-2 text-brand-warm-gray transition-colors hover:bg-brand-sandstone/30 hover:text-brand-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold-deep"
          >
            <Info aria-hidden="true" className="h-5 w-5" />
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>About this estimate</DialogTitle>
              <DialogDescription className="text-left leading-relaxed">
                {disclosures.calculator}
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-7">
        <div>
          <label
            className="mb-2 block text-sm font-semibold text-brand-charcoal"
            htmlFor={amountId}
          >
            Project amount
          </label>
          <div className="relative">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg font-medium text-brand-warm-gray"
            >
              $
            </span>
            <input
              className="h-13 w-full rounded-xl border border-brand-charcoal/15 bg-brand-cream/40 py-3 pl-9 pr-4 text-lg font-semibold text-brand-charcoal outline-none transition-colors focus:border-brand-gold-deep focus:ring-2 focus:ring-brand-gold-deep/20"
              id={amountId}
              inputMode="decimal"
              // Read the field's own value rather than the closed-over `amount`,
              // which is derived from the PREVIOUS render's state. On a fast
              // type-then-tab the blur handler can run before React re-renders,
              // and the stale value then overwrites what the user just typed —
              // their amount visibly snaps back. WebKit surfaced this; Chromium's
              // event timing happened to hide it.
              onBlur={(event) => {
                const parsed = parseAmount(event.target.value);
                setAmountInput(parsed ? String(Math.round(parsed)) : "");
              }}
              onChange={(event) => setAmountInput(event.target.value)}
              placeholder="25,000"
              value={amountInput}
            />
          </div>
          <p
            className={`mt-2 text-xs ${belowMinimum ? "text-brand-bronze" : "text-brand-warm-gray"}`}
          >
            {belowMinimum
              ? `Financing starts at ${currency0.format(calculatorConfig.minAmount)}.`
              : `${currency0.format(calculatorConfig.minAmount)} – ${currency0.format(calculatorConfig.maxAmount)}`}
          </p>
        </div>

        <div>
          <div className="mb-2 flex items-baseline justify-between">
            <label className="text-sm font-semibold text-brand-charcoal" htmlFor={rateId}>
              Rate{ratesConfirmedAsApr ? " (APR)" : ""}
            </label>
            <span className="font-display text-lg font-semibold text-brand-charcoal tabular-nums">
              {rate.toFixed(2)}%
            </span>
          </div>
          <input
            className="w-full accent-[var(--color-brand-gold-deep)]"
            id={rateId}
            max={calculatorConfig.rateSteps}
            min={0}
            onChange={(event) => setRateStep(Number(event.target.value))}
            step={1}
            type="range"
            value={rateStep}
          />
          <div className="mt-1 flex justify-between text-xs text-brand-warm-gray tabular-nums">
            <span>{calculatorConfig.rateBase.toFixed(2)}%</span>
            <span>{rateFromStep(calculatorConfig.rateSteps).toFixed(2)}%</span>
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-baseline justify-between">
            <label className="text-sm font-semibold text-brand-charcoal" htmlFor={termId}>
              Term
            </label>
            <span className="font-display text-lg font-semibold text-brand-charcoal tabular-nums">
              {termMonths} months
            </span>
          </div>
          <input
            className="w-full accent-[var(--color-brand-gold-deep)]"
            id={termId}
            max={calculatorConfig.termOptions.length - 1}
            min={0}
            onChange={(event) => setTermIndex(Number(event.target.value))}
            step={1}
            type="range"
            value={termIndex}
          />
          <div className="mt-1 flex justify-between text-xs text-brand-warm-gray tabular-nums">
            <span>{calculatorConfig.termOptions[0]} mo</span>
            <span>{calculatorConfig.termOptions[calculatorConfig.termOptions.length - 1]} mo</span>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-2xl bg-brand-charcoal p-6 text-white sm:p-7">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-gold">
          Estimated monthly payment
        </p>
        <p
          aria-live="polite"
          className="mt-2 font-display text-4xl font-semibold tabular-nums sm:text-5xl"
        >
          {eligible ? currency2.format(payment) : "—"}
        </p>
        <p className="mt-3 text-sm text-white/70 tabular-nums">
          {eligible ? (
            <>
              {currency0.format(amount)} over {termMonths} months at {rate.toFixed(2)}%
              {ratesConfirmedAsApr ? " APR" : ""}
            </>
          ) : (
            <>Enter {currency0.format(calculatorConfig.minAmount)} or more to see an estimate.</>
          )}
        </p>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-brand-warm-gray">
        Not an offer or commitment to lend. Actual terms are disclosed by the lender at approval.
      </p>
    </div>
  );
}
