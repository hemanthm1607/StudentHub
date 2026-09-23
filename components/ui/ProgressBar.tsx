import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  max?: number;
  label?: string;
  showPercent?: boolean;
  variant?: "primary" | "success" | "warning";
}

export function ProgressBar({
  className,
  value,
  max = 100,
  label,
  showPercent = false,
  variant = "primary",
  ...props
}: ProgressBarProps) {
  const percentage = Math.min(Math.max(Math.round((value / max) * 100), 0), 100);

  const variantStyles = {
    primary: "bg-blue-600",
    success: "bg-emerald-600",
    warning: "bg-amber-600",
  };

  return (
    <div className={cn("w-full space-y-1.5", className)} {...props}>
      {(label || showPercent) && (
        <div className="flex justify-between text-xs font-medium text-slate-700">
          {label && <span>{label}</span>}
          {showPercent && <span className="text-slate-500 tabular-nums">{percentage}%</span>}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200"
      >
        <div
          className={cn("h-full transition-all duration-300 rounded-full", variantStyles[variant])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
