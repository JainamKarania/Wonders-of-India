import { PARTNERS_DATA } from "../../data/partners.data.js";

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  return res.status(200).json({
    success: true,
    count: PARTNERS_DATA.length,
    data: PARTNERS_DATA,
  });
}