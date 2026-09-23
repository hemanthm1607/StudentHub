import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "info" | "success" | "warning" | "danger";
  title?: string;
}

export function Alert({ className, variant = "info", title, children, ...props }: AlertProps) {
  const variantStyles = {
    info: "bg-blue-50 border-blue-200 text-blue-900",
    success: "bg-emerald-50 border-emerald-200 text-emerald-900",
    warning: "bg-amber-50 border-amber-200 text-amber-900",
    danger: "bg-rose-50 border-rose-200 text-rose-900",
  };

  const icons = {
    info: <Info className="w-5 h-5 text-blue-600 shrink-0" aria-hidden="true" />,
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" aria-hidden="true" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" aria-hidden="true" />,
    danger: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" aria-hidden="true" />,
  };

  return (
    <div
      role="alert"
      className={cn("flex gap-3 p-4 rounded-xl border text-sm leading-relaxed", variantStyles[variant], className)}
      {...props}
    >
      {icons[variant]}
      <div className="flex-1 space-y-0.5">
        {title && <h5 className="font-semibold text-sm">{title}</h5>}
        <div className="text-xs opacity-90">{children}</div>
      </div>
    </div>
  );
}
