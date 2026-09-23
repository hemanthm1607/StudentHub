import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/security/auth-helpers";
import {
  getStudentSkills,
  addStudentSkill,
} from "@/lib/services/skill-service";
import { studentSkillCreateSchema } from "@/lib/validation/schemas";
import { checkRateLimit } from "@/lib/security/rate-limit";

/**
 * GET /api/v1/profile/skills
 * Retrieves current authenticated student's skills (TEACH & LEARN).
 */
export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 }
    );
  }

  try {
    const skillsData = await getStudentSkills(user.id);
    return NextResponse.json({
      success: true,
      teachSkills: skillsData.teachSkills,
      learnSkills: skillsData.learnSkills,
      allSkills: skillsData.allSkills,
      counts: {
        teach: skillsData.teachSkills.length,
        learn: skillsData.learnSkills.length,
        total: skillsData.allSkills.length,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to retrieve student skills.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * POST /api/v1/profile/skills
 * Adds a skill to the student's TEACH or LEARN list.
 * Prevents duplicate combinations and verifies skill existence.
 */
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 }
    );
  }

  // Rate limit: 40 additions per minute
  const rateLimit = checkRateLimit(`skill-add:${user.id}`, {
    windowMs: 60 * 1000,
    maxRequests: 40,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many skill modifications. Please wait before adding more." },
      {
        status: 429,
        headers: {
          "Retry-After": Math.ceil(rateLimit.resetMs / 1000).toString(),
        },
      }
    );
  }

  try {
    const rawBody = await req.json();

    // Check for attempted client-side userId override
    if (rawBody.userId && rawBody.userId !== user.id) {
      return NextResponse.json(
        { error: "Unauthorized: You cannot assign skills to another user." },
        { status: 403 }
      );
    }

    const validationResult = studentSkillCreateSchema.safeParse(rawBody);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed.",
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const created = await addStudentSkill(user.id, validationResult.data);

    return NextResponse.json(
      {
        success: true,
        studentSkill: created,
        message: `Skill added to your ${validationResult.data.type.toLowerCase()} list.`,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to add skill.";
    if (message.includes("already added")) {
      return NextResponse.json({ error: message }, { status: 409 });
    }
    if (message.includes("does not exist")) {
      return NextResponse.json({ error: message }, { status: 404 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
