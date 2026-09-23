import crypto from "node:crypto";
import { prisma } from "@/lib/db/client";
import { logAuditEvent } from "@/lib/security/audit-log";
import type {
  StudentSkillCreateInput,
  StudentSkillUpdateInput,
} from "@/lib/validation/schemas";
import type { SkillLevel, SkillPairType } from "@prisma/client";

export interface SkillItem {
  id: string;
  name: string;
  slug: string;
  category: string;
}

export interface StudentSkillResponse {
  id: string;
  userId: string;
  skillId: string;
  type: SkillPairType;
  proficiencyLevel: SkillLevel;
  isVerified: boolean;
  createdAt: string;
  skill: SkillItem;
}

export const DEFAULT_DIRECTORY_SKILLS: SkillItem[] = [
  // Programming
  { id: "skill-java", name: "Java", slug: "java", category: "Programming" },
  { id: "skill-python", name: "Python", slug: "python", category: "Programming" },
  { id: "skill-cpp", name: "C++", slug: "cpp", category: "Programming" },
  { id: "skill-javascript", name: "JavaScript", slug: "javascript", category: "Programming" },
  { id: "skill-typescript", name: "TypeScript", slug: "typescript", category: "Programming" },
  { id: "skill-go", name: "Go", slug: "go", category: "Programming" },
  { id: "skill-rust", name: "Rust", slug: "rust", category: "Programming" },

  // Web
  { id: "skill-html", name: "HTML", slug: "html", category: "Web" },
  { id: "skill-css", name: "CSS", slug: "css", category: "Web" },
  { id: "skill-react", name: "React", slug: "react", category: "Web" },
  { id: "skill-nextjs", name: "Next.js", slug: "nextjs", category: "Web" },
  { id: "skill-tailwindcss", name: "Tailwind CSS", slug: "tailwind-css", category: "Web" },
  { id: "skill-nodejs", name: "Node.js", slug: "nodejs", category: "Web" },

  // Computer Science
  { id: "skill-ds", name: "Data Structures", slug: "data-structures", category: "Computer Science" },
  { id: "skill-algo", name: "Algorithms", slug: "algorithms", category: "Computer Science" },
  { id: "skill-databases", name: "Databases", slug: "databases", category: "Computer Science" },
  { id: "skill-os", name: "Operating Systems", slug: "operating-systems", category: "Computer Science" },
  { id: "skill-networks", name: "Computer Networks", slug: "computer-networks", category: "Computer Science" },

  // Data & AI
  { id: "skill-sql", name: "SQL", slug: "sql", category: "Data & AI" },
  { id: "skill-postgresql", name: "PostgreSQL", slug: "postgresql", category: "Data & AI" },
  { id: "skill-ml", name: "Machine Learning", slug: "machine-learning", category: "Data & AI" },
];

// In-memory dev storage fallback
interface InMemoryStudentSkill {
  id: string;
  userId: string;
  skillId: string;
  type: SkillPairType;
  proficiencyLevel: SkillLevel;
  isVerified: boolean;
  createdAt: Date;
}

declare global {
  // eslint-disable-next-line no-var
  var __studenthub_dev_skills__: Map<string, SkillItem> | undefined;
  // eslint-disable-next-line no-var
  var __studenthub_dev_student_skills__: Map<string, InMemoryStudentSkill> | undefined;
}

const devSkills = globalThis.__studenthub_dev_skills__ ?? new Map<string, SkillItem>();
const devStudentSkills = globalThis.__studenthub_dev_student_skills__ ?? new Map<string, InMemoryStudentSkill>();

if (process.env.NODE_ENV !== "production") {
  globalThis.__studenthub_dev_skills__ = devSkills;
  globalThis.__studenthub_dev_student_skills__ = devStudentSkills;

  if (devSkills.size === 0) {
    for (const skill of DEFAULT_DIRECTORY_SKILLS) {
      devSkills.set(skill.id, skill);
    }
  }
}

let dbSkillsSeeded = false;

/**
 * Ensures directory skills exist in the database when connected.
 */
export async function ensureSkillsInDb(): Promise<void> {
  if (!process.env.DATABASE_URL || dbSkillsSeeded) return;

  try {
    for (const skill of DEFAULT_DIRECTORY_SKILLS) {
      await prisma.skill.upsert({
        where: { slug: skill.slug },
        update: { name: skill.name, category: skill.category },
        create: {
          id: skill.id,
          name: skill.name,
          slug: skill.slug,
          category: skill.category,
        },
      });
    }
    dbSkillsSeeded = true;
  } catch (err) {
    console.warn("Could not seed default skills into database:", err);
  }
}

