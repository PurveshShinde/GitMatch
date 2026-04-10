import React from "react";
import {
  Github,
  Mail,
  Lock,
  User,
  Terminal,
  Code2,
  Cpu,
  Braces,
  Zap,
  Loader2,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  X,
} from "lucide-react";

export const SignUpForm = ({
  isAuthAttempting,
  error,
  onSubmit,
  onToggle,
}) => (
  <div
    className={`
      transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]
      w-full md:w-1/2
      md:block
      relative p-8 md:p-0
      md:absolute md:top-0 md:h-full
      ${
        onToggle
          ? "md:left-full md:-translate-x-full md:opacity-100 md:z-50"
          : "md:left-0 md:opacity-0 md:z-0"
      }
    `}
  >
    <form
      onSubmit={onSubmit}
      className="h-full flex flex-col items-center justify-center text-center bg-[#0f111a] p-0 md:px-12"
    >
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
        {[<Github size={20} />, <Code2 size={20} />].map((icon, i) => (
          <button
            key={i}
            type="button"
            className="group relative p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-cyan-500/50 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-cyan-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <span className="relative z-10">{icon}</span>
          </button>
        ))}
      </div>

      <div className="w-full space-y-5">
        {/* Input: Name */}
        <div className="group relative">
          <User className="absolute left-3 top-4 text-slate-500 w-5 h-5 group-focus-within:text-cyan-400 transition-colors" />
          <input
            required
            type="text"
            id="signup-name"
            className="peer w-full bg-slate-900/50 border border-slate-700 text-white px-10 py-4 rounded-lg outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder-transparent"
            placeholder="Name"
          />
          <label
            htmlFor="signup-name"
            className="absolute left-10 -top-2.5 bg-[#0f111a] px-2 text-xs text-slate-500 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-500 peer-placeholder-shown:top-[14px] peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-cyan-400 transition-all cursor-text font-mono"
          >
            username
          </label>
        </div>

        {/* Input: Email */}
        <div className="group relative">
          <Mail className="absolute left-3 top-4 text-slate-500 w-5 h-5 group-focus-within:text-cyan-400 transition-colors" />
          <input
            required
            type="email"
            id="signup-email"
            className="peer w-full bg-slate-900/50 border border-slate-700 text-white px-10 py-4 rounded-lg outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder-transparent"
            placeholder="Email"
          />
          <label
            htmlFor="signup-email"
            className="absolute left-10 -top-2.5 bg-[#0f111a] px-2 text-xs text-slate-500 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-500 peer-placeholder-shown:top-[14px] peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-cyan-400 transition-all cursor-text font-mono"
          >
            email
          </label>
        </div>

        {/* Input: Password */}
        <div className="group relative">
          <Lock className="absolute left-3 top-4 text-slate-500 w-5 h-5 group-focus-within:text-cyan-400 transition-colors" />
          <input
            required
            type="password"
            id="signup-pass"
            className="peer w-full bg-slate-900/50 border border-slate-700 text-white px-10 py-4 rounded-lg outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder-transparent"
            placeholder="Password"
          />
          <label
            htmlFor="signup-pass"
            className="absolute left-10 -top-2.5 bg-[#0f111a] px-2 text-xs text-slate-500 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-500 peer-placeholder-shown:top-[14px] peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-cyan-400 transition-all cursor-text font-mono"
          >
            password
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={isAuthAttempting}
        className="mt-8 w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-12 rounded-lg transition-all transform hover:-translate-y-0.5 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] flex items-center justify-center gap-2 group"
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
);

export const SignInForm = ({
  isAuthAttempting,
  error,
  onSubmit,
  onToggle,
}) => (
  <div
    className={`
      transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]
      w-full md:w-1/2
      md:block
      relative p-8 md:p-0
      md:absolute md:top-0 md:h-full
      ${
        !onToggle ? "block" : "hidden"
      } md:block
      ${
        onToggle
          ? "md:translate-x-full md:opacity-0"
          : "md:left-0 md:opacity-100 md:z-50"
      }
    `}
  >
    <form
      onSubmit={onSubmit}
      className="h-full flex flex-col items-center justify-center text-center bg-[#0f111a] p-0 md:px-12"
    >
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
        {[<Github size={20} />, <Code2 size={20} />].map((icon, i) => (
          <button
            key={i}
            type="button"
            className="group relative p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-violet-500/50 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-violet-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <span className="relative z-10">{icon}</span>
          </button>
        ))}
      </div>

      <div className="w-full space-y-5">
        {/* Input: Email */}
        <div className="group relative">
          <Mail className="absolute left-3 top-4 text-slate-500 w-5 h-5 group-focus-within:text-violet-400 transition-colors" />
          <input
            required
            type="email"
            id="signin-email"
            className="peer w-full bg-slate-900/50 border border-slate-700 text-white px-10 py-4 rounded-lg outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all placeholder-transparent"
            placeholder="Email"
          />
          <label
            htmlFor="signin-email"
            className="absolute left-10 -top-2.5 bg-[#0f111a] px-2 text-xs text-slate-500 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-500 peer-placeholder-shown:top-[14px] peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-violet-400 transition-all cursor-text font-mono"
          >
            email
          </label>
        </div>

        {/* Input: Password */}
        <div className="group relative">
          <Lock className="absolute left-3 top-4 text-slate-500 w-5 h-5 group-focus-within:text-violet-400 transition-colors" />
          <input
            required
            type="password"
            id="signin-pass"
            className="peer w-full bg-slate-900/50 border border-slate-700 text-white px-10 py-4 rounded-lg outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all placeholder-transparent"
            placeholder="Password"
          />
          <label
            htmlFor="signin-pass"
            className="absolute left-10 -top-2.5 bg-[#0f111a] px-2 text-xs text-slate-500 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-500 peer-placeholder-shown:top-[14px] peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-violet-400 transition-all cursor-text font-mono"
          >
            access_key
          </label>
        </div>
      </div>

      <a
        href="#"
        className="text-slate-500 text-xs mt-6 hover:text-violet-400 transition-colors font-mono"
      >
        Forgot your password?
      </a>

      <button
        type="submit"
        disabled={isAuthAttempting}
        className="mt-8 w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-3 px-12 rounded-lg transition-all transform hover:-translate-y-0.5 shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] flex items-center justify-center gap-2 group"
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
);

export const AuthOverlay = ({ isSignUp, onToggleForms }) => (
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

      {/* Left Overlay Panel (For Sign In) */}
      <div
        className={`
          absolute top-0 flex flex-col items-center justify-center h-full w-1/2 px-12 text-center transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]
          translate-x-0
          ${isSignUp ? "translate-x-0" : "-translate-x-[20%]"}
        `}
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
          onClick={() => onToggleForms(false)}
          className="relative px-8 py-3 text-white font-bold rounded-lg overflow-hidden group border border-white/50"
        >
          <span className="absolute inset-0 w-full h-full bg-white/20 group-hover:bg-white/30 transition-colors"></span>
          <span className="relative flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-ping"></span>
            SIGN IN
          </span>
        </button>
      </div>

      {/* Right Overlay Panel (For Sign Up) */}
      <div
        className={`
          absolute top-0 right-0 flex flex-col items-center justify-center h-full w-1/2 px-12 text-center transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]
          ${isSignUp ? "translate-x-[20%]" : "translate-x-0"}
        `}
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
          onClick={() => onToggleForms(true)}
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
);
