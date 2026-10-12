"use client";

import { useEffect, useState } from "react";
import { FormSubmitButton } from "@/components/forms/FormSubmitButton";
import { LeadSuccessPanel } from "@/components/forms/LeadSuccessPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { leadServiceOptions } from "@/lib/lead-validation";
import { siteConfig } from "@/lib/site-config";
import { trackEvent, getAttribution } from "@/lib/analytics";

type QuoteFormState = {
  service: string;
  zip: string;
  message: string;
  name: string;
  phone: string;
  email: string;
  honeypot: string;
};

type PersistedQuoteFormState = Pick<QuoteFormState, "service">;

type AcceptedLead = { name?: string; service?: string; leadId?: string };

const storageKey = "elevate-hrg-quote-form";
const initialQuoteState: QuoteFormState = {
  service: "",
  zip: "",
  message: "",
  name: "",
  phone: "",
  email: "",
  honeypot: "",
};

function getInitialQuoteState() {
  if (typeof window === "undefined") return initialQuoteState;

  const saved = window.sessionStorage.getItem(storageKey);
  if (!saved) return initialQuoteState;

  try {
    const parsed = JSON.parse(saved) as Partial<PersistedQuoteFormState>;
    return {
      ...initialQuoteState,
      service: parsed.service ?? "",
    };
  } catch {
    return initialQuoteState;
  }
}

