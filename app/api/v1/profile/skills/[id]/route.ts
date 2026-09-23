import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/security/auth-helpers";
import {
  updateStudentSkill,
  deleteStudentSkill,
} from "@/lib/services/skill-service";
import { studentSkillUpdateSchema } from "@/lib/validation/schemas";
import { checkRateLimit } from "@/lib/security/rate-limit";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * PATCH /api/v1/profile/skills/[id]
 * Updates proficiency level of a student's skill.
 * Enforces ownership: only owner can update.
 */
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 }
    );
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json(
      { error: "Skill relationship ID is required." },
      { status: 400 }
    );
  }

  const rateLimit = checkRateLimit(`skill-patch:${user.id}`, {
    windowMs: 60 * 1000,
    maxRequests: 60,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many updates. Please wait before retrying." },
      { status: 429 }
    );
  }

  try {
    const rawBody = await req.json();
    const validationResult = studentSkillUpdateSchema.safeParse(rawBody);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed.",
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const updated = await updateStudentSkill(user.id, id, validationResult.data);

    return NextResponse.json({
      success: true,
      studentSkill: updated,
      message: "Proficiency level updated successfully.",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update skill.";
    if (message.includes("not found")) {
      return NextResponse.json({ error: message }, { status: 404 });
    }
    if (message.includes("Forbidden") || message.includes("permission")) {
      return NextResponse.json({ error: message }, { status: 403 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * DELETE /api/v1/profile/skills/[id]
 * Removes a student skill from TEACH or LEARN list.
 * Enforces ownership: only owner can delete.
 */
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 }
    );
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json(
      { error: "Skill relationship ID is required." },
      { status: 400 }
    );
  }

  try {
    const result = await deleteStudentSkill(user.id, id);

    return NextResponse.json({
      success: true,
      id: result.id,
      message: "Skill removed successfully.",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to remove skill.";
    if (message.includes("not found")) {
      return NextResponse.json({ error: message }, { status: 404 });
    }
    if (message.includes("Forbidden") || message.includes("permission")) {
      return NextResponse.json({ error: message }, { status: 403 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
