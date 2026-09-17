import { eq, desc } from "drizzle-orm";
import { db } from "../../db/client.js";
import { bookings, travelers, destinations } from "../../db/schema.js";
import { getUserFromRequest } from "../lib/supabaseAdmin.js";

export default async function handler(req, res) {
  const user = await getUserFromRequest(req);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "You must be signed in to manage bookings.",
    });
  }

  if (req.method === "GET") {
    return handleGet(req, res, user);
  }

  if (req.method === "POST") {
    return handlePost(req, res, user);
  }

  return res.status(405).json({
    success: false,
    message: "Method not allowed",
  });
}

async function handleGet(req, res, user) {
  try {
    const rows = await db
      .select({
        id: bookings.id,
        fromCity: bookings.fromCity,
        travelDate: bookings.travelDate,
        totalPrice: bookings.totalPrice,
        status: bookings.status,
        createdAt: bookings.createdAt,
        destination: {
          id: destinations.id,
          title: destinations.title,
          locations: destinations.locations,
          image: destinations.image,
          price: destinations.price,
          discountedPrice: destinations.discountedPrice,
        },
      })
      .from(bookings)
      .innerJoin(destinations, eq(bookings.destinationId, destinations.id))
      .where(eq(bookings.userId, user.id))
      .orderBy(desc(bookings.createdAt));

    // Attach travelers for each booking. Simple N+1 for now — fine at
    // this scale (a user's own booking list), worth revisiting with a
    // join if booking history ever gets large.
    const withTravelers = await Promise.all(
      rows.map(async (booking) => {
        const bookingTravelers = await db
          .select()
          .from(travelers)
          .where(eq(travelers.bookingId, booking.id));
        return { ...booking, travelers: bookingTravelers };
      })
    );

    return res.status(200).json({
      success: true,
      count: withTravelers.length,
      data: withTravelers,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Failed to load bookings.",
    });
  }
}

async function handlePost(req, res, user) {
  const { destinationId, fromCity, travelDate, travelers: travelerList } =
    req.body ?? {};

  if (!destinationId || !travelDate || !Array.isArray(travelerList) || travelerList.length === 0) {
    return res.status(400).json({
      success: false,
      message: "destinationId, travelDate, and at least one traveler are required.",
    });
  }

  for (const t of travelerList) {
    if (!t.name) {
      return res.status(400).json({
        success: false,
        message: "Every traveler needs a name.",
      });
    }
  }

  try {
    const [destination] = await db
      .select()
      .from(destinations)
      .where(eq(destinations.id, Number(destinationId)));

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: "That destination no longer exists.",
      });
    }

    // Price is always computed here from the real destination record —
    // never trust a total sent by the client. Falls back to price if
    // discountedPrice isn't set.
    const perPerson = destination.discountedPrice ?? destination.price ?? 0;
    const totalPrice = perPerson * travelerList.length;

    const [newBooking] = await db
      .insert(bookings)
      .values({
        userId: user.id,
        destinationId: destination.id,
        fromCity: fromCity ?? null,
        travelDate: new Date(travelDate),
        totalPrice,
        status: "confirmed",
      })
      .returning();

    const insertedTravelers = await db
      .insert(travelers)
      .values(
        travelerList.map((t) => ({
          bookingId: newBooking.id,
          name: t.name,
          age: t.age ? Number(t.age) : null,
          gender: t.gender ?? null,
          mobile: t.mobile ?? null,
        }))
      )
      .returning();

    return res.status(201).json({
      success: true,
      data: { ...newBooking, travelers: insertedTravelers },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Failed to create booking.",
    });
  }
}