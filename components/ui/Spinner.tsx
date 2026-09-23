import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { Loader2 } from "lucide-react";

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  label?: string;
}

export function Spinner({ className, size = "md", label = "Loading...", ...props }: SpinnerProps) {
  const sizeStyles = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div
      role="status"
      className={cn("inline-flex items-center justify-center text-blue-600", className)}
      {...props}
    >
      <Loader2 className={cn("animate-spin", sizeStyles[size])} aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </div>
  );
}
