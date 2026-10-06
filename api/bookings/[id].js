import { eq } from "drizzle-orm";
import { db } from "../../db/client.js";
import { bookings, travelers, destinations } from "../../db/schema.js";
import { getUserFromRequest } from "../lib/supabaseadmin.js";

export default async function handler(req, res) {
  const user = await getUserFromRequest(req);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "You must be signed in.",
    });
  }

  const { id } = req.query;
  const bookingId = Number(id);

  let existing;
  try {
    [existing] = await db.select().from(bookings).where(eq(bookings.id, bookingId));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Failed to load booking." });
  }

  if (!existing) {
    return res.status(404).json({
      success: false,
      message: "Booking not found.",
    });
  }

  if (existing.userId !== user.id) {
    return res.status(403).json({
      success: false,
      message: "You don't have permission to access this booking.",
    });
  }

  if (req.method === "GET") return handleGet(req, res, existing);
  if (req.method === "PUT") return handlePut(req, res, existing);
  if (req.method === "PATCH") return handlePatch(req, res, existing);
  if (req.method === "DELETE") return handleDelete(req, res, existing);

  return res.status(405).json({
    success: false,
    message: "Method not allowed",
  });
}

async function handleGet(req, res, existing) {
  try {
    const [destination] = await db
      .select()
      .from(destinations)
      .where(eq(destinations.id, existing.destinationId));

    const bookingTravelers = await db
      .select()
      .from(travelers)
      .where(eq(travelers.bookingId, existing.id));

    return res.status(200).json({
      success: true,
      data: { ...existing, destination, travelers: bookingTravelers },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Failed to load booking.",
    });
  }
}

async function handlePut(req, res, existing) {
  const { travelDate, fromCity, travelers: travelerList } = req.body ?? {};

  if (!travelDate || !Array.isArray(travelerList) || travelerList.length === 0) {
    return res.status(400).json({
      success: false,
      message: "travelDate and at least one traveler are required.",
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
      .where(eq(destinations.id, existing.destinationId));

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: "The destination for this booking no longer exists.",
      });
    }

    // Recalculated here too — editing the traveler list changes what the
    // correct total should be, so it can never be trusted from the client.
    const perPerson = destination.discountedPrice ?? destination.price ?? 0;
    const totalPrice = perPerson * travelerList.length;

    const [updated] = await db
      .update(bookings)
      .set({
        travelDate: new Date(travelDate),
        fromCity: fromCity ?? null,
        totalPrice,
      })
      .where(eq(bookings.id, existing.id))
      .returning();

    // Replace-all for travelers rather than diffing individual
    // add/edit/remove operations — simpler, and mirrors how creation
    // already inserts the whole list at once.
    await db.delete(travelers).where(eq(travelers.bookingId, existing.id));

    const insertedTravelers = await db
      .insert(travelers)
      .values(
        travelerList.map((t) => ({
          bookingId: existing.id,
          name: t.name,
          age: t.age ? Number(t.age) : null,
          gender: t.gender ?? null,
          mobile: t.mobile ?? null,
        }))
      )
      .returning();

    return res.status(200).json({
      success: true,
      data: { ...updated, travelers: insertedTravelers },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Failed to update booking.",
    });
  }
}

async function handlePatch(req, res, existing) {
  const { status } = req.body ?? {};

  if (!status) {
    return res.status(400).json({
      success: false,
      message: "status is required.",
    });
  }

  try {
    const [updated] = await db
      .update(bookings)
      .set({ status })
      .where(eq(bookings.id, existing.id))
      .returning();

    return res.status(200).json({ success: true, data: updated });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Failed to update booking.",
    });
  }
}

async function handleDelete(req, res, existing) {
  try {
    // travelers.booking_id has onDelete: "cascade" in the schema, so this
    // automatically removes the booking's travelers too — no manual
    // cleanup needed.
    await db.delete(bookings).where(eq(bookings.id, existing.id));

    return res.status(200).json({
      success: true,
      message: "Booking deleted.",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Failed to delete booking.",
    });
  }
}