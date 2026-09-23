"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { LogOut, Loader2 } from "lucide-react";

export function LogoutButton({ className }: { className?: string }) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch("/api/v1/auth/logout", {
        method: "POST",
      });
      router.push("/login");
      router.refresh();
    } catch {
      // Even if network fails, redirect to login
      router.push("/login");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleLogout}
      disabled={loading}
      className={className}
      aria-label="Log out of account"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <>
          <LogOut className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
          Log out
        </>
      )}
    </Button>
  );
}
