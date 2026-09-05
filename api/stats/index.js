import { STATS_DATA } from "../../data/stats.data.js";

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  return res.status(200).json({
    success: true,
    count: STATS_DATA.length,
    data: STATS_DATA,
  });
}