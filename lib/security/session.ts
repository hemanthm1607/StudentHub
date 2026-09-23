import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/client";
import { env } from "@/lib/config/env";
import { logAuditEvent } from "@/lib/security/audit-log";
import type { Role } from "@prisma/client";

export const SESSION_COOKIE_NAME = "studenthub_session";
export const SESSION_DURATION_DAYS = 14;
export const SESSION_DURATION_MS = SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000;

export interface SafeUser {
  id: string;
  email: string;
  role: Role;
  isActive: boolean;
  isSuspended: boolean;
  createdAt: string;
  profile: {
    displayName: string;
    bio: string | null;
    avatarUrl: string | null;
    githubUrl: string | null;
    linkedinUrl: string | null;
    timezone: string;
    languagePreference: string;
    isDiscoverable: boolean;
    streakCount: number;
    lastActiveDate: string | null;
  } | null;
}

export interface SessionValidationResult {
  authenticated: boolean;
  user: SafeUser | null;
  sessionId: string | null;
  error?: string;
}

// In-memory fallback session store for local development/preview when DATABASE_URL is unattached
interface InMemorySession {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  createdAt: Date;
  lastUsedAt: Date;
  revokedAt: Date | null;
  userAgent?: string | null;
  ipAddress?: string | null;
}

interface InMemoryUser {
  id: string;
  email: string;
  passwordHash: string;
  role: Role;
  isActive: boolean;
  isSuspended: boolean;
  createdAt: Date;
  updatedAt: Date;
  profile: {
    userId: string;
    displayName: string;
    bio: string | null;
    avatarUrl: string | null;
    githubUrl: string | null;
    linkedinUrl: string | null;
    timezone: string;
    languagePreference: string;
    isDiscoverable: boolean;
    streakCount: number;
    lastActiveDate: Date | null;
    createdAt: Date;
    updatedAt: Date;
  };
}

// Global in-memory storage preserved across development hot reloads
declare global {
  // eslint-disable-next-line no-var
  var __studenthub_dev_users__: Map<string, InMemoryUser> | undefined;
  // eslint-disable-next-line no-var
  var __studenthub_dev_sessions__: Map<string, InMemorySession> | undefined;
}

const devUsers = globalThis.__studenthub_dev_users__ ?? new Map<string, InMemoryUser>();
const devSessions = globalThis.__studenthub_dev_sessions__ ?? new Map<string, InMemorySession>();
if (process.env.NODE_ENV !== "production") {
  globalThis.__studenthub_dev_users__ = devUsers;
  globalThis.__studenthub_dev_sessions__ = devSessions;
}

/**
 * Ensures in-memory fallback is strictly forbidden in production.
 * In production, any database unavailability or unattached DATABASE_URL must fail safely.
 */
function assertDatabaseAvailableForAuth(): void {
  if (process.env.NODE_ENV === "production" && !process.env.DATABASE_URL) {
    throw new Error("Production database configuration required. Authentication service unavailable.");
  }
}

/**
 * Generate a cryptographically secure random session token.
 * Minimum 256 bits of entropy.
 */
export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString("base64url");
}

/**
 * Hash a session token using HMAC-SHA256 with the server-side SESSION_SECRET.
 * Never stores raw session tokens in the database.
 */
export function hashSessionToken(token: string): string {
  return crypto
    .createHmac("sha256", env.SESSION_SECRET)
    .update(token)
    .digest("hex");
}

/**
 * Hash a password using bcrypt with salt rounds 10.
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

/**
 * Verify a plain text password against a bcrypt hash.
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hash);
  } catch {
    return false;
  }
}

/**
 * Normalize an email address for consistent lookup and deduplication.
 */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Cookie options for setting the HTTP-only session cookie.
 */
export function getSessionCookieOptions(expiresAt: Date) {
  const isProduction = process.env.NODE_ENV === "production";
  return {
    name: SESSION_COOKIE_NAME,
    value: "", // will be set by caller
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax" as const,
    path: "/",
    expires: expiresAt,
  };
}

/**
 * Register a new user with profile and return a newly issued session token.
 */
