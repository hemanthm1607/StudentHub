import { z } from "zod";

/**
 * Foundational Zod schemas for future authentication, profiles, and health checks.
 */

export const healthResponseSchema = z.object({
  status: z.literal("ok"),
  service: z.literal("studenthub"),
  timestamp: z.string(),
  version: z.string(),
  environment: z.string(),
  database: z.object({
    connected: z.boolean(),
    latencyMs: z.number().optional(),
    message: z.string().optional(),
  }),
});

export type HealthResponse = z.infer<typeof healthResponseSchema>;

export const userRegistrationSchema = z.object({
  email: z.string().email("Invalid email address format").max(255),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  displayName: z.string().min(2, "Name must be at least 2 characters").max(50),
});

export const userLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const skillPairingSchema = z.object({
  skillId: z.string().min(1, "Skill ID is required"),
  type: z.enum(["TEACH", "LEARN"]),
  proficiencyLevel: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
});

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

/**
 * Validates a safe avatar URL.
 * Allows null, undefined, or empty string.
 * Strictly enforces https:// or http:// protocol or safe relative path (/...).
 * Disallows javascript:, vbscript:, data:, file:, etc.
 */
export const safeAvatarUrlSchema = z
  .string()
  .trim()
  .max(500, "Avatar URL must not exceed 500 characters")
  .refine(
    (val) => {
      if (!val || val === "") return true;
      // Prohibit dangerous schemes
      const lower = val.toLowerCase();
      if (
        lower.startsWith("javascript:") ||
        lower.startsWith("vbscript:") ||
        lower.startsWith("data:") ||
        lower.startsWith("file:") ||
        /[\r\n\t]/.test(val)
      ) {
        return false;
      }
      if (val.startsWith("/")) return true;
      try {
        const parsed = new URL(val);
        return parsed.protocol === "https:" || parsed.protocol === "http:";
      } catch {
        return false;
      }
    },
    { message: "Avatar must be a valid HTTP/HTTPS URL or safe relative path" }
  )
  .nullable()
  .optional();

/**
 * Phase 3 Profile update validation schema.
 * Prevents mass assignment by strictly validating allowed fields.
 */
export const profileUpdateSchema = z
  .object({
    displayName: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must not exceed 50 characters")
      .optional(),
    bio: z
      .string()
      .trim()
      .max(500, "Bio must not exceed 500 characters")
      .nullable()
      .optional(),
    avatarUrl: safeAvatarUrlSchema,
    timezone: z
      .string()
      .trim()
      .min(1, "Timezone cannot be empty")
      .max(100, "Timezone must not exceed 100 characters")
      .optional(),
    languagePreference: z
      .string()
      .trim()
      .min(1, "Language preference cannot be empty")
      .max(50, "Language must not exceed 50 characters")
      .optional(),
    isDiscoverable: z.boolean().optional(),
    discoverability: z.enum(["DISCOVERABLE", "PRIVATE"]).optional(),
  })
  .strict();

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;

/**
 * Schema for adding a skill to the student's profile (TEACH or LEARN).
 */
export const studentSkillCreateSchema = z.object({
  skillId: z.string().trim().min(1, "Skill ID is required"),
  type: z.enum(["TEACH", "LEARN"] as const),
  proficiencyLevel: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const),
});

export type StudentSkillCreateInput = z.infer<typeof studentSkillCreateSchema>;

/**
 * Schema for updating an existing student skill's proficiency level.
 */
export const studentSkillUpdateSchema = z.object({
  proficiencyLevel: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const),
});

export type StudentSkillUpdateInput = z.infer<typeof studentSkillUpdateSchema>;

/**
 * Schema for querying the skill catalog/directory.
 */
export const skillQuerySchema = z.object({
  search: z.string().trim().max(100).optional(),
  category: z.string().trim().max(100).optional(),
});

export type SkillQueryInput = z.infer<typeof skillQuerySchema>;

/**
 * Phase 4 Course Catalog & Learning System validation schemas.
 */
export const courseQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  category: z.string().trim().max(100).optional(),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const).optional(),
});

export type CourseQueryInput = z.infer<typeof courseQuerySchema>;

export const slugParamSchema = z
  .string()
  .trim()
  .min(1, "Slug is required")
  .max(120, "Slug is too long")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must contain lowercase alphanumeric characters and hyphens only");

