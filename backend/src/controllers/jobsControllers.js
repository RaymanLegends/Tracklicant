import jobApp from "../models/jobApp.js";

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await jobApp.find().sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error in getAllJobs controller")
    res.status(500).json({message: "Internal server error"});
  }
};

export const getJobAppById = async (req, res) => {
  try {
    const jobs = await jobApp.findById(req.params.id);
    if (!jobs) {
      return res.status(404).json({message: "Job Application not found"});
    }
    res.status(200).json(jobs)
  } catch (error) {
    console.error("Error in getAllJobs controller")
    res.status(500).json({message: "Internal server error"});
  }
};

export const createJobApp = async(req, res) => {
  try {
    const {position, company, dateApplied, appStatus, location, jobUrl, notes} = req.body;

    if (!position || !company) {
      return res.status(400).json({message: "Position and Company are required fields"});
    }

    const newJob = new jobApp({
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
    console.log("Error in createJobApp controller");
    res.status(501).json({message:"Internal Server Error"})
  }
};

export const updateJobApp = async(req, res) => {
  try {
    const {position, company, dateApplied, appStatus, location, jobUrl, notes} = req.body;

    const updatedJobApp = await jobApp.findByIdAndUpdate(req.params.id, {position, company, dateApplied, appStatus, location, jobUrl, notes}, {new: true});

    if (!updatedJobApp) {
      return res.status(404).json({message: "Job Application not found"})
    }

    res.status(200).json(updatedJobApp)
  } catch (error) {
    console.log("Error in updateJobApp controller");
    res.status(501).json({message: "Internal Server Error"});
  }
};

export const deleteJobApp = async(req, res) => {
  try {
    const deletedJobApp = await jobApp.findByIdAndDelete(req.params.id);

    if (!deletedJobApp) {
      return res.status(404).json({message: "Job Application not found"});
    }

    res.status(200).json({message:"Deleted Job Application"})

  } catch (error) {
    console.log("Error in deleteJobApp controller");
    res.status(501).json({message: "Internal server error"});
  }
}