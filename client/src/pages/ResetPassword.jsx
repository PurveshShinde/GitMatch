import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Lock,
  Loader2,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  KeyRound,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { resetPassword } from "../redux/authSlice";
import PasswordStrength from "../components/PasswordStrength";
import { usePasswordStrength } from "../hooks/usePasswordStrength";
import { validatePassword, validateConfirmPassword } from "../utils/validation";

const API_BASE_URL =
  import.meta.env?.VITE_API_BASE_URL || "http://localhost:3000";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error: reduxError } = useSelector((state) => state.auth);
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  // Password strength hook
  const passwordStrength = usePasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    // Validation
    let hasErrors = false;
    const errors = {};

    const passwordError = validatePassword(password);
    if (passwordError) {
      errors.password = passwordError;
      hasErrors = true;
    }

    if (!hasErrors && !passwordStrength.isStrong) {
      errors.password = "Password does not meet all requirements";
      hasErrors = true;
    }

    const confirmError = validateConfirmPassword(password, confirmPassword);
    if (confirmError) {
      errors.confirmPassword = confirmError;
      hasErrors = true;
    }

    if (hasErrors) {
      setFieldErrors(errors);
      return;
    }

    try {
      const result = await dispatch(
        resetPassword({ token, newPassword: password })
      ).unwrap();
      setSuccess(true);
      setMessage(result.message || "Password reset successfully!");
      setTimeout(() => {
        navigate("/auth", { state: { mode: "signin" } });
      }, 2000);
    } catch (err) {
      setError(err || "Password reset failed.");
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4 font-sans relative overflow-hidden">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-red-500/10 rounded-full blur-[120px] animate-pulse" />
        </div>
        <div className="relative z-10 bg-[#0f111a] rounded-2xl border border-slate-800/50 shadow-[0_0_50px_-12px_rgba(0,0,0,0.7)] w-full max-w-md p-10 text-center backdrop-blur-sm">
          <div className="w-20 h-20 mx-auto bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/30 mb-6">
            <XCircle size={40} className="text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white font-mono mb-4">
            Invalid_Link
          </h1>
          <p className="text-slate-400 text-sm mb-8">
            This password reset link is invalid or has expired. Please request a
            new one.
          </p>
          <button
            onClick={() => navigate("/forgot-password")}
            className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-3 px-6 rounded-lg transition-all"
          >
            REQUEST_NEW_LINK
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 bg-[#0f111a] rounded-2xl border border-slate-800/50 shadow-[0_0_50px_-12px_rgba(0,0,0,0.7)] w-full max-w-md p-10 backdrop-blur-sm">
        <button
          onClick={() => navigate("/auth")}
          className="flex items-center gap-2 text-slate-500 hover:text-violet-400 transition-colors text-sm font-mono mb-8 group"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          back_to_auth
        </button>

        <div className="flex items-center justify-center w-14 h-14 mx-auto mb-6 rounded-xl border shadow-lg bg-violet-500/10 border-violet-500/20">
          <KeyRound size={28} className="text-violet-400" />
        </div>

        <h1 className="text-2xl font-bold text-white text-center mb-2 font-mono">
          Reset_Password
        </h1>
        <p className="text-slate-500 text-sm text-center mb-8 font-mono">
          Enter your new password below
        </p>

        {success ? (
          <div className="text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
            <div className="w-20 h-20 mx-auto bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
              <ShieldCheck size={40} className="text-green-400" />
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-bold text-white font-mono">
                Password_Updated
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                {message}
              </p>
            </div>
            <button
              onClick={() => navigate("/auth", { state: { mode: "signin" } })}
              className="w-full bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:-translate-y-0.5 shadow-[0_0_20px_rgba(139,92,246,0.3)]"
            >
              SIGN_IN_NOW
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* New Password */}
            <div className="group relative">
              <Lock className="absolute left-3 top-4 text-slate-500 w-5 h-5 group-focus-within:text-violet-400 transition-colors" />
              <input
                required
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  const newPassword = e.target.value;
                  setPassword(newPassword);
                  passwordStrength.updatePassword(newPassword);
                  setFieldErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.password;
                    return newErrors;
                  });
                }}
                className={`peer w-full bg-slate-900/50 border text-white px-10 pr-12 py-4 rounded-lg outline-none focus:ring-1 transition-all placeholder-transparent ${
                  fieldErrors.password
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-slate-700 focus:border-violet-500 focus:ring-violet-500"
                }`}
                placeholder="New Password"
              />
              <label className="absolute left-10 -top-2.5 bg-[#0f111a] px-2 text-xs text-slate-500 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-500 peer-placeholder-shown:top-[14px] peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-violet-400 transition-all cursor-text font-mono">
                new_password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-slate-500 hover:text-violet-300 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
              {fieldErrors.password && (
                <p className="text-red-400 text-xs mt-1 font-mono">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {/* Password Strength Checklist */}
            {password && (
              <PasswordStrength
                strength={passwordStrength.strength}
                requirementsMet={passwordStrength.requirementsMet}
              />
            )}

            {/* Confirm Password */}
            <div className="group relative">
              <Lock className="absolute left-3 top-4 text-slate-500 w-5 h-5 group-focus-within:text-violet-400 transition-colors" />
              <input
                required
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setFieldErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.confirmPassword;
                    return newErrors;
                  });
                }}
                className={`peer w-full bg-slate-900/50 border text-white px-10 pr-12 py-4 rounded-lg outline-none focus:ring-1 transition-all placeholder-transparent ${
                  fieldErrors.confirmPassword
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-slate-700 focus:border-violet-500 focus:ring-violet-500"
                }`}
                placeholder="Confirm Password"
              />
              <label className="absolute left-10 -top-2.5 bg-[#0f111a] px-2 text-xs text-slate-500 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-500 peer-placeholder-shown:top-[14px] peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-violet-400 transition-all cursor-text font-mono">
                confirm_password
              </label>
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-3.5 text-slate-500 hover:text-violet-300 transition-colors"
              >
                {showConfirm ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
              {fieldErrors.confirmPassword && (
                <p className="text-red-400 text-xs mt-1 font-mono">
                  {fieldErrors.confirmPassword}
                </p>
              )}
            </div>

            {error && (
              <Alert variant="destructive" className="border-red-500 bg-red-900/20 text-red-600">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <button
              type="submit"
              disabled={
                loading ||
                Object.keys(fieldErrors).length > 0 ||
                !password ||
                !confirmPassword ||
                !passwordStrength.isStrong
              }
              className="w-full bg-violet-600 hover:bg-violet-500 disabled:bg-violet-600/50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:-translate-y-0.5 shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <ShieldCheck size={18} />
              )}
              {loading ? "UPDATING..." : "UPDATE_PASSWORD"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
