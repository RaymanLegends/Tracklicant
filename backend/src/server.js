import express from "express"
import cors from "cors";
import jobsRoutes from "./routes/jobsRoutes.js";
import {connectDB} from "./config/db.js";
import dotenv from "dotenv";
import { rateLimiter } from "./middleware/rateLimiter.js";

dotenv.config();

const app = express();

const port = process.env.PORT || 5001;

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"]
}));

//middleware
app.use(express.json()); //middleware will parse json bodies

//our simple custom middleware
// app.use((req, res, next) => {
//   console.log(`req method is ${req.method} & req url is ${req.url}`);
//   next();
// })

app.use(rateLimiter);

app.use("/api/jobs", jobsRoutes);

connectDB().then(() => {
  app.listen(5001, () => {     //app.listen tells express to start listening for incoming http requests on a specific port
    console.log("server started on port: ", port);
  });
});
