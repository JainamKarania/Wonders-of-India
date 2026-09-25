import { eq } from "drizzle-orm";
import { db } from "../../db/client.js";
import { bookings } from "../../db/schema.js";
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

  if (req.method !== "PATCH") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  const { status } = req.body ?? {};

  if (!status) {
    return res.status(400).json({
      success: false,
      message: "status is required.",
    });
  }

  try {
    const [existing] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, Number(id)));

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    if (existing.userId !== user.id) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to modify this booking.",
      });
    }

    const [updated] = await db
      .update(bookings)
      .set({ status })
      .where(eq(bookings.id, Number(id)))
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