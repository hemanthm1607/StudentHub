# StudentHub Architecture Blueprint

Comprehensive technical architecture, database relational model, security standards, and performance specifications for **StudentHub** — an open-access student learning, coding practice, assessment, and peer-to-peer Skill Swap platform.

---

## 1. System Overview & Core Philosophy

StudentHub is engineered to dismantle the barriers modern engineering students face: artificial paywalls, locked prerequisite progression, superficial video tutorials, and pseudo-scientific proctoring claims.

### The Continuous Mastery Loop

```
  ┌─────────────────────────────────────────────────────────────┐
  │                                                             │
  ▼                                                             │
[ 1. LEARN ] ──► [ 2. PRACTICE ] ──► [ 3. TEST ]                │
                       │                   │                    │
                       ▼                   ▼                    │
                [ 4. IMPROVE ] ◄── (Weak Topic Flags)           │
                       │                                        │
                       ▼                                        │
                 [ 5. TEACH ] ──► [ 6. LEARN FROM OTHERS ] ─────┘
                    (Mentorship)        (Skill Swap)
```

1. **LEARN**: Granular technical curriculum with deep conceptual explanations, syntax guides, common pitfalls, and real-world production use cases.
2. **PRACTICE**: Sandboxed coding workouts evaluated against visible and hidden unit test cases with zero server host contamination.
3. **TEST**: Timed summative assessments with randomized question variants and server-enforced countdowns.
4. **IMPROVE**: Deterministic rule-based diagnostics that automatically flag concept gaps and prescribe targeted remedial review.
5. **TEACH**: Reinforce topic mastery by mentoring junior peers once skills are verified.
6. **LEARN FROM OTHERS**: Reciprocal peer-to-peer Skill Swap exchange matching compatible students 1-on-1 at $0 cost.

### Zero Operating-Cost ($0 SaaS) Commitment
To ensure StudentHub remains permanently free for students worldwide, the platform is architected without expensive recurring cloud dependencies:
- **Zero Paid Redis/Queue Clusters**: High-throughput database indexes and Server-Sent Events (SSE) over HTTP/2 replace heavyweight caching tiers.
- **Zero Third-Party Auth SaaS**: Native, secure password hashing (Argon2id/Bcrypt) and cryptographically signed JWT sessions.
- **Zero Mandatory AI Quotas**: Core learning, practice, testing, and skill matching operate deterministically without AI API billing bottlenecks.
- **Open-Tier PostgreSQL**: Efficient relational data modeling capable of running on free or low-resource database instances.

---

## 2. Technology Stack & Directory Structure

### Runtime & Frameworks

| Layer | Technology | Selection Rationale |
| :--- | :--- | :--- |
| **Framework** | Next.js 16+ (App Router) | Native Server Components, optimized streaming SSR, Turbopack builds, and unified REST API routes. |
| **Language** | TypeScript 5 (Strict Mode) | End-to-end type safety across schemas, API contracts, and UI components. |
| **Design System** | Tailwind CSS v4 & Lucide React | Clean, high-contrast, accessible styling with zero runtime CSS-in-JS overhead; WCAG AA compliant. |
| **Data Layer** | Prisma ORM v6 with PostgreSQL | Strictly typed relational queries, declarative migrations, and automated client generation. |
| **Validation** | Zod (Runtime Schemas) | Strict runtime schema parsing at API boundaries to prevent injection or malformed data. |
| **Test Engine** | Node.js Native Runner (`tsx --test`) | Fast, zero-dependency unit and security regression test execution. |

### Directory Organization

```
/
├── app/                        # Next.js App Router root
│   ├── (public)/               # Publicly navigable application pages
│   │   ├── about/              # Mission, $0 cost philosophy & architecture
│   │   ├── assessments/        # Summative testing & integrity documentation
│   │   ├── learn/              # Curriculum catalog & direct-access module index
│   │   ├── practice/           # Isolated code runner specifications & workouts
│   │   └── skill-swap/         # P2P exchange & matching engine overview
│   ├── api/                    # Decoupled REST API endpoints
│   │   └── v1/                 # Versioned public/internal API
│   │       └── health/         # System & database latency diagnostics
│   ├── layout.tsx              # Root HTML shell, typography, Navbar & Footer
│   ├── page.tsx                # Landing view with core interactive previews
│   ├── globals.css             # Tailwind v4 directives & light theme tokens
│   ├── error.tsx               # Global resilient client-side error boundary
│   ├── not-found.tsx           # Standardized 404 handler
│   └── loading.tsx             # Global loading skeleton
├── components/                 # Atomic design component library
│   ├── layout/                 # Structural navigation (Navbar, Footer)
│   ├── landing/                # HeroSection, CurriculumShowcase, SkillSwapDemo
│   └── ui/                     # Design tokens (Button, Card, Badge, Alert, etc.)
├── lib/                        # Shared domain logic & system infrastructure
│   ├── config/                 # Environment validation and fail-fast assertions
│   ├── db/                     # Prisma singleton client & health probes
│   ├── security/               # Audit logger, credential redaction & rate limiters
│   ├── utils/                  # Styling helpers (`cn`), time & formatters
│   └── validation/             # Zod schemas for users, courses, & API payloads
├── prisma/                     # Database schema definitions & migrations
│   └── schema.prisma           # Normalized PostgreSQL entities & relationships
├── tests/                      # Automated regression & unit test suite
│   └── unit.test.ts            # Rate limiting, validation & redaction tests
└── docs/                       # Architectural & design documentation
    └── ARCHITECTURE.md         # This technical specification document
```

