import "dotenv/config";
import { eq } from "drizzle-orm";
import { db } from "./client.js";
import { destinations, itineraryDays } from "./schema.js";

const SALVAGED_PACKAGES = [
  {
    title: "Mumbai City Lights Experience",
    locations: ["Mumbai"],
    price: 34999,
    discountedPrice: 27999,
    tag: "Best Seller",
    duration: null,
    days: [
      "Arrival & Gateway of India visit",
      "Bollywood studio tour & Marine Drive evening",
      "Colaba market exploration & departure",
    ],
  },
  {
    title: "Goa Sun & Sand Getaway",
    locations: ["Goa"],
    price: 29999,
    discountedPrice: 23999,
    tag: "Hot Deal",
    duration: null,
    days: [
      "Arrival & beach relaxation",
      "Water sports & local market exploration",
      "Sunset cruise & nightlife experience",
    ],
  },
  {
    title: "Royal Rajasthan Trail",
    locations: ["Jaipur", "Jodhpur", "Udaipur"],
    price: 42000,
    discountedPrice: 34999,
    tag: "Best Deal",
    duration: "3 Days / 2 Nights",
    days: [
      "Arrival & Jaipur City Palace tour",
      "Amber Fort, Jal Mahal & local bazaars",
      "Jodhpur – Mehrangarh Fort & Blue City walk",
    ],
  },
  {
    title: "Spiritual Varanasi Escape",
    locations: ["Varanasi", "Sarnath"],
    price: 18000,
    discountedPrice: 14999,
    tag: "Recommended",
    duration: "3 Days / 2 Nights",
    days: [
      "Arrival & evening Ganga Aarti",
      "Sunrise boat ride & Kashi temple walk",
      "Sarnath Buddhist circuit & departure",
    ],
  },
  {
    title: "Kerala Backwaters Serenity Escape",
    locations: ["Kerala Backwaters"],
    price: 36999,
    discountedPrice: 29999,
    tag: "Recommended",
    duration: null,
    days: [
      "Arrival & houseboat boarding",
      "Village tour & local culture experience",
      "Sunset cruise & backwater relaxation",
    ],
  },
  {
    title: "Ladakh High-Altitude Adventure",
    locations: ["Leh", "Pangong Lake", "Nubra Valley"],
    price: 49999,
    discountedPrice: 41999,
    tag: "Adventure",
    duration: null,
    days: [
      "Arrival & local sightseeing in Leh",
      "Monastery visits & Pangong Lake excursion",
      "Nubra Valley tour & departure",
    ],
  },
  {
    title: "Delhi Heritage & Culture Trail",
    locations: ["Delhi", "Red Fort", "Qutub Minar", "India Gate"],
    price: 26999,
    discountedPrice: 21999,
    tag: "Historic Icon",
    duration: null,
    days: [
      "Arrival & Red Fort tour",
      "Qutub Minar & Humayun's Tomb visit",
      "India Gate & local market exploration",
    ],
  },
  {
    title: "Himalayan Trekking Adventure",
    locations: ["Manali", "Trekking Routes", "Mountain Passes"],
    price: 39999,
    discountedPrice: 32999,
    tag: "Adventure",
    duration: null,
    days: [
      "Arrival & local sightseeing in Manali",
      "Trekking routes & mountain pass exploration",
      "Departure & cultural experience",
    ],
  },
];

function deriveTitle(dayString) {
  const [firstPart] = dayString.split(" & ");
  return firstPart.length < dayString.length ? firstPart : dayString;
}

async function run() {
  for (const pkg of SALVAGED_PACKAGES) {
    const [existing] = await db
      .select()
      .from(destinations)
      .where(eq(destinations.title, pkg.title));

    let destinationId = existing?.id;

    if (!existing) {
      const [inserted] = await db
        .insert(destinations)
        .values({
          title: pkg.title,
          locations: pkg.locations.join(", "),
          price: pkg.price,
          discountedPrice: pkg.discountedPrice,
          image: null,
          tag: pkg.tag,
          duration: pkg.duration,
        })
        .returning();
      destinationId = inserted.id;
      console.log(`  + Created destination: ${pkg.title}`);
    } else {
      console.log(`  = Destination already exists: ${pkg.title}`);
    }

    await db
      .delete(itineraryDays)
      .where(eq(itineraryDays.destinationId, destinationId));

    await db.insert(itineraryDays).values(
      pkg.days.map((dayString, index) => ({
        destinationId,
        dayNumber: index + 1,
        title: deriveTitle(dayString),
        description: dayString,
      }))
    );

    console.log(`    ✓ ${pkg.days.length} itinerary days added`);
  }

  console.log("Done.");
  process.exit(0);
}

run().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});