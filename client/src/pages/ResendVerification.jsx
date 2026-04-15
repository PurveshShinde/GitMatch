import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Loader2,
  ArrowLeft,
  CheckCircle,
  Terminal,
  Send,
  AlertCircle,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";

const API_BASE_URL =
  import.meta.env?.VITE_API_BASE_URL || "http://localhost:3000";

export default function ResendVerification() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/resend-verify`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setMessage(data.message);
      } else {
        setError(data.message || "Failed to resend verification email.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 bg-[#0f111a] rounded-2xl border border-slate-800/50 shadow-[0_0_50px_-12px_rgba(0,0,0,0.7)] w-full max-w-md p-10 backdrop-blur-sm">
        <button
          onClick={() => navigate("/auth")}
          className="flex items-center gap-2 text-slate-500 hover:text-cyan-400 transition-colors text-sm font-mono mb-8 group"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          back_to_auth
        </button>

        <div className="flex items-center justify-center w-14 h-14 mx-auto mb-6 rounded-xl border shadow-lg bg-cyan-500/10 border-cyan-500/20">
          <Terminal size={28} className="text-cyan-400" />
        </div>

        <h1 className="text-2xl font-bold text-white text-center mb-2 font-mono">
          Resend_Verification
        </h1>
        <p className="text-slate-500 text-sm text-center mb-8 font-mono">
          Enter your email to receive a new verification link
        </p>

        {success ? (
          <div className="text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
            <div className="w-20 h-20 mx-auto bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
              <CheckCircle size={40} className="text-green-400" />
            </div>
            <p className="text-slate-300 text-sm">{message}</p>
            <button
              onClick={() => navigate("/auth", { state: { mode: "signin" } })}
              className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:-translate-y-0.5 shadow-[0_0_20px_rgba(139,92,246,0.3)]"
            >
              GO_TO_SIGNIN
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="group relative">
              <Mail className="absolute left-3 top-4 text-slate-500 w-5 h-5 group-focus-within:text-cyan-400 transition-colors" />
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="peer w-full bg-slate-900/50 border border-slate-700 text-white px-10 py-4 rounded-lg outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder-transparent"
                placeholder="Email"
              />
              <label className="absolute left-10 -top-2.5 bg-[#0f111a] px-2 text-xs text-slate-500 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-500 peer-placeholder-shown:top-[14px] peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-cyan-400 transition-all cursor-text font-mono">
                email_address
              </label>
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
              disabled={loading}
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:-translate-y-0.5 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send size={18} />
              )}
              {loading ? "SENDING..." : "SEND_VERIFICATION"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
