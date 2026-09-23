import { NextResponse } from "next/server";
import { checkDatabaseHealth } from "@/lib/db/client";

/**
 * Health check endpoint for StudentHub API.
 * Endpoint: GET /api/v1/health
 */
export async function GET() {
  const dbHealth = await checkDatabaseHealth();

  const responsePayload = {
    status: "ok",
    service: "studenthub",
    version: "1.0.0-phase1",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    database: {
      connected: dbHealth.connected,
      latencyMs: dbHealth.latencyMs,
      message: dbHealth.error ? dbHealth.error : "Database operational",
    },
  };

  return NextResponse.json(responsePayload, {
    status: 200,
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
