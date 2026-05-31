import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "../utils/email.js";

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
  delete userObject.emailVerificationToken;
  delete userObject.emailVerificationExpires;
  delete userObject.passwordResetToken;
  delete userObject.passwordResetExpires;
  
  // Ensure critical fields are always present
  userObject.isOnboarded = user.isOnboarded;
  
  return userObject;
};

const setTokenCookie = (res, token) => {
  res.cookie("access_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

// ─── SIGNUP ───────────────────────────────────────────────
export const signup = async (req, res, next) => {
  try {
    const { username, email, password, avatar } = req.body;

    console.log("[SIGNUP] Request from:", email);

    if (!username || !email || !password) {
      return next(
        errorHandler(400, "Username, email and password are required"),
      );
    }

    if (username.trim().length < 3) {
      return next(
        errorHandler(400, "Username must be at least 3 characters long"),
      );
    }

    if (!isValidEmail(email)) {
      return next(errorHandler(400, "Please enter a valid email address"));
    }

    if (password.length < 8) {
      return next(
        errorHandler(400, "Password must be at least 8 characters long"),
      );
    }

    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username: username.trim() }],
    });

    if (existingUser) {
      if (existingUser.email === email.toLowerCase()) {
        return next(
          errorHandler(
            409,
            "Email is already registered. Please sign in instead.",
          ),
        );
      }
      return next(
        errorHandler(409, "Username is already taken. Please choose another."),
      );
    }

    const user = await User.create({
      username: username.trim(),
      email: email.toLowerCase(),
      password,
      avatar: avatar || "",
      authProvider: "local",
    });

    console.log("[SIGNUP] User created:", user._id);

    // Generate and send verification email
    const verificationToken = user.createEmailVerificationToken();
    console.log("[SIGNUP] Token generated (plain):", verificationToken);
    console.log("[SIGNUP] Token hashed & stored:", user.emailVerificationToken);
    console.log(
      "[SIGNUP] Token expires at:",
      new Date(user.emailVerificationExpires),
    );

    await user.save({ validateBeforeSave: false });
    console.log("[SIGNUP] User saved with verification token");

    try {
      await sendVerificationEmail(user.email, verificationToken);
      console.log("[SIGNUP] ✓ Verification email sent successfully");
    } catch (emailError) {
      console.error(
        "[SIGNUP] ✗ Failed to send verification email:",
        emailError.message,
      );
      // Don't block signup if email fails — user can resend later
    }

    return res.status(201).json({
      success: true,
      message:
        "Account created! Check your email to verify your account. Link expires in 24 hours.",
    });
  } catch (error) {
    console.error("[SIGNUP] ✗ Error:", error.message);
    return next(error);
  }
};

// ─── SIGNIN ───────────────────────────────────────────────
export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(errorHandler(400, "Email and password are required"));
    }

    if (!isValidEmail(email)) {
      return next(errorHandler(400, "Please enter a valid email address"));
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password",
    );

    if (!user) {
      return next(
        errorHandler(
          404,
          "No account found with this email. Please sign up first.",
        ),
      );
    }

    if (user.authProvider === "google") {
      return next(
        errorHandler(
          400,
          "This account uses Google sign-in. Please use the Google button to log in.",
        ),
      );
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return next(errorHandler(401, "Incorrect password. Please try again."));
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message:
          "Your email is not verified yet. Please check your email for a verification link. You can resend it if needed.",
        needsVerification: true,
        email: user.email,
      });
    }

    if (!user.isOnboarded) {
      user.isOnboarded = true;
      await user.save();
    }
    const token = generateToken(user._id);
    const sanitizedUser = sanitizeUser(user);

    setTokenCookie(res, token);

    return res.status(200).json({
      success: true,
      message: "Sign in successful! Welcome back.",
      token,
      user: sanitizedUser,
    });
  } catch (error) {
    return next(error);
  }
};

