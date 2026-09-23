import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { Spinner } from "./Spinner";

export interface LoadingStateProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string;
}

export function LoadingState({
  className,
  message = "Loading content...",
  ...props
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-12 text-center rounded-xl bg-white/50 space-y-3",
        className
      )}
      {...props}
    >
      <Spinner size="lg" />
      <p className="text-xs font-medium text-slate-500 animate-pulse">{message}</p>
    </div>
  );
}
