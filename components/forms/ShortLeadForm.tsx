"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FormSubmitButton } from "@/components/forms/FormSubmitButton";
import { LeadSuccessPanel } from "@/components/forms/LeadSuccessPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  leadServiceOptions,
  leadSubmissionSchema,
  type LeadSubmission,
  type LeadSubmissionInput,
} from "@/lib/lead-validation";
import { siteConfig } from "@/lib/site-config";
import { trackEvent, getAttribution } from "@/lib/analytics";

const leadFieldNames = new Set([
  "name",
  "phone",
  "service",
  "zip",
  "message",
  "honeypot",
  "email",
  "sourcePath",
  "utmSource",
  "utmMedium",
  "utmCampaign",
  "utmTerm",
  "utmContent",
] satisfies (keyof LeadSubmissionInput)[]);

function isLeadField(field: string): field is keyof LeadSubmissionInput {
  return leadFieldNames.has(field as keyof LeadSubmissionInput);
}

type AcceptedLead = { name?: string; service?: string; leadId?: string };

type ShortLeadFormProps = {
  /**
   * Distinguishes which surface produced the lead in the GA4 `generate_lead`
   * payload. Defaults to "short" so existing call sites keep the event shape
   * that tests/e2e/lead-forms.spec.ts and the GA4 reports already expect.
   */
  formName?: string;
};

export function ShortLeadForm({ formName = "short" }: ShortLeadFormProps = {}) {
  const [formError, setFormError] = useState<string | null>(null);
  const [acceptedLead, setAcceptedLead] = useState<AcceptedLead | null>(null);
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    setError,
  } = useForm<LeadSubmissionInput, unknown, LeadSubmission>({
    resolver: zodResolver(leadSubmissionSchema),
    defaultValues: {
      honeypot: "",
      service: undefined,
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    setAcceptedLead(null);

    try {
      const response = await fetch("/api/leads", {
        body: JSON.stringify({
          ...values,
          ...getAttribution(),
          sourcePath: window.location.pathname,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          error?: { details?: { field: string; message: string }[] };
        } | null;

        const details = payload?.error?.details ?? [];
        for (const detail of details) {
          if (isLeadField(detail.field)) {
            setError(detail.field, { message: detail.message, type: "server" });
          }
        }

        setFormError(
          details.length > 0
            ? "Please check the highlighted fields and try again."
            : `Something went wrong on our end. Please call us at ${siteConfig.phone} or email ${siteConfig.email}.`
        );
        return;
      }

      // Read the reference before reset() clears the submitted values.
      const accepted = (await response.json().catch(() => null)) as {
        data?: { leadId?: string };
      } | null;

      setAcceptedLead({
        leadId: accepted?.data?.leadId,
        name: values.name,
        service: values.service ?? undefined,
      });
      trackEvent("generate_lead", {
        form: formName,
        service: values.service ?? "",
        sourcePath: window.location.pathname,
      });
      reset();
    } catch {
      setFormError("Network error. Please try again.");
    }
  });

  return (
    <form className="grid gap-5" data-lead-form onSubmit={onSubmit}>
      {acceptedLead ? (
        <LeadSuccessPanel
          leadId={acceptedLead.leadId}
          name={acceptedLead.name}
          onReset={() => setAcceptedLead(null)}
          service={acceptedLead.service}
        />
      ) : (
        <>
          <div aria-hidden="true" className="hidden">
            <Label htmlFor="company">Company</Label>
            <Input autoComplete="off" id="company" tabIndex={-1} {...register("honeypot")} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="lead-name">Name</Label>
            <Input
              aria-describedby={errors.name ? "lead-name-error" : undefined}
              aria-invalid={!!errors.name}
              autoComplete="name"
              id="lead-name"
              {...register("name")}
            />
            {errors.name ? (
              <p className="text-sm text-destructive" id="lead-name-error">
                {errors.name.message}
              </p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="lead-phone">Phone</Label>
            <Input
              aria-describedby={errors.phone ? "lead-phone-error" : undefined}
              aria-invalid={!!errors.phone}
              autoComplete="tel"
              id="lead-phone"
              inputMode="tel"
              {...register("phone")}
            />
            {errors.phone ? (
              <p className="text-sm text-destructive" id="lead-phone-error">
                {errors.phone.message}
              </p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="lead-email">Email</Label>
            <Input
              aria-describedby={errors.email ? "lead-email-error" : undefined}
              aria-invalid={!!errors.email}
              autoComplete="email"
              id="lead-email"
              inputMode="email"
              {...register("email")}
            />
            {errors.email ? (
              <p className="text-sm text-destructive" id="lead-email-error">
                {errors.email.message}
              </p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="lead-service">Service</Label>
            <select
              aria-describedby={errors.service ? "lead-service-error" : undefined}
              aria-invalid={!!errors.service}
              className="min-h-11 rounded-md border border-input bg-background px-3 text-base md:text-sm"
              id="lead-service"
              {...register("service")}
            >
              <option value="">Select a service</option>
              {leadServiceOptions.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
            {errors.service ? (
              <p className="text-sm text-destructive" id="lead-service-error">
                {errors.service.message}
              </p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="lead-zip">ZIP</Label>
            <Input
              aria-describedby={errors.zip ? "lead-zip-error" : undefined}
              aria-invalid={!!errors.zip}
              autoComplete="postal-code"
              id="lead-zip"
              inputMode="numeric"
              maxLength={5}
              {...register("zip")}
            />
            {errors.zip ? (
              <p className="text-sm text-destructive" id="lead-zip-error">
                {errors.zip.message}
              </p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="lead-message">Message</Label>
            <Textarea
              aria-describedby={errors.message ? "lead-message-error" : undefined}
              aria-invalid={!!errors.message}
              id="lead-message"
              rows={4}
              {...register("message")}
            />
            {errors.message ? (
              <p className="text-sm text-destructive" id="lead-message-error">
                {errors.message.message}
              </p>
            ) : null}
          </div>

          <div role="status" aria-live="polite" aria-atomic="true">
            {formError ? <p className="text-sm text-destructive">{formError}</p> : null}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <FormSubmitButton pending={isSubmitting}>{siteConfig.ctaLabel}</FormSubmitButton>
            <Button type="reset" variant="outline">
              Clear
            </Button>
          </div>
        </>
      )}
    </form>
  );
}