export async function registerUser({
  email,
  password,
  displayName,
  userAgent,
  ipAddress,
}: {
  email: string;
  password: string;
  displayName: string;
  userAgent?: string | null;
  ipAddress?: string | null;
}): Promise<{ user: SafeUser; rawToken: string; expiresAt: Date }> {
  const normalized = normalizeEmail(email);
  const passwordHash = await hashPassword(password);
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
  const rawToken = generateSessionToken();
  const tokenHash = hashSessionToken(rawToken);

  // If database is connected via DATABASE_URL
  if (process.env.DATABASE_URL) {
    try {
      // Check for existing user
      const existing = await prisma.user.findUnique({
        where: { email: normalized },
      });

      if (existing) {
        throw new Error("An account with this email address already exists.");
      }

      const createdUser = await prisma.user.create({
        data: {
          email: normalized,
          passwordHash,
          role: "STUDENT",
          profile: {
            create: {
              displayName: displayName.trim(),
              timezone: "UTC",
              languagePreference: "English",
            },
          },
          sessions: {
            create: {
              tokenHash,
              expiresAt,
              userAgent,
              ipAddress,
            },
          },
        },
        include: {
          profile: true,
        },
      });

      logAuditEvent({
        action: "USER_REGISTERED",
        resourceType: "User",
        resourceId: createdUser.id,
        metadata: { email: normalized, displayName: displayName.trim() },
      });

      const safeUser: SafeUser = {
        id: createdUser.id,
        email: createdUser.email,
        role: createdUser.role,
        isActive: createdUser.isActive,
        isSuspended: createdUser.isSuspended,
        createdAt: createdUser.createdAt.toISOString(),
        profile: createdUser.profile
          ? {
              displayName: createdUser.profile.displayName,
              bio: createdUser.profile.bio,
              avatarUrl: createdUser.profile.avatarUrl,
              githubUrl: createdUser.profile.githubUrl,
              linkedinUrl: createdUser.profile.linkedinUrl,
              timezone: createdUser.profile.timezone,
              languagePreference: createdUser.profile.languagePreference,
              isDiscoverable: createdUser.profile.isDiscoverable,
              streakCount: createdUser.profile.streakCount,
              lastActiveDate: createdUser.profile.lastActiveDate?.toISOString() ?? null,
            }
          : null,
      };

      return { user: safeUser, rawToken, expiresAt };
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes("already exists")) {
        throw err;
      }
      // Check Prisma P2002 unique constraint violation
      if (err && typeof err === "object" && "code" in err && err.code === "P2002") {
        throw new Error("An account with this email address already exists.");
      }
      if (process.env.NODE_ENV === "production") {
        console.error("Production registration database error:", err);
        throw new Error("Database service unavailable. Registration could not be completed.");
      }
      console.warn("Prisma register error in development mode, falling back to local memory store:", err);
    }
  }

  // Ensure production never falls back to in-memory store
  assertDatabaseAvailableForAuth();

  // Fallback in-memory database store (for local unattached development/preview)
  if (devUsers.has(normalized)) {
    throw new Error("An account with this email address already exists.");
  }

  const userId = crypto.randomUUID();
  const sessionId = crypto.randomUUID();
  const now = new Date();

  const memUser: InMemoryUser = {
    id: userId,
    email: normalized,
    passwordHash,
    role: "STUDENT",
    isActive: true,
    isSuspended: false,
    createdAt: now,
    updatedAt: now,
    profile: {
      userId,
      displayName: displayName.trim(),
      bio: null,
      avatarUrl: null,
      githubUrl: null,
      linkedinUrl: null,
      timezone: "UTC",
      languagePreference: "English",
      isDiscoverable: true,
      streakCount: 0,
      lastActiveDate: null,
      createdAt: now,
      updatedAt: now,
    },
  };

  devUsers.set(normalized, memUser);

  devSessions.set(tokenHash, {
    id: sessionId,
    userId,
    tokenHash,
    expiresAt,
    createdAt: now,
    lastUsedAt: now,
    revokedAt: null,
    userAgent,
    ipAddress,
  });

  logAuditEvent({
    action: "USER_REGISTERED_MEM",
    resourceType: "User",
    resourceId: userId,
    metadata: { email: normalized, displayName: displayName.trim() },
  });

  const safeUser: SafeUser = {
    id: memUser.id,
    email: memUser.email,
    role: memUser.role,
    isActive: memUser.isActive,
    isSuspended: memUser.isSuspended,
    createdAt: memUser.createdAt.toISOString(),
    profile: {
      displayName: memUser.profile.displayName,
      bio: memUser.profile.bio,
      avatarUrl: memUser.profile.avatarUrl,
      githubUrl: memUser.profile.githubUrl,
      linkedinUrl: memUser.profile.linkedinUrl,
      timezone: memUser.profile.timezone,
      languagePreference: memUser.profile.languagePreference,
      isDiscoverable: memUser.profile.isDiscoverable,
      streakCount: memUser.profile.streakCount,
      lastActiveDate: null,
    },
  };

  return { user: safeUser, rawToken, expiresAt };
}

