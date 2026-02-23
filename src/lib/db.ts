import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("❌ DATABASE_URL is not configured!");
} else {
  console.log("🔗 Connecting to database...");
}

const sql = neon(databaseUrl!);

export const db = drizzle({ client: sql, schema });

console.log("✅ Database connection established");

