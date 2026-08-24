import express from "express";
import { breweries, internPostings } from "../controllers/externalJobsControllers.js";

const router = express.Router();

router.get("/internships", internPostings);

router.get("/breweries", breweries);

export default router;