import { requireAuth } from "@/lib/security/auth-helpers";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { listPublishedCourses } from "@/lib/services/course-service";
import {
  User as UserIcon,
  Mail,
  ShieldCheck,
  Calendar,
  Flame,
  Globe,
  Clock,
  BookOpen,
  Code2,
  Users2,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "Dashboard - StudentHub",
  description: "Protected student workspace and verification dashboard.",
};

export default async function DashboardPage() {
  // Authoritative server-side authentication check. Redirects to /login if unauthenticated.
  const user = await requireAuth();
  const { courses: featuredCourses } = await listPublishedCourses({ limit: 3 });

  const formattedJoinDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner / Welcome Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-2xl shadow-sm shrink-0">
            {user.profile?.displayName ? user.profile.displayName[0].toUpperCase() : "S"}
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Welcome back, {user.profile?.displayName || "Student"}!
              </h1>
              <Badge variant="info" className="uppercase font-semibold text-[11px] tracking-wider">
                {user.role}
              </Badge>
            </div>
            <p className="text-sm text-slate-600 flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              {user.email}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <Link href="/profile">
            <Button variant="primary" size="sm" className="shadow-sm">
              <UserIcon className="w-4 h-4 mr-1.5" />
              My Profile & Skills
            </Button>
          </Link>
          <Link href="/learn">
            <Button variant="secondary" size="sm">
              <BookOpen className="w-4 h-4 mr-1.5" />
              Browse Lessons
            </Button>
          </Link>
          <LogoutButton />
        </div>
      </div>

      {/* Account Verification & Security Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-blue-600" />
                Profile Identity
              </CardTitle>
              <Badge variant="success">Active</Badge>
            </div>
            <CardDescription className="text-xs">
              Verified server-side student identity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3.5 text-xs text-slate-700">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Display Name</span>
              <span className="font-semibold text-slate-900">{user.profile?.displayName}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Account ID</span>
              <span className="font-mono text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                {user.id}
              </span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-slate-400" /> Timezone
              </span>
              <span className="font-semibold text-slate-900">{user.profile?.timezone || "UTC"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> Member Since
              </span>
              <span className="font-semibold text-slate-900">{formattedJoinDate}</span>
            </div>
          </CardContent>
        </Card>

        {/* Session Status & Authorization Card */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Session Status
              </CardTitle>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" title="Active Authenticated Session" />
            </div>
            <CardDescription className="text-xs">
              Account status and authentication state
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3.5 text-xs text-slate-700">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Auth Status</span>
              <span className="font-semibold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Authenticated
              </span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Account Standing</span>
              <span className="font-semibold text-slate-900">Good (Active)</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Role</span>
              <Badge variant="outline" className="font-mono text-[10px]">{user.role}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> Session Expiration
              </span>
              <span className="font-semibold text-slate-900">14 Days Rolling</span>
            </div>
          </CardContent>
        </Card>

        {/* Learning & Swap Status Card */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-500" />
                Learning Progress
              </CardTitle>
              <Badge variant="default">Phase 2 Verified</Badge>
            </div>
            <CardDescription className="text-xs">
              Continuous mastery workflow status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3.5 text-xs text-slate-700">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Daily Streak</span>
              <span className="font-bold text-slate-900">{user.profile?.streakCount ?? 0} days</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Curriculum Access</span>
              <span className="font-semibold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Full & Unlocked
              </span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Skill Swap Standing</span>
              <span className="font-semibold text-slate-900">Ready to Enroll (Phase 3)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Peer Mentorship</span>
              <span className="font-semibold text-slate-900">Eligible</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Featured Courses Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Recommended Courses
            </h2>
            <p className="text-xs text-slate-500">
              Structured paths with direct topic access and zero prerequisites.
            </p>
          </div>
          <Link href="/learn" className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
            View All Courses <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {featuredCourses.map((c) => (
            <div
              key={c.id}
              className="p-5 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2 font-medium">
                  <span className="text-blue-600 font-semibold">{c.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{c.difficulty}</span>
                  <span aria-hidden="true">·</span>
                  <span>{c.estimatedHours}h</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  <Link href={`/learn/${c.slug}`} className="hover:text-blue-600 transition-colors">
                    {c.title}
                  </Link>
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 mb-4">
                  {c.shortDescription || c.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <span className="text-xs text-slate-500">
                  {c.moduleCount} {c.moduleCount === 1 ? "module" : "modules"} · {c.topicCount} topics
                </span>
                <Link href={`/learn/${c.slug}`}>
                  <Button variant="secondary" size="sm">
                    Open Course
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">
          Explore StudentHub Learning System
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/learn"
            className="p-5 bg-white border border-slate-200 rounded-xl hover:border-blue-400 hover:shadow-sm transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Interactive Curriculum</h3>
            <p className="text-xs text-slate-600">
              Direct-access technical courses from Data Structures to Web Systems.
            </p>
          </Link>

          <Link
            href="/practice"
            className="p-5 bg-white border border-slate-200 rounded-xl hover:border-blue-400 hover:shadow-sm transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Coding Workouts</h3>
            <p className="text-xs text-slate-600">
              Sandboxed, isolated coding practice against visible and hidden test suites.
            </p>
          </Link>

          <Link
            href="/skill-swap"
            className="p-5 bg-white border border-slate-200 rounded-xl hover:border-blue-400 hover:shadow-sm transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Users2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Peer Skill Swap</h3>
            <p className="text-xs text-slate-600">
              Exchange technical skills 1-on-1 with verified peer mentors worldwide.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
