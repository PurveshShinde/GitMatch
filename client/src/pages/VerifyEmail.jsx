import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  XCircle,
  Loader2,
  ArrowRight,
  RefreshCw,
  Terminal,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env?.VITE_API_BASE_URL || "http://localhost:3000";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token found. Please check your email link.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/auth/verify-email?token=${encodeURIComponent(
            token
          )}`
        );
        const data = await response.json();

        if (data.success) {
          setStatus("success");
          setMessage(data.message || "Email verified successfully!");
        } else {
          setStatus("error");
          setMessage(data.message || "Verification failed.");
        }
      } catch (err) {
        setStatus("error");
        setMessage("Network error. Please try again.");
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 bg-[#0f111a] rounded-2xl border border-slate-800/50 shadow-[0_0_50px_-12px_rgba(0,0,0,0.7)] w-full max-w-md p-10 text-center backdrop-blur-sm">
        <div className="flex items-center justify-center w-14 h-14 mx-auto mb-6 rounded-xl border shadow-lg bg-slate-900/50 border-slate-700">
          <Terminal size={28} className="text-cyan-400" />
        </div>

        {status === "loading" && (
          <div className="space-y-6">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-slate-800" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-500 animate-spin" />
              <div className="absolute inset-3 rounded-full border-4 border-transparent border-b-violet-500 animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
            </div>
            <h1 className="text-2xl font-bold text-white font-mono">
              Verifying_Email...
            </h1>
            <p className="text-slate-400 text-sm">
              Please wait while we verify your email address.
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
            <div className="w-20 h-20 mx-auto bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
              <CheckCircle size={40} className="text-green-400" />
            </div>
            <h1 className="text-2xl font-bold text-white font-mono">
              Verification_Complete
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed">{message}</p>
            <button
              onClick={() => navigate("/auth", { state: { mode: "signin" } })}
              className="w-full bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:-translate-y-0.5 shadow-[0_0_20px_rgba(139,92,246,0.3)] flex items-center justify-center gap-2 group"
            >
              PROCEED_TO_SIGNIN
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
            <div className="w-20 h-20 mx-auto bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
              <XCircle size={40} className="text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-white font-mono">
              Verification_Failed
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed">{message}</p>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/resend-verification")}
                className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:-translate-y-0.5 shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2"
              >
                <RefreshCw size={18} />
                RESEND_VERIFICATION
              </button>
              <button
                onClick={() => navigate("/auth")}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                BACK_TO_AUTH
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
