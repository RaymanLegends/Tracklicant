import jwt from "jsonwebtoken";

const getJwtSecret = () => {
  if (process.env.NODE_ENV === "production" && !process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET must be configured in production");
  }

  return process.env.JWT_SECRET || "local_development_only_secret";
};

export const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign(
    { userId: userId.toString() },
    getJwtSecret(),
    { expiresIn: "7d" }
  );

  res.cookie("jwt", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};
