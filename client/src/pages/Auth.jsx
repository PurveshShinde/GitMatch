import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  Users,
  Terminal,
  Code2,
  Cpu,
  Braces,
  Zap,
  Briefcase,
  Clock,
  GitBranch,
  Loader2,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  X,
  Trophy,
  Activity,
  Layers,
} from "lucide-react";

import { SignUpForm, SignInForm, AuthOverlay } from "../components/AuthForms";

// --- 4. ONBOARDING DATA & OPTIONS ---
const initialData = {
  accountType: "",
  experienceYears: "",
  primaryLanguage: "",
  secondaryLanguages: [],
  coreSkills: [],
  githubUsername: "gitmatch_user",
  githubActivityLevel: "",
  preferredIssueTypes: [],
  preferredRepoScale: "",
  goals: [],
  preferredTeamSize: "",
  preferredCommunication: "",
  skillVerificationChoice: "",
  weeklyAvailability: "",
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  workStyle: "",
  completedOnboarding: false,
  createdAt: null,
};

const options = {
  accountType: ["Student", "Professional", "Freelancer", "Hobbyist"],
  experienceYears: ["0-1", "1-3", "3-5", "5+"],
  primaryLanguage: [
    "JavaScript/TypeScript",
    "Python",
    "Rust",
    "Go",
    "Java",
    "C#",
    "PHP",
    "Other",
  ],
  secondaryLanguages: [
    "React",
    "Node.js",
    "Vue",
    "Angular",
    "Next.js",
    "Django",
    "Spring",
    "TensorFlow",
    "Docker",
  ],
  coreSkills: [
    "React",
    "Node.js",
    "Firebase",
    "Tailwind",
    "Python",
    "FastAPI",
    "Rust",
    "PostgreSQL",
    "AWS",
    "Docker",
    "ML/AI",
    "Solidity",
    "DevOps",
  ],
  githubActivityLevel: ["Rarely", "Occasionally", "Weekly", "Daily"],
  preferredIssueTypes: [
    "Bug fixes",
    "Feature requests",
    "Documentation",
    "Optimization",
  ],
  preferredRepoScale: [
    "Small (solo / indie)",
    "Medium (3-10 contributors)",
    "Large (OSS)",
  ],
  goals: [
    "Solve GitHub issues",
    "Find collaborators",
    "Build a team",
    "Join a project",
    "Get hired",
  ],
  preferredTeamSize: ["Solo", "Pair", "3–5", "6–10"],
  preferredCommunication: [
    "Async (text / GitHub)",
    "Real-time (voice / video)",
    "Hybrid",
  ],
  skillVerificationChoice: [
    "Quick MCQ skill test",
    "Short coding challenge",
    "No tests for now",
  ],
  weeklyAvailability: ["< 5", "5–10", "10–20", "20+"],
  workStyle: [
    "Fast & iterative",
    "Slow & stable",
    "Deadline focused",
    "Research / experimental",
  ],
};

// --- REUSABLE ONBOARDING COMPONENTS ---

const SelectCard = ({ value, icon: Icon, onClick, isSelected }) => (
  <button
    type="button"
    onClick={onClick}
    className={`
      flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 w-full min-h-[100px] text-left
      ${
        isSelected
          ? "border-blue-500 bg-blue-900/30 shadow-[0_0_15px_rgba(37,99,235,0.4)] text-white"
          : "border-slate-700 bg-slate-800/50 hover:border-slate-500 text-slate-400 hover:text-white"
      }
    `}
  >
    <Icon className="w-6 h-6 mb-2" />
    <span className="font-mono text-xs md:text-sm font-semibold text-center">
      {value}
    </span>
  </button>
);

