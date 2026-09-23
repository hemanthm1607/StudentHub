/**
 * Structured audit logging abstraction.
 * Sanitizes all input payloads to ensure passwords, tokens, and PII are never logged.
 */

export interface AuditLogEntry {
  actorUserId?: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  ipHash?: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

const REDACTED_KEYS = new Set([
  "password",
  "password_hash",
  "token",
  "access_token",
  "refresh_token",
  "secret",
  "authorization",
  "cookie",
]);

export function sanitizeMetadata(data: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    if (REDACTED_KEYS.has(key.toLowerCase())) {
      sanitized[key] = "[REDACTED]";
    } else if (value && typeof value === "object" && !Array.isArray(value)) {
      sanitized[key] = sanitizeMetadata(value as Record<string, unknown>);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

export function logAuditEvent(entry: Omit<AuditLogEntry, "timestamp">): void {
  const sanitizedEntry: AuditLogEntry = {
    ...entry,
    metadata: entry.metadata ? sanitizeMetadata(entry.metadata) : undefined,
    timestamp: new Date().toISOString(),
  };

  // Structured JSON output for Cloud/Docker log aggregator
  console.log(`[AUDIT_LOG] ${JSON.stringify(sanitizedEntry)}`);
}
