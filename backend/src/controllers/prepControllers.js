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
    const {problemId, title, difficulty, category, leetcodeUrl, completed, notes, confidence, action} = req.body;

    if (!problemId) {
      return res.status(400).json({message:"problem id is required"});
    }

    let log = await prep.findOne({
      userId:req.user._id, problemId: problemId,
    });

    const isPracticeCounterUpdate = action === "increment" || action === "decrement";
    const isCompleted = typeof completed === "boolean" ? completed : true;

    if (log) {
      if (isPracticeCounterUpdate) {
        const change = action === "increment" ? 1 : -1;
        log.timesPracticed = Math.max(0, log.timesPracticed + change);
        log.completed = log.timesPracticed > 0;
      } else {
        // Keep supporting older clients that send the original checkbox payload.
        log.completed = isCompleted;
        log.timesPracticed += 1;
      }
      if (notes !== undefined) log.notes = notes;
      if (confidence !== undefined) log.confidence = confidence;
      if (action === "increment" || !isPracticeCounterUpdate) {
        log.lastPracticedAt = new Date();
      }
      await log.save();
    } else {
      const initialCount = action === "decrement" ? 0 : 1;
      log = new prep({
        userId: req.user._id,
        problemId,
        title,
        difficulty,
        category,
        leetcodeUrl,
        completed: isPracticeCounterUpdate ? initialCount > 0 : isCompleted,
        timesPracticed: initialCount,
        lastPracticedAt: initialCount > 0 ? new Date() : null,
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
