import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Terminal } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-slate-200/80 bg-white">
      {/* Subtle architectural background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-70 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Academic status pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium mb-8">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          <span>Open Academic Platform • Always $0 for Students</span>
        </div>

        {/* Primary Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.15]">
          Learn. Practice. Improve. Teach.
        </h1>

        {/* Subtitle with core journey */}
        <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-600 max-w-3xl mx-auto font-normal leading-relaxed">
          StudentHub is a free, comprehensive student learning, sandboxed coding, serious assessment, and peer-to-peer Skill Swap platform. Master technical subjects from beginner to advanced without artificial paywalls.
        </p>

        {/* Action CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <Link href="/learn" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Start Learning
            </Button>
          </Link>
          <Link href="/skill-swap" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Explore Skills
            </Button>
          </Link>
        </div>

        {/* Trust & Guarantee Indicators (Real architectural facts, no fake stats) */}
        <div className="mt-12 pt-8 border-t border-slate-100 max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-500">
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>100% Free Core Curriculum</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Isolated Safe Code Execution</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>Peer-to-Peer Skill Swap</span>
          </div>
        </div>

        {/* Code Runner Preview Card */}
        <div className="mt-12 max-w-3xl mx-auto text-left rounded-2xl border border-slate-200 bg-slate-900 text-slate-100 shadow-xl overflow-hidden font-mono text-xs">
          <div className="flex items-center justify-between px-4 py-3 bg-slate-950/80 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="text-[11px] text-slate-400 font-sans ml-2">Solution.java — Sandboxed Execution</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-sans font-medium bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
              <Terminal className="w-3 h-3" />
              <span>Isolated Container Runtime</span>
            </div>
          </div>
          <div className="p-5 space-y-1.5 leading-relaxed overflow-x-auto text-slate-300">
            <p className="text-slate-500">// 1. Jump directly to any topic without mandatory prerequisite locks</p>
            <p><span className="text-purple-400">public class</span> <span className="text-amber-300">BinarySearch</span> &#123;</p>
            <p className="pl-4"><span className="text-purple-400">public static int</span> <span className="text-blue-300">search</span>(<span className="text-purple-400">int</span>[] nums, <span className="text-purple-400">int</span> target) &#123;</p>
            <p className="pl-8 text-slate-400"><span className="text-purple-400">int</span> left = <span className="text-emerald-300">0</span>, right = nums.length - <span className="text-emerald-300">1</span>;</p>
            <p className="pl-8 text-slate-400"><span className="text-purple-400">while</span> (left &lt;= right) &#123;</p>
            <p className="pl-12 text-slate-400"><span className="text-purple-400">int</span> mid = left + (right - left) / <span className="text-emerald-300">2</span>;</p>
            <p className="pl-12 text-slate-400"><span className="text-purple-400">if</span> (nums[mid] == target) <span className="text-purple-400">return</span> mid;</p>
            <p className="pl-12 text-slate-400"><span className="text-purple-400">if</span> (nums[mid] &lt; target) left = mid + <span className="text-emerald-300">1</span>; <span className="text-purple-400">else</span> right = mid - <span className="text-emerald-300">1</span>;</p>
            <p className="pl-8 text-slate-400">&#125;</p>
            <p className="pl-8 text-slate-400"><span className="text-purple-400">return</span> -<span className="text-emerald-300">1</span>;</p>
            <p className="pl-4">&#125;</p>
            <p>&#125;</p>
          </div>
          <div className="px-5 py-3 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              All 14 Test Cases Passed (4 visible, 10 hidden)
            </span>
            <span>Runtime: 18ms • Memory: 38.4MB</span>
          </div>
        </div>
      </div>
    </section>
  );
}
