import { prisma } from "@/lib/db/client";
import { getDevUserById, updateDevUserProfile } from "@/lib/security/session";
import { logAuditEvent } from "@/lib/security/audit-log";
import type { ProfileUpdateInput } from "@/lib/validation/schemas";
import type { Role } from "@prisma/client";

export interface SafeProfileData {
  displayName: string;
  bio: string | null;
  avatarUrl: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  timezone: string;
  languagePreference: string;
  isDiscoverable: boolean;
  discoverability: "DISCOVERABLE" | "PRIVATE";
  streakCount: number;
  lastActiveDate: string | null;
}

export interface SafeUserProfileResponse {
  userId: string;
  email: string;
  role: Role;
  createdAt: string;
  profile: SafeProfileData;
}

/**
 * Fetch authoritative user profile by user ID.
 * Never exposes passwords, session tokens, or internal credentials.
 */
export async function getUserProfile(userId: string): Promise<SafeUserProfileResponse | null> {
  if (!userId) return null;

  if (process.env.DATABASE_URL) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true },
      });

      if (!user) return null;

      const profile = user.profile;
      const safeProfile: SafeProfileData = {
        displayName: profile?.displayName || "Student",
        bio: profile?.bio ?? null,
        avatarUrl: profile?.avatarUrl ?? null,
        githubUrl: profile?.githubUrl ?? null,
        linkedinUrl: profile?.linkedinUrl ?? null,
        timezone: profile?.timezone || "UTC",
        languagePreference: profile?.languagePreference || "English",
        isDiscoverable: profile?.isDiscoverable ?? true,
        discoverability: (profile?.isDiscoverable ?? true) ? "DISCOVERABLE" : "PRIVATE",
        streakCount: profile?.streakCount ?? 0,
        lastActiveDate: profile?.lastActiveDate?.toISOString() ?? null,
      };

      return {
        userId: user.id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt.toISOString(),
        profile: safeProfile,
      };
    } catch (err) {
      if (process.env.NODE_ENV === "production") {
        console.error("Production getUserProfile database error:", err);
        throw new Error("Database service unavailable.");
      }
      console.warn("Prisma getUserProfile error in dev, falling back to memory:", err);
    }
  }

  // Ensure production never falls back to in-memory store
  if (process.env.NODE_ENV === "production") {
    throw new Error("Database configuration required in production.");
  }

  // Development/Test fallback
  const memUser = getDevUserById(userId);
  if (!memUser) return null;

  const profile = memUser.profile;
  const safeProfile: SafeProfileData = {
    displayName: profile.displayName || "Student",
    bio: profile.bio ?? null,
    avatarUrl: profile.avatarUrl ?? null,
    githubUrl: profile.githubUrl ?? null,
    linkedinUrl: profile.linkedinUrl ?? null,
    timezone: profile.timezone || "UTC",
    languagePreference: profile.languagePreference || "English",
    isDiscoverable: profile.isDiscoverable ?? true,
    discoverability: (profile.isDiscoverable ?? true) ? "DISCOVERABLE" : "PRIVATE",
    streakCount: profile.streakCount ?? 0,
    lastActiveDate: profile.lastActiveDate?.toISOString() ?? null,
  };

  return {
    userId: memUser.id,
    email: memUser.email,
    role: memUser.role,
    createdAt: memUser.createdAt.toISOString(),
    profile: safeProfile,
  };
}

/**
 * Update authenticated student's profile.
 * Strictly whitelist-updates fields to prevent mass assignment.
 */
