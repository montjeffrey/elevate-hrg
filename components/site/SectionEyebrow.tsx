import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

export function SectionEyebrow({ className, ...props }: ComponentPropsWithoutRef<"p">) {
  return (
    <p
      className={cn(
        "text-sm font-semibold uppercase tracking-[0.18em] text-brand-bronze",
        className
      )}
      {...props}
    />
  );
}
