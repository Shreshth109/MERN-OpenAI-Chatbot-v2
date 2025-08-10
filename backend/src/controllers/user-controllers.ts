import { Request, Response } from "express";
import User from "../models/user-model.js";
import { createToken } from "../utils/token-manager.js";
import { COOKIE_NAME } from "../utils/constants.js";

// Signup Controller
export const userSignup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(401).json({ message: "User already exists" });
    }

    const user = new User({ name, email, password });
    await user.save();

    const token = createToken(user._id.toString(), user.email);
    const expires = new Date();
    expires.setDate(expires.getDate() + 7); // expires in 7 days

    // ✅ Set cookie correctly for cross-origin auth
  res.cookie(COOKIE_NAME, token, {
  path: "/",
  expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // true in production
  sameSite: "none", // Required for cross-origin requests
  domain: process.env.NODE_ENV === "production" ? ".onrender.com" : undefined
});

    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ message: "Signup failed", error: err });
  }
};

// Login Controller
export const userLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser || existingUser.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = createToken(existingUser._id.toString(), existingUser.email);
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);

    // ✅ Set cookie correctly for login as well
    res.cookie(COOKIE_NAME, token, {
      path: "/",
      expires,
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
      },
    });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Login failed", error: err });
  }
};