export async function updateUserProfile(
  userId: string,
  input: ProfileUpdateInput
): Promise<SafeProfileData> {
  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Resolve discoverability flag
  let isDiscoverable: boolean | undefined = input.isDiscoverable;
  if (input.discoverability) {
    isDiscoverable = input.discoverability === "DISCOVERABLE";
  }

  const cleanUpdates: {
    displayName?: string;
    bio?: string | null;
    avatarUrl?: string | null;
    timezone?: string;
    languagePreference?: string;
    isDiscoverable?: boolean;
  } = {};

  if (input.displayName !== undefined) {
    cleanUpdates.displayName = input.displayName.trim();
  }
  if (input.bio !== undefined) {
    cleanUpdates.bio = input.bio ? input.bio.trim() : null;
  }
  if (input.avatarUrl !== undefined) {
    cleanUpdates.avatarUrl = input.avatarUrl ? input.avatarUrl.trim() : null;
  }
  if (input.timezone !== undefined) {
    cleanUpdates.timezone = input.timezone.trim();
  }
  if (input.languagePreference !== undefined) {
    cleanUpdates.languagePreference = input.languagePreference.trim();
  }
  if (isDiscoverable !== undefined) {
    cleanUpdates.isDiscoverable = isDiscoverable;
  }

  if (process.env.DATABASE_URL) {
    try {
      const updated = await prisma.userProfile.upsert({
        where: { userId },
        update: cleanUpdates,
        create: {
          userId,
          displayName: cleanUpdates.displayName || "Student",
          bio: cleanUpdates.bio ?? null,
          avatarUrl: cleanUpdates.avatarUrl ?? null,
          timezone: cleanUpdates.timezone || "UTC",
          languagePreference: cleanUpdates.languagePreference || "English",
          isDiscoverable: cleanUpdates.isDiscoverable ?? true,
        },
      });

      logAuditEvent({
        actorUserId: userId,
        action: "PROFILE_UPDATED",
        resourceType: "UserProfile",
        resourceId: userId,
        metadata: {
          updatedFields: Object.keys(cleanUpdates),
        },
      });

      return {
        displayName: updated.displayName,
        bio: updated.bio,
        avatarUrl: updated.avatarUrl,
        githubUrl: updated.githubUrl,
        linkedinUrl: updated.linkedinUrl,
        timezone: updated.timezone,
        languagePreference: updated.languagePreference,
        isDiscoverable: updated.isDiscoverable,
        discoverability: updated.isDiscoverable ? "DISCOVERABLE" : "PRIVATE",
        streakCount: updated.streakCount,
        lastActiveDate: updated.lastActiveDate?.toISOString() ?? null,
      };
    } catch (err) {
      if (process.env.NODE_ENV === "production") {
        console.error("Production updateUserProfile database error:", err);
        throw new Error("Database service unavailable.");
      }
      console.warn("Prisma updateUserProfile error in dev, falling back to memory:", err);
    }
  }

  // Ensure production never falls back to in-memory store
  if (process.env.NODE_ENV === "production") {
    throw new Error("Database configuration required in production.");
  }

  // Fallback in dev/test
  const updatedMemProfile = updateDevUserProfile(userId, cleanUpdates);
  if (!updatedMemProfile) {
    throw new Error("User profile not found.");
  }

  logAuditEvent({
    actorUserId: userId,
    action: "PROFILE_UPDATED",
    resourceType: "UserProfile",
    resourceId: userId,
    metadata: {
      updatedFields: Object.keys(cleanUpdates),
    },
  });

  return {
    displayName: updatedMemProfile.displayName,
    bio: updatedMemProfile.bio,
    avatarUrl: updatedMemProfile.avatarUrl,
    githubUrl: updatedMemProfile.githubUrl,
    linkedinUrl: updatedMemProfile.linkedinUrl,
    timezone: updatedMemProfile.timezone,
    languagePreference: updatedMemProfile.languagePreference,
    isDiscoverable: updatedMemProfile.isDiscoverable,
    discoverability: updatedMemProfile.isDiscoverable ? "DISCOVERABLE" : "PRIVATE",
    streakCount: updatedMemProfile.streakCount,
    lastActiveDate: updatedMemProfile.lastActiveDate?.toISOString() ?? null,
  };
}
