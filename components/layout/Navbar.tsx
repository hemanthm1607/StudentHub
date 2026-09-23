"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/Button";
import {
  GraduationCap,
  BookOpen,
  Code2,
  Users2,
  CheckSquare,
  Info,
  Menu,
  X,
  LayoutDashboard,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import type { SafeUser } from "@/lib/security/session";

const NAV_LINKS = [
  { href: "/learn", label: "Learn", icon: BookOpen },
  { href: "/practice", label: "Practice", icon: Code2 },
  { href: "/skill-swap", label: "Skill Swap", icon: Users2 },
  { href: "/assessments", label: "Assessments", icon: CheckSquare },
  { href: "/about", label: "About", icon: Info },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [user, setUser] = React.useState<SafeUser | null>(null);
  const [authChecked, setAuthChecked] = React.useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Fetch server-authoritative session state on mount & route change
  React.useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      try {
        const res = await fetch("/api/v1/auth/me", {
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setUser(data?.user || null);
          }
        } else {
          if (isMounted) setUser(null);
        }
      } catch {
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setAuthChecked(true);
      }
    }

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [pathname]);

  // Close mobile drawer on route change
  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch("/api/v1/auth/logout", { method: "POST" });
      setUser(null);
      router.push("/login");
      router.refresh();
    } catch {
      setUser(null);
      router.push("/login");
      router.refresh();
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg p-1"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-slate-900 leading-none">
                StudentHub
              </span>
              <span className="text-[10px] font-medium text-slate-500 tracking-wide mt-0.5">
                FREE PEER LEARNING
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1" aria-label="Main Navigation">
            {NAV_LINKS.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || pathname?.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600",
                    isActive
                      ? "text-blue-600 bg-blue-50/70"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  )}
                >
                  <Icon className="w-3.5 h-3.5 opacity-70" aria-hidden="true" />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            {/* If authenticated, show Dashboard and Profile links */}
            {user && (
              <>
                <Link
                  href="/dashboard"
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600",
                    pathname === "/dashboard"
                      ? "text-blue-600 bg-blue-50/70"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  )}
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-blue-600" aria-hidden="true" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  href="/profile"
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600",
                    pathname?.startsWith("/profile")
                      ? "text-blue-600 bg-blue-50/70"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  )}
                >
                  <UserIcon className="w-3.5 h-3.5 text-blue-600" aria-hidden="true" />
                  <span>Profile</span>
                </Link>
              </>
            )}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center space-x-2.5">
            {authChecked && user ? (
              <div className="flex items-center space-x-2">
                <Link href="/profile">
                  <Button variant="ghost" size="sm" className="flex items-center gap-1.5 text-slate-800">
                    <UserIcon className="w-3.5 h-3.5 text-blue-600" />
                    <span className="font-semibold text-xs">
                      {user.profile?.displayName || "Profile"}
                    </span>
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-xs"
                >
                  <LogOut className="w-3.5 h-3.5 text-slate-500" />
                  <span>Logout</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm">
                    Register Free
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-150 shadow-lg">
          <nav className="flex flex-col space-y-1" aria-label="Mobile Navigation">
            {NAV_LINKS.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 px-3.5 py-3 text-sm font-semibold rounded-lg transition-colors min-h-[44px]",
                    isActive
                      ? "text-blue-600 bg-blue-50"
                      : "text-slate-700 hover:bg-slate-50"
                  )}
                >
                  <Icon className="w-4 h-4 text-slate-500" aria-hidden="true" />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            {user && (
              <>
                <Link
                  href="/dashboard"
                  className={cn(
                    "flex items-center gap-3 px-3.5 py-3 text-sm font-semibold rounded-lg transition-colors min-h-[44px]",
                    pathname === "/dashboard"
                      ? "text-blue-600 bg-blue-50"
                      : "text-slate-700 hover:bg-slate-50"
                  )}
                >
                  <LayoutDashboard className="w-4 h-4 text-blue-600" aria-hidden="true" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  href="/profile"
                  className={cn(
                    "flex items-center gap-3 px-3.5 py-3 text-sm font-semibold rounded-lg transition-colors min-h-[44px]",
                    pathname?.startsWith("/profile")
                      ? "text-blue-600 bg-blue-50"
                      : "text-slate-700 hover:bg-slate-50"
                  )}
                >
                  <UserIcon className="w-4 h-4 text-blue-600" aria-hidden="true" />
                  <span>My Profile</span>
                </Link>
              </>
            )}
          </nav>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <>
                <div className="flex gap-2">
                  <Link href="/profile" className="w-1/2">
                    <Button variant="outline" size="md" className="w-full text-xs font-semibold">
                      My Profile
                    </Button>
                  </Link>
                  <Link href="/dashboard" className="w-1/2">
                    <Button variant="primary" size="md" className="w-full text-xs font-semibold">
                      Dashboard
                    </Button>
                  </Link>
                </div>
                <Button
                  variant="outline"
                  size="md"
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/register" className="w-full">
                  <Button variant="primary" size="md" className="w-full">
                    Register Free
                  </Button>
                </Link>
                <Link href="/login" className="w-full">
                  <Button variant="outline" size="md" className="w-full">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
