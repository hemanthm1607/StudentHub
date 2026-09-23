import { NextRequest, NextResponse } from "next/server";
import {
  revokeSessionByRawToken,
  SESSION_COOKIE_NAME,
} from "@/lib/security/session";
import { logAuditEvent } from "@/lib/security/audit-log";

export async function POST(req: NextRequest) {
  try {
    const rawToken = req.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (rawToken) {
      await revokeSessionByRawToken(rawToken);
      logAuditEvent({
        action: "USER_LOGOUT",
        resourceType: "Session",
      });
    }

    const response = NextResponse.json(
      {
        success: true,
        message: "Successfully logged out.",
      },
      { status: 200 }
    );

    // Clear session cookie
    response.cookies.set(SESSION_COOKIE_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(0), // Immediate expiration
    });

    return response;
  } catch (err: unknown) {
    console.error("Logout error:", err);
    // Logout should remain safe even if an internal issue occurs
    const response = NextResponse.json(
      {
        success: true,
        message: "Successfully logged out.",
      },
      { status: 200 }
    );

    response.cookies.set(SESSION_COOKIE_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(0),
    });

    return response;
  }
}
