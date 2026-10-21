import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./server/db/schema.js",
  out: "./server/drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DIRECT_URL,
  },
});