/**
 * Retrieve directory skills with optional category or text search filtering.
 */
export async function getDirectorySkills(params?: {
  search?: string;
  category?: string;
}): Promise<{ skills: SkillItem[]; categories: string[] }> {
  const search = params?.search?.toLowerCase().trim();
  const category = params?.category?.trim();

  if (process.env.DATABASE_URL) {
    try {
      await ensureSkillsInDb();

      const whereClause: {
        category?: string;
        OR?: Array<{ name: { contains: string; mode: "insensitive" } } | { slug: { contains: string; mode: "insensitive" } }>;
      } = {};

      if (category && category !== "All") {
        whereClause.category = category;
      }

      if (search) {
        whereClause.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { slug: { contains: search, mode: "insensitive" } },
        ];
      }

      const skills = await prisma.skill.findMany({
        where: whereClause,
        orderBy: [{ category: "asc" }, { name: "asc" }],
      });

      const allCategories = Array.from(
        new Set(DEFAULT_DIRECTORY_SKILLS.map((s) => s.category))
      ).sort();

      return {
        skills: skills.map((s) => ({
          id: s.id,
          name: s.name,
          slug: s.slug,
          category: s.category,
        })),
        categories: allCategories,
      };
    } catch (err) {
      if (process.env.NODE_ENV === "production") {
        console.error("Production getDirectorySkills database error:", err);
        throw new Error("Database service unavailable.");
      }
      console.warn("Prisma getDirectorySkills error, falling back to memory:", err);
    }
  }

  // Ensure production never falls back to in-memory store
  if (process.env.NODE_ENV === "production") {
    throw new Error("Database configuration required in production.");
  }

  // Memory fallback
  let list = Array.from(devSkills.values());

  if (category && category !== "All") {
    list = list.filter((s) => s.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    list = list.filter(
      (s) =>
        s.name.toLowerCase().includes(search) ||
        s.slug.toLowerCase().includes(search) ||
        s.category.toLowerCase().includes(search)
    );
  }

  list.sort((a, b) => a.name.localeCompare(b.name));

  const categories = Array.from(new Set(Array.from(devSkills.values()).map((s) => s.category))).sort();

  return { skills: list, categories };
}

/**
 * Retrieve all skills registered by a specific student, separated by TEACH and LEARN.
 */
export async function getStudentSkills(userId: string): Promise<{
  teachSkills: StudentSkillResponse[];
  learnSkills: StudentSkillResponse[];
  allSkills: StudentSkillResponse[];
}> {
  if (!userId) throw new Error("Unauthorized");

  if (process.env.DATABASE_URL) {
    try {
      const records = await prisma.studentSkill.findMany({
        where: { userId },
        include: { skill: true },
        orderBy: { createdAt: "desc" },
      });

      const allSkills: StudentSkillResponse[] = records.map((r) => ({
        id: r.id,
        userId: r.userId,
        skillId: r.skillId,
        type: r.type,
        proficiencyLevel: r.proficiencyLevel,
        isVerified: r.isVerified,
        createdAt: r.createdAt.toISOString(),
        skill: {
          id: r.skill.id,
          name: r.skill.name,
          slug: r.skill.slug,
          category: r.skill.category,
        },
      }));

      const teachSkills = allSkills.filter((s) => s.type === "TEACH");
      const learnSkills = allSkills.filter((s) => s.type === "LEARN");

      return { teachSkills, learnSkills, allSkills };
    } catch (err) {
      if (process.env.NODE_ENV === "production") {
        console.error("Production getStudentSkills database error:", err);
        throw new Error("Database service unavailable.");
      }
      console.warn("Prisma getStudentSkills error, falling back to memory:", err);
    }
  }

  // Ensure production never falls back to in-memory store
  if (process.env.NODE_ENV === "production") {
    throw new Error("Database configuration required in production.");
  }

  // Memory fallback
  const userRecords: InMemoryStudentSkill[] = [];
  for (const record of devStudentSkills.values()) {
    if (record.userId === userId) {
      userRecords.push(record);
    }
  }

  userRecords.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const allSkills: StudentSkillResponse[] = userRecords.map((r) => {
    const skill = devSkills.get(r.skillId) || {
      id: r.skillId,
      name: "Unknown Skill",
      slug: "unknown",
      category: "General",
    };

    return {
      id: r.id,
      userId: r.userId,
      skillId: r.skillId,
      type: r.type,
      proficiencyLevel: r.proficiencyLevel,
      isVerified: r.isVerified,
      createdAt: r.createdAt.toISOString(),
      skill,
    };
  });

  const teachSkills = allSkills.filter((s) => s.type === "TEACH");
  const learnSkills = allSkills.filter((s) => s.type === "LEARN");

  return { teachSkills, learnSkills, allSkills };
}

