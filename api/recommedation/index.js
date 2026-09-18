import { eq, ne, inArray, notInArray, desc, sql, cosineDistance } from "drizzle-orm";
import { db } from "../../db/client.js";
import { destinations, bookings } from "../../db/schema.js";
import { getUserFromRequest } from "../lib/supabaseadmin.js";

const LIMIT = 4;

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  const { destinationId } = req.query;
  // No auth required for this endpoint — a missing/invalid token just
  // means personalized recommendations are skipped, not a 401. Anonymous
  // visitors still get "similar to this destination" results.
  const user = await getUserFromRequest(req);

  const host = req.headers.host;
  const protocol = req.headers["x-forwarded-proto"] || "https";
  const BASE_URL = `${protocol}://${host}/assets/packages/`;
  const withImageUrl = (row) => ({
    ...row,
    image: row.image ? BASE_URL + row.image : null,
  });

  try {
    const [similar, personalized] = await Promise.all([
      destinationId
        ? getSimilarToDestination(Number(destinationId))
        : Promise.resolve([]),
      user
        ? getPersonalizedRecommendations(
            user.id,
            destinationId ? Number(destinationId) : null
          )
        : Promise.resolve([]),
    ]);

    return res.status(200).json({
      success: true,
      similar: similar.map(withImageUrl),
      personalized: personalized.map(withImageUrl),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Failed to load recommendations.",
    });
  }
}

const SELECT_FIELDS = {
  id: destinations.id,
  title: destinations.title,
  locations: destinations.locations,
  image: destinations.image,
  price: destinations.price,
  discountedPrice: destinations.discountedPrice,
  tag: destinations.tag,
};

async function getSimilarToDestination(destinationId) {
  const [target] = await db
    .select()
    .from(destinations)
    .where(eq(destinations.id, destinationId));

  // No destination found, or it hasn't been embedded yet — return empty
  // rather than erroring, since this is a "nice to have" section.
  if (!target || !target.embedding) return [];

  const similarity = sql`1 - (${cosineDistance(destinations.embedding, target.embedding)})`;

  return db
    .select({ ...SELECT_FIELDS, similarity })
    .from(destinations)
    .where(ne(destinations.id, destinationId))
    .orderBy((t) => desc(t.similarity))
    .limit(LIMIT);
}

async function getPersonalizedRecommendations(userId, excludeId) {
  const userBookings = await db
    .select({ destinationId: bookings.destinationId })
    .from(bookings)
    .where(eq(bookings.userId, userId));

  const bookedIds = [...new Set(userBookings.map((b) => b.destinationId))];
  if (bookedIds.length === 0) return [];

  const bookedDestinations = await db
    .select({ embedding: destinations.embedding })
    .from(destinations)
    .where(inArray(destinations.id, bookedIds));

  const embeddings = bookedDestinations.map((d) => d.embedding).filter(Boolean);
  if (embeddings.length === 0) return [];

  // A simple average of everywhere the user has already booked, used as
  // their "taste profile" vector for similarity search.
  const profileVector = averageVectors(embeddings);
  const similarity = sql`1 - (${cosineDistance(destinations.embedding, profileVector)})`;

  const excludeIds = excludeId ? [...bookedIds, excludeId] : bookedIds;

  return db
    .select({ ...SELECT_FIELDS, similarity })
    .from(destinations)
    .where(notInArray(destinations.id, excludeIds))
    .orderBy((t) => desc(t.similarity))
    .limit(LIMIT);
}

function averageVectors(vectors) {
  const length = vectors[0].length;
  const sums = new Array(length).fill(0);

  for (const v of vectors) {
    for (let i = 0; i < length; i++) sums[i] += v[i];
  }

  return sums.map((s) => s / vectors.length);
}