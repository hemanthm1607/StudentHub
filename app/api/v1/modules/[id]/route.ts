import { NextRequest, NextResponse } from "next/server";
import { getModuleById } from "@/lib/services/course-service";

/**
 * GET /api/v1/modules/[id]
 * Retrieves details and topics for a specific module.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: moduleId } = await params;

  if (!moduleId) {
    return NextResponse.json({ error: "Module identifier is required." }, { status: 400 });
  }

  try {
    const mod = await getModuleById(moduleId);
    if (!mod) {
      return NextResponse.json({ error: "Module not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      module: mod,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to retrieve module.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