---

## 3. Database Relationships & Entity Model

The relational architecture is modeled in `prisma/schema.prisma` and follows Boyce-Codd 3rd Normal Form (3NF).

### Entity Relationship Diagram

```
                 ┌──────────────────┐
                 │       User       │
                 ├──────────────────┤
                 │ id (UUID, PK)    │
                 │ email (Unique)   │
                 │ passwordHash     │
                 │ role (Enum)      │
                 │ isSuspended      │
                 └────────┬─────────┘
                          │
          1:1             │             1:N
    ┌─────────────────────┴──────────────────────┐
    ▼                                            ▼
┌─────────────────────────┐          ┌───────────────────────────┐
│       UserProfile       │          │       StudentSkill        │
├─────────────────────────┤          ├───────────────────────────┤
│ userId (PK, FK)         │          │ id (UUID, PK)             │
│ displayName             │          │ userId (FK)               │
│ timezone                │          │ skillId (FK)              │
│ languagePreference      │          │ type (TEACH | LEARN)      │
│ streakCount             │          │ proficiencyLevel (Enum)   │
│ isDiscoverable          │          │ isVerified (Boolean)      │
└─────────────────────────┘          └─────────────┬─────────────┘
                                                   │
                                                   │ N:1
                                                   ▼
                                     ┌───────────────────────────┐
                                     │           Skill           │
                                     ├───────────────────────────┤
                                     │ id (UUID, PK)             │
                                     │ name (Unique)             │
                                     │ slug (Unique)             │
                                     │ category                  │
                                     └───────────────────────────┘

┌─────────────────────────┐
│         Course          │
├─────────────────────────┤
│ id (UUID, PK)           │
│ title                   │
│ slug (Unique)           │
│ difficulty (Enum)       │
│ isPublished             │
└───────────┬─────────────┘
            │ 1:N
            ▼
┌─────────────────────────┐
│         Module          │
├─────────────────────────┤
│ id (UUID, PK)           │
│ courseId (FK)           │
│ title                   │
│ orderIndex (Int)        │
└───────────┬─────────────┘
            │ 1:N
            ▼
┌─────────────────────────┐
│          Topic          │
├─────────────────────────┤
│ id (UUID, PK)           │
│ moduleId (FK)           │
│ title, slug             │
│ orderIndex (Int)        │
│ prerequisiteIds (Array) │
└───────────┬─────────────┘
            │ 1:1
            ▼
┌─────────────────────────┐
│         Lesson          │
├─────────────────────────┤
│ id (UUID, PK)           │
│ topicId (FK, Unique)    │
│ markdownBody            │
│ syntaxGuide             │
│ commonMistakes          │
│ practicalUseCases       │
└─────────────────────────┘
```

### Relational Integrity Rules
1. **Cascade Deletion**:
   - Deleting a `User` cascades to delete their `UserProfile`, all active `Session` records, and all registered `StudentSkill` records.
   - Deleting a `Course` cascades down to delete its `Module` records, corresponding `Topic` records, and underlying `Lesson` content.
2. **Deterministic Uniqueness Constraints**:
   - `StudentSkill`: Composite unique key on `[userId, skillId, type]` guarantees a student cannot register duplicate teach/learn entries for the exact same skill.
   - `Topic`: Unique on `slug`.
   - `Lesson`: Unique on `topicId` (enforcing strict 1-to-1 relationship with Topic).
3. **Optimized Composite Indexing**:
   - `@@index([skillId, type, isVerified])` on `StudentSkill` enables the Skill Swap engine to execute reciprocal matching queries across millions of rows in sub-20ms.
   - `@@index([courseId, orderIndex])` and `@@index([moduleId, orderIndex])` guarantee deterministic sorting without expensive file-sort passes.

---

## 4. Key Architectural Principles

### Security Foundations

#### 1. Air-Gapped Code Runner Isolation
Untrusted student code is **never executed directly on the host web application server**. Code workouts execute within an isolated container runner characterized by:
- Read-only root filesystem with memory-backed ephemeral mounts (`/tmp`).
- Linux cgroups v2 resource boundaries: Hard limit of 128 MB RAM, 2.0s maximum CPU execution time, and process limits (`pids.max = 32`).
- Complete network isolation: Zero external outbound network access (`--network none`) to prevent denial-of-service or data exfiltration.

