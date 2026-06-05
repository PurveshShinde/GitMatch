import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    displayName: {
      type: String,
      trim: true,
      default: "",
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    avatar: {
      type: String,
      default: "",
      trim: true,
    },
    authProvider: {
      type: String,
      enum: ["local", "google", "github"],
      default: "local",
    },
    githubUsername: {
      type: String,
      default: "",
      trim: true,
    },
    githubLinkedAccounts: {
      github: {
        type: Boolean,
        default: false,
      },
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      select: false,
    },
    emailVerificationExpires: {
      type: Date,
      select: false,
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
    isOnboarded: {
      type: Boolean,
      default: false,
    },
    onboardingData: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    // RSA-OAEP public key (Base64 SPKI) — stored for E2E message encryption.
    // Private key never touches the server; this field is safe to expose to peers.
    publicKey: {
      type: String,
      default: "",
    },
    githubStats: {
      publicRepos: { type: Number, default: 0 },
      followers: { type: Number, default: 0 },
      publicGists: { type: Number, default: 0 },
      totalStars: { type: Number, default: 0 },
      accountAgeYears: { type: Number, default: 0 },
      recentEventsCount: { type: Number, default: 0 },
      level: { type: Number, default: 1 },
      xp: { type: Number, default: 0 },
      nextLevelXp: { type: Number, default: 200 },
      updatedAt: { type: Date, default: null },
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function preSave() {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function comparePassword(
  plainPassword,
) {
  return bcrypt.compare(plainPassword, this.password);
};

userSchema.methods.createEmailVerificationToken = function () {
  const token = crypto.randomBytes(32).toString("hex");
  this.emailVerificationToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  return token;
};

userSchema.methods.createPasswordResetToken = function () {
  const token = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 60 * 60 * 1000; // 1 hour
  return token;
};

const User = mongoose.model("User", userSchema);

export default User;
