import { test, describe, before } from "node:test";
import assert from "node:assert/strict";
import { registerUser } from "../lib/security/session";
import {
  getUserProfile,
  updateUserProfile,
} from "../lib/services/profile-service";
import {
  getDirectorySkills,
  getStudentSkills,
  addStudentSkill,
  updateStudentSkill,
  deleteStudentSkill,
} from "../lib/services/skill-service";
import {
  profileUpdateSchema,
  studentSkillCreateSchema,
  studentSkillUpdateSchema,
} from "../lib/validation/schemas";

describe("Phase 3: Student Profile Management", () => {
  let testUserId: string;

  before(async () => {
    const randomEmail = `student_${Date.now()}@university.edu`;
    const regResult = await registerUser({
      email: randomEmail,
      password: "SecureTestPassword123!",
      displayName: "Alice Tester",
    });
    testUserId = regResult.user.id;
    assert.ok(testUserId);
  });

  test("getUserProfile: fetches complete safe profile without leaking secrets", async () => {
    const userProfile = await getUserProfile(testUserId);
    assert.ok(userProfile);
    assert.strictEqual(userProfile.userId, testUserId);
    assert.strictEqual(userProfile.profile.displayName, "Alice Tester");
    assert.strictEqual(userProfile.profile.isDiscoverable, true);

    // Verify secret fields are not present
    const record = userProfile as unknown as Record<string, unknown>;
    assert.strictEqual(record.passwordHash, undefined);
    assert.strictEqual(record.sessionToken, undefined);
    assert.strictEqual(record.tokenHash, undefined);
  });

  test("getUserProfile: returns null for non-existent user", async () => {
    const missing = await getUserProfile("non-existent-user-uuid-99999");
    assert.strictEqual(missing, null);
  });

  test("updateUserProfile: updates display name, bio, timezone, and language", async () => {
    const updateResult = await updateUserProfile(testUserId, {
      displayName: "Alice In Wonderland",
      bio: "CS major interested in systems and compilers.",
      timezone: "America/New_York",
      languagePreference: "English",
      isDiscoverable: true,
    });

    assert.strictEqual(updateResult.displayName, "Alice In Wonderland");
    assert.strictEqual(updateResult.bio, "CS major interested in systems and compilers.");
    assert.strictEqual(updateResult.timezone, "America/New_York");
    assert.strictEqual(updateResult.isDiscoverable, true);

    // Verify profile persists on subsequent fetch
    const reFetched = await getUserProfile(testUserId);
    assert.ok(reFetched);
    assert.strictEqual(reFetched.profile.displayName, "Alice In Wonderland");
    assert.strictEqual(reFetched.profile.bio, "CS major interested in systems and compilers.");
  });

  test("updateUserProfile: toggles discoverability between DISCOVERABLE and PRIVATE", async () => {
    // Set to private
    const privateResult = await updateUserProfile(testUserId, {
      discoverability: "PRIVATE",
    });
    assert.strictEqual(privateResult.isDiscoverable, false);
    assert.strictEqual(privateResult.discoverability, "PRIVATE");

    // Set back to discoverable
    const discoverableResult = await updateUserProfile(testUserId, {
      discoverability: "DISCOVERABLE",
    });
    assert.strictEqual(discoverableResult.isDiscoverable, true);
    assert.strictEqual(discoverableResult.discoverability, "DISCOVERABLE");
  });

  test("validation: rejects unsafe avatar URL schemes (XSS prevention)", () => {
    const dangerousSchemes = [
      "javascript:alert(1)",
      "vbscript:msgbox(1)",
      "data:text/html,<script>alert(1)</script>",
      "file:///etc/passwd",
    ];

    for (const url of dangerousSchemes) {
      const parsed = profileUpdateSchema.safeParse({ avatarUrl: url });
      assert.strictEqual(
        parsed.success,
        false,
        `Expected validation failure for dangerous URL: ${url}`
      );
    }

    // Valid URLs must pass
    const validUrls = [
      "https://images.unsplash.com/photo-123456",
      "http://example.com/student.jpg",
      "/avatars/default.png",
      "",
      null,
    ];

    for (const url of validUrls) {
      const parsed = profileUpdateSchema.safeParse({ avatarUrl: url });
      assert.strictEqual(
        parsed.success,
        true,
        `Expected valid URL to pass: ${url}`
      );
    }
  });

  test("validation: strictly validates display name length and bio bounds", () => {
    const tooShortName = profileUpdateSchema.safeParse({ displayName: "A" });
    assert.strictEqual(tooShortName.success, false);

    const tooLongName = profileUpdateSchema.safeParse({ displayName: "A".repeat(51) });
    assert.strictEqual(tooLongName.success, false);

    const tooLongBio = profileUpdateSchema.safeParse({ bio: "B".repeat(501) });
    assert.strictEqual(tooLongBio.success, false);

    const valid = profileUpdateSchema.safeParse({
      displayName: "Bob Smith",
      bio: "Valid student bio within length limits.",
    });
    assert.strictEqual(valid.success, true);
  });
});

