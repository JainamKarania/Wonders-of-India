import { db } from "../../db/client.js";
import { destinations } from "../../db/schema.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    const rows = await db.select().from(destinations);

    const host = req.headers.host;
    const protocol = req.headers["x-forwarded-proto"] || "https";
    const BASE_URL = `${protocol}://${host}/assets/packages/`;

    const formattedData = rows.map((item) => ({
      ...item,
      image: item.image ? BASE_URL + item.image : null,
    }));

    return res.status(200).json({
      success: true,
      count: formattedData.length,
      data: formattedData,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Failed to load destinations.",
    });
  }
}