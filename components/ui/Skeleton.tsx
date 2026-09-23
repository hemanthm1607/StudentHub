import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "rectangular" | "circular";
}

export function Skeleton({ className, variant = "rectangular", ...props }: SkeletonProps) {
  const variantStyles = {
    text: "h-4 w-full rounded",
    rectangular: "rounded-lg",
    circular: "rounded-full",
  };

  return (
    <div
      aria-hidden="true"
      className={cn("animate-pulse bg-slate-200/80", variantStyles[variant], className)}
      {...props}
    />
  );
}
