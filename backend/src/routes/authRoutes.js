import express from "express";
import { googleAuth, login, setPassword, signup } from "../controllers/authControllers.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/google", googleAuth);
router.patch("/password", protectRoute, setPassword);

// Persistent session check
router.get("/me", protectRoute, (req, res) => {
  res.status(200).json(req.user);
});

// Clear JWT cookie on sign-out
router.post("/logout", (req, res) => {
  res.cookie("jwt", "", { maxAge: 0 });
  res.status(200).json({ message: "Logged out successfully" });
});

export default router;