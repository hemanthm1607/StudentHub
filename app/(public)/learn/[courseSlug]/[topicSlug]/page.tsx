import * as React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { SafeMarkdown } from "@/components/learning/SafeMarkdown";
import { getTopicBySlugs, getPublishedCourseBySlug } from "@/lib/services/course-service";
import {
  ChevronRight,
  ChevronLeft,
  Clock,
  BookOpen,
  AlertTriangle,
  Lightbulb,
  Code2,
  Layers,
  ArrowLeft,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface LessonPageProps {
  params: Promise<{
    courseSlug: string;
    topicSlug: string;
  }>;
}

export async function generateMetadata({ params }: LessonPageProps) {
  const { courseSlug, topicSlug } = await params;
  const topicData = await getTopicBySlugs(courseSlug, topicSlug);
  if (!topicData) {
    return { title: "Lesson Not Found — StudentHub" };
  }

  return {
    title: `${topicData.title} — ${topicData.module.course.title} | StudentHub`,
    description: topicData.lesson?.summary || topicData.description || undefined,
  };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { courseSlug, topicSlug } = await params;
  const topicData = await getTopicBySlugs(courseSlug, topicSlug);

  if (!topicData) {
    notFound();
  }

  // Load the complete course to populate the curriculum sidebar
  const course = await getPublishedCourseBySlug(courseSlug);
  const lesson = topicData.lesson;

  return (
    <div className="py-8 bg-slate-50 min-h-screen">
      <Container size="lg">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 mb-6 font-medium">
          <Link href="/" className="hover:text-slate-900 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <Link href="/learn" className="hover:text-slate-900 transition-colors">
            Courses
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <Link href={`/learn/${courseSlug}`} className="hover:text-slate-900 transition-colors">
            {topicData.module.course.title}
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-800 truncate">{topicData.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Lesson Content Area */}
          <main className="lg:col-span-3 space-y-6">
            <article className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-xs">
              {/* Context Header */}
              <div className="pb-6 mb-6 border-b border-slate-100">
                {/* Zero-Pill Unboxed Metadata with Typographic Separators */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 mb-2 font-medium">
                  <span className="text-blue-600 font-semibold">{topicData.module.title}</span>
                  <span aria-hidden="true">·</span>
                  <span>{topicData.module.course.difficulty}</span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {topicData.estimatedMinutes}m read & practice
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {topicData.title}
                </h1>

                {topicData.description && (
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                    {topicData.description}
                  </p>
                )}
              </div>

              {/* Lesson Summary Callout */}
              {lesson?.summary && (
                <div className="mb-6 p-4 bg-blue-50/70 border border-blue-100 rounded-lg">
                  <div className="flex items-start gap-2.5">
                    <Lightbulb className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-blue-900 uppercase tracking-wide block mb-1">
                        Topic Core Takeaway
                      </span>
                      <p className="text-xs text-blue-950 leading-relaxed font-normal">
                        {lesson.summary}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Lesson Markdown Body */}
              {lesson?.markdownBody ? (
                <div className="prose-slate max-w-none">
                  <SafeMarkdown content={lesson.markdownBody} />
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400 text-sm">
                  Lesson content is being finalized for this topic.
                </div>
              )}

              {/* Syntax Guide Section */}
              {lesson?.syntaxGuide && (
                <div className="mt-8 pt-6 border-t border-slate-100">
                  <div className="flex items-center gap-2 mb-3">
                    <Code2 className="w-4 h-4 text-slate-700" />
                    <h3 className="text-sm font-bold text-slate-900">
                      Quick Syntax Reference
                    </h3>
                  </div>
                  <pre className="p-4 bg-slate-900 text-slate-100 rounded-lg text-xs font-mono overflow-x-auto">
                    <code>{lesson.syntaxGuide}</code>
                  </pre>
                </div>
              )}

              {/* Common Mistakes & Important Points */}
              {lesson?.commonMistakes && (
                <div className="mt-6 p-4 bg-amber-50/80 border border-amber-200 rounded-lg">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-amber-900 uppercase tracking-wide block">
                        Common Mistakes to Avoid
                      </span>
                      <p className="text-xs text-amber-950 leading-relaxed">
                        {lesson.commonMistakes}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Practical Use Cases */}
              {lesson?.practicalUseCases && (
                <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wide block">
                      Practical Industry Application
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {lesson.practicalUseCases}
                    </p>
                  </div>
                </div>
              )}
            </article>

            {/* Bottom Navigation: Prev / Syllabus / Next */}
            <nav
              aria-label="Topic Navigation"
              className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2"
            >
              {topicData.navigation.prevTopic ? (
                <Link
                  href={`/learn/${courseSlug}/${topicData.navigation.prevTopic.slug}`}
                  className="flex-1"
                >
                  <Button variant="secondary" size="md" className="w-full justify-start text-left">
                    <ChevronLeft className="w-4 h-4 mr-1 shrink-0" />
                    <div className="truncate">
                      <span className="text-[10px] text-slate-400 block font-normal">Previous Topic</span>
                      <span className="text-xs font-semibold">{topicData.navigation.prevTopic.title}</span>
                    </div>
                  </Button>
                </Link>
              ) : (
                <div className="flex-1" />
              )}

              <Link href={`/learn/${courseSlug}`} className="self-center">
                <Button variant="outline" size="sm">
                  Course Syllabus
                </Button>
              </Link>

              {topicData.navigation.nextTopic ? (
                <Link
                  href={`/learn/${courseSlug}/${topicData.navigation.nextTopic.slug}`}
                  className="flex-1"
                >
                  <Button variant="primary" size="md" className="w-full justify-end text-right">
                    <div className="truncate">
                      <span className="text-[10px] text-blue-100 block font-normal">Next Topic</span>
                      <span className="text-xs font-semibold">{topicData.navigation.nextTopic.title}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 ml-1 shrink-0" />
                  </Button>
                </Link>
              ) : (
                <div className="flex-1 text-right">
                  <Link href={`/learn/${courseSlug}`}>
                    <Button variant="primary" size="md">
                      Course Completed! Back to Syllabus
                    </Button>
                  </Link>
                </div>
              )}
            </nav>
          </main>

          {/* Curriculum Sidebar (Course Outline / Direct Topic Jumping) */}
          <aside className="lg:col-span-1 space-y-4">
            <div className="bg-white border border-slate-200 rounded-lg p-4 sticky top-20 shadow-xs">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Curriculum Outline
                </h2>
                <Link
                  href={`/learn/${courseSlug}`}
                  className="text-[11px] text-blue-600 hover:underline font-medium"
                >
                  Overview
                </Link>
              </div>

              <div className="space-y-4 max-h-[calc(100vh-12rem)] overflow-y-auto pr-1">
                {course?.modules.map((mod, mIdx) => (
                  <div key={mod.id} className="space-y-1.5">
                    <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                      Module {mIdx + 1}
                    </div>
                    <div className="space-y-1">
                      {mod.topics.map((t) => {
                        const isCurrent = t.slug === topicSlug;
                        return (
                          <Link
                            key={t.id}
                            href={`/learn/${courseSlug}/${t.slug}`}
                            className={`block px-2.5 py-1.5 rounded text-xs transition-colors ${
                              isCurrent
                                ? "bg-blue-50 text-blue-700 font-semibold border border-blue-200"
                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                            }`}
                          >
                            <span className="line-clamp-1">{t.title}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </div>
  );
}
