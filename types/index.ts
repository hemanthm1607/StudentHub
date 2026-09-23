/**
 * Universal TypeScript definitions for StudentHub Phase 1 & future phases.
 */

export type Role = "STUDENT" | "CONTENT_CREATOR" | "MODERATOR" | "ADMIN";

export type ProficiencyLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export type SkillType = "TEACH" | "LEARN";

export interface UserSummary {
  id: string;
  email: string;
  role: Role;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
}

export interface SkillItem {
  id: string;
  name: string;
  slug: string;
  category: string;
}

export interface CourseSummary {
  id: string;
  title: string;
  slug: string;
  description: string;
  level: ProficiencyLevel;
  topicsCount: number;
  estimatedHours: number;
  isPublished: boolean;
}

export interface TopicSummary {
  id: string;
  title: string;
  slug: string;
  orderIndex: number;
  moduleId: string;
  prerequisites?: string[];
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}