export function QuoteMultiStepForm() {
  const [form, setForm] = useState<QuoteFormState>(getInitialQuoteState);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [acceptedLead, setAcceptedLead] = useState<AcceptedLead | null>(null);

  useEffect(() => {
    const persistedState: PersistedQuoteFormState = {
      service: form.service,
    };
    window.sessionStorage.setItem(storageKey, JSON.stringify(persistedState));
  }, [form.service]);

  const updateField = (field: keyof QuoteFormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const validateStep = (targetStep: number) => {
    const nextErrors: Record<string, string> = {};

    if (targetStep === 1) {
      if (!form.service) nextErrors.service = "Select a service.";
      if (!/^\d{5}$/.test(form.zip)) nextErrors.zip = "ZIP must be exactly 5 digits.";
    }

    if (targetStep === 2) {
      if (!form.name.trim()) nextErrors.name = "Name is required.";
      if (!form.phone.trim()) nextErrors.phone = "Phone is required.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const nextStep = () => {
    if (!validateStep(step)) return;
    trackEvent("quote_step_complete", { step });
    setStep((current) => Math.min(current + 1, 2));
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (step < 2) {
      nextStep();
      return;
    }
    void submitQuote();
  };

  const applyApiErrors = async (response: Response) => {
    try {
      const payload = (await response.json()) as {
        error?: { details?: { field: string; message: string }[] };
      };
      const details = payload.error?.details ?? [];
      const nextErrors = details.reduce<Record<string, string>>((current, detail) => {
        return {
          ...current,
          [detail.field]: detail.message,
        };
      }, {});

      setErrors(
        Object.keys(nextErrors).length > 0
          ? nextErrors
          : {
              form: `Something went wrong on our end. Please call us at ${siteConfig.phone} or email ${siteConfig.email}.`,
            }
      );
    } catch {
      setErrors({
        form: `Something went wrong on our end. Please call us at ${siteConfig.phone} or email ${siteConfig.email}.`,
      });
    }
  };

  const submitQuote = async () => {
    if (!validateStep(2)) return;

    setIsSubmitting(true);
    setAcceptedLead(null);

    try {
      const response = await fetch("/api/leads", {
        body: JSON.stringify({
          ...form,
          service: form.service,
          ...getAttribution(),
          sourcePath: window.location.pathname,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      if (!response.ok) {
        await applyApiErrors(response);
        return;
      }

      // Capture the reference and the submitted values before the reset below
      // clears them — the confirmation panel echoes them back to the homeowner.
      const accepted = (await response.json().catch(() => null)) as {
        data?: { leadId?: string };
      } | null;

      trackEvent("generate_lead", { form: "quote", service: form.service });
      window.sessionStorage.removeItem(storageKey);
      setAcceptedLead({
        leadId: accepted?.data?.leadId,
        name: form.name,
        service: form.service,
      });
      setForm(initialQuoteState);
      setStep(1);
    } catch {
      setErrors({ form: "Network error. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className="rounded-card border border-border bg-card p-6 shadow-sm"
      data-quote-form
      onSubmit={handleFormSubmit}
      noValidate
    >
      {acceptedLead ? (
        <LeadSuccessPanel
          leadId={acceptedLead.leadId}
          name={acceptedLead.name}
          onReset={() => setAcceptedLead(null)}
          service={acceptedLead.service}
        />
      ) : (
        <>
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold">Project Quote</h2>
            <p
              className="text-sm font-semibold text-brand-bronze"
              aria-live="polite"
              aria-atomic="true"
            >
              Step {step} of 2
            </p>
          </div>

          {step === 1 ? (
            <div className="grid gap-3">
              <Label htmlFor="quote-service">Service</Label>
              <select
                aria-describedby={errors.service ? "quote-service-error" : undefined}
                aria-invalid={!!errors.service}
                className="min-h-12 rounded-md border border-input bg-background px-3 text-base md:text-sm"
                id="quote-service"
                onChange={(event) => updateField("service", event.target.value)}
                value={form.service}
              >
                <option value="">Select a service</option>
                {leadServiceOptions.map((service) => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </select>
              {errors.service ? (
                <p className="text-sm text-destructive" id="quote-service-error">
                  {errors.service}
                </p>
              ) : null}
              <div className="grid gap-2">
                <Label htmlFor="quote-zip">ZIP</Label>
                <Input
                  aria-describedby={errors.zip ? "quote-zip-error" : undefined}
                  aria-invalid={!!errors.zip}
                  autoComplete="postal-code"
                  id="quote-zip"
                  inputMode="numeric"
                  maxLength={5}
                  onChange={(event) => updateField("zip", event.target.value)}
                  value={form.zip}
                />
                {errors.zip ? (
                  <p className="text-sm text-destructive" id="quote-zip-error">
                    {errors.zip}
                  </p>
                ) : null}
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="grid gap-5">
              <div aria-hidden="true" className="hidden">
                <Label htmlFor="quote-company">Company</Label>
                <Input
                  autoComplete="off"
                  id="quote-company"
                  onChange={(event) => updateField("honeypot", event.target.value)}
                  tabIndex={-1}
                  value={form.honeypot}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="quote-name">Name</Label>
                <Input
                  aria-describedby={errors.name ? "quote-name-error" : undefined}
                  aria-invalid={!!errors.name}
                  autoComplete="name"
                  id="quote-name"
                  onChange={(event) => updateField("name", event.target.value)}
                  value={form.name}
                />
                {errors.name ? (
                  <p className="text-sm text-destructive" id="quote-name-error">
                    {errors.name}
                  </p>
                ) : null}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="quote-phone">Phone</Label>
                <Input
                  aria-describedby={errors.phone ? "quote-phone-error" : undefined}
                  aria-invalid={!!errors.phone}
                  autoComplete="tel"
                  id="quote-phone"
                  inputMode="tel"
                  onChange={(event) => updateField("phone", event.target.value)}
                  value={form.phone}
                />
                {errors.phone ? (
                  <p className="text-sm text-destructive" id="quote-phone-error">
                    {errors.phone}
                  </p>
                ) : null}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="quote-email">Email</Label>
                <Input
                  autoComplete="email"
                  id="quote-email"
                  inputMode="email"
                  onChange={(event) => updateField("email", event.target.value)}
                  value={form.email}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="quote-message">Message (optional)</Label>
                <Textarea
                  aria-describedby={errors.message ? "quote-message-error" : undefined}
                  aria-invalid={!!errors.message}
                  id="quote-message"
                  onChange={(event) => updateField("message", event.target.value)}
                  rows={4}
                  value={form.message}
                />
                {errors.message ? (
                  <p className="text-sm text-destructive" id="quote-message-error">
                    {errors.message}
                  </p>
                ) : null}
              </div>
            </div>
          ) : null}

          <div role="status" aria-live="polite" aria-atomic="true">
            {errors.form ? <p className="mt-4 text-sm text-destructive">{errors.form}</p> : null}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            {step > 1 ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep((current) => current - 1)}
              >
                Back
              </Button>
            ) : null}
            {step < 2 ? (
              <Button type="submit" variant="gold">
                Continue
              </Button>
            ) : (
              <FormSubmitButton pending={isSubmitting} type="submit">
                Submit Quote Request
              </FormSubmitButton>
            )}
          </div>
        </>
      )}
    </form>
  );
}
