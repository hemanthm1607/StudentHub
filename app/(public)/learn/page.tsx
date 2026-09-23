import * as React from "react";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { listPublishedCourses } from "@/lib/services/course-service";
import { CourseCatalog } from "@/components/learning/CourseCatalog";
import { BookOpen, Compass } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Curriculum Catalog — StudentHub",
  description: "Explore free structured courses from Beginner to Advanced with direct-access topic navigation.",
};

export default async function LearnPage() {
  const { courses } = await listPublishedCourses({ limit: 50 });

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <Container size="lg">
        <PageHeader
          title="Curriculum Catalog"
          description="High-depth technical courses structured into modular topics. Direct topic access is supported — jump directly to any topic without artificial gating."
        />

        {/* Informational Guidance on Learning Modes */}
        <div className="mb-8 p-4 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 flex items-start gap-3">
          <Compass className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold text-slate-800">Two Flexible Learning Modes</span>
            <p className="leading-relaxed">
              <strong>Complete Course:</strong> Progress sequentially from Course → Module → Topic → Lesson.
              <br />
              <strong>Direct Topic Access:</strong> Jump directly into any specific concept (e.g. <em>Variables</em> or <em>Encapsulation</em>) anytime for targeted reference.
            </p>
          </div>
        </div>

        <CourseCatalog initialCourses={courses} />
      </Container>
    </div>
  );
}
