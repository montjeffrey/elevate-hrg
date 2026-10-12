"use client";

import { useState } from "react";
import Image from "next/image";

interface ImageWithFallbackProps extends React.ComponentProps<typeof Image> {
  label?: string;
}

export function ImageWithFallback({ alt, label, className, ...props }: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    const isDecorative = alt === "";
    return (
      <div
        className={className}
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, color-mix(in srgb, #e3c6a3 20%, white) 0%, color-mix(in srgb, #e3c6a3 30%, white) 100%)",
        }}
        role={isDecorative ? undefined : "img"}
        aria-label={isDecorative ? undefined : (alt as string | undefined)}
        aria-hidden={isDecorative ? true : undefined}
      >
        {/* Gold corner accent — vertical stripe */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 2,
            height: 48,
            background: "#b9823f",
          }}
        />
        {/* Gold corner accent — horizontal stripe */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 48,
            height: 2,
            background: "#b9823f",
          }}
        />
        {label && (
          <span
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.75rem",
              fontWeight: 500,
              color: "color-mix(in srgb, #151515 40%, transparent)",
            }}
          >
            {label}
          </span>
        )}
      </div>
    );
  }

  return <Image {...props} alt={alt} className={className} onError={() => setHasError(true)} />;
}
