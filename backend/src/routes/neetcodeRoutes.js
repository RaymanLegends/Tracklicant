import express from "express";

import {
  logProblem,
  getNewProblem,
  getDoneProblem,
  getAllProblems,
} from "../controllers/prepControllers.js";

import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.use(protectRoute);

router.get("/all", getAllProblems);
router.get("/random-review", getDoneProblem);
router.get("/random-new", getNewProblem);
router.post("/log", logProblem);

export default router;