import "dotenv/config";
import { db } from "./client.js";
import { destinations } from "./schema.js";
import { PACKAGE_DATA } from "../data/destination.data.js";

async function seed() {
  console.log(`Seeding ${PACKAGE_DATA.length} destinations...`);

  const rows = PACKAGE_DATA.map((item) => ({
    title: item.title,
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