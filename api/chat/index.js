import { desc, eq, sql, cosineDistance } from "drizzle-orm";
import { GoogleGenAI } from "@google/genai";
import { db } from "../../db/client.js";
import { destinations, bookings } from "../../db/schema.js";
import { getUserFromRequest } from "../lib/supabaseAdmin.js";

const VOYAGE_API_KEY = process.env.VOYAGE_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const EMBED_MODEL = "voyage-4-lite";
const EMBED_DIMENSIONS = 1024;
const CHAT_MODEL = "gemini-2.5-pro";
const TOP_K_DESTINATIONS = 5;

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

  try {
    const queryEmbedding = await embedQuery(message);
    const relevantDestinations = await getRelevantDestinations(queryEmbedding);

    // No auth required — chat works for anonymous visitors too. If a
    // valid session is present, pull their recent bookings in as extra
    // context so the model can answer "what did I book" style questions
    // without needing a separate tool-call round trip.
    const user = await getUserFromRequest(req);
    const userBookings = user ? await getUserBookings(user.id) : [];

    const systemPrompt = buildSystemPrompt(relevantDestinations, userBookings, user);

    const contents = [
      ...(Array.isArray(history) ? history : []),
      { role: "user", parts: [{ text: message }] },
    ];

    const response = await genAI.models.generateContent({
      model: CHAT_MODEL,
      contents,
      config: { systemInstruction: systemPrompt },
    });

    return res.status(200).json({
      success: true,
      reply: response.text,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Failed to get a response. Please try again.",
    });
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
  });

  if (!res.ok) {
    throw new Error(`Voyage API error ${res.status}: ${await res.text()}`);
  }

  const data = await res.json();
  return data.data[0].embedding;
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