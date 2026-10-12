"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Paperclip } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FormSubmitButton } from "@/components/forms/FormSubmitButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trackEvent, getAttribution } from "@/lib/analytics";
import {
  careerApplicationSchema,
  careerPositionOptions,
  experienceOptions,
  type CareerApplication,
  type CareerApplicationInput,
} from "@/lib/careers-validation";
import {
  ACCEPTED_RESUME_EXTENSION,
  ACCEPTED_RESUME_MIME,
  MAX_RESUME_BYTES,
  MAX_RESUME_LABEL,
} from "@/lib/resume-file";
import { siteConfig } from "@/lib/site-config";

const careerFieldNames = new Set([
  "name",
  "email",
  "phone",
  "position",
  "experience",
  "message",
  "honeypot",
  "sourcePath",
  "utmSource",
  "utmMedium",
  "utmCampaign",
  "utmTerm",
  "utmContent",
] satisfies (keyof CareerApplicationInput)[]);

function isCareerField(field: string): field is keyof CareerApplicationInput {
  return careerFieldNames.has(field as keyof CareerApplicationInput);
}

function formatBytes(bytes: number) {
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export function CareerApplicationForm() {
  const [formError, setFormError] = useState<string | null>(null);
  const [resumeError, setResumeError] = useState<string | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const confirmationRef = useRef<HTMLHeadingElement>(null);

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    setError,
  } = useForm<CareerApplicationInput, unknown, CareerApplication>({
    resolver: zodResolver(careerApplicationSchema),
    defaultValues: { honeypot: "", position: undefined, experience: undefined },
  });

  useEffect(() => {
    if (!applicationId) return;
    const heading = confirmationRef.current;
    if (!heading) return;
    // Same reasoning as LeadSuccessPanel: keyboard and screen-reader users must
    // land on the confirmation rather than at a form that silently vanished.
    heading.focus({ preventScroll: true });
    heading.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [applicationId]);

  /**
   * Client-side file checks are a courtesy, not a control — they exist so an
   * applicant learns about a 20 MB scan before uploading it, not because they
   * protect anything. The server re-verifies the size and sniffs the magic
   * bytes, and treats everything arriving from here as hostile.
   */
  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setResumeError(null);

    if (!file) {
      setResumeFile(null);
      return;
    }

    if (file.size > MAX_RESUME_BYTES) {
      setResumeFile(null);
      event.target.value = "";
      setResumeError(`That file is ${formatBytes(file.size)} — the limit is ${MAX_RESUME_LABEL}.`);
      return;
    }

    if (!file.name.toLowerCase().endsWith(ACCEPTED_RESUME_EXTENSION)) {
      setResumeFile(null);
      event.target.value = "";
      setResumeError("Resumes must be PDF files.");
      return;
    }

    setResumeFile(file);
  };

  const clearResume = () => {
    setResumeFile(null);
    setResumeError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);

    if (!resumeFile) {
      setResumeError("Attach your resume as a PDF.");
      return;
    }

    // multipart/form-data, not JSON — the resume travels as raw bytes rather
    // than base64 inside a JSON string, which would inflate the request by a
    // third for no benefit and eat into the platform's payload ceiling.
    const body = new FormData();
    const attribution = getAttribution();
    body.set("name", values.name);
    body.set("email", values.email);
    body.set("phone", values.phone);
    body.set("position", values.position);
    body.set("experience", values.experience);
    body.set("message", values.message ?? "");
    body.set("honeypot", values.honeypot ?? "");
    body.set("sourcePath", window.location.pathname);
    for (const [key, value] of Object.entries(attribution)) {
      if (typeof value === "string" && value) body.set(key, value);
    }
    body.set("resume", resumeFile, resumeFile.name);

    try {
      const response = await fetch("/api/careers", { method: "POST", body });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          error?: { message?: string; details?: { field: string; message: string }[] };
        } | null;

        const details = payload?.error?.details ?? [];
        let sawResumeError = false;
        for (const detail of details) {
          if (detail.field === "resume") {
            setResumeError(detail.message);
            sawResumeError = true;
          } else if (isCareerField(detail.field)) {
            setError(detail.field, { message: detail.message, type: "server" });
          }
        }

        if (details.length === 0) {
          setFormError(
            payload?.error?.message ??
              `Something went wrong on our end. Please call us at ${siteConfig.phone} or email ${siteConfig.email}.`
          );
        } else {
          setFormError(
            sawResumeError && details.length === 1
              ? "Please check your resume file and try again."
              : "Please check the highlighted fields and try again."
          );
        }
        return;
      }

      const accepted = (await response.json().catch(() => null)) as {
        data?: { applicationId?: string };
      } | null;

      setApplicationId(accepted?.data?.applicationId ?? "sent");
      trackEvent("job_application", {
        position: values.position,
        sourcePath: window.location.pathname,
      });
      reset();
      // Only the state is cleared here, not the DOM input's `value`. The
      // success panel replaces the whole form, so the <input type="file"> is
      // unmounted and remounts empty if the applicant submits another
      // application. Touching fileInputRef from inside the submit callback
      // would also be a ref-read on a render path (react-hooks/refs).
      setResumeFile(null);
      setResumeError(null);
    } catch {
      setFormError("Network error. Please try again.");
    }
  });

  if (applicationId) {
    return (
      <div className="flex flex-col items-center gap-6 py-6 text-center">
        <span
          aria-hidden="true"
          className="flex size-16 items-center justify-center rounded-full bg-brand-gold-deep text-white shadow-sm"
        >
          <Check className="size-8" strokeWidth={3} />
        </span>
        <div className="grid gap-3">
          <h3
            className="text-2xl font-semibold tracking-tight outline-none sm:text-3xl"
            ref={confirmationRef}
            tabIndex={-1}
          >
            Application received
          </h3>
          <p className="text-brand-warm-gray">
            Thanks for applying. Our team reviews every application and will reach out if your
            experience is a fit. Questions? Call{" "}
            <a className="font-medium text-brand-bronze hover:underline" href={siteConfig.phoneTel}>
              {siteConfig.phone}
            </a>
            .
          </p>
          {applicationId !== "sent" ? (
            <p className="text-sm text-brand-warm-gray">
              Reference: <span className="font-mono">{applicationId}</span>
            </p>
          ) : null}
        </div>
        <Button onClick={() => setApplicationId(null)} type="button" variant="outline">
          Submit another application
        </Button>
      </div>
    );
  }

  return (
    <form className="grid gap-5" data-career-form noValidate onSubmit={onSubmit}>
      <div aria-hidden="true" className="hidden">
        <Label htmlFor="career-company">Company</Label>
        <Input autoComplete="off" id="career-company" tabIndex={-1} {...register("honeypot")} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="career-name">Full name</Label>
        <Input
          aria-describedby={errors.name ? "career-name-error" : undefined}
          aria-invalid={!!errors.name}
          autoComplete="name"
          id="career-name"
          {...register("name")}
        />
        {errors.name ? (
          <p className="text-sm text-destructive" id="career-name-error">
            {errors.name.message}
          </p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="career-email">Email</Label>
        <Input
          aria-describedby={errors.email ? "career-email-error" : undefined}
          aria-invalid={!!errors.email}
          autoComplete="email"
          id="career-email"
          inputMode="email"
          {...register("email")}
        />
        {errors.email ? (
          <p className="text-sm text-destructive" id="career-email-error">
            {errors.email.message}
          </p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="career-phone">Phone</Label>
        <Input
          aria-describedby={errors.phone ? "career-phone-error" : undefined}
          aria-invalid={!!errors.phone}
          autoComplete="tel"
          id="career-phone"
          inputMode="tel"
          {...register("phone")}
        />
        {errors.phone ? (
          <p className="text-sm text-destructive" id="career-phone-error">
            {errors.phone.message}
          </p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="career-position">Position</Label>
        <select
          aria-describedby={errors.position ? "career-position-error" : undefined}
          aria-invalid={!!errors.position}
          className="min-h-11 rounded-md border border-input bg-background px-3 text-base md:text-sm"
          id="career-position"
          {...register("position")}
        >
          <option value="">Select a position</option>
          {careerPositionOptions.map((position) => (
            <option key={position} value={position}>
              {position}
            </option>
          ))}
        </select>
        {errors.position ? (
          <p className="text-sm text-destructive" id="career-position-error">
            {errors.position.message}
          </p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="career-experience">Years of experience</Label>
        <select
          aria-describedby={errors.experience ? "career-experience-error" : undefined}
          aria-invalid={!!errors.experience}
          className="min-h-11 rounded-md border border-input bg-background px-3 text-base md:text-sm"
          id="career-experience"
          {...register("experience")}
        >
          <option value="">Select experience</option>
          {experienceOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {errors.experience ? (
          <p className="text-sm text-destructive" id="career-experience-error">
            {errors.experience.message}
          </p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="career-resume">Resume (PDF, {MAX_RESUME_LABEL} max)</Label>
        <input
          accept={`${ACCEPTED_RESUME_MIME},${ACCEPTED_RESUME_EXTENSION}`}
          aria-describedby={resumeError ? "career-resume-error" : "career-resume-hint"}
          aria-invalid={!!resumeError}
          className="min-h-11 rounded-md border border-input bg-background px-3 py-2 text-base file:mr-3 file:rounded-md file:border-0 file:bg-brand-gold/15 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-brand-gold-deep md:text-sm"
          id="career-resume"
          name="resume"
          onChange={onFileChange}
          ref={fileInputRef}
          type="file"
        />
        {resumeFile ? (
          <p className="flex flex-wrap items-center gap-2 text-sm text-brand-warm-gray">
            <Paperclip aria-hidden="true" className="size-4" />
            {/* React escapes this — the filename is never interpreted as markup. */}
            <span className="font-medium">{resumeFile.name}</span>
            <span>({formatBytes(resumeFile.size)})</span>
            <button
              className="ml-1 underline hover:text-brand-bronze"
              onClick={clearResume}
              type="button"
            >
              Remove
            </button>
          </p>
        ) : (
          <p className="text-sm text-brand-warm-gray" id="career-resume-hint">
            PDF only. Export from Word or Google Docs as a PDF before attaching.
          </p>
        )}
        {resumeError ? (
          <p className="text-sm text-destructive" id="career-resume-error">
            {resumeError}
          </p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="career-message">Anything else we should know? (optional)</Label>
        <Textarea
          aria-describedby={errors.message ? "career-message-error" : undefined}
          aria-invalid={!!errors.message}
          id="career-message"
          rows={4}
          {...register("message")}
        />
        {errors.message ? (
          <p className="text-sm text-destructive" id="career-message-error">
            {errors.message.message}
          </p>
        ) : null}
      </div>

      <div aria-atomic="true" aria-live="polite" role="status">
        {formError ? <p className="text-sm text-destructive">{formError}</p> : null}
      </div>

      <p className="text-sm text-brand-warm-gray">
        Your application and resume are emailed to our hiring inbox. This website does not store
        them. To have your application removed, email{" "}
        <a className="text-brand-bronze hover:underline" href={`mailto:${siteConfig.email}`}>
          {siteConfig.email}
        </a>
        .
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <FormSubmitButton pending={isSubmitting}>Submit application</FormSubmitButton>
      </div>
    </form>
  );
}
