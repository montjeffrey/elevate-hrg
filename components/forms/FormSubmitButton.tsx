"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export function FormSubmitButton({
  children,
  onClick,
  pending,
  type = "submit",
}: {
  children: ReactNode;
  onClick?: () => void;
  pending?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <Button disabled={pending} onClick={onClick} type={type} variant="gold">
      {pending ? "Sending..." : children}
    </Button>
  );
}