describe("Phase 3: Skill Directory & Student Skills Management", () => {
  let userAId: string;
  let userBId: string;
  let addedTeachSkillId: string;

  before(async () => {
    const userA = await registerUser({
      email: `studentA_${Date.now()}@school.edu`,
      password: "PasswordA123!",
      displayName: "Student A",
    });
    const userB = await registerUser({
      email: `studentB_${Date.now()}@school.edu`,
      password: "PasswordB123!",
      displayName: "Student B",
    });
    userAId = userA.user.id;
    userBId = userB.user.id;
    assert.ok(userAId);
    assert.ok(userBId);
  });

  test("getDirectorySkills: returns skills catalog and categories", async () => {
    const catalog = await getDirectorySkills();
    assert.ok(catalog.skills.length > 0);
    assert.ok(catalog.categories.length > 0);

    // Filter by category
    const programmingSkills = await getDirectorySkills({ category: "Programming" });
    assert.ok(programmingSkills.skills.every((s) => s.category === "Programming"));

    // Search by name
    const pythonSearch = await getDirectorySkills({ search: "python" });
    assert.ok(pythonSearch.skills.some((s) => s.slug === "python"));
  });

  test("addStudentSkill: adds skill to TEACH list with proficiency", async () => {
    const added = await addStudentSkill(userAId, {
      skillId: "skill-python",
      type: "TEACH",
      proficiencyLevel: "ADVANCED",
    });

    assert.ok(added.id);
    assert.strictEqual(added.userId, userAId);
    assert.strictEqual(added.skillId, "skill-python");
    assert.strictEqual(added.type, "TEACH");
    assert.strictEqual(added.proficiencyLevel, "ADVANCED");
    assert.strictEqual(added.skill.name, "Python");

    addedTeachSkillId = added.id;
  });

  test("addStudentSkill: adds skill to LEARN list", async () => {
    const added = await addStudentSkill(userAId, {
      skillId: "skill-rust",
      type: "LEARN",
      proficiencyLevel: "BEGINNER",
    });

    assert.ok(added.id);
    assert.strictEqual(added.type, "LEARN");
    assert.strictEqual(added.proficiencyLevel, "BEGINNER");
    assert.strictEqual(added.skill.name, "Rust");
  });

  test("getStudentSkills: segregates teach and learn skills cleanly", async () => {
    const skills = await getStudentSkills(userAId);
    assert.strictEqual(skills.teachSkills.length, 1);
    assert.strictEqual(skills.teachSkills[0].skill.name, "Python");

    assert.strictEqual(skills.learnSkills.length, 1);
    assert.strictEqual(skills.learnSkills[0].skill.name, "Rust");

    assert.strictEqual(skills.allSkills.length, 2);
  });

  test("duplicate prevention: rejects adding duplicate skill for same user and type", async () => {
    await assert.rejects(
      async () => {
        await addStudentSkill(userAId, {
          skillId: "skill-python",
          type: "TEACH",
          proficiencyLevel: "INTERMEDIATE",
        });
      },
      (err: Error) => {
        return err.message.includes("already added");
      }
    );
  });

  test("updateStudentSkill: updates proficiency level", async () => {
    const updated = await updateStudentSkill(userAId, addedTeachSkillId, {
      proficiencyLevel: "INTERMEDIATE",
    });

    assert.strictEqual(updated.id, addedTeachSkillId);
    assert.strictEqual(updated.proficiencyLevel, "INTERMEDIATE");

    // Verify change in list
    const skills = await getStudentSkills(userAId);
    assert.strictEqual(skills.teachSkills[0].proficiencyLevel, "INTERMEDIATE");
  });

  test("ownership security: prevents User B from updating User A's skill", async () => {
    await assert.rejects(
      async () => {
        await updateStudentSkill(userBId, addedTeachSkillId, {
          proficiencyLevel: "BEGINNER",
        });
      },
      (err: Error) => {
        return err.message.includes("Forbidden") || err.message.includes("permission");
      }
    );
  });

  test("ownership security: prevents User B from deleting User A's skill", async () => {
    await assert.rejects(
      async () => {
        await deleteStudentSkill(userBId, addedTeachSkillId);
      },
      (err: Error) => {
        return err.message.includes("Forbidden") || err.message.includes("permission");
      }
    );
  });

  test("deleteStudentSkill: allows owner to delete skill", async () => {
    const deleteResult = await deleteStudentSkill(userAId, addedTeachSkillId);
    assert.strictEqual(deleteResult.success, true);
    assert.strictEqual(deleteResult.id, addedTeachSkillId);

    // Verify skill is removed
    const skillsAfter = await getStudentSkills(userAId);
    assert.strictEqual(skillsAfter.teachSkills.length, 0);
  });

  test("validation: rejects invalid skill payloads", () => {
    // Empty skill ID
    const emptySkill = studentSkillCreateSchema.safeParse({
      skillId: "",
      type: "TEACH",
      proficiencyLevel: "BEGINNER",
    });
    assert.strictEqual(emptySkill.success, false);

    // Invalid type
    const invalidType = studentSkillCreateSchema.safeParse({
      skillId: "skill-java",
      type: "MASTER", // Not TEACH or LEARN
      proficiencyLevel: "BEGINNER",
    });
    assert.strictEqual(invalidType.success, false);

    // Invalid proficiency level
    const invalidProf = studentSkillUpdateSchema.safeParse({
      proficiencyLevel: "EXPERT", // Not BEGINNER, INTERMEDIATE, or ADVANCED
    });
    assert.strictEqual(invalidProf.success, false);
  });
});
