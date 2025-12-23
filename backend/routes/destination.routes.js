import express from "express";
import destinations from "../data/destination.data.js";

const router = express.Router();

/**
 * GET /api/destinations
 */
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    count: destinations.length,
    data: destinations,
  });
});

export default router;