/**
 * Add a skill to the student's profile (TEACH or LEARN).
 * Prevents duplicate skill relationships for the same (userId, skillId, type).
 */
export async function addStudentSkill(
  userId: string,
  input: StudentSkillCreateInput
): Promise<StudentSkillResponse> {
  if (!userId) throw new Error("Unauthorized");

  const { skillId, type, proficiencyLevel } = input;

  if (process.env.DATABASE_URL) {
    try {
      await ensureSkillsInDb();

      // Verify skill exists
      const existingSkill = await prisma.skill.findUnique({
        where: { id: skillId },
      });

      if (!existingSkill) {
        throw new Error("The selected skill does not exist in the directory.");
      }

      // Check duplicate constraint
      const existingPair = await prisma.studentSkill.findUnique({
        where: {
          userId_skillId_type: {
            userId,
            skillId,
            type,
          },
        },
      });

      if (existingPair) {
        throw new Error(`You have already added "${existingSkill.name}" to your ${type.toLowerCase()} skills.`);
      }

      const created = await prisma.studentSkill.create({
        data: {
          userId,
          skillId,
          type,
          proficiencyLevel,
          isVerified: false,
        },
        include: { skill: true },
      });

      logAuditEvent({
        actorUserId: userId,
        action: "SKILL_ADDED",
        resourceType: "StudentSkill",
        resourceId: created.id,
        metadata: {
          skillId,
          skillName: existingSkill.name,
          type,
          proficiencyLevel,
        },
      });

      return {
        id: created.id,
        userId: created.userId,
        skillId: created.skillId,
        type: created.type,
        proficiencyLevel: created.proficiencyLevel,
        isVerified: created.isVerified,
        createdAt: created.createdAt.toISOString(),
        skill: {
          id: created.skill.id,
          name: created.skill.name,
          slug: created.skill.slug,
          category: created.skill.category,
        },
      };
    } catch (err: unknown) {
      if (err instanceof Error && (err.message.includes("already added") || err.message.includes("does not exist"))) {
        throw err;
      }
      if (err && typeof err === "object" && "code" in err && err.code === "P2002") {
        throw new Error(`You have already added this skill to your ${type.toLowerCase()} skills.`);
      }
      if (process.env.NODE_ENV === "production") {
        console.error("Production addStudentSkill database error:", err);
        throw new Error("Database service unavailable.");
      }
      console.warn("Prisma addStudentSkill error in dev, falling back to memory:", err);
    }
  }

  // Ensure production never falls back to in-memory store
  if (process.env.NODE_ENV === "production") {
    throw new Error("Database configuration required in production.");
  }

  // Memory fallback
  const skill = devSkills.get(skillId);
  if (!skill) {
    throw new Error("The selected skill does not exist in the directory.");
  }

  for (const r of devStudentSkills.values()) {
    if (r.userId === userId && r.skillId === skillId && r.type === type) {
      throw new Error(`You have already added "${skill.name}" to your ${type.toLowerCase()} skills.`);
    }
  }

  const id = crypto.randomUUID();
  const now = new Date();
  const record: InMemoryStudentSkill = {
    id,
    userId,
    skillId,
    type,
    proficiencyLevel,
    isVerified: false,
    createdAt: now,
  };

  devStudentSkills.set(id, record);

  logAuditEvent({
    actorUserId: userId,
    action: "SKILL_ADDED",
    resourceType: "StudentSkill",
    resourceId: id,
    metadata: {
      skillId,
      skillName: skill.name,
      type,
      proficiencyLevel,
    },
  });

  return {
    id,
    userId,
    skillId,
    type,
    proficiencyLevel,
    isVerified: false,
    createdAt: now.toISOString(),
    skill,
  };
}

/**
 * Update proficiency level for a registered student skill.
 * Enforces ownership: only the owner can update.
 */
