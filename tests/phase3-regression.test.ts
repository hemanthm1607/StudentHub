import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import {
  registerUser,
  authenticateWithPassword,
  validateSessionToken,
  revokeSessionByRawToken,
  generateSessionToken,
} from "../lib/security/session";
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

describe("Phase 3 Complete Regression & Production Safety Suite", () => {
  let userEmail: string;
  let userPassword: string;
  let registeredUserId: string;
  let activeRawToken: string;
  let secondUserId: string;
  let studentSkillId: string;

  before(async () => {
    userEmail = `regression_student_${Date.now()}@university.edu`;
    userPassword = "StrongTestPassword999!";

    // 1. REGISTRATION
    const regResult = await registerUser({
      email: userEmail,
      password: userPassword,
      displayName: "Regression Candidate",
    });

    registeredUserId = regResult.user.id;
    assert.ok(registeredUserId);
    assert.strictEqual(regResult.user.profile?.displayName, "Regression Candidate");
    assert.strictEqual(regResult.user.profile?.isDiscoverable, true);

    // Setup second user for ownership security checks
    const user2 = await registerUser({
      email: `second_user_${Date.now()}@university.edu`,
      password: "StrongTestPassword888!",
      displayName: "Attacker User",
    });
    secondUserId = user2.user.id;
    assert.ok(secondUserId);
  });

  // 10. AUTHENTICATION FLOW: Register -> Login -> Dashboard/Session -> Profile -> Logout
  test("Auth Flow: Authenticates credentials and issues safe user object", async () => {
    const authResult = await authenticateWithPassword({
      email: userEmail,
      password: userPassword,
    });
    assert.ok(authResult);
    assert.strictEqual(authResult.user.id, registeredUserId);
    activeRawToken = authResult.rawToken;
    assert.ok(activeRawToken);
  });

  test("Auth Flow: Validates session token and resolves safe user session", async () => {
    const sessionResult = await validateSessionToken(activeRawToken);
    assert.strictEqual(sessionResult.authenticated, true);
    assert.ok(sessionResult.user);
    assert.strictEqual(sessionResult.user.id, registeredUserId);
  });

  // 7. SECURITY LEAK CHECK: Verify no profile API or service returns sensitive secrets
  test("Security Leak Check: Profile object never returns passwordHash, tokens, or secrets", async () => {
    const profileData = await getUserProfile(registeredUserId);
    assert.ok(profileData);

    const record = profileData as unknown as Record<string, unknown>;
    const profileRecord = profileData.profile as unknown as Record<string, unknown>;

    // Sensitive keys that must NEVER be present
    const forbiddenKeys = [
      "passwordHash",
      "password",
      "salt",
      "rawToken",
      "tokenHash",
      "sessionToken",
      "sessionId",
      "SESSION_SECRET",
      "secret",
    ];

    for (const key of forbiddenKeys) {
      assert.strictEqual(
        record[key],
        undefined,
        `Leak detected: root profile data contains sensitive field "${key}"`
      );
      assert.strictEqual(
        profileRecord[key],
        undefined,
        `Leak detected: user.profile contains sensitive field "${key}"`
      );
    }
  });

  // 9. DISCOVERABILITY SETTINGS: Verify private/discoverable settings are respected
  test("Discoverability: Respects DISCOVERABLE vs PRIVATE toggle", async () => {
    // Set to PRIVATE
    const priv = await updateUserProfile(registeredUserId, {
      discoverability: "PRIVATE",
    });
    assert.strictEqual(priv.isDiscoverable, false);
    assert.strictEqual(priv.discoverability, "PRIVATE");

    let fetched = await getUserProfile(registeredUserId);
    assert.strictEqual(fetched?.profile.isDiscoverable, false);
    assert.strictEqual(fetched?.profile.discoverability, "PRIVATE");

    // Set to DISCOVERABLE
    const disc = await updateUserProfile(registeredUserId, {
      discoverability: "DISCOVERABLE",
    });
    assert.strictEqual(disc.isDiscoverable, true);
    assert.strictEqual(disc.discoverability, "DISCOVERABLE");

    fetched = await getUserProfile(registeredUserId);
    assert.strictEqual(fetched?.profile.isDiscoverable, true);
    assert.strictEqual(fetched?.profile.discoverability, "DISCOVERABLE");
  });

  // 8. SKILL OWNERSHIP SECURITY: Verify users cannot modify or delete other users' records
  test("Skill Ownership: User adds a skill to their own TEACH list", async () => {
    const added = await addStudentSkill(registeredUserId, {
      skillId: "skill-typescript",
      type: "TEACH",
      proficiencyLevel: "ADVANCED",
    });

    assert.ok(added.id);
    assert.strictEqual(added.userId, registeredUserId);
    assert.strictEqual(added.skill.slug, "typescript");
    studentSkillId = added.id;
  });

  test("Skill Ownership: Second user cannot modify the first user's StudentSkill", async () => {
    await assert.rejects(
      async () => {
        await updateStudentSkill(secondUserId, studentSkillId, {
          proficiencyLevel: "BEGINNER",
        });
      },
      (err: Error) => {
        return (
          err.message.includes("Forbidden") ||
          err.message.includes("permission") ||
          err.message.includes("not found")
        );
      }
    );
  });

  test("Skill Ownership: Second user cannot delete the first user's StudentSkill", async () => {
    await assert.rejects(
      async () => {
        await deleteStudentSkill(secondUserId, studentSkillId);
      },
      (err: Error) => {
        return (
          err.message.includes("Forbidden") ||
          err.message.includes("permission") ||
          err.message.includes("not found")
        );
      }
    );
  });

  test("Skill Management: Owner can successfully update proficiency level", async () => {
    const updated = await updateStudentSkill(registeredUserId, studentSkillId, {
      proficiencyLevel: "INTERMEDIATE",
    });
    assert.strictEqual(updated.proficiencyLevel, "INTERMEDIATE");

    const skills = await getStudentSkills(registeredUserId);
    assert.strictEqual(skills.teachSkills[0].proficiencyLevel, "INTERMEDIATE");
  });

  test("Skill Management: Owner can successfully delete their own skill", async () => {
    const deleted = await deleteStudentSkill(registeredUserId, studentSkillId);
    assert.strictEqual(deleted.success, true);

    const skills = await getStudentSkills(registeredUserId);
    assert.strictEqual(skills.teachSkills.length, 0);
  });

  // 10. AUTH FLOW: Logout and Session Revocation
  test("Auth Flow: Session revocation (Logout) invalidates session token", async () => {
    const revoked = await revokeSessionByRawToken(activeRawToken);
    assert.strictEqual(revoked, true);

    const check = await validateSessionToken(activeRawToken);
    assert.strictEqual(check.authenticated, false);
    assert.strictEqual(check.user, null);
  });

  // 5. PRODUCTION FALLBACK SAFETY: Verify in-memory fallbacks are strictly blocked in production
  test("Production Safety: When NODE_ENV=production, memory fallbacks throw errors", async () => {
    const originalEnv = process.env.NODE_ENV;
    const originalDbUrl = process.env.DATABASE_URL;

    try {
      // Simulate production with broken/unset DB
      (process.env as Record<string, string | undefined>).NODE_ENV = "production";
      delete process.env.DATABASE_URL;

      // 1. getUserProfile must fail in production without DB
      await assert.rejects(
        async () => {
          await getUserProfile(registeredUserId);
        },
        (err: Error) => {
          return err.message.includes("Database") || err.message.includes("production");
        }
      );

      // 2. updateUserProfile must fail in production without DB
      await assert.rejects(
        async () => {
          await updateUserProfile(registeredUserId, { displayName: "Hacked" });
        },
        (err: Error) => {
          return err.message.includes("Database") || err.message.includes("production");
        }
      );

      // 3. getDirectorySkills must fail in production without DB
      await assert.rejects(
        async () => {
          await getDirectorySkills();
        },
        (err: Error) => {
          return err.message.includes("Database") || err.message.includes("production");
        }
      );

      // 4. getStudentSkills must fail in production without DB
      await assert.rejects(
        async () => {
          await getStudentSkills(registeredUserId);
        },
        (err: Error) => {
          return err.message.includes("Database") || err.message.includes("production");
        }
      );

      // 5. addStudentSkill must fail in production without DB
      await assert.rejects(
        async () => {
          await addStudentSkill(registeredUserId, {
            skillId: "skill-go",
            type: "TEACH",
            proficiencyLevel: "BEGINNER",
          });
        },
        (err: Error) => {
          return err.message.includes("Database") || err.message.includes("production");
        }
      );
    } finally {
      // Restore original environment
      (process.env as Record<string, string | undefined>).NODE_ENV = originalEnv;
      if (originalDbUrl) {
        process.env.DATABASE_URL = originalDbUrl;
      }
    }
  });
});
