import { eq, sql } from "drizzle-orm";
import { db } from "../../db/client.js";
import { bookings, travelers, destinations } from "../../db/schema.js";
import { getUserFromRequest } from "../lib/supabaseAdmin.js";

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
  const { fromCity, destinationId } = req.body ?? {};

  if (existing.status !== "confirmed") {
    return res.status(400).json({
      success: false,
      message: "Only confirmed bookings can be changed.",
    });
  }

  const nextFromCity = typeof fromCity === "string" ? fromCity.trim() : "";
  const nextDestinationId = Number(destinationId);

  if (!nextFromCity || !nextDestinationId) {
    return res.status(400).json({
      success: false,
      message: "A boarding station and a destination are required.",
    });
  }

  try {
    const [destination] = await db
      .select()
      .from(destinations)
      .where(eq(destinations.id, nextDestinationId));

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: "That destination doesn't exist.",
      });
    }

    const [{ count }] = await db
      .select({ count: sql`count(*)::int` })
      .from(travelers)
      .where(eq(travelers.bookingId, existing.id));

    // Price is recalculated from the (possibly new) destination and the
    // existing traveler count, never trusted from the client.
    const perPerson = destination.discountedPrice ?? destination.price ?? 0;
    const totalPrice = perPerson * Math.max(count, 1);

    const [updated] = await db
      .update(bookings)
      .set({
        fromCity: nextFromCity,
        destinationId: destination.id,
        totalPrice,
      })
      .where(eq(bookings.id, existing.id))
      .returning();

    return res.status(200).json({
      success: true,
      data: { ...updated, destination },
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