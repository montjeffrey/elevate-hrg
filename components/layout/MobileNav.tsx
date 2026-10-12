"use client";

import Link from "next/link";
import type { ReactElement } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { primaryNav, serviceLinks } from "@/lib/navigation";
import { siteConfig } from "@/lib/site-config";

export function MobileNav({ trigger }: { trigger: ReactElement }) {
  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className="w-full max-w-sm border-brand-sandstone px-0" side="right">
        <SheetHeader className="border-b border-brand-sandstone/60 px-6 py-5 text-left">
          <SheetTitle>{siteConfig.name}</SheetTitle>
          <SheetDescription>Mobile navigation links and contact actions.</SheetDescription>
        </SheetHeader>
        <nav
          aria-label="Mobile navigation"
          className="grid min-h-0 flex-1 auto-rows-min gap-1 overflow-y-auto overscroll-contain px-3 py-1"
        >
          {serviceLinks.map((item) => (
            <SheetClose asChild key={item.href}>
              <Link
                className="flex min-h-12 items-center rounded-md px-3 text-base font-semibold text-brand-espresso hover:bg-brand-sandstone/35"
                href={item.href}
              >
                {item.label}
              </Link>
            </SheetClose>
          ))}
          {primaryNav
            .filter((item) => item.label !== "Services")
            .map((item) => (
              <SheetClose asChild key={item.href}>
                <Link
                  className="flex min-h-12 items-center rounded-md px-3 text-base font-semibold text-brand-espresso hover:bg-brand-sandstone/35"
                  href={item.href}
                >
                  {item.label}
                </Link>
              </SheetClose>
            ))}
        </nav>
        <div className="grid gap-3 border-t border-brand-sandstone/60 p-6">
          <Button asChild size="lg" variant="gold">
            <a href={siteConfig.phoneTel}>Call {siteConfig.phone}</a>
          </Button>
          <SheetClose asChild>
            <Button asChild size="lg" variant="primary">
              <Link href={siteConfig.quotePath}>{siteConfig.ctaLabel}</Link>
            </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}
