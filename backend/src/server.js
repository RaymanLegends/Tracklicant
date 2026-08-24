import express from "express";
import cors from "cors";
import jobsRoutes from "./routes/jobsRoutes.js";
import externalJobsRoutes from "./routes/externalJobRoutes.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import { rateLimiter } from "./middleware/rateLimiter.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();

const port = process.env.PORT || 5001;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendDist = path.resolve(__dirname, "../../frontend/dist");

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
app.use("/api/external-jobs", externalJobsRoutes);

// Serve the built frontend when running the backend directly.
app.use(express.static(frontendDist));

// Express 5 compatible catch-all for SPA client-side routing
app.use((req, res) => {
  res.sendFile(path.join(frontendDist, "index.html"));
});

connectDB().then(() => {
  app.listen(port, () => {
    console.log("Server started on port:", port);
  });
});