// ─── GOOGLE AUTH ──────────────────────────────────────────
export const googleAuth = async (req, res, next) => {
  try {
    const { email, username, avatar } = req.body;

    if (!email) {
      return next(errorHandler(400, "email is required"));
    }

    let user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      if (!user.isOnboarded) {
        user.isOnboarded = true;
        await user.save();
      }
      const token = generateToken(user._id);
      const sanitizedUser = sanitizeUser(user);
      setTokenCookie(res, token);
      return res.status(200).json({
        success: true,
        message: "Sign in successful",
        token,
        user: sanitizedUser,
      });
    }

    // New user — create account (auto-verified, no password needed for Google)
    const generatedPassword =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8);

    const sanitizedUsername =
      (username || email.split("@")[0])
        .replace(/[^a-zA-Z0-9]/g, "")
        .toLowerCase()
        .slice(0, 20) + Math.random().toString(36).slice(-4);

    user = await User.create({
      username: sanitizedUsername,
      displayName: username || sanitizedUsername,
      email: email.toLowerCase(),
      password: generatedPassword,
      avatar: avatar || "",
      authProvider: "google",
      isEmailVerified: true,
      isOnboarded: true,
      onboardingData: {
        bio: "",
        skills: "",
        role: "Developer",
        experience: "1-3 Years",
        availability: "Open to collaborate",
      },
    });

    const token = generateToken(user._id);
    const sanitizedUser = sanitizeUser(user);
    setTokenCookie(res, token);

    return res.status(201).json({
      success: true,
      message: "Google signup successful",
      token,
      user: sanitizedUser,
    });
  } catch (error) {
    return next(error);
  }
};

// ─── GITHUB AUTH ──────────────────────────────────────────
export const githubAuth = async (req, res, next) => {
  try {
    const { code } = req.body;

    if (!code) {
      return next(errorHandler(400, "Authorization code is required"));
    }

    // Exchange code for GitHub token
    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: process.env.GITHUB_CLIENT_ID || "",
          client_secret: process.env.GITHUB_CLIENT_SECRET || "",
          code,
        }),
      },
    );

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      return next(errorHandler(400, "Failed to get GitHub access token"));
    }

    // Get user info from GitHub
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    const githubUser = await userResponse.json();
    console.log("[GITHUB-AUTH] GitHub user data received:", githubUser.login, githubUser.email);

    if (!githubUser.login) {
      console.error("[GITHUB-AUTH] No login found in GitHub response");
      return next(errorHandler(400, "Failed to get GitHub user info"));
    }

    // --- CASE 1: USER IS ALREADY LOGGED IN (Linking) ---
    const existingToken = req.cookies?.access_token;
    let authenticatedUserId = null;
    if (existingToken) {
      try {
        const decoded = jwt.verify(existingToken, process.env.JWT_SECRET);
        authenticatedUserId = decoded.id;
        console.log("[GITHUB-AUTH] Found authenticated user ID:", authenticatedUserId);
      } catch (err) {
        console.warn("[GITHUB-AUTH] Invalid existing token:", err.message);
      }
    }

    if (authenticatedUserId) {
      const currentUser = await User.findById(authenticatedUserId);
      if (currentUser) {
        console.log("[GITHUB-AUTH] Linking to current user:", currentUser.username);
        currentUser.githubUsername = githubUser.login;
        currentUser.githubLinkedAccounts = {
          ...currentUser.githubLinkedAccounts,
          github: true,
        };
        currentUser.isOnboarded = true; // Ensure they stay onboarded
        
        if (!currentUser.avatar && githubUser.avatar_url) {
          currentUser.avatar = githubUser.avatar_url;
        }
        await currentUser.save();

        const token = generateToken(currentUser._id);
        setTokenCookie(res, token);

        return res.status(200).json({
          success: true,
          message: "GitHub account linked successfully",
          token,
          user: sanitizeUser(currentUser),
        });
      }
    }

    // --- CASE 2: GUEST LOGIN/SIGNUP ---
    let user = await User.findOne({
      $or: [
        { githubUsername: githubUser.login },
        { "onboardingData.githubUsername": githubUser.login },
        ...(githubUser.email ? [{ email: githubUser.email.toLowerCase() }] : []),
      ],
    });

    if (user) {
      console.log("[GITHUB-AUTH] Found existing guest user:", user.username);
      let needsUpdate = false;
      if (!user.githubUsername) {
        user.githubUsername = githubUser.login;
        needsUpdate = true;
      }
      if (!user.githubLinkedAccounts?.github) {
        user.githubLinkedAccounts = {
          ...user.githubLinkedAccounts,
          github: true,
        };
        needsUpdate = true;
      }
      if (!user.isOnboarded) {
        user.isOnboarded = true;
        needsUpdate = true;
      }
      if (!user.avatar && githubUser.avatar_url) {
        user.avatar = githubUser.avatar_url;
        needsUpdate = true;
      }

      if (needsUpdate) {
        await user.save();
      }

      const token = generateToken(user._id);
      const sanitizedUser = sanitizeUser(user);
      setTokenCookie(res, token);

      return res.status(200).json({
        success: true,
        message: "GitHub signin successful",
        token,
        user: sanitizedUser,
      });
    }

    console.log("[GITHUB-AUTH] Creating new user for:", githubUser.login);
    const sanitizedUsername = githubUser.login
      .replace(/[^a-zA-Z0-9]/g, "")
      .toLowerCase()
      .slice(0, 20);

    let finalUsername = sanitizedUsername;
    const existingUsername = await User.findOne({ username: finalUsername });
    if (existingUsername) {
      finalUsername = `${sanitizedUsername}${Math.random().toString(36).slice(-4)}`;
    }

    user = await User.create({
      username: finalUsername,
      displayName: githubUser.name || githubUser.login,
      email:
        githubUser.email?.toLowerCase() || `${githubUser.login}@github.local`,
      password:
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8),
      avatar: githubUser.avatar_url || "",
      authProvider: "github",
      isEmailVerified: !!githubUser.email,
      githubUsername: githubUser.login,
      githubLinkedAccounts: { github: true },
      isOnboarded: true, 
      onboardingData: {
        bio: githubUser.bio || "",
        githubUsername: githubUser.login,
        skills: "",
        role: "Developer",
        experience: "1-3 Years",
        availability: "Open to collaborate",
      },
    });

    const token = generateToken(user._id);
    const sanitizedUser = sanitizeUser(user);
    setTokenCookie(res, token);

    return res.status(201).json({
      success: true,
      message: "GitHub signup successful",
      token,
      user: sanitizedUser,
    });
  } catch (error) {
    return next(error);
  }
};

