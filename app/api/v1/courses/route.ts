import { NextRequest, NextResponse } from "next/server";
import { listPublishedCourses } from "@/lib/services/course-service";
import { courseQuerySchema } from "@/lib/validation/schemas";

/**
 * GET /api/v1/courses
 * Publicly accessible list of published courses.
 * Draft and archived courses are strictly excluded.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawQuery = {
    page: searchParams.get("page") || undefined,
    limit: searchParams.get("limit") || undefined,
    category: searchParams.get("category") || undefined,
    level: searchParams.get("level") || undefined,
  };

  const parsed = courseQuerySchema.safeParse(rawQuery);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid query parameters.", details: parsed.error.format() },
      { status: 400 }
    );
  }

  try {
    const result = await listPublishedCourses(parsed.data);
    return NextResponse.json({
      success: true,
      courses: result.courses,
      pagination: result.pagination,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to retrieve courses.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * Disallow unauthorized modifications to learning content.
 */
export async function POST() {
  return NextResponse.json(
    { error: "Method not allowed. StudentHub learning content is server-authoritative." },
    { status: 405 }
  );
}
