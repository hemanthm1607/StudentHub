import { NextRequest, NextResponse } from "next/server";
import { userRegistrationSchema } from "@/lib/validation/schemas";
import {
  registerUser,
  getSessionCookieOptions,
} from "@/lib/security/session";
import { checkRateLimit } from "@/lib/security/rate-limit";

export async function POST(req: NextRequest) {
  try {
    // 1. Rate limiting by IP address
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
    const rateCheck = checkRateLimit(`register:${ip}`, {
      windowMs: 60 * 1000,
      maxRequests: 5, // Max 5 registration attempts per minute per IP
    });

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "RATE_LIMITED",
            message: "Too many registration attempts. Please try again in a few moments.",
          },
        },
        { status: 429 }
      );
    }

    // 2. Parse & validate request body
    const body = await req.json().catch(() => ({}));
    const parseResult = userRegistrationSchema.safeParse(body);

    if (!parseResult.success) {
      const issue = parseResult.error.issues[0];
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_FAILED",
            message: issue?.message || "Invalid input data provided.",
            field: issue?.path[0],
          },
        },
        { status: 400 }
      );
    }

    const { email, password, displayName } = parseResult.data;
    const userAgent = req.headers.get("user-agent");

    // 3. Register user and generate session
    const { user, rawToken, expiresAt } = await registerUser({
      email,
      password,
      displayName,
      userAgent,
      ipAddress: ip,
    });

    // 4. Create response and attach secure HTTP-only cookie
    const response = NextResponse.json(
      {
        success: true,
        user,
      },
      { status: 201 }
    );

    const cookieOptions = getSessionCookieOptions(expiresAt);
    response.cookies.set(cookieOptions.name, rawToken, cookieOptions);

    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Registration failed.";

    if (message.includes("already exists")) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "EMAIL_ALREADY_EXISTS",
            message: "An account with this email address already exists.",
          },
        },
        { status: 409 }
      );
    }

    console.error("Registration endpoint error:", err);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "An unexpected error occurred during registration. Please try again.",
        },
      },
      { status: 500 }
    );
  }
}
