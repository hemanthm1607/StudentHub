import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "muted" | "bordered";
  interactive?: boolean;
}

export function Card({
  className,
  variant = "default",
  interactive = false,
  children,
  ...props
}: CardProps) {
  const variantStyles = {
    default: "bg-white border border-slate-200 shadow-sm",
    muted: "bg-slate-50 border border-slate-200/80",
    bordered: "bg-white border-2 border-slate-200",
  };

  return (
    <div
      className={cn(
        "rounded-xl p-5 transition-all text-slate-900",
        variantStyles[variant],
        interactive && "hover:border-blue-300 hover:shadow-md cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col space-y-1.5 pb-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("text-base font-semibold text-slate-900 tracking-tight", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-xs text-slate-500 leading-relaxed", className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("text-sm", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-center pt-4 border-t border-slate-100", className)} {...props}>
      {children}
    </div>
  );
}
