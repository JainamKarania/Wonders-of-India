import { SERVICES_DATA } from "../../data/services.data.js";

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  return res.status(200).json({
    success: true,
    count: SERVICES_DATA.length,
    data: SERVICES_DATA,
  });
}