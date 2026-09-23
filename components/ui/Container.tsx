import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

export function Container({ className, size = "lg", children, ...props }: ContainerProps) {
  const sizeStyles = {
    sm: "max-w-3xl",
    md: "max-w-5xl",
    lg: "max-w-7xl",
    xl: "max-w-screen-2xl",
    full: "max-w-full",
  };

  return (
    <div className={cn("w-full mx-auto px-4 sm:px-6 lg:px-8", sizeStyles[size], className)} {...props}>
      {children}
    </div>
  );
}
