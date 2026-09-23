import * as React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  BookOpen,
  Code2,
  CheckCircle,
  TrendingUp,
  Users,
  Repeat,
  Shield,
  Layers,
  Sparkles,
  ArrowRight,
  Clock,
  Terminal,
  BrainCircuit,
} from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      num: "01",
      title: "LEARN",
      desc: "Deep conceptual explanations, syntax guides, common pitfalls, and real-world use cases.",
      icon: BookOpen,
      badge: "Beginner to Advanced",
    },
    {
      num: "02",
      title: "PRACTICE",
      desc: "Instant code workouts in a Monaco editor evaluated securely against visible and hidden unit tests.",
      icon: Code2,
      badge: "Sandboxed Runner",
    },
    {
      num: "03",
      title: "TEST",
      desc: "Topical quizzes and timed summative assessments with randomized question variants.",
      icon: CheckCircle,
      badge: "Integrity Enforced",
    },
    {
      num: "04",
      title: "IMPROVE",
      desc: "Deterministic detection flags weak topics automatically and prescribes targeted review exercises.",
      icon: TrendingUp,
      badge: "Rule-Based Diagnostics",
    },
    {
      num: "05",
      title: "TEACH",
      desc: "Reinforce your mastery by mentoring peers in topics you've already verified and mastered.",
      icon: Users,
      badge: "Verified Skill Badges",
    },
    {
      num: "06",
      title: "LEARN FROM OTHERS",
      desc: "Match with compatible Skill Swap partners. Exchange knowledge 1-on-1 at zero monetary cost.",
      icon: Repeat,
      badge: "Skill Swap Engine",
    },
  ];

  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge variant="info" className="mb-2">
            The Continuous Mastery Loop
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            How StudentHub Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            A cohesive cycle engineered to transition students from foundational theory to real-world engineering mastery and peer collaboration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <Card key={s.num} variant="default" className="relative group hover:border-blue-300">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-300 group-hover:text-blue-600 transition-colors">
                      {s.num}
                    </span>
                  </div>
                  <CardTitle className="flex items-center gap-2">
                    <span>{s.title}</span>
                  </CardTitle>
                  <div className="pt-1">
                    <Badge variant="outline" size="sm">
                      {s.badge}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function CurriculumShowcaseSection() {
  const sampleCourses = [
    {
      title: "Java Core & Object-Oriented Architecture",
      slug: "java-core",
      level: "Beginner to Advanced",
      hours: "48 Hours",
      topics: 36,
      desc: "Classes, encapsulation, inheritance, polymorphism, abstract interfaces, collections framework, multithreading, and memory model.",
      sampleTopic: "Classes, Objects & Constructors",
    },
    {
      title: "Python Systems & Data Structures",
      slug: "python-systems",
      level: "Beginner to Advanced",
      hours: "42 Hours",
      topics: 32,
      desc: "Idiomatic Python, memory management, generator iterators, decorators, dunder methods, sorting algorithms, and complexity analysis.",
      sampleTopic: "Generators & Memory Efficiency",
    },
  ];

  return (
    <section className="py-20 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="max-w-2xl">
            <Badge variant="info" className="mb-2">
              Comprehensive Curriculum
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Structured Learning Without Artificial Locks
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
              Every course contains granular modules, topics, code walkthroughs, and common mistakes. Need to review a specific concept for an interview tomorrow? Jump directly to that topic without completing 30 earlier lessons.
            </p>
          </div>
          <Link href="/learn">
            <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              View All Courses
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {sampleCourses.map((c) => (
            <Card key={c.slug} variant="default" className="border-slate-200 flex flex-col justify-between">
              <div>
                <CardHeader>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span className="font-semibold text-blue-600">{c.level}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {c.hours} • {c.topics} Topics
                    </span>
                  </div>
                  <CardTitle className="text-lg">{c.title}</CardTitle>
                  <CardDescription className="pt-1">{c.desc}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 pt-2">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                    <span className="font-semibold text-slate-700 block mb-1">
                      Direct-Access Sample Lesson:
                    </span>
                    <div className="flex items-center justify-between text-slate-600">
                      <span>• {c.sampleTopic}</span>
                      <span className="text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Open Access
                      </span>
                    </div>
                  </div>
                </CardContent>
              </div>
              <div className="p-5 pt-0">
                <Link href={`/learn`}>
                  <Button variant="secondary" size="sm" className="w-full">
                    Explore Course Syllabus
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PracticeAndAssessmentSection() {
  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Practice Pillar */}
          <div className="space-y-4">
            <Badge variant="success">Coding Workout Environment</Badge>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Real Practice in an Isolated Sandbox
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We never run student code on the host web application server. Practice workouts execute in an air-gapped container sandbox with strict CPU, memory, and process limits.
            </p>
            <ul className="space-y-2.5 text-xs text-slate-700 pt-2">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <span>
                  <strong>Monaco Code Editor:</strong> Professional syntax highlighting, indentation, and keyboard navigation identical to industry tools.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <span>
                  <strong>Visible & Hidden Test Cases:</strong> Test your edge cases with confidence before authoritative submission.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <span>
                  <strong>Zero Lost Work:</strong> Local draft autosaving ensures accidental refresh or offline blips never erase your code.
                </span>
              </li>
            </ul>
          </div>

          {/* Assessment Pillar */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Serious Assessments & Integrity</h3>
              </div>
              <Badge variant="outline">Server-Timed</Badge>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Assessments evaluate true concept retention. During formal tests, answers and hints are sealed, questions and choices are randomized, and time windows are strictly verified server-side.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-semibold text-slate-900 block mb-0.5">MCQ & Output Prediction</span>
                <span className="text-slate-500 text-[11px]">Tests mental code execution and debugging intuition.</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-semibold text-slate-900 block mb-0.5">Automated Weak Topic Flags</span>
                <span className="text-slate-500 text-[11px]">Deterministic rule engine spots concept gaps instantly.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SkillSwapSection() {
  return (
    <section className="py-20 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge variant="info" className="mb-2">
            Peer-to-Peer Learning Network
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            &ldquo;I Teach What I Know, and Learn What I Don&apos;t.&rdquo;
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
            Mastered Java OOP but want to learn Python data science? Skill Swap connects you with a fellow student whose teaching strengths match your learning goals, operating deterministically with 100% free peer scheduling.
          </p>
        </div>

        {/* Interactive Match Visualization */}
        <div className="max-w-4xl mx-auto p-6 bg-slate-50 rounded-2xl border border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Student A */}
            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm text-left space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                  A
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Student A</h4>
                  <p className="text-[10px] text-slate-500">CS Sophomore • UTC-5</p>
                </div>
              </div>
              <div className="pt-2 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Teaches:</span>
                  <Badge variant="success">Java (Advanced)</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Wants:</span>
                  <Badge variant="info">Python (Beginner)</Badge>
                </div>
              </div>
            </div>

            {/* Matching Engine Indicator */}
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 rounded-full bg-blue-600 text-white shadow-sm">
                <Repeat className="w-5 h-5 animate-pulse" />
              </div>
              <div className="text-xs font-bold text-slate-900">Deterministic Match</div>
              <p className="text-[11px] text-slate-500">
                100% Reciprocal Skill Compatibility + Shared Language
              </p>
            </div>

            {/* Student B */}
            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm text-left space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-xs">
                  B
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Student B</h4>
                  <p className="text-[10px] text-slate-500">Data Science Junior • UTC-5</p>
                </div>
              </div>
              <div className="pt-2 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Teaches:</span>
                  <Badge variant="success">Python (Advanced)</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Wants:</span>
                  <Badge variant="info">Java (Beginner)</Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-3">
            <span>Features integrated chat, study session scheduler, and mutual feedback logs.</span>
            <Link href="/skill-swap">
              <Button size="sm" variant="primary">
                Explore Skill Swap
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function WhyStudentHubSection() {
  const points = [
    {
      title: "Zero Monetary Cost Commitment",
      desc: "Engineered from the ground up on open-source foundations with zero bloated recurring SaaS fees. The core platform is guaranteed free for students.",
      icon: Shield,
    },
    {
      title: "No Artificial Gatekeeping",
      desc: "Jump straight into advanced concurrency, dynamic programming, or system design whenever you need it. We recommend prerequisites, but never lock content.",
      icon: Layers,
    },
    {
      title: "Honest Academic Craftsmanship",
      desc: "No fake user metrics, no fake 5-star reviews, and no pseudo-scientific proctoring claims. Clean, transparent engineering designed for real learning.",
      icon: BrainCircuit,
    },
    {
      title: "Decoupled Android-Ready Architecture",
      desc: "Built on clean, normalized REST API endpoints ready to power a future native Android application using the exact same backend engine.",
      icon: Terminal,
    },
  ];

  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge variant="info" className="mb-2">
            Architectural Integrity
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Why We Built StudentHub
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Modern students face paywalled platforms, fake course certificates, and bloated interfaces. StudentHub is the antidote.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {points.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div key={idx} className="p-6 bg-white rounded-xl border border-slate-200 flex gap-4 text-left">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900">{p.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{p.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function CtaSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 text-white text-center space-y-6 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.2),transparent_50%)] pointer-events-none" />
          <Badge variant="info" className="bg-blue-900/60 text-blue-200 border-blue-700/60">
            100% Free For All Students
          </Badge>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight max-w-2xl mx-auto">
            Ready to Accelerate Your Technical Journey?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Start learning programming with deep explanations, practice in an isolated sandbox, test your knowledge without paywalls, and exchange skills with fellow students.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/learn" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-500">
                Start Learning Now
              </Button>
            </Link>
            <Link href="/about" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700">
                Read Architectural Blueprint
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
