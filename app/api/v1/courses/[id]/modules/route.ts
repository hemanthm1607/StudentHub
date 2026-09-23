import { NextRequest, NextResponse } from "next/server";
import { getPublishedCourseBySlug } from "@/lib/services/course-service";

/**
 * GET /api/v1/courses/[id]/modules
 * Retrieves the ordered modules and topic outlines for a course.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: courseIdOrSlug } = await params;

  if (!courseIdOrSlug) {
    return NextResponse.json({ error: "Course identifier is required." }, { status: 400 });
  }

  try {
    const course = await getPublishedCourseBySlug(courseIdOrSlug);
    if (!course) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      courseId: course.id,
      courseSlug: course.slug,
      modules: course.modules,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to retrieve modules.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
