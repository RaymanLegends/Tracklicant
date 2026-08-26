import mongoose from "mongoose";

const prepSchema = new mongoose.Schema({
  userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    problemId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    leetcodeUrl: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    timesPracticed: {
      type: Number,
      default: 0,
    },
    lastPracticedAt: {
      type: Date,
      default: null,
    },
    confidence: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    notes: {
      type: String,
      default: "",
    },
  }, {
    timestamps:true
  }
);

prepSchema.index({ userId: 1, problemId: 1 }, { unique: true });

const prep = mongoose.model("ProblemLog", prepSchema);

export default prep;