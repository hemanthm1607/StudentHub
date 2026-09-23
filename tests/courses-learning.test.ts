import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  listPublishedCourses,
  getPublishedCourseBySlug,
  getTopicBySlugs,
  getTopicByIdOrSlug,
  getModuleById,
  getLessonById,
} from "../lib/services/course-service";
import {
  courseQuerySchema,
  slugParamSchema,
} from "../lib/validation/schemas";

describe("Phase 4 Courses & Learning System Tests", () => {
  test("1. listPublishedCourses() returns published courses and pagination metadata", async () => {
    const result = await listPublishedCourses({ limit: 10 });
    assert.ok(result);
    assert.ok(Array.isArray(result.courses));
    assert.ok(result.courses.length >= 2, "Expected at least 2 published courses");
    assert.ok(result.pagination);
    assert.strictEqual(result.pagination.page, 1);
    assert.strictEqual(result.pagination.limit, 10);
    assert.ok(result.pagination.total >= 2);

    const javaCourse = result.courses.find((c) => c.slug === "java");
    assert.ok(javaCourse, "Java course should be published and listed");
    assert.strictEqual(javaCourse.difficulty, "BEGINNER");
    assert.strictEqual(javaCourse.category, "Programming");
    assert.ok(javaCourse.moduleCount > 0);
    assert.ok(javaCourse.topicCount > 0);
  });

  test("2. Unpublished / draft courses are strictly excluded from listPublishedCourses()", async () => {
    const result = await listPublishedCourses({ limit: 50 });
    const draft = result.courses.find((c) => c.slug === "distributed-systems");
    assert.strictEqual(draft, undefined, "Draft/unpublished courses must never appear in catalog");
  });

  test("3. getPublishedCourseBySlug() returns curriculum with modules and topics in order", async () => {
    const course = await getPublishedCourseBySlug("java");
    assert.ok(course);
    assert.strictEqual(course.slug, "java");
    assert.ok(course.modules.length >= 3);

    // Verify module ordering
    for (let i = 0; i < course.modules.length - 1; i++) {
      assert.ok(
        course.modules[i].orderIndex <= course.modules[i + 1].orderIndex,
        `Module ${course.modules[i].title} index should be <= next module`
      );
    }

    // Verify topics inside modules are also ordered
    for (const mod of course.modules) {
      assert.ok(mod.topics.length > 0);
      for (let j = 0; j < mod.topics.length - 1; j++) {
        assert.ok(
          mod.topics[j].orderIndex <= mod.topics[j + 1].orderIndex,
          `Topic ${mod.topics[j].title} index should be <= next topic`
        );
      }
    }
  });

  test("4. getPublishedCourseBySlug() returns null for unpublished courses to unprivileged users", async () => {
    const draft = await getPublishedCourseBySlug("distributed-systems", false);
    assert.strictEqual(draft, null, "Unpublished course must return null");

    // Privileged access returns it
    const privileged = await getPublishedCourseBySlug("distributed-systems", true);
    assert.ok(privileged, "Privileged query can access draft course");
    assert.strictEqual(privileged.isPublished, false);
  });

  test("5. Direct topic access (Mode B) resolves topic and lesson content", async () => {
    const topic = await getTopicBySlugs("java", "variables");
    assert.ok(topic, "Topic 'variables' should resolve directly");
    assert.strictEqual(topic.slug, "variables");
    assert.strictEqual(topic.module.course.slug, "java");
    assert.ok(topic.estimatedMinutes > 0);

    // Check lesson content
    assert.ok(topic.lesson);
    assert.ok(topic.lesson.markdownBody.includes("Java is a **statically typed** language"));
    assert.ok(topic.lesson.syntaxGuide);
    assert.ok(topic.lesson.commonMistakes);
    assert.ok(topic.lesson.practicalUseCases);
  });

  test("6. Sequential course flow (Mode A) correctly computes prevTopic and nextTopic", async () => {
    // Middle topic: variables has intro before it, operators after it
    const topic = await getTopicBySlugs("java", "variables");
    assert.ok(topic);
    assert.ok(topic.navigation.prevTopic, "Variables should have a previous topic");
    assert.strictEqual(topic.navigation.prevTopic.slug, "introduction");
    assert.ok(topic.navigation.nextTopic, "Variables should have a next topic");
    assert.strictEqual(topic.navigation.nextTopic.slug, "operators");

    // First topic in course: introduction should have prevTopic = null
    const firstTopic = await getTopicBySlugs("java", "introduction");
    assert.ok(firstTopic);
    assert.strictEqual(firstTopic.navigation.prevTopic, null, "First topic must have no previous topic");
    assert.strictEqual(firstTopic.navigation.nextTopic?.slug, "variables");
  });

  test("7. Cross-module topic sequencing works smoothly", async () => {
    // Last topic of Module 1: operators
    const operatorsTopic = await getTopicBySlugs("java", "operators");
    assert.ok(operatorsTopic);
    // Next topic should cross into Module 2: conditions
    assert.strictEqual(operatorsTopic.navigation.nextTopic?.slug, "conditions");
  });

  test("8. getTopicByIdOrSlug() and getLessonById() standalone lookups work", async () => {
    const topic = await getTopicByIdOrSlug("introduction");
    assert.ok(topic);
    assert.strictEqual(topic.slug, "introduction");

    if (topic.lesson) {
      const lesson = await getLessonById(topic.lesson.id);
      assert.ok(lesson);
      assert.strictEqual(lesson.id, topic.lesson.id);
    }
  });

  test("9. Schema validation: courseQuerySchema validates and sanitizes input", () => {
    const valid = courseQuerySchema.safeParse({ page: "2", limit: "15", level: "BEGINNER" });
    assert.strictEqual(valid.success, true);
    if (valid.success) {
      assert.strictEqual(valid.data.page, 2);
      assert.strictEqual(valid.data.limit, 15);
      assert.strictEqual(valid.data.level, "BEGINNER");
    }

    const invalidLevel = courseQuerySchema.safeParse({ level: "EXPERT_NOT_REAL" });
    assert.strictEqual(invalidLevel.success, false);

    const excessiveLimit = courseQuerySchema.safeParse({ limit: "500" });
    assert.strictEqual(excessiveLimit.success, false);
  });

  test("10. Schema validation: slugParamSchema enforces safe slug characters", () => {
    assert.strictEqual(slugParamSchema.safeParse("java-programming").success, true);
    assert.strictEqual(slugParamSchema.safeParse("java").success, true);
    assert.strictEqual(slugParamSchema.safeParse("introduction-1").success, true);

    // Rejects invalid slug formats (XSS attempts, spaces, capitals)
    assert.strictEqual(slugParamSchema.safeParse("<script>alert(1)</script>").success, false);
    assert.strictEqual(slugParamSchema.safeParse("Java Programming").success, false);
    assert.strictEqual(slugParamSchema.safeParse("").success, false);
    assert.strictEqual(slugParamSchema.safeParse("../escape").success, false);
  });

  test("11. Production Fallback Safety: in-memory store cannot be used when NODE_ENV=production", async () => {
    const originalEnv = process.env.NODE_ENV;
    const originalDbUrl = process.env.DATABASE_URL;

    try {
      // Simulate production environment with unconfigured database
      (process.env as Record<string, string | undefined>).NODE_ENV = "production";
      delete process.env.DATABASE_URL;

      await assert.rejects(
        async () => {
          await listPublishedCourses();
        },
        /Database configuration required in production|Database service unavailable/,
        "Must throw error in production when database is unconfigured"
      );

      await assert.rejects(
        async () => {
          await getPublishedCourseBySlug("java");
        },
        /Database configuration required in production|Database service unavailable/,
        "Must throw error in production when database is unconfigured"
      );
    } finally {
      (process.env as Record<string, string | undefined>).NODE_ENV = originalEnv;
      if (originalDbUrl) {
        process.env.DATABASE_URL = originalDbUrl;
      }
    }
  });
});
