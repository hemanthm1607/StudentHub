"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { GraduationCap, Eye, EyeOff, Lock, Mail, User, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [displayName, setDisplayName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // Password requirements check for client guidance
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!displayName.trim() || !email.trim() || !password) {
      setErrorMessage("Please complete all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please verify both fields.");
      return;
    }

    if (!hasMinLength || !hasUppercase || !hasNumber) {
      setErrorMessage("Password must be at least 8 characters and include at least one uppercase letter and one number.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: displayName.trim(),
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data?.error?.message || "Registration failed. Please try again.");
        setLoading(false);
        return;
      }

      // Success: redirect to protected dashboard
      router.push("/dashboard");
      router.refresh();
    } catch {
      setErrorMessage("Unable to communicate with the authentication server. Please check your connection.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50/50">
      <div className="w-full max-w-md space-y-6">
        {/* Header Icon & Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-blue-600 text-white items-center justify-center shadow-md">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Create your StudentHub Account
          </h1>
          <p className="text-sm text-slate-600">
            Join thousands of students learning, coding, and mentoring without paywalls.
          </p>
        </div>

        {/* Card Form */}
        <Card className="shadow-sm border-slate-200/90 bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold text-slate-900">Student Registration</CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Free forever. No credit card required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <Alert variant="danger">
                  {errorMessage}
                </Alert>
              )}

              {/* Display Name */}
              <div className="space-y-1.5">
                <label
                  htmlFor="displayName"
                  className="block text-xs font-semibold text-slate-700 tracking-wide"
                >
                  Full or Display Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="displayName"
                    name="displayName"
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Alex Morgan"
                    disabled={loading}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900 placeholder:text-slate-400 disabled:bg-slate-50"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold text-slate-700 tracking-wide"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@university.edu"
                    disabled={loading}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900 placeholder:text-slate-400 disabled:bg-slate-50"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-slate-700 tracking-wide"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 8 characters"
                    disabled={loading}
                    className="w-full pl-9 pr-10 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900 placeholder:text-slate-400 disabled:bg-slate-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Rule Indicators */}
                <div className="pt-1 flex flex-wrap gap-2 text-[11px] text-slate-500">
                  <span className={`inline-flex items-center gap-1 ${hasMinLength ? "text-emerald-600 font-medium" : "text-slate-500"}`}>
                    <CheckCircle2 className="w-3 h-3" /> 8+ chars
                  </span>
                  <span className={`inline-flex items-center gap-1 ${hasUppercase ? "text-emerald-600 font-medium" : "text-slate-500"}`}>
                    <CheckCircle2 className="w-3 h-3" /> Uppercase
                  </span>
                  <span className={`inline-flex items-center gap-1 ${hasNumber ? "text-emerald-600 font-medium" : "text-slate-500"}`}>
                    <CheckCircle2 className="w-3 h-3" /> Number
                  </span>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs font-semibold text-slate-700 tracking-wide"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    disabled={loading}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900 placeholder:text-slate-400 disabled:bg-slate-50"
                  />
                </div>
                {confirmPassword && !passwordsMatch && (
                  <p className="text-[11px] text-rose-600 font-medium pt-0.5">
                    Passwords do not match
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full justify-center mt-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Login Link */}
        <div className="text-center text-xs text-slate-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-blue-600 hover:text-blue-700 underline underline-offset-4"
          >
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
}
