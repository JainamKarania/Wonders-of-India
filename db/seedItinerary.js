// Run once (and again whenever you update itinerary content):
// node --env-file=.env db/seedItinerary.js
//
// Fill in ITINERARY_SEED below with real content for your actual
// destinations. Each key must exactly match a `title` already in your
// destinations table (check Supabase → Table Editor → destinations for
// the exact spelling). Destinations not listed here just won't have a
// day-wise breakdown yet — that's fine, add them incrementally.

import "dotenv/config";
import { eq } from "drizzle-orm";
import { db } from "./client.js";
import { destinations, itineraryDays } from "./schema.js";

const ITINERARY_SEED = {
  // Example — replace with your real destination titles and real content.
  // "Jaipur Royal Heritage Tour": {
  //   duration: "4 Days / 3 Nights",
  //   days: [
  //     { title: "Arrival in Jaipur", description: "Check-in and evening at Bapu Bazaar." },
  //     { title: "Amber Fort & City Palace", description: "Guided heritage tour of Jaipur's forts." },
  //     { title: "Hawa Mahal & Local Markets", description: "Photography stop and shopping for local crafts." },
  //     { title: "Departure", description: "Breakfast and checkout." },
  //   ],
  // },
  "Mumbai City Lights Experience" : {
    duration: "3 Days / 2 Nights",
    days: [
        { title: "Arrival in Mumbai", description: "Check-in and evening at Marine Drive." },
        { title: "Gateway of India & Elephanta Caves", description: "Guided tour of the iconic Gateway and ferry to Elephanta Caves." },
        { title: "Chhatrapati Shivaji Terminus & Local Markets", description: "Photography stop and shopping for local crafts." },
        { title: "Departure", description: "Breakfast and checkout." },
    ],
  },
    "Ayodhya Divine Pilgrimage Tour" : {
    duration: "5 Days / 4 Nights",
    days: [
        { title: "Arrival in Ayodhya", description: "Check-in and evening at Ram Ki Paidi." },
        { title: "Hanuman Garhi & Kanak Bhawan", description: "Guided tour of the sacred temples." },
        { title: "Saryu River & Local Markets", description: "Photography stop and shopping for local crafts." },
        { title: "Ram Janmabhoomi & Departure", description: "Visit the birthplace of Lord Ram and checkout." },
    ],
    },
    "Ahemdabad Heritage Walk Tour" : {
    duration: "4 Days / 3 Nights",
    days: [
        { title: "Arrival in Ahmedabad", description: "Check-in and evening at Sabarmati Riverfront." },
        { title: "Sabarmati Ashram & Jama Masjid", description: "Guided tour of the historic sites." },
        { title: "Kankaria Lake & Local Markets", description: "Photography stop and shopping for local crafts." },
        { title: "Departure", description: "Breakfast and checkout." },
    ]
    },
    "Bangalore Urban Explorer Getaway" : {
    duration: "3 Days / 2 Nights",
    days: [
        { title: "Arrival in Bangalore", description: "Check-in and evening at MG Road." },
        { title: "Lalbagh Botanical Garden & Bangalore Palace", description: "Guided tour of the iconic landmarks." },
        { title: "Cubbon Park & Local Markets", description: "Photography stop and shopping for local crafts." },
        { title: "Departure", description: "Breakfast and checkout." },
    ]
    },
    "Agra Taj Mahal Golden Triangle Tour" : {
    duration: "4 Days / 3 Nights",
    days: [
        { title: "Arrival in Agra", description: "Check-in and evening at Taj Mahal." },    
    { title: "Agra Fort & Fatehpur Sikri", description: "Guided tour of the historic sites." },
    { title: "Mehtab Bagh & Local Markets", description: "Photography stop and shopping for local crafts." },
    { title: "Departure", description: "Breakfast and checkout." },
    ]
    },
    "Hyderabad Royal Nizam Experience"  : {
    duration: "3 Days / 2 Nights",
    days: [
        { title: "Arrival in Hyderabad", description: "Check-in and evening at Charminar." },
        { title: "Golconda Fort & Qutb Shahi Tombs", description: "Guided tour of the historic sites." },
        { title: "Hussain Sagar Lake & Local Markets", description: "Photography stop and shopping for local crafts." },
        { title: "Departure", description: "Breakfast and checkout." },
    ]
    },
    "Delhi Heritage & Culture Trail" : {
    duration: "4 Days / 3 Nights",
    days: [
        { title: "Arrival in Delhi", description: "Check-in and evening at India Gate." },
        { title: "Red Fort & Jama Masjid", description: "Guided tour of the historic sites." },
        { title: "Qutub Minar & Local Markets", description: "Photography stop and shopping for local crafts." },
        { title: "Departure", description: "Breakfast and checkout." },
    ]
    },
    "Kutch Desert Festival Tour" : {
    duration: "5 Days / 4 Nights",
    days: [
        { title: "Arrival in Kutch", description: "Check-in and evening at Rann of Kutch." },
        { title: "Kalo Dungar & White Desert", description: "Guided tour of the desert landscapes." },
        { title: "Mandvi Beach & Local Markets", description: "Photography stop and shopping for local crafts." },
        { title: "Departure", description: "Breakfast and checkout." },
    ]
    },   
};

async function run() {
  const titles = Object.keys(ITINERARY_SEED);

  if (titles.length === 0) {
    console.log("ITINERARY_SEED is empty — add real content before running this.");
    process.exit(0);
  }

  for (const title of titles) {
    const [destination] = await db
      .select()
      .from(destinations)
      .where(eq(destinations.title, title));

    if (!destination) {
      console.warn(`  ⚠ No destination found with title "${title}" — skipping. Check exact spelling in Supabase.`);
      continue;
    }

    const { duration, days } = ITINERARY_SEED[title];

    await db
      .update(destinations)
      .set({ duration })
      .where(eq(destinations.id, destination.id));

    // Clear any existing days for this destination before inserting, so
    // re-running this script after editing content doesn't duplicate rows.
    await db.delete(itineraryDays).where(eq(itineraryDays.destinationId, destination.id));

    await db.insert(itineraryDays).values(
      days.map((day, index) => ({
        destinationId: destination.id,
        dayNumber: index + 1,
        title: day.title,
        description: day.description,
      }))
    );

    console.log(`  ✓ ${title} (${days.length} days)`);
  }

  console.log("Done.");
  process.exit(0);
}

run().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});