// ─── VERIFY EMAIL ─────────────────────────────────────────
export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;

    console.log(
      "[VERIFY-EMAIL] Verification request with token:",
      token?.substring(0, 10) + "...",
    );

    if (!token) {
      return next(errorHandler(400, "Verification token is required"));
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    console.log(
      "[VERIFY-EMAIL] Token hashed:",
      hashedToken.substring(0, 10) + "...",
    );

    // NOTE: We intentionally do NOT filter by expiry in the DB query.
    // In React dev StrictMode, this endpoint can be hit twice; making it
    // idempotent prevents a "success then failure" UX.
    const user = await User.findOne({
      emailVerificationToken: hashedToken,
    }).select("+emailVerificationToken +emailVerificationExpires");

    if (!user) {
      console.error("[VERIFY-EMAIL] ✗ No user found with this token");
      return next(errorHandler(400, "Invalid or expired verification token"));
    }

    // If already verified, treat this as success (idempotent).
    if (user.isEmailVerified) {
      console.log("[VERIFY-EMAIL] ✓ Email already verified:", user.email);
      return res.status(200).json({
        success: true,
        message: "Email verified successfully! You can now sign in.",
      });
    }

    if (
      !user.emailVerificationExpires ||
      user.emailVerificationExpires.getTime() <= Date.now()
    ) {
      console.error("[VERIFY-EMAIL] ✗ Token expired for user:", user.email);
      return next(errorHandler(400, "Invalid or expired verification token"));
    }

    console.log("[VERIFY-EMAIL] ✓ User found:", user.email);
    console.log(
      "[VERIFY-EMAIL] ✓ Token is valid, expires at:",
      new Date(user.emailVerificationExpires),
    );

    user.isEmailVerified = true;
    // Keep the token until it expires so repeated requests (or refreshes)
    // can still resolve to a verified user.
    await user.save({ validateBeforeSave: false });

    console.log("[VERIFY-EMAIL] ✓ Email verified and user updated");

    return res.status(200).json({
      success: true,
      message: "Email verified successfully! You can now sign in.",
    });
  } catch (error) {
    console.error("[VERIFY-EMAIL] ✗ Error:", error.message);
    return next(error);
  }
};

