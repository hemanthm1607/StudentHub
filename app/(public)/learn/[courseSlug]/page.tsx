import * as React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getPublishedCourseBySlug } from "@/lib/services/course-service";
import { ChevronRight, Clock, BookOpen, Layers, ArrowRight, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

interface CourseDetailPageProps {
  params: Promise<{
    courseSlug: string;
  }>;
}

export async function generateMetadata({ params }: CourseDetailPageProps) {
  const { courseSlug } = await params;
  const course = await getPublishedCourseBySlug(courseSlug);
  if (!course) {
    return {
      title: "Course Not Found — StudentHub",
    };
  }

  return {
    title: `${course.title} — StudentHub`,
    description: course.shortDescription || course.description,
  };
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { courseSlug } = await params;
  const course = await getPublishedCourseBySlug(courseSlug);

  if (!course) {
    notFound();
  }

  // Find first topic for sequential learning CTA
  const firstTopic = course.modules[0]?.topics[0];

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <Container size="lg">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 mb-6 font-medium">
          <Link href="/" className="hover:text-slate-900 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <Link href="/learn" className="hover:text-slate-900 transition-colors">
            Courses
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-800 truncate">{course.title}</span>
        </nav>

        {/* Hero Course Header */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 mb-8 shadow-xs">
          {/* Zero-Pill Unboxed Metadata with Typographic Separators */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 mb-3 font-medium">
            <span className="text-blue-600 font-semibold">{course.category}</span>
            <span aria-hidden="true">·</span>
            <span>{course.difficulty}</span>
            <span aria-hidden="true">·</span>
            <span>{course.estimatedHours}h Total</span>
            <span aria-hidden="true">·</span>
            <span>{course.moduleCount} {course.moduleCount === 1 ? "Module" : "Modules"}</span>
            <span aria-hidden="true">·</span>
            <span>{course.topicCount} {course.topicCount === 1 ? "Topic" : "Topics"}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
            {course.title}
          </h1>

          <p className="text-sm text-slate-600 leading-relaxed max-w-3xl mb-6">
            {course.description}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {firstTopic ? (
              <Link href={`/learn/${course.slug}/${firstTopic.slug}`}>
                <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Start Course (Mode A: Sequential)
                </Button>
              </Link>
            ) : null}
            <Link href="#curriculum">
              <Button variant="secondary" size="md">
                Browse Curriculum (Mode B: Direct Access)
              </Button>
            </Link>
          </div>
        </div>

        {/* Structured Curriculum Section */}
        <div id="curriculum" className="space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Curriculum Structure
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Click any topic below to access its lesson directly without prerequisites.
              </p>
            </div>
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">
              {course.topicCount} Lessons Available
            </span>
          </div>

          <div className="space-y-6">
            {course.modules.map((module, modIdx) => (
              <div key={module.id} className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
                {/* Module Header */}
                <div className="p-4 sm:p-5 bg-slate-50/80 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                      {modIdx + 1}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        {module.title}
                      </h3>
                      {module.description && (
                        <p className="text-xs text-slate-500 mt-0.5">{module.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium pl-8 sm:pl-0">
                    <span>{module.level}</span>
                    <span aria-hidden="true">·</span>
                    <span>{module.topics.length} {module.topics.length === 1 ? "topic" : "topics"}</span>
                  </div>
                </div>

                {/* Topics in Module */}
                <div className="divide-y divide-slate-100">
                  {module.topics.map((topic, topIdx) => (
                    <div
                      key={topic.id}
                      className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
                    >
                      <div className="space-y-1 max-w-2xl">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-slate-400">
                            {modIdx + 1}.{topIdx + 1}
                          </span>
                          <Link
                            href={`/learn/${course.slug}/${topic.slug}`}
                            className="text-sm font-semibold text-slate-900 hover:text-blue-600 transition-colors"
                          >
                            {topic.title}
                          </Link>
                        </div>
                        {topic.description && (
                          <p className="text-xs text-slate-500 line-clamp-1 pl-6">
                            {topic.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {topic.estimatedMinutes}m
                        </span>
                        <Link href={`/learn/${course.slug}/${topic.slug}`}>
                          <Button variant="secondary" size="sm">
                            Open Lesson
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
