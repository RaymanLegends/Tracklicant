import jobApp from "../models/jobApp.js";

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await jobApp
      .find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error in getAllJobs controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getJobAppById = async (req, res) => {
  try {
    const jobs = await jobApp.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!jobs) {
      return res.status(404).json({ message: "Job Application not found" });
    }
    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error in getJobAppById controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createJobApp = async (req, res) => {
  try {
    const {
      position,
      company,
      dateApplied,
      appStatus,
      location,
      jobUrl,
      notes,
    } = req.body;

    if (!position || !company) {
      return res
        .status(400)
        .json({ message: "Position and Company are required fields" });
    }

    const newJob = new jobApp({
      userId: req.user._id,
      position,
      company,
      dateApplied,
      appStatus,
      location,
      jobUrl,
      notes,
    });

    const savedJobApp = await newJob.save();

    res.status(201).json(savedJobApp);
  } catch (error) {
    console.error("Error in createJobApp controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateJobApp = async (req, res) => {
  try {
    const {
      position,
      company,
      dateApplied,
      appStatus,
      location,
      jobUrl,
      notes,
    } = req.body;

    const updatedJobApp = await jobApp.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { position, company, dateApplied, appStatus, location, jobUrl, notes },
      { returnDocument: "after" }
    );

    if (!updatedJobApp) {
      return res.status(404).json({ message: "Job Application not found" });
    }

    res.status(200).json(updatedJobApp);
  } catch (error) {
    console.error("Error in updateJobApp controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteJobApp = async (req, res) => {
  try {
    const deletedJobApp = await jobApp.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!deletedJobApp) {
      return res.status(404).json({ message: "Job Application not found" });
    }

    res.status(200).json({ message: "Deleted Job Application" });
  } catch (error) {
    console.error("Error in deleteJobApp controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};