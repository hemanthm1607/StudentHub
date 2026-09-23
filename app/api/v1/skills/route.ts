import { NextRequest, NextResponse } from "next/server";
import { getDirectorySkills } from "@/lib/services/skill-service";
import { skillQuerySchema } from "@/lib/validation/schemas";

/**
 * GET /api/v1/skills
 * Publicly accessible or authenticated directory of available skills.
 * Supports search and category filtering.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawQuery = {
    search: searchParams.get("search") || undefined,
    category: searchParams.get("category") || undefined,
  };

  const parsed = skillQuerySchema.safeParse(rawQuery);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid query parameters.", details: parsed.error.format() },
      { status: 400 }
    );
  }

  try {
    const result = await getDirectorySkills(parsed.data);
    return NextResponse.json({
      success: true,
      skills: result.skills,
      categories: result.categories,
      count: result.skills.length,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to retrieve skills directory.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
