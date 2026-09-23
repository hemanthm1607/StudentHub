import { z } from "zod";

/**
 * Validated environment schema.
 * Ensures the platform fails fast if required production environment variables are missing.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().url().optional().or(z.literal("")),
  APP_URL: z.string().optional().default("http://localhost:3000"),
  GEMINI_API_KEY: z.string().optional(),
  SESSION_SECRET: z.string().min(16).optional().default("studenthub-dev-session-secret-at-least-32-chars!"),
});

export type EnvConfig = z.infer<typeof envSchema>;

let parsedEnv: EnvConfig;

try {
  parsedEnv = envSchema.parse({
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    APP_URL: process.env.APP_URL,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    SESSION_SECRET: process.env.SESSION_SECRET,
  });
} catch (error) {
  if (process.env.NODE_ENV === "production") {
    console.error("Critical environment variable validation failed:", error);
    throw new Error("Invalid application environment configuration.");
  } else {
    // In development, fall back with default safe values
    parsedEnv = {
      NODE_ENV: "development",
      DATABASE_URL: process.env.DATABASE_URL || "",
      APP_URL: process.env.APP_URL || "http://localhost:3000",
      GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
      SESSION_SECRET: process.env.SESSION_SECRET || "studenthub-dev-session-secret-at-least-32-chars!",
    };
  }
}

export const env = parsedEnv;