// ─── RESEND VERIFICATION EMAIL ────────────────────────────
export const resendVerificationEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return next(errorHandler(400, "email is required"));
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+emailVerificationToken +emailVerificationExpires",
    );

    if (!user) {
      // Don't reveal if user exists — generic success message
      return res.status(200).json({
        success: true,
        message:
          "If an account with that email exists, a verification email has been sent.",
      });
    }

    if (user.isEmailVerified) {
      return res.status(200).json({
        success: true,
        message: "Your email is already verified. You can sign in.",
      });
    }

    const verificationToken = user.createEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    await sendVerificationEmail(user.email, verificationToken);

    return res.status(200).json({
      success: true,
      message: "Verification email sent! Please check your inbox.",
    });
  } catch (error) {
    return next(error);
  }
};

// ─── FORGOT PASSWORD ──────────────────────────────────────
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    console.log("[FORGOT-PASS] Request from:", email);

    if (!email) {
      return next(errorHandler(400, "email is required"));
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.log("[FORGOT-PASS] No user found with email:", email);
      // Don't reveal if user exists
      return res.status(200).json({
        success: true,
        message:
          "If an account with that email exists, a password reset link has been sent.",
      });
    }

    console.log("[FORGOT-PASS] User found:", user._id);

    if (user.authProvider === "google") {
      return next(
        errorHandler(
          400,
          "This account uses Google sign-in. Password reset is not available.",
        ),
      );
    }

    const resetToken = user.createPasswordResetToken();
    console.log("[FORGOT-PASS] Reset token generated (plain):", resetToken);
    console.log(
      "[FORGOT-PASS] Token hashed & stored:",
      user.passwordResetToken,
    );
    console.log(
      "[FORGOT-PASS] Token expires at:",
      new Date(user.passwordResetExpires),
    );

    await user.save({ validateBeforeSave: false });
    console.log("[FORGOT-PASS] User saved with reset token");

    try {
      await sendPasswordResetEmail(user.email, resetToken);
      console.log("[FORGOT-PASS] ✓ Password reset email sent successfully");
    } catch (emailError) {
      console.error(
        "[FORGOT-PASS] ✗ Failed to send password reset email:",
        emailError.message,
      );
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      return next(
        errorHandler(
          500,
          "Failed to send password reset email. Please try again.",
        ),
      );
    }

    return res.status(200).json({
      success: true,
      message:
        "If an account with that email exists, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("[FORGOT-PASS] ✗ Error:", error.message);
    return next(error);
  }
};

// ─── RESET PASSWORD ──────────────────────────────────────
export const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    console.log(
      "[RESET-PASS] Reset request with token:",
      token?.substring(0, 10) + "...",
    );

    if (!token || !newPassword) {
      return next(errorHandler(400, "Token and new password are required"));
    }

    if (newPassword.length < 8) {
      return next(errorHandler(400, "Password must be at least 8 characters"));
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    console.log(
      "[RESET-PASS] Token hashed:",
      hashedToken.substring(0, 10) + "...",
    );

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    }).select("+passwordResetToken +passwordResetExpires +password");

    if (!user) {
      console.error(
        "[RESET-PASS] ✗ No user found with this token or token expired",
      );
      return next(errorHandler(400, "Invalid or expired reset token"));
    }

    console.log("[RESET-PASS] ✓ User found:", user._id);
    console.log(
      "[RESET-PASS] ✓ Token valid, expires at:",
      new Date(user.passwordResetExpires),
    );

    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    console.log("[RESET-PASS] ✓ Password reset successful");

    return res.status(200).json({
      success: true,
      message:
        "Password reset successful! You can now sign in with your new password.",
    });
  } catch (error) {
    console.error("[RESET-PASS] ✗ Error:", error.message);
    return next(error);
  }
};

// ─── ONBOARDING ───────────────────────────────────────────
export const saveOnboarding = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const onboardingData = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        isOnboarded: true,
        onboardingData,
      },
      { new: true },
    );

    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    return res.status(200).json({
      success: true,
      message: "Onboarding completed successfully",
      user: sanitizeUser(user),
    });
  } catch (error) {
    return next(error);
  }
};

// ─── GET CURRENT USER ─────────────────────────────────────
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    return res.status(200).json({
      success: true,
      user: sanitizeUser(user),
    });
  } catch (error) {
    return next(error);
  }
};

// ─── SIGNOUT ──────────────────────────────────────────────
export const signout = async (req, res) => {
  res.clearCookie("access_token");

  return res.status(200).json({
    success: true,
    message: "signout successful",
  });
};
