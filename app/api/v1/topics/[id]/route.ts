import { NextRequest, NextResponse } from "next/server";
import { getTopicByIdOrSlug } from "@/lib/services/course-service";

/**
 * GET /api/v1/topics/[id]
 * Retrieves topic metadata and structured outline.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: topicIdOrSlug } = await params;

  if (!topicIdOrSlug) {
    return NextResponse.json({ error: "Topic identifier is required." }, { status: 400 });
  }

  try {
    const topic = await getTopicByIdOrSlug(topicIdOrSlug);
    if (!topic) {
      return NextResponse.json({ error: "Topic not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      topic,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to retrieve topic.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
