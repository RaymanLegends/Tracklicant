import express from "express";
import {
  getAllJobs,
  getJobAppById,
  createJobApp,
  updateJobApp,
  deleteJobApp,
} from "../controllers/jobsControllers.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

// Apply protectRoute to all routes in this file
router.use(protectRoute);

router.get("/", getAllJobs);
router.get("/:id", getJobAppById);
router.post("/", createJobApp);
router.put("/:id", updateJobApp);
router.delete("/:id", deleteJobApp);

export default router;