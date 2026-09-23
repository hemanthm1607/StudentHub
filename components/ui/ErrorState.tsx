import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "./Button";

export interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorState({
  className,
  title = "Something went wrong",
  message = "An error occurred while loading this section. Please try again.",
  onRetry,
  retryLabel = "Try Again",
  ...props
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center rounded-xl border border-rose-200 bg-rose-50/40 text-slate-900",
        className
      )}
      {...props}
    >
      <div className="w-12 h-12 rounded-xl bg-white border border-rose-200 flex items-center justify-center text-rose-600 mb-3 shadow-sm">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h4 className="text-sm font-semibold text-slate-900 mb-1">{title}</h4>
      <p className="text-xs text-slate-600 max-w-sm mb-4 leading-relaxed">{message}</p>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          leftIcon={<RotateCcw className="w-3.5 h-3.5 text-slate-600" />}
        >
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
