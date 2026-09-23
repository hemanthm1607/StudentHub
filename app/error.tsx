"use client";

import * as React from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("Global application boundary error:", error);
  }, [error]);

  return (
    <div className="py-24 bg-white min-h-[60vh] flex items-center justify-center">
      <Container size="sm" className="text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">Application Encountered an Error</h1>
        <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
          An unexpected operational exception occurred. Our logging systems have recorded the event. You can retry safely without losing local progress.
        </p>
        <div className="pt-2">
          <Button
            onClick={() => reset()}
            variant="outline"
            size="sm"
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Try Again
          </Button>
        </div>
      </Container>
    </div>
  );
}
