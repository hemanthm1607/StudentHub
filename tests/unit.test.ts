import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { cn } from "../lib/utils/cn";
import {
  userRegistrationSchema,
  userLoginSchema,
  healthResponseSchema,
} from "../lib/validation/schemas";
import { sanitizeMetadata } from "../lib/security/audit-log";
import { checkRateLimit } from "../lib/security/rate-limit";

describe("Design System Utilities (cn)", () => {
  test("merges class names correctly without duplicates", () => {
    const result = cn("px-4 py-2", "px-6", { "bg-blue-600": true, "bg-red-600": false });
    assert.strictEqual(result, "py-2 px-6 bg-blue-600");
  });

  test("handles undefined, null, and empty values gracefully", () => {
    const result = cn("btn", undefined, null, false, "btn-primary");
    assert.strictEqual(result, "btn btn-primary");
  });
});

describe("Zod Validation Schemas", () => {
  test("validates compliant user registration payload", () => {
    const validData = {
      email: "student@university.edu",
      password: "SecurePassword123",
      displayName: "Priya Sharma",
    };
    const parsed = userRegistrationSchema.safeParse(validData);
    assert.strictEqual(parsed.success, true);
  });

  test("rejects invalid email format in registration", () => {
    const invalidData = {
      email: "not-an-email",
      password: "SecurePassword123",
      displayName: "Priya",
    };
    const parsed = userRegistrationSchema.safeParse(invalidData);
    assert.strictEqual(parsed.success, false);
  });

  test("rejects password missing numbers or uppercase letters", () => {
    const weakData = {
      email: "test@example.com",
      password: "weakpassword",
      displayName: "Alex",
    };
    const parsed = userRegistrationSchema.safeParse(weakData);
    assert.strictEqual(parsed.success, false);
  });

  test("validates compliant health response structure", () => {
    const payload = {
      status: "ok",
      service: "studenthub",
      timestamp: new Date().toISOString(),
      version: "1.0.0-phase1",
      environment: "test",
      database: {
        connected: true,
        latencyMs: 12,
        message: "Database operational",
      },
    };
    const parsed = healthResponseSchema.safeParse(payload);
    assert.strictEqual(parsed.success, true);
  });
});

describe("Security Audit Logger Sanitization", () => {
  test("redacts sensitive fields like passwords, tokens, and secrets", () => {
    const dirtyMetadata = {
      action: "LOGIN_ATTEMPT",
      password: "SuperSecretPassword!",
      token: "jwt.header.payload",
      userEmail: "learner@studenthub.org",
      nested: {
        access_token: "secret_access",
        safeNote: "Hello",
      },
    };

    const sanitized = sanitizeMetadata(dirtyMetadata);

    assert.strictEqual(sanitized.action, "LOGIN_ATTEMPT");
    assert.strictEqual(sanitized.password, "[REDACTED]");
    assert.strictEqual(sanitized.token, "[REDACTED]");
    assert.strictEqual(sanitized.userEmail, "learner@studenthub.org");

    const nested = sanitized.nested as Record<string, unknown>;
    assert.strictEqual(nested.access_token, "[REDACTED]");
    assert.strictEqual(nested.safeNote, "Hello");
  });
});

describe("Rate Limiter Abstraction", () => {
  test("allows requests under the quota limit", () => {
    const testIp = `test-ip-${Date.now()}`;
    const result1 = checkRateLimit(testIp, { windowMs: 1000, maxRequests: 2 });
    assert.strictEqual(result1.allowed, true);
    assert.strictEqual(result1.remaining, 1);

    const result2 = checkRateLimit(testIp, { windowMs: 1000, maxRequests: 2 });
    assert.strictEqual(result2.allowed, true);
    assert.strictEqual(result2.remaining, 0);

    const result3 = checkRateLimit(testIp, { windowMs: 1000, maxRequests: 2 });
    assert.strictEqual(result3.allowed, false);
    assert.strictEqual(result3.remaining, 0);
  });
});
