import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setOnboarded, updateUser } from "../redux/authSlice.js";
import {
  Briefcase,
  Clock,
  Code2,
  GitBranch,
  Users,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  X,
  Trophy,
  Activity,
  Layers,
  Zap,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env?.VITE_API_BASE_URL || "http://localhost:3000";

export default function Onboarding() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser, token } = useSelector((state) => state.auth);

  // Redirect if not logged in or already onboarded
  useEffect(() => {
    if (!currentUser) {
      navigate("/auth");
    } else if (currentUser.isOnboarded) {
      navigate("/Dashboard");
    }
  }, [currentUser, navigate]);

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const totalSteps = 6;

  // Initial Form Data
  const initialData = {
    accountType: "",
    experienceYears: "",
    primaryLanguage: "",
    secondaryLanguages: [],
    coreSkills: [],
    githubUsername: "",
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
  };

  const [formData, setFormData] = useState(initialData);

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

  // Reusable Components
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

  const ChipSelect = ({
    label,
    currentSelection,
    allOptions,
    max,
    onToggle,
  }) => {
    const isMulti = max > 1;
    const isMaxReached = currentSelection.length >= max;

    return (
      <div className="space-y-3">
        <label className="text-slate-300 font-mono text-sm block">
          {label}{" "}
          {isMulti && <span className="text-slate-500">({max} max)</span>}
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

  // Handlers
  const handleNext = () => {
    setError(null);

    if (step === 1) {
      if (!formData.accountType) {
        setError("Please select your account type");
        return;
      }
      if (!formData.experienceYears) {
        setError("Please select your experience level");
        return;
      }
    } else if (step === 2) {
      if (!formData.primaryLanguage) {
        setError("Please select your primary programming language");
        return;
      }
      if (formData.coreSkills.length === 0) {
        setError("Please select at least one core skill");
        return;
      }
    } else if (step === 3) {
      if (!formData.githubActivityLevel) {
        setError("Please select your GitHub activity level");
        return;
      }
      if (formData.preferredIssueTypes.length === 0) {
        setError("Please select at least one issue type");
        return;
      }
      if (!formData.preferredRepoScale) {
        setError("Please select your preferred repository scale");
        return;
      }
    } else if (step === 4) {
      if (formData.goals.length === 0) {
        setError("Please select at least one goal");
        return;
      }
      if (!formData.preferredTeamSize) {
        setError("Please select your preferred team size");
        return;
      }
      if (!formData.preferredCommunication) {
        setError("Please select your preferred communication style");
        return;
      }
    } else if (step === 5) {
      if (!formData.skillVerificationChoice) {
        setError("Please select your skill verification preference");
        return;
      }
    } else if (step === 6) {
      if (!formData.weeklyAvailability) {
        setError("Please select your weekly availability");
        return;
      }
      if (!formData.workStyle) {
        setError("Please select your work style");
        return;
      }
    }

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setError(null);

    // Final validation before submission
    if (!formData.accountType || !formData.experienceYears) {
      setError("Step 1: Please complete all required fields");
      return;
    }
    if (!formData.primaryLanguage || formData.coreSkills.length === 0) {
      setError("Step 2: Please complete all required fields");
      return;
    }
    if (
      !formData.githubActivityLevel ||
      formData.preferredIssueTypes.length === 0 ||
      !formData.preferredRepoScale
    ) {
      setError("Step 3: Please complete all required fields");
      return;
    }
    if (
      formData.goals.length === 0 ||
      !formData.preferredTeamSize ||
      !formData.preferredCommunication
    ) {
      setError("Step 4: Please complete all required fields");
      return;
    }
    if (!formData.skillVerificationChoice) {
      setError("Step 5: Please complete all required fields");
      return;
    }
    if (!formData.weeklyAvailability || !formData.workStyle) {
      setError("Step 6: Please complete all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // Trim GitHub username if provided
      const dataToSubmit = {
        ...formData,
        githubUsername: formData.githubUsername.trim(),
      };

      const response = await fetch(`${API_BASE_URL}/api/auth/onboarding`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify(dataToSubmit),
      });

      const data = await response.json();

      if (data.success) {
        dispatch(setOnboarded());
        if (data.user) {
          dispatch(updateUser(data.user));
        }
        navigate("/Dashboard");
      } else {
        setError(data.message || "Failed to save profile. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
      console.error("Onboarding error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render Current Step
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
                    icon={Users}
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
              <label className="text-slate-300 font-mono text-sm block mb-3">
                Primary programming language:
              </label>
              <select
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
              <label className="text-slate-300 font-mono text-sm block mb-3">
                GitHub Username:
              </label>
              <div className="relative">
                <GitBranch className="absolute left-3 top-3.5 text-slate-500 w-5 h-5" />
                <input
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
              <Trophy className="w-6 h-6 text-yellow-400" />
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

        {/* Current Step Content */}
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
