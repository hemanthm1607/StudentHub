import * as React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ArrowRight, BookOpen } from "lucide-react";
import type { CourseSummary } from "@/lib/services/course-service";

interface CourseCardProps {
  course: CourseSummary;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Card variant="default" className="flex flex-col justify-between hover:border-slate-300 transition-colors">
      <div>
        <CardHeader className="pb-3">
          {/* Zero-Pill Unboxed Metadata with Typographic Separators */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2 font-medium">
            <span className="text-blue-600 font-semibold">{course.category}</span>
            <span aria-hidden="true">·</span>
            <span>{course.difficulty}</span>
            <span aria-hidden="true">·</span>
            <span>{course.estimatedHours}h estimated</span>
          </div>
          <CardTitle className="text-lg leading-snug">
            <Link href={`/learn/${course.slug}`} className="hover:text-blue-600 transition-colors">
              {course.title}
            </Link>
          </CardTitle>
          <CardDescription className="mt-1.5 line-clamp-2">
            {course.shortDescription || course.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="flex items-center gap-3 text-xs text-slate-500 py-3 border-y border-slate-100">
            <div>
              <span className="font-semibold text-slate-900">{course.moduleCount}</span>{" "}
              <span>{course.moduleCount === 1 ? "Module" : "Modules"}</span>
            </div>
            <span aria-hidden="true">·</span>
            <div>
              <span className="font-semibold text-slate-900">{course.topicCount}</span>{" "}
              <span>{course.topicCount === 1 ? "Topic" : "Topics"}</span>
            </div>
          </div>
        </CardContent>
      </div>

      <div className="p-5 pt-0 flex items-center justify-between mt-auto">
        <span className="text-xs text-slate-400 font-medium">Free Access</span>
        <Link href={`/learn/${course.slug}`}>
          <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
            View Syllabus
          </Button>
        </Link>
      </div>
    </Card>
  );
}
