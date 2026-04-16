import { useState, useCallback } from "react";
import { checkPasswordStrength } from "../utils/validation";

/**
 * Custom hook to track password strength in real-time
 * @param {string} initialPassword - Initial password value
 * @returns {object} Object with strength data and utility functions
 */
export const usePasswordStrength = (initialPassword = "") => {
  const [strength, setStrength] = useState(
    checkPasswordStrength(initialPassword)
  );

  // Update strength when password changes
  const updatePassword = useCallback((password) => {
    setStrength(checkPasswordStrength(password));
  }, []);

  // Check if all requirements are met
  const isStrong = useCallback(
    () => Object.values(strength).every((req) => req === true),
    [strength]
  );

  // Count how many requirements are met
  const requirementsMet = useCallback(
    () => Object.values(strength).filter((req) => req === true).length,
    [strength]
  );

  // Get strength percentage
  const strengthPercentage = useCallback(
    () => Math.round((requirementsMet() / 5) * 100),
    [requirementsMet]
  );

  // Get strength label
  const strengthLabel = useCallback(() => {
    const percentage = strengthPercentage();
    if (percentage === 0) return "none";
    if (percentage <= 20) return "very-weak";
    if (percentage <= 40) return "weak";
    if (percentage <= 60) return "fair";
    if (percentage <= 80) return "good";
    return "strong";
  }, [strengthPercentage]);

  return {
    strength,
    updatePassword,
    isStrong: isStrong(),
    requirementsMet: requirementsMet(),
    strengthPercentage: strengthPercentage(),
    strengthLabel: strengthLabel(),
  };
};

export default usePasswordStrength;
