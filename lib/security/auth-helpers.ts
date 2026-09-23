import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  validateSessionToken,
  SESSION_COOKIE_NAME,
  type SafeUser,
} from "./session";
import type { Role } from "@prisma/client";

/**
 * Server-side helper to retrieve the currently authenticated user from incoming HTTP cookies.
 * Does NOT redirect. Returns null if unauthenticated.
 */
export async function getCurrentUser(): Promise<SafeUser | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  const result = await validateSessionToken(sessionCookie.value);
  if (!result.authenticated || !result.user) {
    return null;
  }

  return result.user;
}

/**
 * Server-side helper that enforces authentication.
 * If unauthenticated, immediately redirects to /login.
 * Returns the verified SafeUser.
 */
export async function requireAuth(): Promise<SafeUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

/**
 * Server-side helper that enforces specific role authorization.
 * If unauthenticated, redirects to /login.
 * If authenticated but without authorized role, throws an error or redirects.
 */
export async function requireRole(allowedRoles: Role[]): Promise<SafeUser> {
  const user = await requireAuth();

  if (!allowedRoles.includes(user.role)) {
    redirect("/dashboard");
  }

  return user;
}
