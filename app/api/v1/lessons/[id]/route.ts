import { NextRequest, NextResponse } from "next/server";
import { getLessonById } from "@/lib/services/course-service";

/**
 * GET /api/v1/lessons/[id]
 * Retrieves educational lesson content.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: lessonId } = await params;

  if (!lessonId) {
    return NextResponse.json({ error: "Lesson identifier is required." }, { status: 400 });
  }

  try {
    const lesson = await getLessonById(lessonId);
    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      lesson,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to retrieve lesson.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
