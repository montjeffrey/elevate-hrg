"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Menu, Phone, ArrowRight } from "lucide-react";
import { MobileNav } from "@/components/layout/MobileNav";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { primaryNav, serviceLinks } from "@/lib/navigation";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

const subscribeToHydration = () => () => {};
const getClientHydrationState = () => true;
const getServerHydrationState = () => false;

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const isHydrated = useSyncExternalStore(
    subscribeToHydration,
    getClientHydrationState,
    getServerHydrationState
  );
  const pathname = usePathname();
  const transparentAtTop = pathname === "/";

  // Plain passive scroll listener replaces motion's useScroll/useMotionValueEvent
  // so the global header no longer pulls the motion library onto every page.
  // The background fade is a CSS color transition (see className below).
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = isScrolled || !transparentAtTop;

  return (
    <header
      data-hydrated={isHydrated ? "true" : undefined}
      className={cn(
        "fixed inset-x-0 top-0 z-40 border-b transition-colors duration-300",
        solid
          ? "border-white/10 bg-[rgba(21,21,21,0.95)] backdrop-blur"
          : "border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between gap-6 px-6">
        <Link href="/" className="flex items-center">
          <Image
            src="/brand/elevate-hrg-logo.svg"
            alt="Elevate Home Remodeling"
            width={480}
            height={448}
            className="h-12 w-auto"
            priority
            unoptimized
          />
        </Link>
        <nav aria-label="Primary navigation" className="hidden lg:block">
          <NavigationMenu viewport={false}>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent px-3 text-white hover:text-white/80 hover:bg-white/5 data-[state=open]:bg-white/10 xl:px-4">
                  Services
                </NavigationMenuTrigger>
                <NavigationMenuContent
                  className="w-full md:w-[720px] p-6 border-brand-charcoal/10"
                  data-testid="services-menu-content"
                >
                  <div className="grid grid-cols-3 gap-8">
                    <div>
                      <p className="mb-4 text-xs font-bold uppercase tracking-wider text-brand-charcoal/50">
                        Primary Services
                      </p>
                      <ul className="space-y-3">
                        {serviceLinks.slice(0, 4).map((item) => (
                          <li key={item.href}>
                            <NavigationMenuLink asChild>
                              <Link
                                className="block rounded-md p-2 text-sm font-semibold text-brand-charcoal hover:bg-brand-sandstone/20 hover:text-brand-gold-deep transition-colors"
                                href={item.href}
                              >
                                {item.label}
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="mb-4 text-xs font-bold uppercase tracking-wider text-brand-charcoal/50">
                        Additional Services
                      </p>
                      <ul className="space-y-3">
                        {serviceLinks.slice(4).map((item) => (
                          <li key={item.href}>
                            <NavigationMenuLink asChild>
                              <Link
                                className="block rounded-md p-2 text-sm font-medium text-brand-charcoal/80 hover:bg-brand-sandstone/20 hover:text-brand-gold-deep transition-colors"
                                href={item.href}
                              >
                                {item.label}
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/gallery"
                          className="rounded-xl border border-brand-gold bg-brand-sandstone/10 p-6 h-full min-h-[160px] flex flex-col justify-end relative overflow-hidden group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold-deep"
                        >
                          <Image
                            src="/brand/roofing-hero.avif"
                            fill
                            className="object-cover absolute inset-0 z-0 transition-transform duration-500 group-hover:scale-105"
                            alt="Featured Work"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal to-transparent z-10" />
                          <span className="relative z-20 text-white font-medium group-hover:text-brand-gold transition-colors flex items-center">
                            View Featured Work
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </span>
                        </Link>
                      </NavigationMenuLink>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              {primaryNav
                .filter((item) => item.label !== "Services")
                .map((item) => (
                  <NavigationMenuItem key={item.href}>
                    <NavigationMenuLink asChild>
                      <Link
                        className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-white transition hover:bg-white/10 hover:text-white xl:px-4"
                        href={item.href}
                      >
                        {item.label}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
            </NavigationMenuList>
          </NavigationMenu>
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <Button
            asChild
            size="sm"
            variant="ghost"
            className="text-white hover:bg-white/10 hover:text-white"
          >
            {/* phone_click is fired by the delegated PhoneClickTracker (see
                app/layout.tsx); an onClick here would double-count it. */}
            <a href={siteConfig.phoneTel} data-cta="phone-header">
              <Phone className="size-4" />
              {siteConfig.phone}
            </a>
          </Button>
          <Button
            asChild
            size="md"
            variant="primary"
            className="bg-brand-gold-deep hover:bg-brand-gold text-white border-none"
          >
            <Link
              href={siteConfig.quotePath}
              onClick={() => trackEvent("cta_click", { label: "header_quote", location: "header" })}
            >
              {siteConfig.ctaLabel}
            </Link>
          </Button>
        </div>
        <div className="flex items-center gap-2 lg:hidden">
          <Button asChild size="icon" variant="ghost" className="text-white hover:bg-white/10">
            <a
              aria-label="Call Elevate HRG"
              href={siteConfig.phoneTel}
              data-cta="phone-header-mobile"
            >
              <Phone className="size-5" />
            </a>
          </Button>
          <MobileNav
            trigger={
              <Button
                aria-label="Open navigation menu"
                size="icon"
                variant="outline"
                className="border-white/20 bg-transparent text-white hover:bg-white/10"
              >
                <Menu className="size-5" />
              </Button>
            }
          />
        </div>
      </div>
    </header>
  );
}
