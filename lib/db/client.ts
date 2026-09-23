import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

/**
 * Lazy Prisma client singleton preventing connection pool exhaustion in development.
 */
function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
}

export const prisma: PrismaClient = globalThis.prismaGlobal ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}

/**
 * Health check for database connectivity.
 * Returns { connected: boolean, latencyMs?: number, error?: string }
 * Never exposes raw credentials or internal database errors to clients.
 */
export async function checkDatabaseHealth(): Promise<{ connected: boolean; latencyMs?: number; error?: string }> {
  if (!process.env.DATABASE_URL) {
    return {
      connected: false,
      error: "DATABASE_URL not configured. Running in unattached database mode.",
    };
  }

  const start = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    return {
      connected: true,
      latencyMs: Date.now() - start,
    };
  } catch (err: unknown) {
    console.error("Database health check failed:", err instanceof Error ? err.message : err);
    return {
      connected: false,
      error: "Database connectivity currently unavailable.",
    };
  }
}
