import { PACKAGE_DATA } from "../../data/destinations.data.js";

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  // Get host and protocol for generating full image URLs
  const host = req.headers.host;
  const protocol = req.headers["x-forwarded-proto"] || "https";
  const BASE_URL = `${protocol}://${host}/assets/packages/`;

  const formattedData = PACKAGE_DATA.map((item) => ({
    ...item,
    image: item.image ? BASE_URL + item.image : null,
  }));

  return res.status(200).json({
    success: true,
    count: formattedData.length,
    data: formattedData,
  });
}
