import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/security/auth-helpers";
import { getUserProfile, updateUserProfile } from "@/lib/services/profile-service";
import { profileUpdateSchema } from "@/lib/validation/schemas";
import { checkRateLimit } from "@/lib/security/rate-limit";

/**
 * GET /api/v1/profile
 * Authoritative endpoint for current authenticated user's profile.
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
    const data = await getUserProfile(user.id);
    if (!data) {
      return NextResponse.json(
        { error: "Profile not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      profile: data.profile,
      user: {
        id: data.userId,
        email: data.email,
        role: data.role,
        createdAt: data.createdAt,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to retrieve profile.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * PATCH /api/v1/profile
 * Updates the current authenticated user's profile.
 * Never trusts client-controlled userId; strictly derives identity from session.
 */
export async function PATCH(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 }
    );
  }

  // Rate limiting: 30 updates per minute
  const rateLimit = checkRateLimit(`profile-patch:${user.id}`, {
    windowMs: 60 * 1000,
    maxRequests: 30,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many profile updates. Please wait before trying again." },
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

    // Strip client-provided userId or role to prevent unauthorized escalation or ownership tampering
    if (rawBody.userId && rawBody.userId !== user.id) {
      return NextResponse.json(
        { error: "Unauthorized: You cannot modify another user's profile." },
        { status: 403 }
      );
    }

    const validationResult = profileUpdateSchema.safeParse(rawBody);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed.",
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const updatedProfile = await updateUserProfile(user.id, validationResult.data);

    return NextResponse.json({
      success: true,
      profile: updatedProfile,
      message: "Profile updated successfully.",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update profile.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
