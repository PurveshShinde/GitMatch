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

/**
 * POST /api/users/public-key
 * Saves or updates the authenticated user's RSA public key (Base64 SPKI).
 */
export const savePublicKey = async (req, res, next) => {
  try {
    const { publicKey } = req.body;

    if (!publicKey || typeof publicKey !== "string" || publicKey.trim().length === 0) {
      return next(errorHandler(400, "publicKey is required and must be a non-empty string."));
    }

    if (publicKey.length < 100 || publicKey.length > 2000) {
      return next(errorHandler(400, "publicKey appears malformed. Expected a Base64 SPKI string."));
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { publicKey: publicKey.trim() },
      { new: true, runValidators: true }
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
      "onboardingData.githubUsername": {
        $regex: new RegExp(`^${githubUsername.trim()}$`, "i"),
      },
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
