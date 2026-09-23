import * as React from "react";
import Link from "next/link";
import { GraduationCap, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-slate-50 border-t border-slate-200 mt-auto text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand and Mission */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold tracking-tight text-slate-900">StudentHub</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
              A free student learning, practice, assessment, and peer-to-peer Skill Swap platform designed for computer science and engineering learners worldwide.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <span>Crafted for students with</span>
              <Heart className="w-3 h-3 text-rose-500 fill-rose-500" aria-label="love" />
              <span>at zero cost.</span>
            </div>
          </div>

          {/* Learn & Practice */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900">Curriculum</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/learn" className="hover:text-blue-600 transition-colors">
                  Course Catalog
                </Link>
              </li>
              <li>
                <Link href="/learn" className="hover:text-blue-600 transition-colors">
                  Java Core & OOP
                </Link>
              </li>
              <li>
                <Link href="/learn" className="hover:text-blue-600 transition-colors">
                  Python Fundamentals
                </Link>
              </li>
              <li>
                <Link href="/practice" className="hover:text-blue-600 transition-colors">
                  Coding Workouts
                </Link>
              </li>
            </ul>
          </div>

          {/* Community & Testing */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900">Community</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/skill-swap" className="hover:text-blue-600 transition-colors">
                  Skill Swap Network
                </Link>
              </li>
              <li>
                <Link href="/assessments" className="hover:text-blue-600 transition-colors">
                  Assessments & Integrity
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-blue-600 transition-colors">
                  Zero-Cost Philosophy
                </Link>
              </li>
              <li>
                <a
                  href="/api/v1/health"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 transition-colors"
                >
                  System Health API
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Policies */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900">Transparency</h4>
            <ul className="space-y-2 text-slate-500">
              <li>
                <span className="cursor-default" title="Formal terms documentation in progress">
                  Terms of Service (Pending Phase 13)
                </span>
              </li>
              <li>
                <span className="cursor-default" title="Student data privacy architecture details in docs/ARCHITECTURE.md">
                  Student Privacy Charter
                </span>
              </li>
              <li>
                <Link href="/about" className="hover:text-blue-600 transition-colors">
                  Open Source Architecture
                </Link>
              </li>
              <li>
                <a href="mailto:maha14laxmi08@gmail.com" className="hover:text-blue-600 transition-colors">
                  Contact Technical Lead
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>© {new Date().getFullYear()} StudentHub Platform. Distributed under open educational principles.</p>
          <div className="flex items-center space-x-4">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              All Core Services Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
