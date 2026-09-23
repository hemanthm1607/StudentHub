"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export interface ToastMessage {
  id: string;
  type?: "success" | "error" | "info";
  title?: string;
  message: string;
}

export interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
          info: <Info className="w-5 h-5 text-blue-600 shrink-0" />,
        };

        const borderColors = {
          success: "border-emerald-200 bg-white",
          error: "border-rose-200 bg-white",
          info: "border-blue-200 bg-white",
        };

        return (
          <div
            key={toast.id}
            role="status"
            className={cn(
              "pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border text-slate-900 transition-all animate-in slide-in-from-bottom-2 duration-200",
              borderColors[toast.type || "info"]
            )}
          >
            {icons[toast.type || "info"]}
            <div className="flex-1 space-y-0.5">
              {toast.title && <h5 className="font-semibold text-xs text-slate-900">{toast.title}</h5>}
              <p className="text-xs text-slate-600 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              aria-label="Dismiss notification"
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
