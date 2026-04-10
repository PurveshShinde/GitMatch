import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  // ... (Lucide Icons remain the same) ...
  Github,
  Code2,
  Users,
  Trophy,
  ArrowRight,
  Menu,
  X,
  GitPullRequest,
  Zap,
  ShieldCheck,
  Terminal,
  Cpu,
  Activity,
  GitMerge,
  Layers,
  LogOut,
  LayoutDashboard,
  Loader2,
} from "lucide-react";

// --- UPDATED: IMPORT CENTRALIZED FIREBASE INSTANCES ---
import { auth, db } from "../firebase"; // Assuming src/firebase.js is one directory up
import { onAuthStateChanged, signOut } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
// --- END IMPORT ---

// Define appId for profile fetching (assuming it's still needed outside the firebase module)
const appId =
  typeof __app_id !== "undefined" ? __app_id : "gitmatch-production";

// --- 1. CUSTOM AUTH HOOK ---
const useAuthAndProfile = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If auth/db are null, the centralization failed or the config wasn't injected.
    if (!auth || !db) {
      console.warn(
        "Auth/DB not available, showing guest state. (Centralized check)"
      );
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // Fetch Profile Data
        try {
          const docRef = doc(
            db,
            "artifacts",
            appId,
            "users",
            currentUser.uid,
            "profile",
            "onboarding"
          );
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setProfile(docSnap.data());
          } else {
            setProfile(null);
          }
        } catch (e) {
          console.error("Error fetching home profile:", e);
          setProfile(null);
        }
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, profile, loading };
};

// --- 2. Advanced Ripple Button Component (No change) ---
const RippleButton = ({
  children,
  to,
  state,
  onClick,
  className,
  variant = "primary",
}) => {
  const [ripples, setRipples] = useState([]);
  const createRipple = (e) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    const newRipple = { x, y, size, id: Date.now() };
    setRipples((prev) => [...prev, newRipple]);
  };
  useEffect(() => {
    if (ripples.length > 0) {
      const timer = setTimeout(() => setRipples((prev) => prev.slice(1)), 600);
      return () => clearTimeout(timer);
    }
  }, [ripples]);
  const baseClasses =
    "relative overflow-hidden transition-all transform active:scale-95 font-bold rounded-lg flex items-center justify-center gap-2 group font-mono text-sm tracking-wide border z-10";
  const variants = {
    primary:
      "bg-blue-600 hover:bg-blue-500 text-white border-blue-500/50 shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)]",
    secondary:
      "bg-[#1e293b] hover:bg-[#334155] text-white border-slate-600 hover:border-slate-500 shadow-lg",
    outline:
      "bg-transparent hover:bg-slate-800/50 text-slate-300 hover:text-white border-slate-700 hover:border-blue-500/50",
    nav: "bg-transparent hover:bg-slate-800 text-slate-400 hover:text-white border-transparent hover:border-slate-700",
  };
  const combinedClasses = `${baseClasses} ${variants[variant]} ${
    className || ""
  }`;
  const content = (
    <>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute bg-white/20 rounded-full animate-ripple pointer-events-none z-0"
          style={{
            top: ripple.y,
            left: ripple.x,
            width: ripple.size,
            height: ripple.size,
          }}
        />
      ))}
    </>
  );
  if (to)
    return (
      <Link
        to={to}
        state={state}
        className={combinedClasses}
        onClick={createRipple}
      >
        {content}
      </Link>
    );
  return (
    <button
      onClick={(e) => {
        createRipple(e);
        onClick && onClick(e);
      }}
      className={combinedClasses}
    >
      {content}
    </button>
  );
};

