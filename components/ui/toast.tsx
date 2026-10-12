import * as React from "react";
import { cn } from "@/lib/utils";

function Toast({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-md border border-border bg-card p-4 text-card-foreground shadow-lg",
        className,
      )}
      role="status"
      {...props}
    />
  );
}

function ToastTitle({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("text-sm font-semibold", className)} {...props} />;
}

function ToastDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("mt-1 text-sm text-muted-foreground", className)} {...props} />;
}

export { Toast, ToastDescription, ToastTitle };
