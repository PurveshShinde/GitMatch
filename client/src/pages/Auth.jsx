import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Github,
  Mail,
  Lock,
  User,
  Terminal,
  Code2,
  Cpu,
  Zap,
  Braces,
  Loader2,
  X,
  Eye,
  EyeOff,
  Chrome,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import {
  signupUser,
  signinUser,
  googleAuthUser,
  githubAuthUser,
  resendVerificationEmail,
} from "../redux/authSlice";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import PasswordStrength from "../components/PasswordStrength";
import { usePasswordStrength } from "../hooks/usePasswordStrength";
import {
  validateEmail,
  validateUsername,
  validatePassword,
  validateConfirmPassword,
  validateSignupEmail,
  validateSigninEmail,
} from "../utils/validation";

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { loading: isAuthAttempting, error: reduxError } = useSelector(
    (state) => state.auth,
  );

  // --- UI STATES ---
  const [isSignUp, setIsSignUp] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirm, setShowSignupConfirm] = useState(false);
  const [showSigninPassword, setShowSigninPassword] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState(null);

  // --- LIVE VALIDATION STATES ---
  const [signupFields, setSignupFields] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [signinFields, setSigninFields] = useState({
    email: "",
    password: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});

  // --- PASSWORD STRENGTH HOOK ---
  const passwordStrength = usePasswordStrength(signupFields.password);

  // Handle initial mode from navigation state
  useEffect(() => {
    if (location.state?.mode === "signup") setIsSignUp(true);
    else if (location.state?.mode === "signin") setIsSignUp(false);
  }, [location]);

  // Parallax Background Effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 20,
        y: (e.clientY / window.innerHeight) * 20,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // GitHub Auth Message Listener
  useEffect(() => {
    const handleMessage = async (event) => {
      if (event.data?.type === "github_auth_complete" && event.data?.code) {
        try {
          const authResult = await dispatch(
            githubAuthUser({ code: event.data.code }),
          ).unwrap();
          setSuccessMessage("Sign in successful! Redirecting...");
          setTimeout(() => {
            navigate("/dashboard");
          }, 1500);
        } catch (err) {
          setError(err || "GitHub authentication failed.");
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [dispatch, navigate]);

  // --- LIVE VALIDATION FUNCTIONS ---
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateUsername = (username) => {
    if (!username) return "Username is required";
    if (username.length < 3) return "Username must be at least 3 characters";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    return "";
  };

  const validateSignupEmail = (email) => {
    if (!email) return "Email is required";
    if (!validateEmail(email)) return "Please enter a valid email";
    return "";
  };

  const validateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword) return "Please confirm your password";
    if (password !== confirmPassword) return "Passwords do not match";
    return "";
  };

  const validateSigninEmail = (email) => {
    if (!email) return "Email is required";
    if (!validateEmail(email)) return "Please enter a valid email";
    return "";
  };

  // --- SIGNUP FIELD HANDLERS ---
  const handleSignupFieldChange = (e) => {
    const { name, value } = e.target;
    setSignupFields((prev) => ({ ...prev, [name]: value }));

    // Update password strength if password field changed
    if (name === "password") {
      passwordStrength.updatePassword(value);
    }

    // Live validation
    let error = "";
    if (name === "username") {
      error = validateUsername(value);
    } else if (name === "email") {
      error = validateSignupEmail(value);
    } else if (name === "password") {
      error = validatePassword(value);
      // Also validate confirm password if it exists
      if (
        signupFields.confirmPassword &&
        value !== signupFields.confirmPassword
      ) {
        setFieldErrors((prev) => ({
          ...prev,
          confirmPassword: "Passwords do not match",
        }));
      } else if (signupFields.confirmPassword) {
        setFieldErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.confirmPassword;
          return newErrors;
        });
      }
    } else if (name === "confirmPassword") {
      error = validateConfirmPassword(signupFields.password, value);
    }

    if (error) {
      setFieldErrors((prev) => ({ ...prev, [name]: error }));
    } else {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // --- SIGNIN FIELD HANDLERS ---
  const handleSigninFieldChange = (e) => {
    const { name, value } = e.target;
    setSigninFields((prev) => ({ ...prev, [name]: value }));

    // Live validation
    let error = "";
    if (name === "email") {
      error = validateSigninEmail(value);
    } else if (name === "password") {
      error = validatePassword(value);
    }

    if (error) {
      setFieldErrors((prev) => ({ ...prev, [name]: error }));
    } else {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Auth Submission with Redux
  const handleAuthSubmit = async (e, isSignupForm) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage("");

    // Get values from state or form (for backward compatibility)
    const email = isSignupForm ? signupFields.email : signinFields.email;
    const password = isSignupForm
      ? signupFields.password
      : signinFields.password;
    const username = isSignupForm ? signupFields.username : "";
    const confirmPassword = isSignupForm ? signupFields.confirmPassword : "";

    // Validate form
    let hasErrors = false;
    const errors = {};

    if (isSignupForm) {
      // Signup validation
      const usernameError = validateUsername(username);
      if (usernameError) {
        errors.username = usernameError;
        hasErrors = true;
      }

      const emailError = validateSignupEmail(email);
      if (emailError) {
        errors.email = emailError;
        hasErrors = true;
      }

      const passwordError = validatePassword(password);
      if (passwordError) {
        errors.password = passwordError;
        hasErrors = true;
      }

      // Check if password meets strength requirements
      if (!hasErrors && !passwordStrength.isStrong) {
        errors.password = "Password does not meet all requirements";
        hasErrors = true;
      }

      const confirmError = validateConfirmPassword(password, confirmPassword);
      if (confirmError) {
        errors.confirmPassword = confirmError;
        hasErrors = true;
      }
    } else {
      // Signin validation
      const emailError = validateSigninEmail(email);
      if (emailError) {
        errors.email = emailError;
        hasErrors = true;
      }

      if (!password) {
        errors.password = "Password is required";
        hasErrors = true;
      }
    }

    if (hasErrors) {
      setFieldErrors(errors);
      return;
    }

    // Clear field errors if validation passed
    setFieldErrors({});

    try {
      if (isSignupForm) {
        const result = await dispatch(
          signupUser({ username, email, password }),
        ).unwrap();
        setSuccessMessage(
          "✓ Account created! Check your email to verify your account.\n\n📧 Verification link expires in 24 hours.\n\n👉 After verification, you can sign in with your credentials.",
        );
        // Reset form
        setSignupFields({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        setTimeout(() => {
          setIsSignUp(false);
          setSuccessMessage("");
        }, 4000);
      } else {
        const result = await dispatch(signinUser({ email, password })).unwrap();
        setSuccessMessage("✓ Sign in successful! Redirecting...");
        // Reset form
        setSigninFields({ email: "", password: "" });
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      }
    } catch (err) {
      // Handle object-based error payload
      if (typeof err === "object" && err?.needsVerification) {
        setError(
          "Your email is not verified yet. Please check your email for a verification link.",
        );
        setUnverifiedEmail(err.email || email);
      } else if (typeof err === "object" && err?.message) {
        setError(err.message);
      } else if (typeof err === "string") {
        setError(err);
      } else {
        setError("Authentication failed. Please try again.");
      }
    }
  };

  const handleResendVerification = async () => {
    if (!unverifiedEmail) return;

    try {
      const result = await dispatch(
        resendVerificationEmail(unverifiedEmail),
      ).unwrap();
      setError(null);
      setSuccessMessage(
        `✓ Verification email resent to ${unverifiedEmail}\n\n📧 Check your inbox and spam folder\n\n👉 Click the link to verify your account`,
      );
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (err) {
      setError(err || "Failed to resend verification email");
    }
  };

  const handleGoogleAuth = async (mode) => {
    setError(null);
    setSuccessMessage("");

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const googleUser = {
        email: result.user.email,
        username: result.user.displayName || result.user.email.split("@")[0],
        avatar: result.user.photoURL || "",
      };

      // Send to backend for auth
      const authResult = await dispatch(googleAuthUser(googleUser)).unwrap();

      setSuccessMessage(
        mode === "signup"
          ? "Account created successfully! Redirecting..."
          : "Sign in successful! Redirecting...",
      );

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      setError(err?.message || "Google authentication failed.");
    }
  };

  const handleGitHubAuth = async () => {
    const githubClientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    const githubRedirectUri = import.meta.env.VITE_GITHUB_REDIRECT_URI;

    if (!githubClientId || !githubRedirectUri) {
      setError("GitHub OAuth credentials not configured.");
      return;
    }

    const state = Math.random().toString(36).substring(7);
    sessionStorage.setItem("github_oauth_state", state);

    const authUrl = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${encodeURIComponent(githubRedirectUri)}&scope=read:user,user:email&state=${state}`;

    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    window.open(
      authUrl,
      "github_auth",
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes`,
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4 font-sans selection:bg-cyan-500/30 relative overflow-hidden">
      {/* Back to Home Button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 md:top-8 md:left-8 z-50 flex items-center gap-2 text-slate-400 hover:text-white hover:bg-slate-800/50 px-4 py-2 rounded-lg transition-all group font-mono text-sm border border-transparent hover:border-slate-700/50"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Home
      </button>

      {/* --- Animated Background --- */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(#4f4f4f 1px, transparent 1px), linear-gradient(90deg, #4f4f4f 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
            transform: `translate(${mousePosition.x * -1}px, ${
              mousePosition.y * -1
            }px)`,
          }}
        />
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      {/* --- Main Container --- */}
      <div
        className={`
          relative bg-[#0f111a] rounded-2xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.7)]
          w-full max-w-[1000px] 
          min-h-fit md:min-h-[600px] 
          flex flex-col md:block 
          overflow-hidden 
          border border-slate-800/50 z-10 backdrop-blur-sm
        `}
      >
        {/* --- Mobile Toggle Tabs --- */}
        <div className="md:hidden flex border-b border-slate-800">
          <button
            onClick={() => setIsSignUp(false)}
            className={`flex-1 py-4 text-sm font-bold transition-colors font-mono tracking-wide ${
              !isSignUp
                ? "text-cyan-400 border-b-2 border-cyan-400 bg-slate-900/50"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            SIGN IN
          </button>
          <button
            onClick={() => setIsSignUp(true)}
            className={`flex-1 py-4 text-sm font-bold transition-colors font-mono tracking-wide ${
              isSignUp
                ? "text-violet-400 border-b-2 border-violet-400 bg-slate-900/50"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            SIGN UP
          </button>
        </div>

        {/* --- Sign Up Form --- */}
        <div
          className={`
            transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]
            w-full md:w-1/2
            ${isSignUp ? "block" : "hidden"} md:block
            relative p-4 md:p-0
            md:absolute md:top-0 md:h-full
            overflow-y-auto max-h-screen
            ${
              isSignUp
                ? "md:left-full md:-translate-x-full md:opacity-100 md:z-50"
                : "md:left-0 md:opacity-0 md:z-0"
            }
          `}
        >
          <form
            onSubmit={(e) => handleAuthSubmit(e, true)}
            className="h-full flex flex-col items-center justify-center text-center bg-[#0f111a] p-0 md:px-12"
          >
            {/* Error Message - Inline */}
            {error && (
              <Alert
                variant="destructive"
                className="w-full mb-6 border-red-500 bg-red-900/20 text-red-600"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription className="mt-2 text-sm">
                  {error}
                  {unverifiedEmail && (
                    <button
                      onClick={handleResendVerification}
                      disabled={isAuthAttempting}
                      className="mt-3 block w-full text-xs bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-3 py-2 rounded transition-colors font-medium"
                    >
                      {isAuthAttempting
                        ? "Resending..."
                        : "Resend Verification Email"}
                    </button>
                  )}
                </AlertDescription>
              </Alert>
            )}

            {/* Success Message - Inline */}
            {successMessage && (
              <Alert className="w-full mb-6 border-green-500 bg-green-900/20 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription className="mt-2 text-sm whitespace-pre-line">
                  {successMessage}
                </AlertDescription>
              </Alert>
            )}

            <div className="hidden md:flex items-center justify-center w-12 h-12 bg-cyan-500/10 rounded-xl mb-6 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <Terminal size={24} className="text-cyan-400" />
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">
              Initialize_User
            </h1>
            <span className="text-slate-500 text-sm mb-8 font-mono">
              System.create(new_account)
            </span>

            <div className="flex gap-4 mb-8">
              <button
                type="button"
                onClick={() => handleGoogleAuth("signup")}
                disabled={isAuthAttempting}
                className="group relative p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-cyan-500/50 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-cyan-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10">
                  <Chrome size={20} />
                </span>
              </button>
              <button
                type="button"
                onClick={handleGitHubAuth}
                disabled={isAuthAttempting}
                className="group relative p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-cyan-500/50 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-cyan-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10">
                  <Github size={20} />
                </span>
              </button>
            </div>

            <div className="w-full space-y-5">
              {/* Username */}
              <div className="group relative">
                <User className="absolute left-3 top-4 text-slate-500 w-5 h-5 group-focus-within:text-cyan-400 transition-colors" />
                <input
                  required
                  type="text"
                  id="signup-name"
                  name="username"
                  value={signupFields.username}
                  onChange={handleSignupFieldChange}
                  className={`peer w-full bg-slate-900/50 border text-white px-10 py-4 rounded-lg outline-none focus:ring-1 transition-all placeholder-transparent ${
                    fieldErrors.username
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-slate-700 focus:border-cyan-500 focus:ring-cyan-500"
                  }`}
                  placeholder="Name"
                />
                <label
                  htmlFor="signup-name"
                  className="absolute left-10 -top-2.5 bg-[#0f111a] px-2 text-xs text-slate-500 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-500 peer-placeholder-shown:top-[14px] peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-cyan-400 transition-all cursor-text font-mono"
                >
                  username
                </label>
                {fieldErrors.username && (
                  <p className="text-red-300 text-xs mt-2 px-2 py-1 bg-red-900/40 rounded border border-red-700/50 font-mono">
                    {fieldErrors.username}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="group relative">
                <Mail className="absolute left-3 top-4 text-slate-500 w-5 h-5 group-focus-within:text-cyan-400 transition-colors" />
                <input
                  required
                  type="email"
                  id="signup-email"
                  name="email"
                  value={signupFields.email}
                  onChange={handleSignupFieldChange}
                  className={`peer w-full bg-slate-900/50 border text-white px-10 py-4 rounded-lg outline-none focus:ring-1 transition-all placeholder-transparent ${
                    fieldErrors.email
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-slate-700 focus:border-cyan-500 focus:ring-cyan-500"
                  }`}
                  placeholder="Email"
                />
                <label
                  htmlFor="signup-email"
                  className="absolute left-10 -top-2.5 bg-[#0f111a] px-2 text-xs text-slate-500 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-500 peer-placeholder-shown:top-[14px] peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-cyan-400 transition-all cursor-text font-mono"
                >
                  email
                </label>
                {fieldErrors.email && (
                  <p className="text-red-300 text-xs mt-2 px-2 py-1 bg-red-900/40 rounded border border-red-700/50 font-mono">
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="group relative">
                <Lock className="absolute left-3 top-4 text-slate-500 w-5 h-5 group-focus-within:text-cyan-400 transition-colors" />
                <input
                  required
                  type={showSignupPassword ? "text" : "password"}
                  id="signup-pass"
                  name="password"
                  value={signupFields.password}
                  onChange={handleSignupFieldChange}
                  className={`peer w-full bg-slate-900/50 border text-white px-10 pr-12 py-4 rounded-lg outline-none focus:ring-1 transition-all placeholder-transparent ${
                    fieldErrors.password
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-slate-700 focus:border-cyan-500 focus:ring-cyan-500"
                  }`}
                  placeholder="Password"
                />
                <label
                  htmlFor="signup-pass"
                  className="absolute left-10 -top-2.5 bg-[#0f111a] px-2 text-xs text-slate-500 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-500 peer-placeholder-shown:top-[14px] peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-cyan-400 transition-all cursor-text font-mono"
                >
                  password
                </label>
                <button
                  type="button"
                  onClick={() => setShowSignupPassword((prev) => !prev)}
                  className="absolute right-3 top-3.5 text-slate-500 hover:text-cyan-300 transition-colors"
                  aria-label={
                    showSignupPassword ? "Hide password" : "Show password"
                  }
                >
                  {showSignupPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
                {fieldErrors.password && (
                  <p className="text-red-300 text-xs mt-2 px-2 py-1 bg-red-900/40 rounded border border-red-700/50 font-mono">
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              {/* Password Strength Checklist */}
              {signupFields.password && (
                <>
                  <PasswordStrength
                    strength={passwordStrength.strength}
                    requirementsMet={passwordStrength.requirementsMet}
                  />

                  {/* Strong Password Indicator */}
                  {passwordStrength.strengthLabel === "strong" && (
                    <div className="flex items-center gap-2 p-3 bg-green-900/20 border border-green-600/50 rounded-lg text-green-400 text-sm font-mono">
                      <CheckCircle size={18} className="text-green-400" />
                      <span>✓ Password strength requirement met</span>
                    </div>
                  )}
                </>
              )}

              {/* Confirm Password */}
              <div className="group relative">
                <Lock className="absolute left-3 top-4 text-slate-500 w-5 h-5 group-focus-within:text-cyan-400 transition-colors" />
                <input
                  required
                  type={showSignupConfirm ? "text" : "password"}
                  id="signup-confirm-pass"
                  name="confirmPassword"
                  value={signupFields.confirmPassword}
                  onChange={handleSignupFieldChange}
                  className={`peer w-full bg-slate-900/50 border text-white px-10 pr-12 py-4 rounded-lg outline-none focus:ring-1 transition-all placeholder-transparent ${
                    fieldErrors.confirmPassword
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-slate-700 focus:border-cyan-500 focus:ring-cyan-500"
                  }`}
                  placeholder="Confirm Password"
                />
                <label
                  htmlFor="signup-confirm-pass"
                  className="absolute left-10 -top-2.5 bg-[#0f111a] px-2 text-xs text-slate-500 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-500 peer-placeholder-shown:top-[14px] peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-cyan-400 transition-all cursor-text font-mono"
                >
                  confirm_password
                </label>
                <button
                  type="button"
                  onClick={() => setShowSignupConfirm((prev) => !prev)}
                  className="absolute right-3 top-3.5 text-slate-500 hover:text-cyan-300 transition-colors"
                  aria-label={
                    showSignupConfirm ? "Hide password" : "Show password"
                  }
                >
                  {showSignupConfirm ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
                {fieldErrors.confirmPassword && (
                  <p className="text-red-300 text-xs mt-2 px-2 py-1 bg-red-900/40 rounded border border-red-700/50 font-mono">
                    {fieldErrors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={
                isAuthAttempting ||
                Object.keys(fieldErrors).length > 0 ||
                !signupFields.username ||
                !signupFields.email ||
                !signupFields.password ||
                !signupFields.confirmPassword ||
                !passwordStrength.isStrong
              }
              className="mt-4 md:mt-8 w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-cyan-600/50 disabled:cursor-not-allowed text-white font-bold py-3 px-12 rounded-lg transition-all transform hover:-translate-y-0.5 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] flex items-center justify-center gap-2 group"
            >
              {isAuthAttempting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Zap
                  size={18}
                  className="group-hover:text-yellow-300 transition-colors"
                />
              )}
              <span>
                {isAuthAttempting ? "AUTHORIZING..." : "EXECUTE_SIGNUP"}
              </span>
            </button>
          </form>
        </div>

        {/* --- Sign In Form --- */}
        <div
          className={`
            transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]
            w-full md:w-1/2
            ${!isSignUp ? "block" : "hidden"} md:block
            relative p-4 md:p-0
            md:absolute md:top-0 md:h-full
            overflow-y-auto max-h-screen
            ${
              isSignUp
                ? "md:translate-x-full md:opacity-0"
                : "md:left-0 md:opacity-100 md:z-50"
            }
          `}
        >
          <form
            onSubmit={(e) => handleAuthSubmit(e, false)}
            className="h-full flex flex-col items-center justify-center text-center bg-[#0f111a] p-0 md:px-12"
          >
            {/* Error Message - Inline */}
            {error && (
              <Alert
                variant="destructive"
                className="w-full mb-6 border-red-500 bg-red-900/20 text-red-600"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription className="mt-2 text-sm">
                  {error}
                  {unverifiedEmail && (
                    <button
                      onClick={handleResendVerification}
                      disabled={isAuthAttempting}
                      className="mt-3 block w-full text-xs bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-3 py-2 rounded transition-colors font-medium"
                    >
                      {isAuthAttempting
                        ? "Resending..."
                        : "Resend Verification Email"}
                    </button>
                  )}
                </AlertDescription>
              </Alert>
            )}

            {/* Success Message - Inline */}
            {successMessage && (
              <Alert className="w-full mb-6 border-green-500 bg-green-900/20 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription className="mt-2 text-sm whitespace-pre-line">
                  {successMessage}
                </AlertDescription>
              </Alert>
            )}

            <div className="hidden md:flex items-center justify-center w-12 h-12 bg-violet-500/10 rounded-xl mb-6 border border-violet-500/20 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
              <Code2 size={24} className="text-violet-400" />
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">
              Welcome Back
            </h1>
            <span className="text-slate-500 text-sm mb-8 font-mono">
              Authenticate to continue
            </span>

            <div className="flex gap-4 mb-8">
              <button
                type="button"
                onClick={() => handleGoogleAuth("signin")}
                disabled={isAuthAttempting}
                className="group relative p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-violet-500/50 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-violet-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10">
                  <Chrome size={20} />
                </span>
              </button>
              <button
                type="button"
                onClick={handleGitHubAuth}
                disabled={isAuthAttempting}
                className="group relative p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-violet-500/50 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-violet-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10">
                  <Github size={20} />
                </span>
              </button>
            </div>

            <div className="w-full space-y-5">
              {/* Email */}
              <div className="group relative">
                <Mail className="absolute left-3 top-4 text-slate-500 w-5 h-5 group-focus-within:text-violet-400 transition-colors" />
                <input
                  required
                  type="email"
                  id="signin-email"
                  name="email"
                  value={signinFields.email}
                  onChange={handleSigninFieldChange}
                  className={`peer w-full bg-slate-900/50 border text-white px-10 py-4 rounded-lg outline-none focus:ring-1 transition-all placeholder-transparent ${
                    fieldErrors.email
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-slate-700 focus:border-violet-500 focus:ring-violet-500"
                  }`}
                  placeholder="Email"
                />
                <label
                  htmlFor="signin-email"
                  className="absolute left-10 -top-2.5 bg-[#0f111a] px-2 text-xs text-slate-500 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-500 peer-placeholder-shown:top-[14px] peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-violet-400 transition-all cursor-text font-mono"
                >
                  email
                </label>
                {fieldErrors.email && (
                  <p className="text-red-300 text-xs mt-2 px-2 py-1 bg-red-900/40 rounded border border-red-700/50 font-mono">
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="group relative">
                <Lock className="absolute left-3 top-4 text-slate-500 w-5 h-5 group-focus-within:text-violet-400 transition-colors" />
                <input
                  required
                  type={showSigninPassword ? "text" : "password"}
                  id="signin-pass"
                  name="password"
                  value={signinFields.password}
                  onChange={handleSigninFieldChange}
                  className={`peer w-full bg-slate-900/50 border text-white px-10 pr-12 py-4 rounded-lg outline-none focus:ring-1 transition-all placeholder-transparent ${
                    fieldErrors.password
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-slate-700 focus:border-violet-500 focus:ring-violet-500"
                  }`}
                  placeholder="Password"
                />
                <label
                  htmlFor="signin-pass"
                  className="absolute left-10 -top-2.5 bg-[#0f111a] px-2 text-xs text-slate-500 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-500 peer-placeholder-shown:top-[14px] peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-violet-400 transition-all cursor-text font-mono"
                >
                  access_key
                </label>
                <button
                  type="button"
                  onClick={() => setShowSigninPassword((prev) => !prev)}
                  className="absolute right-3 top-3.5 text-slate-500 hover:text-violet-300 transition-colors"
                  aria-label={
                    showSigninPassword ? "Hide password" : "Show password"
                  }
                >
                  {showSigninPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
                {fieldErrors.password && (
                  <p className="text-red-300 text-xs mt-2 px-2 py-1 bg-red-900/40 rounded border border-red-700/50 font-mono">
                    {fieldErrors.password}
                  </p>
                )}
              </div>
            </div>

            <a
              href="/forgot-password"
              className="text-slate-500 text-xs mt-6 hover:text-violet-400 transition-colors font-mono"
            >
              Forgot your password?
            </a>

            <button
              type="submit"
              disabled={
                isAuthAttempting ||
                Object.keys(fieldErrors).length > 0 ||
                !signinFields.email ||
                !signinFields.password
              }
              className="mt-4 md:mt-8 w-full bg-violet-600 hover:bg-violet-500 disabled:bg-violet-600/50 disabled:cursor-not-allowed text-white font-bold py-3 px-12 rounded-lg transition-all transform hover:-translate-y-0.5 shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] flex items-center justify-center gap-2 group"
            >
              {isAuthAttempting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Braces
                  size={18}
                  className="group-hover:rotate-90 transition-transform duration-300"
                />
              )}
              <span>
                {isAuthAttempting ? "AUTHORIZING..." : "INITIALIZE_SESSION"}
              </span>
            </button>
          </form>
        </div>

        {/* --- Sliding Overlay Panel --- */}
        <div
          className={`
            hidden md:block
            absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] z-[100]
            ${isSignUp ? "-translate-x-full" : ""}
          `}
        >
          <div
            className={`
              bg-gradient-to-r from-violet-600 to-cyan-600
              relative -left-full h-full w-[200%] transform transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]
              ${isSignUp ? "translate-x-1/2" : "translate-x-0"}
            `}
          >
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

            {/* Left Panel (Sign In) */}
            <div
              className={`absolute top-0 flex flex-col items-center justify-center h-full w-1/2 px-12 text-center transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]
                ${isSignUp ? "translate-x-0" : "-translate-x-[20%]"}`}
            >
              <div className="mb-8 p-6 bg-white/10 rounded-2xl backdrop-blur-xl border border-white/20 shadow-2xl">
                <Cpu size={64} className="text-white animate-pulse" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">
                Already <br /> Connected?
              </h1>
              <p className="text-blue-100 mb-10 text-sm leading-relaxed font-light max-w-[260px]">
                Re-establish connection to the mainframe and sync your latest
                commits.
              </p>
              <button
                type="button"
                onClick={() => setIsSignUp(false)}
                className="relative px-8 py-3 text-white font-bold rounded-lg overflow-hidden group border border-white/50"
              >
                <span className="absolute inset-0 w-full h-full bg-white/20 group-hover:bg-white/30 transition-colors"></span>
                <span className="relative flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-ping"></span>
                  SIGN IN
                </span>
              </button>
            </div>

            {/* Right Panel (Sign Up) */}
            <div
              className={`absolute top-0 right-0 flex flex-col items-center justify-center h-full w-1/2 px-12 text-center transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]
                ${isSignUp ? "translate-x-[20%]" : "translate-x-0"}`}
            >
              <div className="mb-8 p-6 bg-white/10 rounded-2xl backdrop-blur-xl border border-white/20 shadow-2xl">
                <Terminal size={64} className="text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">
                New <br /> Protocol?
              </h1>
              <p className="text-blue-100 mb-10 text-sm leading-relaxed font-light max-w-[260px]">
                Initialize a new developer instance and start building your
                legacy.
              </p>
              <button
                type="button"
                onClick={() => setIsSignUp(true)}
                className="relative px-8 py-3 text-white font-bold rounded-lg overflow-hidden group border border-white/50"
              >
                <span className="absolute inset-0 w-full h-full bg-white/20 group-hover:bg-white/30 transition-colors"></span>
                <span className="relative flex items-center gap-2">
                  <span className="w-2 h-2 bg-cyan-300 rounded-full animate-pulse"></span>
                  SIGN UP
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
