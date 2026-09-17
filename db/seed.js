// Run once: `node db/seed.js`
// Populates the real Postgres `destinations` table from the existing
// static data file, so it stops being empty. After this runs
// successfully, api/destinations/index.js reads from Postgres instead —
// data/destination.data.js is no longer the live source of truth.

import "dotenv/config";
import { db } from "./client.js";
import { destinations } from "./schema.js";
import { PACKAGE_DATA } from "../data/destination.data.js";

async function seed() {
  console.log(`Seeding ${PACKAGE_DATA.length} destinations...`);

  const rows = PACKAGE_DATA.map((item) => ({
    title: item.title,
    // Schema stores locations as text — join if the source data has it
    // as an array (confirmed earlier that it does), store as-is if it's
    // already a string.
    locations: Array.isArray(item.locations)
      ? item.locations.join(", ")
      : item.locations,
    price: item.price ?? null,
    discountedPrice: item.discountedPrice ?? null,
    image: item.image ?? null,
    tag: item.tag ?? null,
  }));

  await db.insert(destinations).values(rows);

  console.log(`Done — inserted ${rows.length} rows.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});