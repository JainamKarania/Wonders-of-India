import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema.js";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Missing DATABASE_URL — check your Vercel/local env.");
}

const globalForDb = globalThis;

// `prepare: false` is required when using Supabase's pooled (pgbouncer)
// connection in transaction mode — pgbouncer doesn't support prepared
// statements being reused across pooled connections.
const client =
  globalForDb.__postgresClient ??
  postgres(connectionString, { prepare: false });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__postgresClient = client;
}

export const db = drizzle(client, { schema });