// --- 3. Hero Terminal Animation (No change) ---
const TerminalHero = () => {
  const [lines, setLines] = useState([
    { text: "> git init git-match", color: "text-yellow-400" },
    { text: "> Initialized empty Git repository...", color: "text-slate-400" },
  ]);

  useEffect(() => {
    const sequence = [
      {
        text: "> npm install talent-pool",
        color: "text-yellow-400",
        delay: 800,
      },
      {
        text: "[+] 10k+ developers found",
        color: "text-green-400",
        delay: 1600,
      },
      {
        text: "> git commit -m 'Initial Commit'",
        color: "text-yellow-400",
        delay: 2400,
      },
      {
        text: "> Searching for collaborators...",
        color: "text-blue-400",
        delay: 3200,
      },
      {
        text: ">> MATCH FOUND: Rating 98/100",
        color: "text-green-400 font-bold",
        delay: 4000,
      },
    ];
    let timeouts = [];
    sequence.forEach(({ text, color, delay }) => {
      timeouts.push(
        setTimeout(() => {
          setLines((prev) => [...prev.slice(-6), { text, color }]);
        }, delay)
      );
    });
    return () => timeouts.forEach(clearTimeout);
  }, []);

  return (
    <div className="w-full max-w-lg mx-auto bg-[#0d1117] rounded-lg border border-slate-800 shadow-2xl overflow-hidden font-mono text-xs sm:text-sm transform transition-transform hover:scale-[1.02] duration-500 group relative">
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
      <div className="relative bg-[#0d1117] rounded-lg">
        <div className="flex items-center px-4 py-3 bg-[#161b22] border-b border-slate-800 gap-2">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="ml-4 text-slate-500 text-xs flex-1 text-center font-mono">
            bash — git-match-cli
          </span>
        </div>
        <div className="p-4 space-y-2 h-64 flex flex-col justify-end font-mono">
          {lines.map((line, i) => (
            <div key={i} className={`${line.color} animate-fade-in`}>
              {line.text}
            </div>
          ))}
          <div className="flex items-center">
            <span className="text-blue-500 mr-2">➜</span>
            <span className="text-white">_</span>
            <span className="w-2 h-4 bg-slate-500 ml-1 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 4. Feature Card Component (No change) ---
const TechCard = ({ icon: Icon, title, desc, delay }) => (
  <div
    className="p-6 rounded-xl bg-[#0d1117]/50 border border-slate-800 hover:border-blue-500/50 transition-all duration-300 group hover:-translate-y-1 backdrop-blur-sm"
    style={{ animationDelay: delay }}
  >
    <div className="w-12 h-12 rounded-lg bg-[#161b22] border border-slate-700 flex items-center justify-center mb-4 group-hover:border-blue-500/50 group-hover:shadow-[0_0_15px_rgba(37,99,235,0.2)] transition-all">
      <Icon className="w-6 h-6 text-slate-400 group-hover:text-blue-400 transition-colors" />
    </div>
    <h3 className="text-lg font-bold text-white mb-2 font-mono">{title}</h3>
    <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
  </div>
);

// --- MAIN COMPONENT ---
const HomePage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // *** USE AUTH HOOK ***
  const { user, profile, loading } = useAuthAndProfile();

  const navigate = useNavigate();

  const handleLogout = async () => {
    if (auth) await signOut(auth);
    setMobileMenuOpen(false);
  };

  // --- UI EFFECTS (Scroll/Mouse) ---
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 15,
        y: (e.clientY / window.innerHeight) * 15,
      });
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Helper to get display name/avatar
  const displayName =
    profile?.githubUsername ||
    user?.email?.split("@")[0] ||
    user?.displayName ||
    "Developer";

  const avatarUrl = profile?.githubUsername
    ? `https://github.com/${profile.githubUsername}.png`
    : user?.photoURL || "https://github.com/ghost.png";

  // Added Loading State for better UX
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#050508] text-white">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" />
        <p className="font-mono">LOADING_SESSION...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050508] text-slate-200 font-sans selection:bg-blue-500/30 overflow-hidden relative">
      {/* --- Advanced Background Layer --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `linear-gradient(#475569 1px, transparent 1px), linear-gradient(90deg, #475569 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
            transform: `translate(${mousePosition.x * -1}px, ${
              mousePosition.y * -1
            }px)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050508] via-transparent to-[#050508]" />
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[100px]" />
      </div>

      {/* --- Navbar --- */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#050508]/90 backdrop-blur-md border-b border-slate-800/50 py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-3 font-bold text-xl text-white tracking-tight group font-mono"
            >
              <div className="p-1.5 bg-blue-500/10 rounded border border-blue-500/20 group-hover:border-blue-500/50 transition-colors">
                <Terminal className="w-5 h-5 text-blue-500" />
              </div>
              <span className="group-hover:text-blue-100 transition-colors">
                GitMatch<span className="text-blue-500 animate-pulse">_</span>
              </span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-8">
              {["Features", "Workflow", "Community"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-xs font-mono text-slate-400 hover:text-blue-400 transition-colors tracking-wide"
                >
                  &lt;{item} /&gt;
                </a>
              ))}

              <div className="flex items-center gap-3 ml-4 border-l border-slate-800 pl-6">
                {user ? (
                  // AUTHENTICATED STATE (DESKTOP)
                  <div className="flex items-center gap-4">
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2 group"
                    >
                      <img
                        src={avatarUrl}
                        alt="Profile"
                        className="w-8 h-8 rounded-full border border-slate-700 group-hover:border-blue-500 transition-colors object-cover"
                      />
                      <div className="text-right hidden lg:block">
                        <div className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                          {displayName}
                        </div>
                        <div className="text-xs text-slate-500 font-mono">
                          // LOGGED_IN
                        </div>
                      </div>
                    </Link>
                    <RippleButton
                      to="/dashboard"
                      variant="primary"
                      className="text-xs px-4 py-2"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
                    </RippleButton>
                  </div>
                ) : (
                  // GUEST STATE (DESKTOP)
                  <>
                    <RippleButton
                      to="/auth"
                      state={{ mode: "signin" }}
                      variant="nav"
                      className="text-xs"
                    >
                      <Github className="w-3.5 h-3.5" /> Login
                    </RippleButton>
                    <RippleButton
                      to="/auth"
                      state={{ mode: "signup" }}
                      variant="primary"
                      className="text-xs px-5 py-2"
                    >
                      Get Started
                    </RippleButton>
                  </>
                )}
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-slate-300 hover:text-white p-2"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0a0a0f] border-b border-slate-800 absolute w-full shadow-2xl animate-slide-down">
            <div className="p-4 space-y-3">
              {user ? (
                // AUTHENTICATED STATE (MOBILE)
                <>
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-800/50">
                    <img
                      src={avatarUrl}
                      alt="Profile"
                      className="w-10 h-10 rounded-full border border-slate-700 object-cover"
                    />
                    <div>
                      <div className="text-sm font-bold text-white">
                        {displayName}
                      </div>
                      <div className="text-xs text-slate-500">
                        {user.email || "Logged In"}
                      </div>
                    </div>
                  </div>
                  <RippleButton
                    to="/dashboard"
                    variant="primary"
                    className="w-full py-3 justify-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <LayoutDashboard className="w-4 h-4" /> Go to Dashboard
                  </RippleButton>
                  <RippleButton
                    onClick={handleLogout}
                    variant="secondary"
                    className="w-full py-3 justify-center text-red-400 border-red-900/30 hover:border-red-500/50"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </RippleButton>
                </>
              ) : (
                // GUEST STATE (MOBILE)
                <>
                  <RippleButton
                    to="/Auth"
                    state={{ mode: "signin" }}
                    variant="secondary"
                    className="w-full py-3 justify-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Github className="w-4 h-4" /> Sign In
                  </RippleButton>
                  <RippleButton
                    to="/Auth"
                    state={{ mode: "signup" }}
                    variant="primary"
                    className="w-full py-3 justify-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Create Account
                  </RippleButton>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* --- Hero Section --- */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-blue-500/20 bg-blue-500/5 text-blue-400 text-[10px] font-mono uppercase tracking-widest mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                System Status: Online
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6 leading-[1.1]">
                Commit Code.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400">
                  Build Legacy.
                </span>
              </h1>

              <p className="text-lg text-slate-400 mb-8 leading-relaxed max-w-xl font-light">
                The only platform that parses your{" "}
                <code className="text-blue-300 bg-slate-800/50 px-1.5 py-0.5 rounded text-sm font-mono">
                  git log
                </code>{" "}
                to match you with elite teams. Stop sending resumes. Start
                sending PRs.
              </p>

              <div className="flex flex-wrap gap-4">
                {user ? (
                  <RippleButton
                    to="/dashboard"
                    variant="primary"
                    className="px-8 py-4 text-base"
                  >
                    Launch_Dashboard <ArrowRight className="w-4 h-4 ml-2" />
                  </RippleButton>
                ) : (
                  <RippleButton
                    to="/Auth"
                    state={{ mode: "signup" }}
                    variant="primary"
                    className="px-8 py-4 text-base"
                  >
                    Initialize_Profile
                  </RippleButton>
                )}

                <RippleButton
                  to="#features"
                  variant="outline"
                  className="px-8 py-4 text-base"
                >
                  Explore_Issues{" "}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </RippleButton>
              </div>

              <div className="mt-10 pt-8 border-t border-slate-800/50 flex gap-8 text-slate-500 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-slate-400" />
                  <span>1.2M+ Commits Parsed</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span>15k+ Devs Active</span>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 relative">
              <TerminalHero />
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* --- How It Works (Git Graph Style) --- */}
      <section
        id="workflow"
        className="py-24 bg-[#050508] relative z-10 border-y border-slate-900"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl font-bold text-white font-mono mb-4">
              &lt;Workflow /&gt;
            </h2>
            <p className="text-slate-400">
              From local repository to global impact.
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-1 bg-slate-800 md:-translate-x-1/2"></div>

            {[
              {
                icon: Github,
                title: "Connect_Repository",
                desc: "Sync your GitHub profile. We analyze your commit history, languages, and contribution graphs.",
              },
              {
                icon: Code2,
                title: "Solve_Issues",
                desc: "Pick from curated issues. Write clean code. Open a Pull Request. Pass the CI/CD checks.",
              },
              {
                icon: GitMerge,
                title: "Get_Merged",
                desc: "Once merged, you earn reputation points (RP). Higher RP unlocks paid bounties and team invites.",
              },
            ].map((step, idx) => (
              <div
                key={idx}
                className={`relative flex flex-col md:flex-row gap-8 mb-16 ${
                  idx % 2 === 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                <div className="flex-1 md:text-right pt-2 pl-16 md:pl-0 md:pr-0">
                  <div
                    className={`${
                      idx % 2 === 0 ? "md:text-left" : "md:text-right"
                    }`}
                  >
                    <h3 className="text-xl font-bold text-white font-mono mb-2 text-blue-400">
                      {step.title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>

                <div className="absolute left-0 md:relative md:left-auto w-14 h-14 flex-shrink-0 z-10">
                  <div className="w-14 h-14 rounded-full bg-[#0d1117] border-4 border-slate-800 flex items-center justify-center relative group hover:border-blue-500 transition-colors">
                    <step.icon className="w-6 h-6 text-slate-300 group-hover:text-blue-400" />
                  </div>
                </div>

                <div className="flex-1 hidden md:block"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Features Grid --- */}
      <section id="features" className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white font-mono mb-6">
              System.getFeatures()
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <TechCard
              icon={GitPullRequest}
              title="Real-World Issues"
              desc="Don't solve LeetCode. Solve real bugs in open source repos like React, TensorFlow, and more."
            />
            <TechCard
              icon={Trophy}
              title="Skill Rating"
              desc="Our algorithm calculates your rating based on code complexity, PR reviews, and consistency."
              delay="100ms"
            />
            <TechCard
              icon={Users}
              title="Smart Matching"
              desc="Find teammates who complement your stack. Frontend needs Backend? We found them."
              delay="200ms"
            />
            <TechCard
              icon={ShieldCheck}
              title="Verified Profile"
              desc="No fake resumes. Your profile is generated strictly from your actual code contributions."
              delay="300ms"
            />
            <TechCard
              icon={Zap}
              title="Instant Bounties"
              desc="High-rated developers get exclusive access to paid crypto and fiat bounties."
              delay="400ms"
            />
            <TechCard
              icon={Layers}
              title="Team Formation"
              desc="Create a squad, participate in hackathons, and split rewards automatically."
              delay="500ms"
            />
          </div>
        </div>
      </section>

      {/* --- CTA Section --- */}
      <section className="py-32 relative z-10 overflow-hidden border-t border-slate-900">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-3xl mx-auto px-4 text-center relative">
          <div className="w-16 h-16 mx-auto bg-blue-500/10 rounded-2xl flex items-center justify-center mb-8 border border-blue-500/30 animate-pulse">
            <Activity className="w-8 h-8 text-blue-400" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight">
            Ready to push to production?
          </h2>
          <p className="text-lg text-slate-400 mb-10">
            Join the network of developers building the future.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {user ? (
              <RippleButton
                to="/dashboard"
                variant="primary"
                className="px-12 py-4 text-lg"
              >
                Go to Dashboard
              </RippleButton>
            ) : (
              <>
                <RippleButton
                  to="/Auth"
                  state={{ mode: "signup" }}
                  variant="primary"
                  className="px-12 py-4 text-lg"
                >
                  <Github className="w-5 h-5" /> Authorize_GitHub
                </RippleButton>

                <RippleButton
                  to="/Auth"
                  state={{ mode: "signin" }}
                  variant="secondary"
                  className="px-12 py-4 text-lg"
                >
                  Log_In
                </RippleButton>
              </>
            )}
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-[#020203] border-t border-slate-900 pt-16 pb-8 z-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 font-bold text-xl text-white mb-4 font-mono">
                <Terminal className="w-6 h-6 text-blue-500" />
                <span>GitMatch</span>
              </div>
              <p className="text-slate-500 max-w-sm text-sm leading-relaxed">
                Connecting developers worldwide through code. Validate your
                skills, find your squad, and get paid for your expertise.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold font-mono mb-4 text-sm">
                Platform
              </h4>
              <ul className="space-y-2 text-slate-500 text-xs font-mono">
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    browse_issues
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    find_devs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    leaderboard
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-700 text-xs font-mono">
              © 2024 GitMatch. All systems operational.
            </p>
            <div className="flex gap-6">
              <Github className="w-5 h-5 text-slate-600 hover:text-white cursor-pointer transition-colors" />
              <Code2 className="w-5 h-5 text-slate-600 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>
        </div>
      </footer>

      {/* CSS Animations */}
      <style>{`
        @keyframes ripple {
          to { transform: scale(4); opacity: 0; }
        }
        .animate-ripple { animation: ripple 0.6s linear; }
        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; opacity: 0; }
        @keyframes fadeIn { to { opacity: 1; } }
        @keyframes slide-down { from { transform: translateY(-10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-slide-down { animation: slide-down 0.2s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default HomePage;
