import { eq, asc } from "drizzle-orm";
import { db } from "../../db/client.js";
import { destinations, itineraryDays } from "../../db/schema.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  const { destinationId } = req.query;

  if (!destinationId) {
    return res.status(400).json({
      success: false,
      message: "destinationId is required.",
    });
  }

  try {
    const [destination] = await db
      .select()
      .from(destinations)
      .where(eq(destinations.id, Number(destinationId)));

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: "Destination not found.",
      });
    }

    const days = await db
      .select({
        dayNumber: itineraryDays.dayNumber,
        title: itineraryDays.title,
        description: itineraryDays.description,
      })
      .from(itineraryDays)
      .where(eq(itineraryDays.destinationId, destination.id))
      .orderBy(asc(itineraryDays.dayNumber));

    const host = req.headers.host;
    const protocol = req.headers["x-forwarded-proto"] || "https";
    const BASE_URL = `${protocol}://${host}/assets/packages/`;

    return res.status(200).json({
      success: true,
      data: {
        ...destination,
        image: destination.image ? BASE_URL + destination.image : null,
        days,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Failed to load itinerary.",
    });
  }
}