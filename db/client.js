import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema.js";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Missing DATABASE_URL — check your Vercel/local env.");
}

const globalForDb = globalThis;

const client =
  globalForDb.__postgresClient ??
  postgres(connectionString, {
    prepare: false,
    max: 1,
    connect_timeout: 5,
    idle_timeout: 20,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__postgresClient = client;
}

export const db = drizzle(client, { schema });