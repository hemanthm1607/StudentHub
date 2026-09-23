import { NextRequest, NextResponse } from "next/server";
import {
  validateSessionToken,
  SESSION_COOKIE_NAME,
} from "@/lib/security/session";

export async function GET(req: NextRequest) {
  try {
    const rawToken = req.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (!rawToken) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "UNAUTHENTICATED",
            message: "Authentication required.",
          },
        },
        { status: 401 }
      );
    }

    const sessionResult = await validateSessionToken(rawToken);

    if (!sessionResult.authenticated || !sessionResult.user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_SESSION",
            message: sessionResult.error || "Session is invalid or expired.",
          },
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        user: sessionResult.user,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error("Auth me check error:", err);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Unable to retrieve session profile.",
        },
      },
      { status: 500 }
    );
  }
}
