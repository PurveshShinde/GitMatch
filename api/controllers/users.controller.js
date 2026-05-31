/**
 * Users Controller — GitMatch
 *
 * Handles user-level endpoints that sit outside the auth flow.
 * Currently used only for E2E public key registration.
 *
 * Design principle: the backend stores public keys so peers can look them up,
 * but the backend NEVER decrypts any messages and NEVER receives private keys.
 */

import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

const sanitizeUser = (user) => {
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.emailVerificationToken;
  delete userObject.emailVerificationExpires;
  delete userObject.passwordResetToken;
  delete userObject.passwordResetExpires;
  return userObject;
};

/**
 * POST /api/users/public-key
 * Saves or updates the authenticated user's RSA public key (Base64 SPKI).
 */
export const savePublicKey = async (req, res, next) => {
  try {
    const { publicKey } = req.body;

    if (
      !publicKey ||
      typeof publicKey !== "string" ||
      publicKey.trim().length === 0
    ) {
      return next(
        errorHandler(
          400,
          "publicKey is required and must be a non-empty string.",
        ),
      );
    }

    if (publicKey.length < 100 || publicKey.length > 2000) {
      return next(
        errorHandler(
          400,
          "publicKey appears malformed. Expected a Base64 SPKI string.",
        ),
      );
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { publicKey: publicKey.trim() },
      { new: true, runValidators: true },
    );

    if (!user) {
      return next(errorHandler(404, "User not found."));
    }

    return res.status(200).json({
      success: true,
      message: "Public key registered successfully.",
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * GET /api/users/lookup?githubUsername=...
 * Finds a GitMatch user by their GitHub username.
 * Returns { uid, displayName, githubUsername } or null if not found.
 * Used by the frontend to resolve a GitHub contact to a GitMatch user.
 */
export const lookupUser = async (req, res, next) => {
  try {
    const { githubUsername } = req.query;
    if (!githubUsername) {
      return next(errorHandler(400, "githubUsername query param is required."));
    }

    const user = await User.findOne({
      $or: [
        { githubUsername: { $regex: new RegExp(`^${githubUsername.trim()}$`, "i") } },
        { "onboardingData.githubUsername": { $regex: new RegExp(`^${githubUsername.trim()}$`, "i") } }
      ]
    })
      .select("_id username onboardingData")
      .lean();

    if (!user) {
      return res.json({ success: true, user: null });
    }

    return res.json({
      success: true,
      user: {
        uid: user._id.toString(),
        displayName: user.username,
        githubUsername: user.onboardingData?.githubUsername || githubUsername,
      },
    });
  } catch (err) {
    return next(err);
  }
};

/**
 * POST /api/users/update-profile
 * Updates user profile data from Settings page
 */
export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { displayName, username, email, onboardingData } = req.body;

    const updateData = {};

    if (displayName !== undefined) updateData.displayName = displayName;
    if (username !== undefined) updateData.username = username;
    if (email !== undefined) updateData.email = email;

    if (onboardingData !== undefined && onboardingData !== null) {
      updateData.onboardingData = onboardingData;
    }

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: sanitizeUser(user),
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * POST /api/users/unlink-github
 * Unlinks GitHub account from user profile
 */
export const unlinkGithub = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        githubUsername: "",
        "githubLinkedAccounts.github": false,
      },
      { new: true },
    );

    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    return res.status(200).json({
      success: true,
      message: "GitHub account unlinked successfully",
      user: sanitizeUser(user),
    });
  } catch (error) {
    return next(error);
  }
};