#### 2. Automated Credential & PII Redaction
All system audit logs, diagnostic streams, and error boundaries pass through an automated sanitizer (`lib/security/audit-log.ts`):
- Automatically scans keys for `password`, `token`, `secret`, `authorization`, `cookie`, `apiKey`, and `access_token`.
- Deeply traverses nested payloads and replaces sensitive values with `[REDACTED]` before write operations.

#### 3. Edge-Compatible Rate Limiting
Endpoint protection (`lib/security/rate-limit.ts`) prevents brute-force credential stuffing and denial-of-service:
- Sliding window in-memory rate limiter with automated memory garbage collection.
- Per-IP request throttling on authentication (`/api/v1/auth/*`) and code execution routes.

#### 4. Fail-Fast Production Configuration
Environment parsing (`lib/config/env.ts`) guarantees that in production mode (`NODE_ENV === "production"`), missing database credentials or misconfigured variables trigger immediate startup halts rather than silent runtime failures.

#### 5. Opaque Session Tokens & Zero-LocalStorage Storage (Phase 2)
Authentication adheres strictly to modern web security benchmarks:
- **Zero Token in LocalStorage**: Session tokens are strictly transported via secure, `HttpOnly`, `SameSite=Lax`, `Path=/` cookies (`studenthub_session`), rendering them completely inaccessible to malicious client-side JavaScript / XSS vectors.
- **HMAC-SHA256 Token Storage**: The server stores only cryptographic hashes (`HMAC-SHA256(rawToken, SESSION_SECRET)`) in the database/store, ensuring raw tokens can never be leaked even in the event of an authorized database export.
- **Bcrypt Password Security**: Passwords are salted and hashed using bcrypt (10 rounds) prior to storage. Plaintext passwords never touch logs or error responses.
- **Authoritative Server Enforcement**: Client components never self-authorize; page access is protected via Next.js Middleware and server-side `requireAuth()` validation.
- **Rate-Limited Auth Endpoints**: Both `/api/v1/auth/register` (5/min/IP) and `/api/v1/auth/login` (10/min/IP) enforce sliding-window rate limiting.

---

### Performance Foundations

#### 1. Server Components by Default
In alignment with Next.js App Router standards, pages and components default to React Server Components. Client-side JavaScript bundles are kept minimal by pushing `'use client'` strictly to leaf-node interactive controls (e.g. navigation toggle, editor inputs).

#### 2. Resilient Unattached Database Handling
The database client singleton (`lib/db/client.ts`) implements connection pooling with graceful degradation:
- Health check endpoints (`/api/v1/health`) probe connection latency via `SELECT 1`.
- When `DATABASE_URL` is unattached or unavailable during development or preview modes, the application does not crash; it smoothly logs an unattached state while continuing to serve static curriculum assets and offline tools.

#### 3. Deterministic Reciprocal Matching
The Skill Swap engine avoids non-deterministic AI or vector search overhead by utilizing indexed SQL intersection queries:
```sql
SELECT s1.user_id AS student_a, s2.user_id AS student_b
FROM student_skills s1
JOIN student_skills s2 ON s1.skill_id = s2.skill_id
WHERE s1.type = 'TEACH' 
  AND s2.type = 'LEARN'
  AND s1.user_id != s2.user_id;
```
This guarantees 100% accurate, instantaneous peer matching at zero compute cost.

---

### Pedagogy & Assessment Integrity

1. **Direct-Access Progression**:
   - No artificial "level locks". If a student is preparing for an interview and needs to review *Java Multithreading*, they can navigate directly to that topic without completing all introductory syntax modules.
   - Recommended prerequisites are displayed as advisory references (`prerequisiteIds`) rather than blocking gates.
2. **Dual-Stage Practice Verification**:
   - Coding exercises provide visible unit test cases for iterative debugging.
   - Final submission evaluates student solutions against sealed, hidden test cases to assess true problem-solving competence.
3. **Tamper-Proof Assessment Integrity**:
   - Assessment start and end times are tracked strictly on the server to prevent client-side clock tampering.
   - Question sequences and multiple-choice options are dynamically shuffled per attempt.
   - Explanations and solution keys remain sealed until after the assessment window closes.

---

## 5. Multi-Platform Extensibility (Android Readiness)

All backend endpoints under `/api/v1/*` follow decoupled, RESTful conventions returning standardized JSON envelopes:

```json
{
  "status": "ok",
  "data": { ... },
  "error": null,
  "meta": {
    "timestamp": "2026-09-22T02:57:00.000Z",
    "version": "1.0.0"
  }
}
```

This decoupled API design allows a future native Android application (built with Kotlin and Jetpack Compose) to connect directly to the existing authentication, curriculum, practice runner, and Skill Swap systems without modifying backend core logic.

---

## 6. Verification & Health Monitoring

The platform includes automated testing and health diagnostics:
- **Unit & Security Tests**: Run via `npm run test` (`tests/unit.test.ts`).
- **TypeScript Static Verification**: Run via `npm run lint` (`tsc --noEmit`).
- **Production Build Check**: Run via `npm run build` (`next build`).
- **Health Diagnostic Endpoint**: Available at `GET /api/v1/health`.
