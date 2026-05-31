import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "../redux/authSlice";
import {
  User,
  Shield,
  Code2,
  Target,
  Bell,
  Lock,
  Palette,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Save,
  LogOut,
  Github,
  Globe,
  Clock,
  Mail,
  Monitor,
  Trash2,
  RefreshCw,
  Moon,
  Sun,
  Terminal,
  ArrowLeft,
  ExternalLink,
  Link as LinkIcon,
  Unlink,
} from "lucide-react";

// Simple Icon component for header
const SettingsIcon = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

// --- REDUX & API ---
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

// --- HELPER: GITHUB AVATAR ---
const githubAvatar = (username) =>
  username
    ? `https://github.com/${username}.png`
    : "https://github.com/octocat.png";

// --- REUSABLE UI COMPONENTS ---

const Section = ({
  title,
  icon: Icon,
  isOpen,
  onToggle,
  children,
  isDanger = false,
}) => (
  <div
    className={`mb-4 rounded-xl border transition-all duration-300 overflow-hidden ${
      isDanger
        ? "bg-red-950/10 border-red-900/30 hover:border-red-800/50"
        : "bg-[#0f111a] border-slate-800 hover:border-slate-700"
    }`}
  >
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-6 focus:outline-none"
    >
      <div className="flex items-center gap-4">
        <div
          className={`p-2 rounded-lg ${
            isDanger
              ? "bg-red-500/10 text-red-500"
              : "bg-slate-800 text-blue-400"
          }`}
        >
          <Icon className="w-5 h-5" />
        </div>
        <div className="text-left">
          <h3
            className={`font-bold text-base ${
              isDanger ? "text-red-400" : "text-slate-200"
            }`}
          >
            {title}
          </h3>
        </div>
      </div>
      {isOpen ? (
        <ChevronUp className="w-5 h-5 text-slate-500" />
      ) : (
        <ChevronDown className="w-5 h-5 text-slate-500" />
      )}
    </button>

    <div
      className={`transition-all duration-300 ease-in-out ${
        isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      <div className="p-6 pt-0 border-t border-slate-800/50">
        <div className="pt-6 space-y-6">{children}</div>
      </div>
    </div>
  </div>
);

const InputGroup = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  icon: Icon,
  helpText,
  extraContent = null,
}) => (
  <div className="space-y-2">
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
      {label}
    </label>
    <div className="flex gap-3">
      <div className="relative group flex-1">
        {Icon && (
          <Icon className="absolute left-3 top-2.5 w-4 h-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
        )}
        <input
          type={type}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full bg-[#0a0a0f] border border-slate-800 rounded-lg py-2 text-sm text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all ${
            Icon ? "pl-10" : "px-4"
          }`}
        />
      </div>
      {extraContent}
    </div>
    {helpText && <p className="text-[10px] text-slate-600">{helpText}</p>}
  </div>
);

