import React from "react";
import { Check, X } from "lucide-react";

/**
 * PasswordStrength Component
 * Displays a live checklist of password requirements as user types
 *
 * @param {object} strength - Object with boolean properties: minLength, hasUppercase, hasLowercase, hasNumber, hasSpecialChar
 * @param {number} requirementsMet - Number of requirements met (0-5)
 */
export default function PasswordStrength({
  strength = {
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false,
  },
  requirementsMet = 0,
}) {
  const requirements = [
    {
      key: "minLength",
      label: "At least 8 characters",
      met: strength.minLength,
    },
    {
      key: "hasUppercase",
      label: "At least 1 uppercase letter (A-Z)",
      met: strength.hasUppercase,
    },
    {
      key: "hasLowercase",
      label: "At least 1 lowercase letter (a-z)",
      met: strength.hasLowercase,
    },
    {
      key: "hasNumber",
      label: "At least 1 number (0-9)",
      met: strength.hasNumber,
    },
    {
      key: "hasSpecialChar",
      label: "At least 1 special character (!@#$%^&*...)",
      met: strength.hasSpecialChar,
    },
  ];

  // Determine progress bar color
  const getProgressColor = () => {
    if (requirementsMet === 0) return "bg-slate-600";
    if (requirementsMet <= 2) return "bg-red-500";
    if (requirementsMet === 3) return "bg-yellow-500";
    if (requirementsMet === 4) return "bg-blue-500";
    return "bg-green-500";
  };

  const getProgressLabel = () => {
    if (requirementsMet === 0) return "No requirements met";
    if (requirementsMet <= 2) return "Weak password";
    if (requirementsMet === 3) return "Fair password strength";
    if (requirementsMet === 4) return "Good password strength";
    return "Strong password";
  };

  return (
    <div className="space-y-4 p-4 bg-slate-900/50 border border-slate-700 rounded-lg">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-xs font-mono text-slate-400">
            PASSWORD_STRENGTH
          </label>
          <span className="text-xs font-mono text-slate-500">
            {requirementsMet}/5
          </span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full ${getProgressColor()} transition-all duration-300`}
            style={{ width: `${(requirementsMet / 5) * 100}%` }}
          />
        </div>
        <p className="text-xs text-slate-400 font-mono">
          {getProgressLabel()}
        </p>
      </div>

      {/* Requirements Checklist */}
      <div className="space-y-2">
        <p className="text-xs font-mono text-slate-400 uppercase tracking-wide">
          Requirements:
        </p>
        <div className="space-y-2">
          {requirements.map((req) => (
            <div
              key={req.key}
              className={`flex items-center gap-3 p-2 rounded transition-colors ${
                req.met
                  ? "bg-green-900/30 border border-green-500/30"
                  : "bg-slate-800/30 border border-slate-700/50"
              }`}
            >
              {req.met ? (
                <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
              ) : (
                <X className="w-4 h-4 text-slate-500 flex-shrink-0" />
              )}
              <span
                className={`text-xs font-mono ${
                  req.met ? "text-green-300" : "text-slate-500"
                }`}
              >
                {req.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