/**
 * Authenticate user with credentials and create a new session.
 */
export async function authenticateWithPassword({
  email,
  password,
  userAgent,
  ipAddress,
}: {
  email: string;
  password: string;
  userAgent?: string | null;
  ipAddress?: string | null;
}): Promise<{ user: SafeUser; rawToken: string; expiresAt: Date }> {
  const normalized = normalizeEmail(email);

  if (process.env.DATABASE_URL) {
    try {
      const user = await prisma.user.findUnique({
        where: { email: normalized },
        include: { profile: true },
      });

      if (!user) {
        // Timing-safe dummy comparison to reduce user enumeration timing side channels
        await bcrypt.compare("dummy-password-check", "$2a$10$N9qo8uLOickgx2ZMRZoMye.I3qJ2NfW4jJj75vT8Q2Kk3x4V0J6l.");
        throw new Error("Invalid email or password.");
      }

      if (user.isSuspended) {
        logAuditEvent({
          action: "LOGIN_REJECTED_SUSPENDED",
          resourceType: "User",
          resourceId: user.id,
          metadata: { email: normalized },
        });
        throw new Error("This account is currently suspended. Please contact support.");
      }

      if (!user.isActive) {
        throw new Error("This account is currently inactive.");
      }

      const validPassword = await verifyPassword(password, user.passwordHash);
      if (!validPassword) {
        logAuditEvent({
          action: "LOGIN_FAILED_BAD_PASSWORD",
          resourceType: "User",
          resourceId: user.id,
          metadata: { email: normalized },
        });
        throw new Error("Invalid email or password.");
      }

      const rawToken = generateSessionToken();
      const tokenHash = hashSessionToken(rawToken);
      const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

      await prisma.session.create({
        data: {
          userId: user.id,
          tokenHash,
          expiresAt,
          userAgent,
          ipAddress,
        },
      });

      logAuditEvent({
        action: "LOGIN_SUCCESS",
        resourceType: "User",
        resourceId: user.id,
        metadata: { email: normalized },
      });

      const safeUser: SafeUser = {
        id: user.id,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        isSuspended: user.isSuspended,
        createdAt: user.createdAt.toISOString(),
        profile: user.profile
          ? {
              displayName: user.profile.displayName,
              bio: user.profile.bio,
              avatarUrl: user.profile.avatarUrl,
              githubUrl: user.profile.githubUrl,
              linkedinUrl: user.profile.linkedinUrl,
              timezone: user.profile.timezone,
              languagePreference: user.profile.languagePreference,
              isDiscoverable: user.profile.isDiscoverable,
              streakCount: user.profile.streakCount,
              lastActiveDate: user.profile.lastActiveDate?.toISOString() ?? null,
            }
          : null,
      };

      return { user: safeUser, rawToken, expiresAt };
    } catch (err: unknown) {
      if (err instanceof Error && (err.message.includes("Invalid email or password") || err.message.includes("suspended") || err.message.includes("inactive"))) {
        throw err;
      }
      if (process.env.NODE_ENV === "production") {
        console.error("Production login database error:", err);
        throw new Error("Database service unavailable. Login could not be completed.");
      }
      console.warn("Prisma login error, trying memory store:", err);
    }
  }

  // Ensure production never falls back to in-memory store
  assertDatabaseAvailableForAuth();

  // Memory fallback
  const user = devUsers.get(normalized);
  if (!user) {
    await bcrypt.compare("dummy-password-check", "$2a$10$N9qo8uLOickgx2ZMRZoMye.I3qJ2NfW4jJj75vT8Q2Kk3x4V0J6l.");
    throw new Error("Invalid email or password.");
  }

  if (user.isSuspended) {
    throw new Error("This account is currently suspended. Please contact support.");
  }

  if (!user.isActive) {
    throw new Error("This account is currently inactive.");
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    logAuditEvent({
      action: "LOGIN_FAILED_BAD_PASSWORD_MEM",
      resourceType: "User",
      resourceId: user.id,
      metadata: { email: normalized },
    });
    throw new Error("Invalid email or password.");
  }

  const rawToken = generateSessionToken();
  const tokenHash = hashSessionToken(rawToken);
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  devSessions.set(tokenHash, {
    id: crypto.randomUUID(),
    userId: user.id,
    tokenHash,
    expiresAt,
    createdAt: new Date(),
    lastUsedAt: new Date(),
    revokedAt: null,
    userAgent,
    ipAddress,
  });

  logAuditEvent({
    action: "LOGIN_SUCCESS_MEM",
    resourceType: "User",
    resourceId: user.id,
    metadata: { email: normalized },
  });

  const safeUser: SafeUser = {
    id: user.id,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    isSuspended: user.isSuspended,
    createdAt: user.createdAt.toISOString(),
    profile: {
      displayName: user.profile.displayName,
      bio: user.profile.bio,
      avatarUrl: user.profile.avatarUrl,
      githubUrl: user.profile.githubUrl,
      linkedinUrl: user.profile.linkedinUrl,
      timezone: user.profile.timezone,
      languagePreference: user.profile.languagePreference,
      isDiscoverable: user.profile.isDiscoverable,
      streakCount: user.profile.streakCount,
      lastActiveDate: null,
    },
  };

  return { user: safeUser, rawToken, expiresAt };
}

