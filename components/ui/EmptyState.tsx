import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { FolderOpen } from "lucide-react";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({
  className,
  icon,
  title,
  description,
  action,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-10 text-center rounded-xl border border-dashed border-slate-300 bg-slate-50/50",
        className
      )}
      {...props}
    >
      <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 mb-4 shadow-sm">
        {icon || <FolderOpen className="w-6 h-6" />}
      </div>
      <h4 className="text-sm font-semibold text-slate-900 tracking-tight mb-1">{title}</h4>
      <p className="text-xs text-slate-500 max-w-sm leading-relaxed mb-5">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
