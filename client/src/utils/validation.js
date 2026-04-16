/**
 * Email validation using regex pattern
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Username validation - min 3 chars, alphanumeric + underscore
 */
export const validateUsername = (username) => {
  if (!username) return "Username is required";
  if (username.length < 3) return "Username must be at least 3 characters";
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return "Username can only contain letters, numbers, and underscores";
  }
  return "";
};

/**
 * Password strength validation
 * Returns object with individual requirement states
 */
export const checkPasswordStrength = (password) => {
  return {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };
};

/**
 * Validate if password meets all requirements
 */
export const validatePasswordStrength = (password) => {
  const strength = checkPasswordStrength(password);
  return Object.values(strength).every((requirement) => requirement === true);
};

/**
 * Validate password minimum requirements
 */
export const validatePassword = (password) => {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters";
  return "";
};

/**
 * Validate confirm password matches
 */
export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return "Please confirm your password";
  if (password !== confirmPassword) return "Passwords do not match";
  return "";
};

/**
 * Sanitize input to prevent XSS attacks
 */
export const sanitizeInput = (input) => {
  if (typeof input !== "string") return input;
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
};

/**
 * Trim and validate email
 */
export const validateSignupEmail = (email) => {
  const trimmedEmail = email.trim();
  if (!trimmedEmail) return "Email is required";
  if (!validateEmail(trimmedEmail)) return "Please enter a valid email";
  return "";
};

/**
 * Validate signin email
 */
export const validateSigninEmail = (email) => {
  if (!email) return "Email is required";
  if (!validateEmail(email)) return "Please enter a valid email";
  return "";
};

/**
 * Get password strength percentage (0-100)
 */
export const getPasswordStrengthPercentage = (password) => {
  const strength = checkPasswordStrength(password);
  const metRequirements = Object.values(strength).filter(
    (requirement) => requirement === true
  ).length;
  const totalRequirements = Object.keys(strength).length;
  return Math.round((metRequirements / totalRequirements) * 100);
};

/**
 * Get password strength label
 */
export const getPasswordStrengthLabel = (password) => {
  const percentage = getPasswordStrengthPercentage(password);
  if (percentage === 0) return "none";
  if (percentage <= 20) return "very-weak";
  if (percentage <= 40) return "weak";
  if (percentage <= 60) return "fair";
  if (percentage <= 80) return "good";
  return "strong";
};
