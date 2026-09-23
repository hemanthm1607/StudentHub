"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface DropdownItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  danger?: boolean;
  onClick: () => void;
}

export interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: "left" | "right";
  className?: string;
}

export function Dropdown({ trigger, items, align = "right", className }: DropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={cn("relative inline-block text-left", className)}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div
          role="menu"
          className={cn(
            "absolute z-30 mt-2 w-48 rounded-xl bg-white shadow-lg border border-slate-200 py-1.5 focus:outline-none animate-in fade-in zoom-in-95 duration-150",
            align === "right" ? "right-0" : "left-0"
          )}
        >
          {items.map((item) => (
            <button
              key={item.id}
              role="menuitem"
              disabled={item.disabled}
              onClick={() => {
                item.onClick();
                setIsOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-left transition-colors",
                item.danger
                  ? "text-red-600 hover:bg-red-50"
                  : "text-slate-700 hover:bg-slate-50 hover:text-slate-900",
                item.disabled && "opacity-40 cursor-not-allowed"
              )}
            >
              {item.icon && <span className="w-4 h-4 text-slate-400">{item.icon}</span>}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
