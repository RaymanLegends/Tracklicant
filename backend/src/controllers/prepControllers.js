import prep from "../models/prepModel.js";
import {NEETCODE} from "../data/neetcode150.js";

export const getAllProblems = async(req, res) => {
  try {
    const userLogs = await prep
      .find({userId: req.user._id}) //returns an array


    const results = [];

    for (let i = 0; i < NEETCODE.length; i++) {
      const problem = NEETCODE[i];

      let foundLog = null;

      for (let j = 0; j < userLogs.length; j++) {
        if (userLogs[j].problemId === problem.problemId) {
          foundLog = userLogs[j]; 
          break;
        }
      }

      if (foundLog) {
        results.push({
          id: problem.problemId,
          title: problem.title,
          category: problem.category,
          difficulty: problem.difficulty,
          leetcodeUrl: problem.leetcodeUrl,
          completed: foundLog.completed,
          timesPracticed: foundLog.timesPracticed,
          lastPracticedAt: foundLog.lastPracticedAt,
          confidence: foundLog.confidence,
          notes: foundLog.notes,
        })
      } else {
        results.push({
          id: problem.problemId,
          title: problem.title,
          category: problem.category,
          difficulty: problem.difficulty,
          leetcodeUrl: problem.leetcodeUrl,
          completed: false,
          timesPracticed: 0,
          lastPracticedAt: null,
          confidence: "Medium",
          notes: "",
        });
      }
    }
    res.status(200).json(results);

  } catch (error) {
    console.log("error in getAllProblems in prepControllers: ", error);
    res.status(500).json({message: "error in prepControllers getAllProblems"});
  }
}

export const getDoneProblem = async(req, res) => {
  try {
    const userDone = await prep
      .find({userId: req.user._id, completed: true});

    if (userDone.length === 0) {
      return res.status(404).json({message:"No completed problems to review"});
    } else {
      const r = Math.floor(Math.random() * userDone.length);

      const chosenProblem = userDone[r];
      res.status(200).json(chosenProblem);
    } 
  } catch (error) {
    console.log("error in prepControllers.js getDoneProblem: ", error);
    res.status(500).json({message:"error in getDoneProblem prepControllers"});
  }
}

export const getNewProblem = async(req, res) => {
  try {
    const difficulty = req.query.difficulty;

    //userDone is an array, mongo's .find returns 
    //an array of every mongo entry that satisfies those requirements
    const userDone = await prep
      .find({userId: req.user._id, completed: true});

    //an array of user already completed problems
    const completed = [];
    for (let i = 0; i < userDone.length; i++) {
      completed.push(userDone[i].problemId); //adds by problemId, userDone has 
                                            //all the schema fields
    }

    const availableProblems = [];
    for (let i = 0; i < NEETCODE.length; i++) {
      const problem = NEETCODE[i];  //neetcode array of objects

      let matchesDiff = false;
      if (!difficulty) {
        matchesDiff = true;
      } else if (problem.difficulty === difficulty) {
        matchesDiff = true;
      } else {matchesDiff = false;}

      let userCompleted = false;
      if (completed.includes(problem.problemId)) {
        userCompleted = true;
      }

      if (!userCompleted && matchesDiff) {
        availableProblems.push(problem);
      };
    }

    if (availableProblems.length === 0) {
      res.status(404).json({message:"no more new problems"});
    }

    const r = Math.floor(Math.random() * availableProblems.length);
    const chosenProblem = availableProblems[r];
    res.status(200).json(chosenProblem);
  } catch (error) {
    console.log("error in prepControllers.js getNewProblem: ", error);
    res.status(500).json({message:"error in getNewProblem prepControllers"});
  }
};

export const logProblem = async(req, res) => {
  try {
    const {problemId, title, difficulty, category, leetcodeUrl, completed, notes, confidence} = req.body;

    if (!problemId) {
      req.status(400).json({message:"problem id is required"});
    }

    let log = await prep.findOne({
      userId:req.user._id, problemId: problemId,
    });

    const isCompleted = typeof completed === "boolean" ? completed : true;

    if (log) {
      log.completed = isCompleted;
      if (notes !== undefined) log.notes = notes;
      if (confidence !== undefined) log.confidence = confidence;
      log.timesPracticed += 1;
      log.lastPracticedAt = new Date();
      await log.save();
    } else {
      log = new prep({
        userId: req.user._id,
        problemId,
        title,
        difficulty,
        category,
        leetcodeUrl,
        completed: isCompleted,
        timesPracticed: 1,
        lastPracticedAt: new Date(),
        notes: notes || "",
        confidence: confidence || "Medium",
      });
      await log.save();
    }

    res.status(200).json(log);
  } catch (error) {
      console.error("Error in logPracticeAttempt controller", error);
      res.status(500).json({ message: "Internal Server Error" });
  }
};