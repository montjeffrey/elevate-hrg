"use client";

import { cn } from "@/lib/utils";

type StripItem = {
  label: string;
  value?: string;
};

type HeroFrostedStripProps = {
  items: StripItem[];
  theme?: "dark" | "light";
  className?: string;
};

export function HeroFrostedStrip({ items, theme = "dark", className }: HeroFrostedStripProps) {
  const isDark = theme === "dark";

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-y-2 px-6 py-3 md:px-8",
        isDark
          ? "border-t border-brand-cream/10 bg-brand-cream/[0.06] backdrop-blur-md"
          : "border-t border-brand-charcoal/10 bg-brand-charcoal/[0.05] backdrop-blur-md",
        className
      )}
    >
      {items.map((item, i) => (
        <div key={item.label} className="flex items-center">
          {i > 0 && (
            <span
              aria-hidden="true"
              className={cn("mx-3 h-3 w-px", isDark ? "bg-brand-cream/20" : "bg-brand-charcoal/15")}
            />
          )}
          <div className="flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-gold-deep"
            />
            {item.value ? (
              <span
                className={cn(
                  "text-[8.5px] font-bold uppercase tracking-[0.08em]",
                  isDark ? "text-brand-cream/80" : "text-brand-charcoal/65"
                )}
              >
                <span className="text-brand-gold-deep">{item.value}</span> {item.label}
              </span>
            ) : (
              <span
                className={cn(
                  "text-[8.5px] font-bold uppercase tracking-[0.08em]",
                  isDark ? "text-brand-cream/80" : "text-brand-charcoal/65"
                )}
              >
                {item.label}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