const Toggle = ({ label, description, enabled, onToggle, danger = false }) => (
  <div className="flex items-center justify-between py-2">
    <div className="pr-4">
      <h4 className="text-sm font-medium text-slate-300">{label}</h4>
      {description && (
        <p className="text-xs text-slate-500 mt-0.5">{description}</p>
      )}
    </div>
    <button
      onClick={() => onToggle(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
        enabled ? (danger ? "bg-red-500" : "bg-blue-600") : "bg-slate-700"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  </div>
);

const Badge = ({ text, color = "blue" }) => {
  const colors = {
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    green: "bg-green-500/10 text-green-400 border-green-500/20",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    yellow: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    red: "bg-red-500/10 text-red-400 border-red-500/20",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
        colors[color] || colors.blue
      }`}
    >
      {text}
    </span>
  );
};

// --- MAIN COMPONENT ---

const Settings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.auth);

  const [saving, setSaving] = useState(false);
  const [openSection, setOpenSection] = useState("account");
  const [linkingGitHub, setLinkingGitHub] = useState(false);

  // Form States
  const [formData, setFormData] = useState({
    // Account
    displayName: "",
    username: "",
    bio: "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    workHours: "09:00 - 17:00",

    // Security
    email: "",
    githubConnected: false,

    // Dev Profile
    skills: "",
    coreSkills: [],
    role: "Frontend Developer",
    experience: "1-3 Years",
    availability: "Open to collaborate",

    // Matching
    prefLevel: "Any Level",
    prefComm: "Async",
    prefTeamSize: "3-5",

    // Notifications
    emailNotifs: true,
    pushNotifs: false,

    // Privacy
    publicProfile: true,
    hideEmail: true,

    // Appearance
    theme: "dark",
    glassMode: true,
  });

  // --- DATA POPULATION ---
  useEffect(() => {
    if (currentUser) {
      const onboardingData = currentUser.onboardingData || {};
      setFormData((prev) => ({
        ...prev,
        displayName: currentUser.displayName || currentUser.username || "",
        username: currentUser.username || "",
        email: currentUser.email || "",
        bio: onboardingData.bio || "",
        timezone:
          onboardingData.timezone ||
          Intl.DateTimeFormat().resolvedOptions().timeZone,
        workHours: onboardingData.workHours || "09:00 - 17:00",
        skills: Array.isArray(onboardingData.coreSkills)
          ? onboardingData.coreSkills.join(", ")
          : onboardingData.skills || "",
        coreSkills: onboardingData.coreSkills || [],
        role: onboardingData.role || "Frontend Developer",
        experience: onboardingData.experience || "1-3 Years",
        availability: onboardingData.availability || "Open to collaborate",
        prefLevel: onboardingData.prefLevel || "Any Level",
        prefComm: onboardingData.prefComm || "Async",
        prefTeamSize: onboardingData.prefTeamSize || "3-5",
        emailNotifs: onboardingData.emailNotifs !== false,
        pushNotifs: onboardingData.pushNotifs || false,
        publicProfile: onboardingData.publicProfile !== false,
        hideEmail: onboardingData.hideEmail !== false,
        theme: onboardingData.theme || "dark",
        glassMode: onboardingData.glassMode !== false,
        githubConnected: !!currentUser.githubUsername,
      }));
    }
  }, [currentUser]);

  // --- GITHUB CALLBACK MESSAGE LISTENER ---
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === "github_auth_complete" && event.data?.code) {
        exchangeCodeForGitHubAuth(event.data.code);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // --- HANDLERS ---
  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // --- GITHUB LOGIC: REAL-TIME AUTH ---

  const handleLinkGitHub = async () => {
    const githubClientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    const githubRedirectUri = import.meta.env.VITE_GITHUB_REDIRECT_URI;

    if (!githubClientId || !githubRedirectUri) {
      alert("GitHub OAuth credentials not configured.");
      return;
    }

    try {
      setLinkingGitHub(true);
      const state = Math.random().toString(36).substring(7);
      sessionStorage.setItem("github_oauth_state", state);

      const authUrl = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${encodeURIComponent(githubRedirectUri)}&scope=read:user&state=${state}`;

      const width = 500;
      const height = 600;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      const popup = window.open(
        authUrl,
        "github_auth",
        `width=${width},height=${height},left=${left},top=${top},scrollbars=yes`,
      );

      if (!popup) {
        alert(
          "Failed to open authorization popup. Please check your popup blocker settings.",
        );
        setLinkingGitHub(false);
        return;
      }

      const pollInterval = setInterval(() => {
        try {
          if (popup.closed) {
            clearInterval(pollInterval);
            const authCode = sessionStorage.getItem("github_auth_code");
            if (authCode) {
              sessionStorage.removeItem("github_auth_code");
              exchangeCodeForGitHubAuth(authCode);
            }
            setLinkingGitHub(false);
          }
        } catch (e) {
          console.error("Popup polling error:", e);
        }
      }, 500);

      setTimeout(() => {
        clearInterval(pollInterval);
        if (!popup.closed) {
          popup.close();
        }
        setLinkingGitHub(false);
      }, 120000);
    } catch (e) {
      console.error("GitHub auth error:", e);
      alert(`Failed to connect GitHub: ${e.message}`);
      setLinkingGitHub(false);
    }
  };

  const exchangeCodeForGitHubAuth = async (code) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/github`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to connect GitHub");
      }

      // Update Redux with latest user data
      if (data.user) {
        dispatch(updateUser(data.user));
      }

      // Update local form state
      setFormData((prev) => ({
        ...prev,
        username: data.user?.githubUsername || prev.username,
        githubConnected: true,
      }));

      alert(
        `Successfully connected GitHub account: ${data.user?.githubUsername}`,
      );
    } catch (error) {
      console.error("GitHub auth error:", error);
      alert(`Failed to connect GitHub: ${error.message}`);
    }
  };

  const handleUnlinkGitHub = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/unlink-github`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to unlink GitHub");
      }

      // Update Redux with latest user data
      if (data.user) {
        dispatch(updateUser(data.user));
      }

      setFormData((prev) => ({
        ...prev,
        username: "",
        githubConnected: false,
      }));

      alert("GitHub account disconnected successfully.");
    } catch (error) {
      console.error("Unlink GitHub error:", error);
      alert(`Failed to unlink GitHub: ${error.message}`);
    }
  };

  const handleViewGitHub = () => {
    const userToView = formData.username;
    if (userToView) {
      window.open("https://github.com/" + userToView, "_blank");
    }
  };

  const handlePasswordReset = async () => {
    const emailToReset = formData.email || currentUser?.email;
    if (!emailToReset) {
      alert("No linked email address found.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailToReset }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send reset link");
      }

      alert("A password reset link has been sent to your email!");
    } catch (error) {
      console.error("Password reset error:", error);
      alert(`Failed to send reset link: ${error.message}`);
    }
  };

  // --- SAVE HANDLER ---
  const handleSave = async () => {
    if (!currentUser) {
      alert("You must be logged in to save settings.");
      return;
    }

    setSaving(true);

    try {
      const processedSkills = formData.skills
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const dataToSave = {
        displayName: formData.displayName,
        username: formData.username,
        email: formData.email,
        onboardingData: {
          bio: formData.bio,
          timezone: formData.timezone,
          workHours: formData.workHours,
          skills: formData.skills,
          coreSkills: processedSkills,
          role: formData.role,
          experience: formData.experience,
          availability: formData.availability,
          prefLevel: formData.prefLevel,
          prefComm: formData.prefComm,
          prefTeamSize: formData.prefTeamSize,
          emailNotifs: formData.emailNotifs,
          pushNotifs: formData.pushNotifs,
          publicProfile: formData.publicProfile,
          hideEmail: formData.hideEmail,
          theme: formData.theme,
          glassMode: formData.glassMode,
        },
      };

      const response = await fetch(`${API_BASE_URL}/api/users/update-profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(dataToSave),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to save settings");
      }

      // Update Redux with the latest user data
      if (result.user) {
        dispatch(updateUser(result.user));
      }

      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert(`Failed to save: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    navigate("/auth");
  };

  if (!currentUser)
    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center text-blue-500 font-mono">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          <span className="animate-pulse tracking-widest text-xs">
            LOADING SETTINGS...
          </span>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#050508] text-slate-200 font-sans selection:bg-blue-500/30">
      {/* HEADER */}
      <header className="sticky top-0 z-30 bg-[#050508]/80 backdrop-blur-xl border-b border-slate-800/50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-blue-500" /> Settings
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-xs text-slate-500 font-mono">
            Synced
          </span>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20"
          >
            {saving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 lg:p-10 space-y-8 pb-24">
        {/* 1. ACCOUNT SETTINGS */}
        <Section
          title="Account Settings"
          icon={User}
          isOpen={openSection === "account"}
          onToggle={() => toggleSection("account")}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputGroup
              label="Display Name"
              value={formData.displayName}
              onChange={(v) => handleChange("displayName", v)}
              icon={User}
            />
            <InputGroup
              label="Username / Handle"
              value={formData.username}
              onChange={(v) => handleChange("username", v)}
              icon={Terminal}
              placeholder="@username"
              helpText="Enter your GitHub username to fetch your avatar."
              extraContent={
                <div className="shrink-0">
                  <img
                    src={githubAvatar(formData.username)}
                    alt="Avatar"
                    className="w-10 h-10 rounded-lg border border-slate-700 bg-slate-900 object-cover"
                  />
                </div>
              }
            />
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleChange("bio", e.target.value)}
                className="w-full bg-[#0a0a0f] border border-slate-800 rounded-lg p-4 text-sm text-slate-200 focus:border-blue-500 outline-none min-h-[100px]"
              />
            </div>
            <InputGroup
              label="Timezone"
              value={formData.timezone}
              onChange={(v) => handleChange("timezone", v)}
              icon={Globe}
            />
            <InputGroup
              label="Preferred Work Hours"
              value={formData.workHours}
              onChange={(v) => handleChange("workHours", v)}
              icon={Clock}
            />
          </div>
        </Section>

        {/* 2. AUTH & SECURITY */}
        <Section
          title="Authentication & Security"
          icon={Shield}
          isOpen={openSection === "security"}
          onToggle={() => toggleSection("security")}
        >
          <div className="space-y-6">
            <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Github className="w-4 h-4" /> GitHub Account
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  {formData.githubConnected
                    ? `Connected as ${currentUser.githubUsername || formData.username}`
                    : "Not connected"}
                </p>
              </div>
              <div className="flex gap-2">
                {formData.githubConnected ? (
                  <button
                    onClick={handleUnlinkGitHub}
                    className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1.5 rounded hover:bg-red-500/20 transition-colors flex items-center gap-1"
                  >
                    <Unlink className="w-3 h-3" /> Disconnect
                  </button>
                ) : (
                  <button
                    onClick={handleLinkGitHub}
                    className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1.5 rounded hover:bg-blue-500/20 transition-colors flex items-center gap-1"
                  >
                    <LinkIcon className="w-3 h-3" /> Connect GitHub
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputGroup
                label="Email Address"
                type="email"
                value={formData.email || (currentUser ? currentUser.email : "")}
                onChange={(v) => handleChange("email", v)}
                icon={Mail}
              />
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Password
                </label>
                <button
                  onClick={handlePasswordReset}
                  className="w-full flex items-center justify-between bg-[#0a0a0f] border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-400 hover:text-white hover:border-slate-600 transition-all"
                >
                  <span>••••••••••••</span>
                  <span className="text-xs text-blue-400">Send Reset Link</span>
                </button>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
                Active Sessions
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded bg-[#0a0a0f] border border-slate-800">
                  <div className="flex items-center gap-3">
                    <Monitor className="w-4 h-4 text-green-400" />
                    <div>
                      <p className="text-sm font-medium text-white">
                        Chrome on Windows
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Current Session
                      </p>
                    </div>
                  </div>
                  <Badge text="Active" color="green" />
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* 3. DEV PROFILE */}
        <Section
          title="Developer Profile"
          icon={Code2}
          isOpen={openSection === "dev"}
          onToggle={() => toggleSection("dev")}
        >
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Tech Stack (Comma Separated)
              </label>
              <div className="relative">
                <Code2 className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <textarea
                  value={formData.skills}
                  onChange={(e) => handleChange("skills", e.target.value)}
                  className="w-full bg-[#0a0a0f] border border-slate-800 rounded-lg pl-10 pr-4 py-3 text-sm text-slate-200 focus:border-blue-500 outline-none min-h-[80px]"
                  placeholder="e.g. React, Node.js, Python"
                />
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.skills &&
                  formData.skills
                    .split(",")
                    .map(
                      (s, i) =>
                        s.trim() && (
                          <Badge key={i} text={s.trim()} color="blue" />
                        ),
                    )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Primary Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => handleChange("role", e.target.value)}
                  className="w-full bg-[#0a0a0f] border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-200 focus:border-blue-500 outline-none appearance-none"
                >
                  <option>Frontend Developer</option>
                  <option>Backend Developer</option>
                  <option>Fullstack Developer</option>
                  <option>DevOps Engineer</option>
                  <option>Mobile Developer</option>
                  <option>ML Engineer</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Experience
                </label>
                <select
                  value={formData.experience}
                  onChange={(e) => handleChange("experience", e.target.value)}
                  className="w-full bg-[#0a0a0f] border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-200 focus:border-blue-500 outline-none appearance-none"
                >
                  <option>0-1 Years (Junior)</option>
                  <option>1-3 Years (Associate)</option>
                  <option>3-5 Years (Mid-Level)</option>
                  <option>5-8 Years (Senior)</option>
                  <option>8+ Years (Lead/Architect)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Availability Status
                </label>
                <select
                  value={formData.availability}
                  onChange={(e) => handleChange("availability", e.target.value)}
                  className="w-full bg-[#0a0a0f] border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-200 focus:border-blue-500 outline-none appearance-none"
                >
                  <option>Open to collaborate</option>
                  <option>Hiring partner</option>
                  <option>Looking for tasks / issues</option>
                  <option>Busy / Do not disturb</option>
                </select>
              </div>
            </div>
          </div>
        </Section>

        {/* 4. MATCHING PREFERENCES */}
        <Section
          title="Matching Preferences"
          icon={Target}
          isOpen={openSection === "matching"}
          onToggle={() => toggleSection("matching")}
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Preferred Collaborator Level
                </label>
                <select
                  value={formData.prefLevel}
                  onChange={(e) => handleChange("prefLevel", e.target.value)}
                  className="w-full bg-[#0a0a0f] border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-200"
                >
                  <option>Any Level</option>
                  <option>Similar to me</option>
                  <option>Expert / Mentor</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Communication Style
                </label>
                <select
                  value={formData.prefComm}
                  onChange={(e) => handleChange("prefComm", e.target.value)}
                  className="w-full bg-[#0a0a0f] border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-200"
                >
                  <option>Async (Text/Chat)</option>
                  <option>Sync (Voice/Video)</option>
                  <option>Mixed</option>
                </select>
              </div>
            </div>
          </div>
        </Section>

        {/* 5. NOTIFICATIONS */}
        <Section
          title="Notifications"
          icon={Bell}
          isOpen={openSection === "notifs"}
          onToggle={() => toggleSection("notifs")}
        >
          <div className="space-y-1">
            <Toggle
              label="Email Notifications"
              description="Receive weekly summaries and important alerts."
              enabled={formData.emailNotifs}
              onToggle={(v) => handleChange("emailNotifs", v)}
            />
            <Toggle
              label="Push Notifications"
              description="Get real-time alerts for messages and matches."
              enabled={formData.pushNotifs}
              onToggle={(v) => handleChange("pushNotifs", v)}
            />
          </div>
        </Section>

        {/* 6. PRIVACY */}
        <Section
          title="Privacy"
          icon={Lock}
          isOpen={openSection === "privacy"}
          onToggle={() => toggleSection("privacy")}
        >
          <div className="space-y-1">
            <Toggle
              label="Public Profile"
              description="Allow anyone on GitMatch to view your profile."
              enabled={formData.publicProfile}
              onToggle={(v) => handleChange("publicProfile", v)}
            />
            <Toggle
              label="Hide Email Address"
              description="Prevent others from seeing your email."
              enabled={formData.hideEmail}
              onToggle={(v) => handleChange("hideEmail", v)}
            />
          </div>
        </Section>

        {/* 7. APPEARANCE */}
        <Section
          title="Appearance"
          icon={Palette}
          isOpen={openSection === "appearance"}
          onToggle={() => toggleSection("appearance")}
        >
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              {["Light", "Dark", "Amoled"].map((theme) => (
                <button
                  key={theme}
                  onClick={() => handleChange("theme", theme.toLowerCase())}
                  className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                    formData.theme === theme.toLowerCase()
                      ? "bg-blue-600/10 border-blue-500 text-blue-400"
                      : "bg-[#0a0a0f] border-slate-800 text-slate-500 hover:border-slate-600"
                  }`}
                >
                  {theme === "Light" ? (
                    <Sun className="w-6 h-6" />
                  ) : (
                    <Moon className="w-6 h-6" />
                  )}
                  <span className="text-xs font-bold">{theme}</span>
                </button>
              ))}
            </div>

            <div className="space-y-1">
              <Toggle
                label="Glassmorphism Effects"
                description="Enable blur and transparency effects."
                enabled={formData.glassMode}
                onToggle={(v) => handleChange("glassMode", v)}
              />
            </div>
          </div>
        </Section>

        {/* 10. DANGER ZONE */}
        <Section
          title="Danger Zone"
          icon={AlertTriangle}
          isOpen={openSection === "danger"}
          onToggle={() => toggleSection("danger")}
          isDanger={true}
        >
          <div className="space-y-4">
            {/* ADDED: VIEW GITHUB PROFILE BUTTON */}
            <div className="flex items-center justify-between py-3 border-b border-red-900/30">
              <div>
                <h5 className="text-sm font-bold text-slate-300">
                  View Public Profile
                </h5>
                <p className="text-[10px] text-slate-500">
                  Check your GitHub profile page as others see it.
                </p>
              </div>
              <button
                onClick={handleViewGitHub}
                disabled={!formData.username}
                className="text-xs bg-slate-800 text-slate-300 px-3 py-2 rounded border border-slate-700 hover:text-white flex items-center gap-2 disabled:opacity-50"
              >
                <ExternalLink className="w-3 h-3" /> Open GitHub
              </button>
            </div>

            <p className="text-xs text-red-400/80 pt-2">
              Irreversible actions. Please be careful.
            </p>

            <div className="flex items-center justify-between py-3 border-b border-red-900/30">
              <div>
                <h5 className="text-sm font-bold text-slate-300">
                  Reset Onboarding
                </h5>
                <p className="text-[10px] text-slate-500">
                  Clear your profile intro and restart the welcome tour.
                </p>
              </div>
              <button className="text-xs bg-slate-800 text-slate-300 px-3 py-2 rounded border border-slate-700 hover:text-white">
                Reset
              </button>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <h5 className="text-sm font-bold text-red-400">
                  Delete Account
                </h5>
                <p className="text-[10px] text-slate-500">
                  Permanently remove your account and all data.
                </p>
              </div>
              <button className="text-xs bg-red-600 text-white px-3 py-2 rounded hover:bg-red-500 flex items-center gap-2">
                <Trash2 className="w-3 h-3" /> Delete
              </button>
            </div>
          </div>
        </Section>
      </main>

      {/* FLOATING LOGOUT (Mobile/Tablet mostly) */}
      <div className="fixed bottom-6 right-6 z-40 lg:hidden">
        <button
          onClick={handleLogout}
          className="bg-slate-800 text-slate-300 p-4 rounded-full shadow-lg border border-slate-700"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};



export default Settings;
