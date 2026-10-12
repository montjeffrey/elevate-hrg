"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { MoveHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeAlt?: string;
  afterAlt?: string;
  /** On-brand image shown if `beforeImage` fails to load (e.g. the real photo isn't in /public yet). */
  beforeFallback?: string;
  /** On-brand image shown if `afterImage` fails to load. */
  afterFallback?: string;
  className?: string;
}

// Neutral brand asset used when neither the real photo nor a service-specific
// fallback is available, so a missing image degrades to an on-brand tile
// instead of a broken <img>.
const DEFAULT_IMAGE_FALLBACK = "/brand/roofing-hero.avif";

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeAlt = "Before",
  afterAlt = "After",
  beforeFallback,
  afterFallback,
  className,
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  const [beforeFailed, setBeforeFailed] = useState(false);
  const [afterFailed, setAfterFailed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  // If a configured photo 404s (optimizer returns 400), swap to an on-brand
  // placeholder rather than rendering a broken tile.
  const beforeSrc = beforeFailed ? (beforeFallback ?? DEFAULT_IMAGE_FALLBACK) : beforeImage;
  const afterSrc = afterFailed ? (afterFallback ?? DEFAULT_IMAGE_FALLBACK) : afterImage;

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setPosition(percent);
  }, []);

  useEffect(() => {
    const element = containerRef.current;

    if (!element) {
      return;
    }

    const updateWidth = () => {
      setContainerWidth(element.offsetWidth);
    };

    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    handleMove(e.clientX);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    handleMove(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDragging.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const clamp = (value: number) => Math.max(0, Math.min(100, value));

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case "ArrowLeft":
      case "ArrowDown":
        e.preventDefault();
        setPosition((prev) => clamp(prev - 2));
        break;
      case "ArrowRight":
      case "ArrowUp":
        e.preventDefault();
        setPosition((prev) => clamp(prev + 2));
        break;
      case "Home":
        e.preventDefault();
        setPosition(0);
        break;
      case "End":
        e.preventDefault();
        setPosition(100);
        break;
      case "PageDown":
        e.preventDefault();
        setPosition((prev) => clamp(prev - 10));
        break;
      case "PageUp":
        e.preventDefault();
        setPosition((prev) => clamp(prev + 10));
        break;
      default:
        break;
    }
  };

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label="Before and after project comparison"
      className={cn(
        "relative w-full aspect-video cursor-ew-resize overflow-hidden rounded-xl touch-none select-none",
        className
      )}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* After Image (Background) */}
      <Image
        src={afterSrc}
        alt={afterAlt}
        fill
        className="object-cover pointer-events-none"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        onError={() => {
          if (!afterFailed) setAfterFailed(true);
        }}
      />
      <div className="absolute top-4 right-4 bg-brand-charcoal text-white text-xs font-medium px-3 py-1 rounded-full pointer-events-none shadow-md">
        After
      </div>

      {/* Before Image (Foreground, clipped) */}
      <div
        className="absolute inset-0 z-10 overflow-hidden pointer-events-none"
        style={{ width: `${position}%` }}
      >
        <div
          className="relative h-full w-full"
          style={containerWidth ? { width: containerWidth } : undefined}
        >
          <Image
            src={beforeSrc}
            alt={beforeAlt}
            fill
            className="object-cover pointer-events-none"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => {
              if (!beforeFailed) setBeforeFailed(true);
            }}
          />
        </div>
        <div className="absolute top-4 left-4 bg-brand-charcoal text-white text-xs font-medium px-3 py-1 rounded-full pointer-events-none shadow-md">
          Before
        </div>
      </div>

      {/* Slider Handle */}
      <div
        role="slider"
        aria-label="Before and after comparison"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position)}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="absolute inset-y-0 z-20 w-1 bg-white cursor-ew-resize shadow-[0_0_10px_rgba(0,0,0,0.5)] outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-charcoal/50"
        style={{ left: `calc(${position}% - 2px)` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg border border-brand-sandstone pointer-events-none">
          <MoveHorizontal className="w-4 h-4 text-brand-charcoal" />
        </div>
      </div>
    </div>
  );
}
