import express from "express";
import {getAllJobs, getJobAppById, createJobApp, updateJobApp, deleteJobApp} from "../controllers/jobsControllers.js";

const router = express.Router();

router.get("/", getAllJobs);

router.get("/:id", getJobAppById);

router.post("/", createJobApp);

router.put("/:id", updateJobApp);

router.delete("/:id", deleteJobApp);

//build api - defines get endpoint /api/jobs, request and response params, res.send sends something back to whoever made the request. this api listens for get requests

export default router;