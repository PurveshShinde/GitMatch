import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BrainCircuit } from "lucide-react";

export default function SkillTest() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050508] text-slate-200 font-sans flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#0f111a] border border-slate-800 rounded-xl p-8 md:p-12 text-center relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500" />
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 bg-slate-800/50 rounded-2xl flex items-center justify-center mb-6 border border-slate-700 shadow-xl shadow-purple-900/20">
            <BrainCircuit className="w-10 h-10 text-purple-400" />
          </div>

          <h1 className="text-3xl font-bold font-mono text-white mb-4">
            Skill Assessment
          </h1>
          
          <p className="text-slate-400 max-w-md mx-auto mb-8 leading-relaxed">
            This section will contain a dynamically generated Multiple Choice Question (MCQ) test tailored to your profile data. Complete it to unlock higher matchmaking tiers.
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 rounded-full text-sm font-mono mb-10">
            <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
            Coming Soon
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-mono font-bold transition-all shadow-md shadow-blue-500/20"
          >
            Skip for now
            <ArrowLeft className="w-4 h-4 rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
}