/**
 * Validate a raw session token from HTTP-only cookie.
 */
export async function validateSessionToken(rawToken: string): Promise<SessionValidationResult> {
  if (!rawToken || typeof rawToken !== "string") {
    return { authenticated: false, user: null, sessionId: null };
  }

  const tokenHash = hashSessionToken(rawToken);
  const now = new Date();

  if (process.env.DATABASE_URL) {
    try {
      const session = await prisma.session.findUnique({
        where: { tokenHash },
        include: {
          user: {
            include: { profile: true },
          },
        },
      });

      if (!session) {
        return { authenticated: false, user: null, sessionId: null, error: "Session not found." };
      }

      if (session.revokedAt) {
        return { authenticated: false, user: null, sessionId: null, error: "Session has been revoked." };
      }

      if (session.expiresAt < now) {
        return { authenticated: false, user: null, sessionId: null, error: "Session has expired." };
      }

      if (session.user.isSuspended || !session.user.isActive) {
        return { authenticated: false, user: null, sessionId: null, error: "User account is suspended or inactive." };
      }

      // Periodically update lastUsedAt (throttled to once every 15 minutes)
      if (now.getTime() - session.lastUsedAt.getTime() > 15 * 60 * 1000) {
        prisma.session.update({
          where: { id: session.id },
          data: { lastUsedAt: now },
        }).catch(() => {});
      }

      const safeUser: SafeUser = {
        id: session.user.id,
        email: session.user.email,
        role: session.user.role,
        isActive: session.user.isActive,
        isSuspended: session.user.isSuspended,
        createdAt: session.user.createdAt.toISOString(),
        profile: session.user.profile
          ? {
              displayName: session.user.profile.displayName,
              bio: session.user.profile.bio,
              avatarUrl: session.user.profile.avatarUrl,
              githubUrl: session.user.profile.githubUrl,
              linkedinUrl: session.user.profile.linkedinUrl,
              timezone: session.user.profile.timezone,
              languagePreference: session.user.profile.languagePreference,
              isDiscoverable: session.user.profile.isDiscoverable,
              streakCount: session.user.profile.streakCount,
              lastActiveDate: session.user.profile.lastActiveDate?.toISOString() ?? null,
            }
          : null,
      };

      return {
        authenticated: true,
        user: safeUser,
        sessionId: session.id,
      };
    } catch (err) {
      if (process.env.NODE_ENV === "production") {
        console.error("Production validateSession database error:", err);
        return { authenticated: false, user: null, sessionId: null, error: "Database error validating session." };
      }
      console.warn("Prisma session lookup error, checking memory fallback:", err);
    }
  }

  // Ensure production never falls back to in-memory store
  if (process.env.NODE_ENV === "production") {
    return { authenticated: false, user: null, sessionId: null, error: "Session validation service unavailable." };
  }

  // Memory fallback
  const memSession = devSessions.get(tokenHash);
  if (!memSession) {
    return { authenticated: false, user: null, sessionId: null, error: "Session not found." };
  }

  if (memSession.revokedAt) {
    return { authenticated: false, user: null, sessionId: null, error: "Session has been revoked." };
  }

  if (memSession.expiresAt < now) {
    return { authenticated: false, user: null, sessionId: null, error: "Session has expired." };
  }

  // Find user by userId in devUsers
  let foundUser: InMemoryUser | null = null;
  for (const user of devUsers.values()) {
    if (user.id === memSession.userId) {
      foundUser = user;
      break;
    }
  }

  if (!foundUser || foundUser.isSuspended || !foundUser.isActive) {
    return { authenticated: false, user: null, sessionId: null, error: "User account is suspended or inactive." };
  }

  memSession.lastUsedAt = now;

  const safeUser: SafeUser = {
    id: foundUser.id,
    email: foundUser.email,
    role: foundUser.role,
    isActive: foundUser.isActive,
    isSuspended: foundUser.isSuspended,
    createdAt: foundUser.createdAt.toISOString(),
    profile: {
      displayName: foundUser.profile.displayName,
      bio: foundUser.profile.bio,
      avatarUrl: foundUser.profile.avatarUrl,
      githubUrl: foundUser.profile.githubUrl,
      linkedinUrl: foundUser.profile.linkedinUrl,
      timezone: foundUser.profile.timezone,
      languagePreference: foundUser.profile.languagePreference,
      isDiscoverable: foundUser.profile.isDiscoverable,
      streakCount: foundUser.profile.streakCount,
      lastActiveDate: null,
    },
  };

  return {
    authenticated: true,
    user: safeUser,
    sessionId: memSession.id,
  };
}