export async function updateStudentSkill(
  userId: string,
  studentSkillId: string,
  input: StudentSkillUpdateInput
): Promise<StudentSkillResponse> {
  if (!userId) throw new Error("Unauthorized");

  const { proficiencyLevel } = input;

  if (process.env.DATABASE_URL) {
    try {
      const existing = await prisma.studentSkill.findUnique({
        where: { id: studentSkillId },
        include: { skill: true },
      });

      if (!existing) {
        throw new Error("Skill entry not found.");
      }

      if (existing.userId !== userId) {
        throw new Error("Forbidden: You do not have permission to modify this skill.");
      }

      const updated = await prisma.studentSkill.update({
        where: { id: studentSkillId },
        data: { proficiencyLevel },
        include: { skill: true },
      });

      logAuditEvent({
        actorUserId: userId,
        action: "SKILL_UPDATED",
        resourceType: "StudentSkill",
        resourceId: studentSkillId,
        metadata: {
          proficiencyLevel,
          previousLevel: existing.proficiencyLevel,
        },
      });

      return {
        id: updated.id,
        userId: updated.userId,
        skillId: updated.skillId,
        type: updated.type,
        proficiencyLevel: updated.proficiencyLevel,
        isVerified: updated.isVerified,
        createdAt: updated.createdAt.toISOString(),
        skill: {
          id: updated.skill.id,
          name: updated.skill.name,
          slug: updated.skill.slug,
          category: updated.skill.category,
        },
      };
    } catch (err: unknown) {
      if (err instanceof Error && (err.message.includes("not found") || err.message.includes("permission"))) {
        throw err;
      }
      if (process.env.NODE_ENV === "production") {
        console.error("Production updateStudentSkill database error:", err);
        throw new Error("Database service unavailable.");
      }
      console.warn("Prisma updateStudentSkill error, falling back to memory:", err);
    }
  }

  // Ensure production never falls back to in-memory store
  if (process.env.NODE_ENV === "production") {
    throw new Error("Database configuration required in production.");
  }

  // Memory fallback
  const record = devStudentSkills.get(studentSkillId);
  if (!record) {
    throw new Error("Skill entry not found.");
  }

  if (record.userId !== userId) {
    throw new Error("Forbidden: You do not have permission to modify this skill.");
  }

  record.proficiencyLevel = proficiencyLevel;

  const skill = devSkills.get(record.skillId) || {
    id: record.skillId,
    name: "Skill",
    slug: "skill",
    category: "General",
  };

  logAuditEvent({
    actorUserId: userId,
    action: "SKILL_UPDATED",
    resourceType: "StudentSkill",
    resourceId: studentSkillId,
    metadata: {
      proficiencyLevel,
    },
  });

  return {
    id: record.id,
    userId: record.userId,
    skillId: record.skillId,
    type: record.type,
    proficiencyLevel: record.proficiencyLevel,
    isVerified: record.isVerified,
    createdAt: record.createdAt.toISOString(),
    skill,
  };
}

/**
 * Remove a registered skill from the student's profile.
 * Enforces ownership: only the owner can delete.
 */
export async function deleteStudentSkill(
  userId: string,
  studentSkillId: string
): Promise<{ success: boolean; id: string }> {
  if (!userId) throw new Error("Unauthorized");

  if (process.env.DATABASE_URL) {
    try {
      const existing = await prisma.studentSkill.findUnique({
        where: { id: studentSkillId },
      });

      if (!existing) {
        throw new Error("Skill entry not found.");
      }

      if (existing.userId !== userId) {
        throw new Error("Forbidden: You do not have permission to delete this skill.");
      }

      await prisma.studentSkill.delete({
        where: { id: studentSkillId },
      });

      logAuditEvent({
        actorUserId: userId,
        action: "SKILL_DELETED",
        resourceType: "StudentSkill",
        resourceId: studentSkillId,
      });

      return { success: true, id: studentSkillId };
    } catch (err: unknown) {
      if (err instanceof Error && (err.message.includes("not found") || err.message.includes("permission"))) {
        throw err;
      }
      if (process.env.NODE_ENV === "production") {
        console.error("Production deleteStudentSkill database error:", err);
        throw new Error("Database service unavailable.");
      }
      console.warn("Prisma deleteStudentSkill error, falling back to memory:", err);
    }
  }

  // Ensure production never falls back to in-memory store
  if (process.env.NODE_ENV === "production") {
    throw new Error("Database configuration required in production.");
  }

  // Memory fallback
  const record = devStudentSkills.get(studentSkillId);
  if (!record) {
    throw new Error("Skill entry not found.");
  }

  if (record.userId !== userId) {
    throw new Error("Forbidden: You do not have permission to delete this skill.");
  }

  devStudentSkills.delete(studentSkillId);

  logAuditEvent({
    actorUserId: userId,
    action: "SKILL_DELETED",
    resourceType: "StudentSkill",
    resourceId: studentSkillId,
  });

  return { success: true, id: studentSkillId };
}
