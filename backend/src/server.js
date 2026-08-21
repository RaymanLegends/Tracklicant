import express from "express";
import cors from "cors";
import jobsRoutes from "./routes/jobsRoutes.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import { rateLimiter } from "./middleware/rateLimiter.js";
import path from "path";

dotenv.config();

const app = express();

const port = process.env.PORT || 5001;

const __dirname = path.resolve();

// Middleware
if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: ["http://localhost:5173", "http://localhost:5174"],
    })
  );
}

app.use(express.json()); // Middleware to parse JSON bodies

app.use(rateLimiter);

// API Routes
app.use("/api/jobs", jobsRoutes);

// Production Static Serving
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  // Express 5 compatible catch-all for SPA client-side routing
  app.use((req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
  });
}

connectDB().then(() => {
  app.listen(port, () => {
    console.log("Server started on port:", port);
  });
});