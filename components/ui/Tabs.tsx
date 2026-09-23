"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div
      role="tablist"
      aria-orientation="horizontal"
      className={cn("flex space-x-1 border-b border-slate-200 overflow-x-auto", className)}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            disabled={tab.disabled}
            onClick={() => onChange(tab.id)}
            className={cn(
              "px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 -mb-px flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600",
              isActive
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300",
              tab.disabled && "opacity-40 cursor-not-allowed"
            )}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={cn(
                  "px-1.5 py-0.5 rounded-full text-[10px] tabular-nums font-bold",
                  isActive ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