const ChipSelect = ({ label, currentSelection, allOptions, max, onToggle }) => {
  const isMulti = max > 1;
  const isMaxReached = currentSelection.length >= max;

  return (
    <div className="space-y-3">
      <label className="text-slate-300 font-mono text-sm block">
        {label} {isMulti && <span className="text-slate-500">({max} max)</span>}
      </label>
      <div className="flex flex-wrap gap-2">
        {allOptions.map((option) => {
          const isSelected = currentSelection.includes(option);
          const isDisabled = isMulti && !isSelected && isMaxReached;

          return (
            <button
              key={option}
              type="button"
              onClick={() => onToggle(option)}
              disabled={isDisabled}
              className={`
                px-4 py-2 rounded-full text-xs font-mono transition-all duration-150 border
                ${
                  isSelected
                    ? "bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/20"
                    : "bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white"
                }
                ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
              `}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// --- 4. AUTH PAGE (Unified Component) ---
const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // --- AUTH/SLIDING STATE ---
  const [isSignUp, setIsSignUp] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isAuthAttempting, setIsAuthAttempting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // --- ONBOARDING STATE ---
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(initialData);
  const [onboardingStatus, setOnboardingStatus] = useState({
    isCompleted: false,
    isLoading: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const totalSteps = 6;

  // --- REDIRECT HANDLER ---
  const goToDashboard = () => {
    console.log("Onboarding complete. Navigating to /dashboard...");
    navigate("/dashboard");
  };

  // --- EFFECT 1: Handle Initial Navigation & Sliding Panel ---
  useEffect(() => {
    if (location.state?.mode === "signup") setIsSignUp(true);
    else if (location.state?.mode === "signin") setIsSignUp(false);
  }, [location]);

  // --- EFFECT 2: Parallax Background ---
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

  // --- AUTH FORM SUBMISSION HANDLER ---
  const handleAuthSubmit = async (e, isSignupForm) => {
    e.preventDefault();
    setError(null);
    setIsAuthAttempting(true);

    const email = e.target.querySelector("input[type=email]").value;
    const password = e.target.querySelector("input[type=password]").value;

    // Placeholder: Connect to your backend API here
    console.log(isSignupForm ? "SIGNUP" : "SIGNIN", { email, password });

    // Simulate auth delay
    setTimeout(() => {
      setIsAuthAttempting(false);
      setIsAuthenticated(true);
      setOnboardingStatus({ isCompleted: false, isLoading: false });
      // TODO: Handle actual authentication on your backend
    }, 500);
  };

  // --- ONBOARDING HANDLERS ---
  const handleNext = () => {
    // Simple validation
    if (step === 1 && (!formData.accountType || !formData.experienceYears))
      return;
    if (
      step === 2 &&
      (!formData.primaryLanguage || formData.coreSkills.length === 0)
    )
      return;
    if (
      step === 3 &&
      (!formData.githubActivityLevel ||
        formData.preferredIssueTypes.length === 0 ||
        !formData.preferredRepoScale)
    )
      return;
    if (
      step === 4 &&
      (!formData.goals.length ||
        !formData.preferredTeamSize ||
        !formData.preferredCommunication)
    )
      return;
    if (step === 5 && !formData.skillVerificationChoice) return;
    if (step === 6 && (!formData.weeklyAvailability || !formData.workStyle))
      return;

    setStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSingleSelect = (key, value) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  const handleMultiToggle = (key, value) => {
    setFormData((prev) => {
      const current = prev[key] || [];
      if (current.includes(value)) {
        return { ...prev, [key]: current.filter((item) => item !== value) };
      } else {
        const maxLimit = key === "coreSkills" ? 5 : 3;
        if (current.length < maxLimit) {
          return { ...prev, [key]: [...current, value] };
        }
        return prev;
      }
    });
  };

  // --- SUBMISSION HANDLER (Saves locally and Redirects) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    const dataToSave = {
      ...formData,
      completedOnboarding: true,
      createdAt: new Date().toISOString(),
    };

    try {
      // TODO: Send to your backend API
      console.log("Saving onboarding data:", dataToSave);

      // Simulate save delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      setOnboardingStatus({ isCompleted: true, isLoading: false });
      goToDashboard();
    } catch (e) {
      console.error("Error saving profile:", e);
      setError("Failed to save profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- RENDER CURRENT STEP CONTENT (ONBOARDING) ---
  const renderOnboardingStep = (currentStep) => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-white font-mono flex items-center gap-3">
              <Briefcase className="w-6 h-6 text-blue-400" />
              1. Identity & Experience
            </h2>
            <p className="text-slate-400 text-sm">
              Define your current status and professional experience.
            </p>
            <div>
              <label className="text-slate-300 font-mono text-sm block mb-3">
                Are you a:
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {options.accountType.map((type) => (
                  <SelectCard
                    key={type}
                    value={type}
                    icon={User}
                    isSelected={formData.accountType === type}
                    onClick={() => handleSingleSelect("accountType", type)}
                  />
                ))}
              </div>
            </div>
            <div>
              <label className="text-slate-300 font-mono text-sm block mb-3">
                Years of experience:
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {options.experienceYears.map((years) => (
                  <SelectCard
                    key={years}
                    value={years}
                    icon={Clock}
                    isSelected={formData.experienceYears === years}
                    onClick={() => handleSingleSelect("experienceYears", years)}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-white font-mono flex items-center gap-3">
              <Code2 className="w-6 h-6 text-purple-400" />
              2. Tech Profile
            </h2>
            <p className="text-slate-400 text-sm">
              Define your stack for accurate matchmaking.
            </p>
            <div>
              <label
                htmlFor="primary-lang"
                className="text-slate-300 font-mono text-sm block mb-3"
              >
                Primary programming language:
              </label>
              <select
                id="primary-lang"
                value={formData.primaryLanguage}
                onChange={(e) =>
                  handleSingleSelect("primaryLanguage", e.target.value)
                }
                className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              >
                <option value="" disabled>
                  Select your primary language
                </option>
                {options.primaryLanguage.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
            <ChipSelect
              label="Core Skills (up to 5):"
              currentSelection={formData.coreSkills}
              allOptions={options.coreSkills}
              max={5}
              onToggle={(skill) => handleMultiToggle("coreSkills", skill)}
            />
            <ChipSelect
              label="Secondary Languages/Frameworks (up to 3):"
              currentSelection={formData.secondaryLanguages}
              allOptions={options.secondaryLanguages}
              max={3}
              onToggle={(lang) => handleMultiToggle("secondaryLanguages", lang)}
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-white font-mono flex items-center gap-3">
              <GitBranch className="w-6 h-6 text-green-400" />
              3. GitHub Activity
            </h2>
            <p className="text-slate-400 text-sm">
              How you interact with open source.
            </p>
            <div>
              <label
                htmlFor="github-user"
                className="text-slate-300 font-mono text-sm block mb-3"
              >
                GitHub Username:
              </label>
              <div className="relative">
                <Github className="absolute left-3 top-3.5 text-slate-500 w-5 h-5" />
                <input
                  id="github-user"
                  type="text"
                  value={formData.githubUsername}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      githubUsername: e.target.value,
                    }))
                  }
                  className="w-full bg-slate-800 border border-slate-700 text-white px-10 py-3 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-500"
                  placeholder="Your GitHub Handle"
                />
              </div>
            </div>
            <div>
              <label className="text-slate-300 font-mono text-sm block mb-3">
                How active are you on GitHub?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {options.githubActivityLevel.map((level) => (
                  <SelectCard
                    key={level}
                    value={level}
                    icon={Activity}
                    isSelected={formData.githubActivityLevel === level}
                    onClick={() =>
                      handleSingleSelect("githubActivityLevel", level)
                    }
                  />
                ))}
              </div>
            </div>
            <ChipSelect
              label="Preferred Issue Types (up to 3):"
              currentSelection={formData.preferredIssueTypes}
              allOptions={options.preferredIssueTypes}
              max={3}
              onToggle={(type) =>
                handleMultiToggle("preferredIssueTypes", type)
              }
            />
            <div>
              <label className="text-slate-300 font-mono text-sm block mb-3">
                Preferred repo scale:
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {options.preferredRepoScale.map((scale) => (
                  <SelectCard
                    key={scale}
                    value={scale}
                    icon={Layers}
                    isSelected={formData.preferredRepoScale === scale}
                    onClick={() =>
                      handleSingleSelect("preferredRepoScale", scale)
                    }
                  />
                ))}
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-white font-mono flex items-center gap-3">
              <Users className="w-6 h-6 text-cyan-400" />
              4. Collaboration Profile
            </h2>
            <p className="text-slate-400 text-sm">
              Your goals and preferred work environment.
            </p>
            <ChipSelect
              label="What are you here for? (up to 3):"
              currentSelection={formData.goals}
              allOptions={options.goals}
              max={3}
              onToggle={(goal) => handleMultiToggle("goals", goal)}
            />
            <div>
              <label className="text-slate-300 font-mono text-sm block mb-3">
                Preferred team size:
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {options.preferredTeamSize.map((size) => (
                  <SelectCard
                    key={size}
                    value={size}
                    icon={Users}
                    isSelected={formData.preferredTeamSize === size}
                    onClick={() =>
                      handleSingleSelect("preferredTeamSize", size)
                    }
                  />
                ))}
              </div>
            </div>
            <div>
              <label className="text-slate-300 font-mono text-sm block mb-3">
                Preferred communication:
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {options.preferredCommunication.map((comm) => (
                  <SelectCard
                    key={comm}
                    value={comm}
                    icon={Zap}
                    isSelected={formData.preferredCommunication === comm}
                    onClick={() =>
                      handleSingleSelect("preferredCommunication", comm)
                    }
                  />
                ))}
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-white font-mono flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-yellow-400" />
              5. Skill Verification
            </h2>
            <p className="text-slate-400 text-sm">
              Optional: verifying your skills improves matchmaking accuracy.
            </p>
            <div>
              <label className="text-slate-300 font-mono text-sm block mb-3">
                Are you open to:
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {options.skillVerificationChoice.map((choice) => (
                  <SelectCard
                    key={choice}
                    value={choice}
                    icon={Trophy}
                    isSelected={formData.skillVerificationChoice === choice}
                    onClick={() =>
                      handleSingleSelect("skillVerificationChoice", choice)
                    }
                  />
                ))}
              </div>
            </div>
            <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-slate-400">
              Note: Opting into verification will unlock the highest tiers of
              paid collaboration opportunities.
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-white font-mono flex items-center gap-3">
              <Clock className="w-6 h-6 text-red-400" />
              6. Commitment & Style
            </h2>
            <p className="text-slate-400 text-sm">
              Your available time and preferred working cadence.
            </p>
            <div>
              <label className="text-slate-300 font-mono text-sm block mb-3">
                Available hours / week:
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {options.weeklyAvailability.map((hours) => (
                  <SelectCard
                    key={hours}
                    value={hours}
                    icon={Clock}
                    isSelected={formData.weeklyAvailability === hours}
                    onClick={() =>
                      handleSingleSelect("weeklyAvailability", hours)
                    }
                  />
                ))}
              </div>
            </div>
            <div>
              <label className="text-slate-300 font-mono text-sm block mb-3">
                Work style:
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {options.workStyle.map((style) => (
                  <SelectCard
                    key={style}
                    value={style}
                    icon={GitBranch}
                    isSelected={formData.workStyle === style}
                    onClick={() => handleSingleSelect("workStyle", style)}
                  />
                ))}
              </div>
            </div>
            <div>
              <label className="text-slate-300 font-mono text-sm block mb-3">
                Timezone (Auto-detected):
              </label>
              <div className="p-3 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono text-sm">
                {formData.timezone}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // --- MAIN RENDER LOGIC ---

  // 1. Initialize loading state
  useEffect(() => {
    // Skip Firebase check and go straight to showing auth forms
    setOnboardingStatus({ isCompleted: false, isLoading: false });
  }, []);

  // 2. Onboarding Complete State (Ready to redirect)
  if (onboardingStatus.isCompleted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0f] text-white p-6">
        <CheckCircle className="w-16 h-16 text-green-500 mb-4 animate-bounce" />
        <h1 className="text-3xl font-bold font-mono">ONBOARDING_SUCCESS</h1>
        <p className="text-slate-400 mt-2">
          Profile saved. Redirecting to /dashboard...
        </p>
      </div>
    );
  }

  // 3. ONBOARDING FLOW UI (After successful auth)
  if (isAuthenticated && !onboardingStatus.isCompleted) {
    return (
      <div className="min-h-screen bg-[#050508] text-slate-200 font-sans p-4 md:p-8 flex justify-center items-start pt-8">
        <div className="w-full max-w-4xl bg-[#0f111a] rounded-xl border border-slate-800 shadow-2xl p-6 md:p-10 relative">
          <header className="mb-8 border-b border-slate-800 pb-6">
            <h1 className="text-2xl font-bold font-mono text-blue-400">
              GitMatch Profile Setup
            </h1>
            <p className="text-slate-500 text-sm">
              Final step before dashboard. Answer carefully for best matches.
            </p>
          </header>

          {/* Progress Bar */}
          <div className="mb-10 w-full bg-slate-800 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>

          {/* Render Current Step Content */}
          <div className="min-h-[400px] transition-opacity duration-300">
            {renderOnboardingStep(step)}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-3 bg-red-900/50 border border-red-700 text-red-300 rounded-lg flex items-center gap-2">
              <X className="w-5 h-5" />
              <span>ERROR: {error}</span>
            </div>
          )}

          {/* Navigation Buttons */}
          <footer className="mt-10 pt-6 border-t border-slate-800 flex justify-between">
            <button
              onClick={handleBack}
              disabled={step === 1 || isSubmitting}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-lg font-mono text-sm transition-all
                ${
                  step === 1 || isSubmitting
                    ? "bg-slate-800 text-slate-600 cursor-not-allowed"
                    : "bg-slate-700 hover:bg-slate-600 text-white"
                }
              `}
            >
              <ArrowLeft className="w-4 h-4" />
              BACK
            </button>

            {step < totalSteps ? (
              <button
                onClick={handleNext}
                disabled={isSubmitting}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-lg font-mono text-sm transition-all
                  ${
                    isSubmitting
                      ? "bg-blue-800/50 text-slate-500 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/30"
                  }
                `}
              >
                NEXT <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-lg font-mono text-sm transition-all
                  ${
                    isSubmitting
                      ? "bg-green-800/50 text-slate-500 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-500 text-white shadow-md shadow-green-500/30"
                  }
                `}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> SAVING...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" /> COMPLETE_SETUP
                  </>
                )}
              </button>
            )}
          </footer>
        </div>
      </div>
    );
  }

  // 4. AUTH FORMS UI (Default View - If NO user is logged in)
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4 font-sans selection:bg-cyan-500/30 relative overflow-hidden">
      {/* --- Advanced Animated Background --- */}
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
        {/* --- Mobile Toggle Tabs (Visible only on mobile) --- */}
        <div className="md:hidden flex border-b border-slate-800">
          <button
            onClick={() => setIsSignUp(false)}
            className={`flex-1 py-4 text-sm font-bold transition-colors font-mono tracking-wide ${
              !isSignUp
                ? "text-cyan-400 border-b-2 border-cyan-400 bg-slate-900/50"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            // Sign In
          </button>
          <button
            onClick={() => setIsSignUp(true)}
            className={`flex-1 py-4 text-sm font-bold transition-colors font-mono tracking-wide ${
              isSignUp
                ? "text-violet-400 border-b-2 border-violet-400 bg-slate-900/50"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            // Sign Up
          </button>
        </div>

        {/* Error Message Display for Auth Forms */}
        {error && !isAuthAttempting && (
          <div className="absolute top-0 w-full p-3 bg-red-900/50 border-b border-red-700 text-red-300 text-sm font-mono flex items-center justify-center z-50">
            <X className="w-4 h-4 mr-2" />
            AUTH_FAILED: {error}
          </div>
        )}

        {/* Sign Up Form */}
        <SignUpForm
          isAuthAttempting={isAuthAttempting}
          error={error}
          onSubmit={(e) => handleAuthSubmit(e, true)}
          onToggle={isSignUp}
        />

        {/* Sign In Form */}
        <SignInForm
          isAuthAttempting={isAuthAttempting}
          error={error}
          onSubmit={(e) => handleAuthSubmit(e, false)}
          onToggle={isSignUp}
        />

        {/* Overlay */}
        <AuthOverlay isSignUp={isSignUp} onToggleForms={setIsSignUp} />
      </div>
    </div>
  );
};

export default AuthPage;