/**
 * Revoke a session by token hash.
 */
export async function revokeSessionByRawToken(rawToken: string): Promise<boolean> {
  if (!rawToken) return false;
  const tokenHash = hashSessionToken(rawToken);
  const now = new Date();

  if (process.env.DATABASE_URL) {
    try {
      await prisma.session.updateMany({
        where: { tokenHash },
        data: { revokedAt: now },
      });
      return true;
    } catch (err) {
      if (process.env.NODE_ENV === "production") {
        console.error("Production revokeSession database error:", err);
        return false;
      }
    }
  }

  if (process.env.NODE_ENV === "production") {
    return false;
  }

  const memSession = devSessions.get(tokenHash);
  if (memSession) {
    memSession.revokedAt = now;
    return true;
  }

  return false;
}

/**
 * Dev-mode helper: lookup user by id from in-memory store.
 */
export function getDevUserById(userId: string): InMemoryUser | null {
  for (const user of devUsers.values()) {
    if (user.id === userId) {
      return user;
    }
  }
  return null;
}

/**
 * Dev-mode helper: update user profile in in-memory store.
 */
export function updateDevUserProfile(
  userId: string,
  updates: Partial<InMemoryUser["profile"]>
): InMemoryUser["profile"] | null {
  const user = getDevUserById(userId);
  if (!user) return null;

  user.profile = {
    ...user.profile,
    ...updates,
    updatedAt: new Date(),
  };

  return user.profile;
}

