import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ className, items, ...props }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center text-xs text-slate-500", className)} {...props}>
      <ol className="flex items-center space-x-1.5">
        <li>
          <Link
            href="/"
            aria-label="Home"
            className="flex items-center text-slate-400 hover:text-slate-700 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <React.Fragment key={index}>
              <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" aria-hidden="true" />
              <li>
                {isLast || !item.href ? (
                  <span className="font-semibold text-slate-900 truncate max-w-[200px] block" aria-current="page">
                    {item.label}
                  </span>
                ) : (
                  <Link href={item.href} className="hover:text-slate-800 transition-colors truncate max-w-[150px] block">
                    {item.label}
                  </Link>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
