import { desc, eq, sql, cosineDistance } from "drizzle-orm";
import { GoogleGenAI } from "@google/genai";
import { db } from "../../db/client.js";
import { destinations, bookings } from "../../db/schema.js";
import { getUserFromRequest } from "../lib/supabaseAdmin.js";

const VOYAGE_API_KEY = process.env.VOYAGE_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const EMBED_MODEL = "voyage-4-lite";
const EMBED_DIMENSIONS = 1024;
const CHAT_MODEL = "gemini-3.8-flash";
const TOP_K_DESTINATIONS = 5;
const MAX_HISTORY_TURNS = 10;

// Keep this below `maxDuration` in vercel.json so we always return a clean
// error ourselves instead of being killed by the platform mid-request.
const TIME_BUDGET_MS = 25000;
const EMBED_TIMEOUT_MS = 4000;
const MIN_TIME_FOR_RETRY_MS = 6000;
const MAX_RETRIES = 2;

const genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  const { message, history } = req.body ?? {};

  if (!message || typeof message !== "string") {
    return res.status(400).json({
      success: false,
      message: "A message is required.",
    });
  }

  const startedAt = Date.now();
  const remaining = () => TIME_BUDGET_MS - (Date.now() - startedAt);

  try {
    // Auth lookup and retrieval don't depend on each other, so run them
    // together instead of one after the other.
    const userPromise = getUserFromRequest(req).catch(() => null);
    const destinationsPromise = findRelevantDestinations(message);

    const user = await userPromise;
    const bookingsPromise = user
      ? getUserBookings(user.id).catch(() => [])
      : Promise.resolve([]);

    const [relevantDestinations, userBookings] = await Promise.all([
      destinationsPromise,
      bookingsPromise,
    ]);

    const systemPrompt = buildSystemPrompt(relevantDestinations, userBookings, user);

    const recentHistory = Array.isArray(history)
      ? history.slice(-MAX_HISTORY_TURNS)
      : [];

    const contents = [
      ...recentHistory,
      { role: "user", parts: [{ text: message }] },
    ];

    const response = await generateWithRetry(
      {
        model: CHAT_MODEL,
        contents,
        config: { systemInstruction: systemPrompt },
      },
      remaining
    );

    return res.status(200).json({
      success: true,
      reply: response.text,
    });
  } catch (err) {
    console.error(err);

    const timedOut = err?.name === "AbortError" || err?.name === "TimeoutError";

    return res.status(timedOut ? 504 : 500).json({
      success: false,
      message: timedOut
        ? "The assistant took too long to respond. Please try again."
        : "Failed to get a response. Please try again.",
    });
  }
}

async function generateWithRetry(params, remaining, attempt = 0) {
  const timeLeft = remaining();

  if (timeLeft <= 1000) {
    const err = new Error("Time budget exhausted");
    err.name = "TimeoutError";
    throw err;
  }

  try {
    return await genAI.models.generateContent({
      ...params,
      config: {
        ...params.config,
        abortSignal: AbortSignal.timeout(timeLeft - 500),
      },
    });
  } catch (err) {
    const isOverloaded =
      err?.status === "UNAVAILABLE" ||
      err?.code === 503 ||
      err?.error?.code === 503 ||
      /UNAVAILABLE|high demand/i.test(err?.message ?? "");

    if (isOverloaded && attempt < MAX_RETRIES && remaining() > MIN_TIME_FOR_RETRY_MS) {
      const waitMs = 1000 * (attempt + 1);
      console.log(`Gemini overloaded — retrying in ${waitMs}ms (retry ${attempt + 1})`);
      await new Promise((resolve) => setTimeout(resolve, waitMs));
      return generateWithRetry(params, remaining, attempt + 1);
    }

    throw err;
  }
}

async function embedQuery(text) {
  const res = await fetch("https://api.voyageai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${VOYAGE_API_KEY}`,
    },
    body: JSON.stringify({
      input: [text],
      model: EMBED_MODEL,
      // "query" (not "document") — Voyage recommends this asymmetric
      // mode for search queries vs. the content being searched over,
      // which improves retrieval quality.
      input_type: "query",
      output_dimension: EMBED_DIMENSIONS,
    }),
    signal: AbortSignal.timeout(EMBED_TIMEOUT_MS),
  });

  if (!res.ok) {
    throw new Error(`Voyage API error ${res.status}: ${await res.text()}`);
  }

  const data = await res.json();
  return data.data[0].embedding;
}

// Never throws: if embedding or the vector search fails (rate limit,
// slow response), fall back to a plain list of destinations so the chat
// still answers instead of timing out.
async function findRelevantDestinations(message) {
  try {
    const queryEmbedding = await embedQuery(message);
    return await getRelevantDestinations(queryEmbedding);
  } catch (err) {
    console.error("Retrieval failed, using fallback list:", err?.message ?? err);

    try {
      return await db
        .select({
          title: destinations.title,
          locations: destinations.locations,
          price: destinations.price,
          discountedPrice: destinations.discountedPrice,
          tag: destinations.tag,
        })
        .from(destinations)
        .limit(8);
    } catch (fallbackErr) {
      console.error("Fallback destinations query failed:", fallbackErr);
      return [];
    }
  }
}

async function getRelevantDestinations(queryEmbedding) {
  const similarity = sql`1 - (${cosineDistance(destinations.embedding, queryEmbedding)})`;

  return db
    .select({
      title: destinations.title,
      locations: destinations.locations,
      price: destinations.price,
      discountedPrice: destinations.discountedPrice,
      tag: destinations.tag,
      similarity,
    })
    .from(destinations)
    .orderBy((t) => desc(t.similarity))
    .limit(TOP_K_DESTINATIONS);
}

async function getUserBookings(userId) {
  return db
    .select({
      destinationTitle: destinations.title,
      travelDate: bookings.travelDate,
      status: bookings.status,
      totalPrice: bookings.totalPrice,
    })
    .from(bookings)
    .innerJoin(destinations, eq(bookings.destinationId, destinations.id))
    .where(eq(bookings.userId, userId))
    .orderBy(desc(bookings.createdAt))
    .limit(10);
}

function buildSystemPrompt(relevantDestinations, userBookings, user) {
  const destinationsBlock = relevantDestinations
    .map((d) => {
      const locations = Array.isArray(d.locations)
        ? d.locations.join(", ")
        : d.locations;
      const price = d.discountedPrice ?? d.price;
      return `- ${d.title} (${locations})${price ? ` — ₹${price}/person` : ""}${
        d.tag ? ` [${d.tag}]` : ""
      }`;
    })
    .join("\n");

  const bookingsBlock =
    user && userBookings.length > 0
      ? userBookings
          .map(
            (b) =>
              `- ${b.destinationTitle}, travel date ${new Date(
                b.travelDate
              ).toDateString()}, status: ${b.status}, total ₹${b.totalPrice}`
          )
          .join("\n")
      : null;

  return `You are the travel assistant for "Wonders of India", a travel agency site. Be warm, concise, and helpful. Only recommend destinations from the list below — never invent packages, prices, or destinations that aren't listed. If asked about something outside travel planning for this site, politely redirect to how you can help with trips.

Relevant destinations for this conversation:
${destinationsBlock || "(no closely matching destinations found)"}

${
  user
    ? bookingsBlock
      ? `This user is logged in as ${user.email} and has these bookings:\n${bookingsBlock}`
      : `This user is logged in as ${user.email} but has no bookings yet.`
    : "This visitor is not logged in — if they ask about their bookings, let them know they need to sign in first."
}`;
}