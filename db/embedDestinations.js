import "dotenv/config";
import { eq } from "drizzle-orm";
import { db } from "./client.js";
import { destinations } from "./schema.js";

const VOYAGE_API_KEY = process.env.VOYAGE_API_KEY;
const MODEL = "voyage-4-lite";
const DIMENSIONS = 1024;

async function embedText(text, attempt = 1) {
  const res = await fetch("https://api.voyageai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${VOYAGE_API_KEY}`,
    },
    body: JSON.stringify({
      input: [text],
      model: MODEL,
      input_type: "document",
      output_dimension: DIMENSIONS,
    }),
  });

  if (res.status === 429) {
    if (attempt > 5) {
      throw new Error("Voyage API rate limit — too many retries, giving up.");
    }
    const waitSeconds = 25 * attempt;
    console.log(`  Rate limited — waiting ${waitSeconds}s before retry...`);
    await sleep(waitSeconds * 1000);
    return embedText(text, attempt + 1);
  }

  if (!res.ok) {
    throw new Error(`Voyage API error ${res.status}: ${await res.text()}`);
  }

  const data = await res.json();
  return data.data[0].embedding;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function run() {
  if (!VOYAGE_API_KEY) {
    throw new Error("Missing VOYAGE_API_KEY — check your .env file.");
  }

  const rows = await db.select().from(destinations);
  console.log(`Embedding ${rows.length} destinations...`);

  for (const dest of rows) {
    // Combine the fields that actually describe the destination into one
    // string — this is what similarity search will match against later.
    const text = [dest.title, dest.locations, dest.tag]
      .filter(Boolean)
      .join(". ");

    const embedding = await embedText(text);

    await db
      .update(destinations)
      .set({ embedding })
      .where(eq(destinations.id, dest.id));

    console.log(`  ✓ ${dest.title}`);

    // Free-tier accounts (no payment method on file) are capped at 3
    // requests per minute — space requests out to stay under that
    // proactively, rather than only reacting to 429s after they happen.
    await sleep(21000);
  }

  console.log("Done.");
  process.exit(0);
}

run().catch((err) => {
  console.error("Embedding failed:", err);
  process.exit(1);
});