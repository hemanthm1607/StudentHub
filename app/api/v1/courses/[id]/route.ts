import { NextRequest, NextResponse } from "next/server";
import { getPublishedCourseBySlug } from "@/lib/services/course-service";

/**
 * GET /api/v1/courses/[id]
 * Retrieves details and full curriculum structure for a published course.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: courseIdOrSlug } = await params;

  if (!courseIdOrSlug || typeof courseIdOrSlug !== "string") {
    return NextResponse.json({ error: "Course identifier is required." }, { status: 400 });
  }

  try {
    const course = await getPublishedCourseBySlug(courseIdOrSlug);
    if (!course) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      course,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to retrieve course.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT() {
  return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
}
