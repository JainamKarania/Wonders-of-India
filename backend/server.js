import express from "express";
import cors from "cors";
// import authRoutes from "./routes/auth.routes.js";
import destinationRoutes from "./routes/destination.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// app.use("/api/auth", authRoutes);
app.use("/api/destinations", destinationRoutes);

app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});
