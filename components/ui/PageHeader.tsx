import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
}

export function PageHeader({
  className,
  title,
  description,
  badge,
  action,
  children,
  ...props
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-200/80 mb-6",
        className
      )}
      {...props}
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
          {badge}
        </div>
        {description && <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{description}</p>}
      </div>
      {action && <div className="flex items-center gap-2.5 shrink-0">{action}</div>}
      {children}
    </div>
  );
}
