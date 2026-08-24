import { OAuth2Client } from "google-auth-library";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const userResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  avatar: user.avatar,
});

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    generateTokenAndSetCookie(user._id, res);
    res.status(201).json(userResponse(user));
  } catch (error) {
    console.error("Error in signup controller:", error);
    if (error.code === 11000) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }
    res.status(500).json({ message: "Account creation failed" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email?.trim().toLowerCase() });

    if (!user?.password || !(await bcrypt.compare(password || "", user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    generateTokenAndSetCookie(user._id, res);
    res.status(200).json(userResponse(user));
  } catch (error) {
    console.error("Error in login controller:", error);
    res.status(500).json({ message: "Login failed" });
  }
};

export const googleAuth = async (req, res) => {
  try {
    const { credential, createAccount = false } = req.body;

    if (!credential) {
      return res.status(400).json({ message: "No credential token provided" });
    }

    // Verify Google ID token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture, email_verified: emailVerified } = payload;

    if (!emailVerified) {
      return res.status(401).json({ message: "Google email is not verified" });
    }

    // Check if user already exists
    let user = await User.findOne({ email });

    if (!user && !createAccount) {
      return res.status(404).json({ message: "No account exists with this Google email" });
    }

    if (user) {
      if (user.googleId && user.googleId !== googleId) {
        return res.status(401).json({ message: "This email is linked to a different Google account" });
      }

      if (!user.googleId) {
        return res.status(409).json({
          message: "An account already exists with this email. Sign in with your password first.",
        });
      }
    } else {
      if (!createAccount) {
        return res.status(404).json({ message: "No account exists with this Google email" });
      }

      // Create new OAuth user
      user = await User.create({
        name: name || email,
        email: email.toLowerCase(),
        googleId,
        avatar: picture,
      });
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    });
  } catch (error) {
    console.error("Error in googleAuth controller:", error);
    res.status(500).json({ message: "Google authentication failed" });
  }
};

export const setPassword = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error in setPassword controller:", error);
    res.status(500).json({ message: "Password update failed" });
  }
};