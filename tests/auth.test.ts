import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  hashPassword,
  verifyPassword,
  generateSessionToken,
  hashSessionToken,
  normalizeEmail,
  registerUser,
  authenticateWithPassword,
  validateSessionToken,
  revokeSessionByRawToken,
  getSessionCookieOptions,
} from "../lib/security/session";
import { userRegistrationSchema, userLoginSchema } from "../lib/validation/schemas";

describe("Password Hashing & Verification (Bcrypt)", () => {
  test("hashes password securely and verifies match", async () => {
    const raw = "SuperSecurePassword123!";
    const hash = await hashPassword(raw);

    assert.notStrictEqual(hash, raw);
    assert.strictEqual(hash.startsWith("$2a$") || hash.startsWith("$2b$"), true);

    const matches = await verifyPassword(raw, hash);
    assert.strictEqual(matches, true);

    const wrongMatches = await verifyPassword("WrongPassword!", hash);
    assert.strictEqual(wrongMatches, false);
  });
});

describe("Session Token Generation & HMAC Hashing", () => {
  test("generates random high-entropy tokens and deterministic HMAC hash", () => {
    const token1 = generateSessionToken();
    const token2 = generateSessionToken();

    assert.strictEqual(typeof token1, "string");
    assert.ok(token1.length >= 32);
    assert.notStrictEqual(token1, token2);

    const hash1 = hashSessionToken(token1);
    const hash1Again = hashSessionToken(token1);
    const hash2 = hashSessionToken(token2);

    assert.strictEqual(hash1, hash1Again);
    assert.notStrictEqual(hash1, hash2);
    assert.notStrictEqual(hash1, token1); // Hash is never identical to raw token
  });

  test("generates secure HTTP-only cookie configuration", () => {
    const expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    const options = getSessionCookieOptions(expiresAt);

    assert.strictEqual(options.name, "studenthub_session");
    assert.strictEqual(options.httpOnly, true);
    assert.strictEqual(options.sameSite, "lax");
    assert.strictEqual(options.path, "/");
    assert.strictEqual(options.expires.getTime(), expiresAt.getTime());
  });
});

describe("Email Normalization", () => {
  test("trims whitespace and converts to lowercase", () => {
    assert.strictEqual(normalizeEmail("  Student@University.EDU  "), "student@university.edu");
    assert.strictEqual(normalizeEmail("John.Doe@Example.COM"), "john.doe@example.com");
  });
});

describe("Authentication Workflows & Sessions", () => {
  const testEmail = `student_${Date.now()}@domain.edu`;
  const testPassword = "ValidPassword999";
  const testDisplayName = "Amina K";

  let createdRawToken: string;

  test("registers a new user and returns safe user data with session token", async () => {
    const result = await registerUser({
      email: testEmail,
      password: testPassword,
      displayName: testDisplayName,
    });

    assert.ok(result.user.id);
    assert.strictEqual(result.user.email, testEmail.toLowerCase());
    assert.strictEqual(result.user.profile?.displayName, testDisplayName);
    assert.strictEqual(result.user.role, "STUDENT");
    assert.ok(result.rawToken);
    assert.ok(result.expiresAt);

    // Verify critical security rule: sensitive credentials are never in user object
    const userObj = result.user as unknown as Record<string, unknown>;
    assert.strictEqual(userObj.password, undefined);
    assert.strictEqual(userObj.passwordHash, undefined);
    assert.strictEqual(userObj.tokenHash, undefined);

    createdRawToken = result.rawToken;
  });

  test("rejects duplicate registration with identical email", async () => {
    await assert.rejects(
      async () => {
        await registerUser({
          email: testEmail.toUpperCase(), // Test case-insensitive collision
          password: "AnotherPassword123",
          displayName: "Duplicate Attempt",
        });
      },
      /already exists/i
    );
  });

  test("validates valid session token and retrieves user", async () => {
    const sessionCheck = await validateSessionToken(createdRawToken);
    assert.strictEqual(sessionCheck.authenticated, true);
    assert.ok(sessionCheck.user);
    assert.strictEqual(sessionCheck.user.email, testEmail.toLowerCase());
    assert.strictEqual(sessionCheck.user.profile?.displayName, testDisplayName);
  });

  test("rejects invalid, malformed, or nonexistent session tokens", async () => {
    const invalidCheck = await validateSessionToken("completely-fabricated-token-value");
    assert.strictEqual(invalidCheck.authenticated, false);
    assert.strictEqual(invalidCheck.user, null);

    const emptyCheck = await validateSessionToken("");
    assert.strictEqual(emptyCheck.authenticated, false);
  });

  test("authenticates existing user with correct password and issues new session", async () => {
    const loginResult = await authenticateWithPassword({
      email: testEmail,
      password: testPassword,
    });

    assert.ok(loginResult.user);
    assert.strictEqual(loginResult.user.email, testEmail.toLowerCase());
    assert.ok(loginResult.rawToken);

    // Verify session from login is valid
    const sessionCheck = await validateSessionToken(loginResult.rawToken);
    assert.strictEqual(sessionCheck.authenticated, true);
  });

  test("rejects authentication with invalid password", async () => {
    await assert.rejects(
      async () => {
        await authenticateWithPassword({
          email: testEmail,
          password: "WrongPassword123!",
        });
      },
      /Invalid email or password/i
    );
  });

  test("rejects authentication with nonexistent email", async () => {
    await assert.rejects(
      async () => {
        await authenticateWithPassword({
          email: "nonexistent_student_999@univ.edu",
          password: "AnyPassword123!",
        });
      },
      /Invalid email or password/i
    );
  });

  test("revokes session on logout and rejects subsequent validation", async () => {
    // Revoke the session
    const revoked = await revokeSessionByRawToken(createdRawToken);
    assert.strictEqual(revoked, true);

    // Validate that the session is now rejected
    const checkAfterRevoke = await validateSessionToken(createdRawToken);
    assert.strictEqual(checkAfterRevoke.authenticated, false);
    assert.strictEqual(checkAfterRevoke.user, null);

    // Repeated logout on already-revoked session remains safe
    const repeatedRevoke = await revokeSessionByRawToken(createdRawToken);
    assert.strictEqual(repeatedRevoke, true);
  });
});
