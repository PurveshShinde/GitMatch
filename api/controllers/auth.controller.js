import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

const sanitizeUser = (user) => {
  const userObject = user.toObject();
  delete userObject.password;
  return userObject;
};

export const signup = async (req, res, next) => {
  try {
    const { username, email, password, avatar } = req.body;

    if (!username || !email || !password) {
      return next(errorHandler(400, "username, email and password are required"));
    }

    if (username.trim().length < 3) {
      return next(errorHandler(400, "username must be at least 3 characters"));
    }

    if (!isValidEmail(email)) {
      return next(errorHandler(400, "invalid email format"));
    }

    if (password.length < 8) {
      return next(errorHandler(400, "password must be at least 8 characters"));
    }

    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username: username.trim() }],
    });

    if (existingUser) {
      return next(errorHandler(409, "user already exists"));
    }

    const user = await User.create({
      username: username.trim(),
      email: email.toLowerCase(),
      password,
      avatar: avatar || "",
    });

    return res.status(201).json({
      success: true,
      message: "signup successful",
      user: sanitizeUser(user),
    });
  } catch (error) {
    return next(error);
  }
};

export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(errorHandler(400, "email and password are required"));
    }

    if (!isValidEmail(email)) {
      return next(errorHandler(400, "invalid email format"));
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

    if (!user) {
      return next(errorHandler(404, "user not found"));
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return next(errorHandler(401, "invalid credentials"));
    }

    const token = generateToken(user._id);
    const sanitizedUser = sanitizeUser(user);

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "signin successful",
      token,
      user: sanitizedUser,
    });
  } catch (error) {
    return next(error);
  }
};

export const signout = async (req, res) => {
  res.clearCookie("access_token");

  return res.status(200).json({
    success: true,
    message: "signout successful",
  });
};
