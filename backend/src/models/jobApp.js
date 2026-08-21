import mongoose from "mongoose";
//create a schema
//create a model based off that schema

const jobSchema = new mongoose.Schema({
  position: {  
    type: String,
    required: true,
  },
  company: {
    type:String,
    required: true,
  },
  dateApplied: {
    type: Date,
    default:Date.now,
    required: true,
  },
  appStatus: {
    type: String,
    required:true,
    enum: ["Applied", "Interviewing", "Offer", "Rejected"],
    default: "Applied",
  }, 
  location: {
    type:String,
    trim:true,
  },
  jobUrl: {
    type:String,
    trim: true,
  },
  notes: {
    type:String,
    trim: true, 
  },
},
{
  timestamps:true, //createdAt and updatedAt
});

const jobApp = mongoose.model("Job Application", jobSchema);

export default jobApp;