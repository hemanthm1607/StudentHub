import { NextRequest, NextResponse } from "next/server";
import { userLoginSchema } from "@/lib/validation/schemas";
import {
  authenticateWithPassword,
  getSessionCookieOptions,
} from "@/lib/security/session";
import { checkRateLimit } from "@/lib/security/rate-limit";

export async function POST(req: NextRequest) {
  try {
    // 1. Rate limiting by IP
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
    const rateCheck = checkRateLimit(`login:${ip}`, {
      windowMs: 60 * 1000,
      maxRequests: 10, // Max 10 login attempts per minute per IP
    });

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "RATE_LIMITED",
            message: "Too many login attempts. Please wait a moment before trying again.",
          },
        },
        { status: 429 }
      );
    }

    // 2. Parse & validate request payload
    const body = await req.json().catch(() => ({}));
    const parseResult = userLoginSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_FAILED",
            message: "Please enter a valid email and password.",
          },
        },
        { status: 400 }
      );
    }

    const { email, password } = parseResult.data;
    const userAgent = req.headers.get("user-agent");

    // 3. Authenticate against password hash and issue session
    const { user, rawToken, expiresAt } = await authenticateWithPassword({
      email,
      password,
      userAgent,
      ipAddress: ip,
    });

    // 4. Return safe user info & attach HTTP-only cookie
    const response = NextResponse.json(
      {
        success: true,
        user,
      },
      { status: 200 }
    );

    const cookieOptions = getSessionCookieOptions(expiresAt);
    response.cookies.set(cookieOptions.name, rawToken, cookieOptions);

    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Authentication failed.";

    // Maintain consistent generic error message for invalid credentials to avoid enumeration
    if (message.includes("suspended")) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "ACCOUNT_SUSPENDED",
            message: "This account is currently suspended. Please contact support.",
          },
        },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "AUTHENTICATION_FAILED",
          message: "Invalid email or password.",
        },
      },
      { status: 401 }
    );
  }
}
