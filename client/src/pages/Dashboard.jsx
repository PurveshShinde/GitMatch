// src/pages/Dashboard.jsx

import React, { useEffect, useState } from "react";

// --- FIREBASE IMPORTS (REAL) ---
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

// --- UI Imports ---
import {
  User,
  Github,
  LogOut,
  Zap,
  ArrowRight,
  Briefcase,
  BookOpen,
  Star,
  Users,
} from "lucide-react";

const appId = "gitmatch-production";

export default function DashboardPage() {
  const [authState, setAuthState] = useState({
    loading: true,
    user: null,
    profile: null,
    onboarding: null,
  });

  // --- Handle Logout ---
  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = "/auth"; // redirect to login
  };

  // --- Load User + Profile ---
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setAuthState((prev) => ({ ...prev, loading: false, user: null }));
        return;
      }

      // get onboarding document
      const onboardingRef = doc(
        db,
        "artifacts",
        appId,
        "users",
        user.uid,
        "profile",
        "onboarding"
      );
      const onboardingSnap = await getDoc(onboardingRef);

      setAuthState({
        loading: false,
        user,
        onboarding: onboardingSnap.exists() ? onboardingSnap.data() : null,
      });
    });

    return () => unsub();
  }, []);

  const { loading, user, onboarding } = authState;

  // --- Loading State ---
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050507] text-white">
        <p className="text-lg animate-pulse">Loading Dashboard...</p>
      </div>
    );
  }

  // --- Auth Required ---
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#050507] text-white">
        <h1 className="text-3xl font-bold">ACCESS_DENIED</h1>
        <p className="text-slate-400 mt-2">
          Authentication required. Log in first.
        </p>
        <a
          href="/auth"
          className="mt-4 px-4 py-2 bg-cyan-500 rounded-xl hover:bg-cyan-600 transition"
        >
          Go to Login
        </a>
      </div>
    );
  }

  // --- Missing Onboarding ---
  if (!onboarding) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#050507] text-white">
        <h1 className="text-2xl font-bold">Setup Required</h1>
        <p className="text-slate-400 mt-2">Please complete onboarding.</p>

        <a
          href="/auth"
          className="mt-4 px-4 py-2 bg-cyan-500 rounded-xl hover:bg-cyan-600 transition"
        >
          Start Onboarding
        </a>
      </div>
    );
  }

  // --- Dashboard ---
  return (
    <div className="min-h-screen bg-[#050507] text-white">
      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-6 py-4 border-b border-[#111]">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Zap className="w-6 h-6 text-cyan-400" />
          GitMatch Dashboard
        </h1>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </nav>

      {/* CONTENT */}
      <main className="p-6 space-y-8">
        {/* Welcome */}
        <section className="bg-[#0a0a0f] p-6 rounded-2xl shadow-xl border border-[#111]">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <User className="w-7 h-7 text-cyan-400" />
            Welcome, {user.email}
          </h2>
          <p className="text-slate-400 mt-2">Great to have you back!</p>
        </section>

        {/* Onboarding Summary */}
        <section className="grid md:grid-cols-2 gap-6">
          <div className="bg-[#0a0a0f] p-6 rounded-2xl border border-[#111]">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-400" />
              Your Skills
            </h3>
            <p className="text-slate-400 mt-2">
              Primary Language: {onboarding.primaryLanguage || "N/A"}
            </p>
            <p className="text-slate-400 mt-2">
              Experience Level: {onboarding.experienceLevel || "N/A"}
            </p>
          </div>

          <div className="bg-[#0a0a0f] p-6 rounded-2xl border border-[#111]">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-green-400" />
              Collaboration Preferences
            </h3>
            <p className="text-slate-400 mt-2">
              Preferred Team Size: {onboarding.preferredTeamSize || "N/A"}
            </p>
            <p className="text-slate-400 mt-2">
              Communication Style: {onboarding.preferredCommunication || "N/A"}
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#0a0a0f] p-6 rounded-2xl border border-[#111] flex flex-col items-center text-center">
          <h3 className="text-xl font-bold">Start Exploring</h3>
          <p className="text-slate-400 mt-2">
            Find matching projects, teammates, and issues.
          </p>

          <button className="mt-4 px-6 py-3 bg-cyan-500 rounded-xl flex items-center gap-2 hover:bg-cyan-600 transition">
            Explore Now <ArrowRight className="w-5 h-5" />
          </button>
        </section>
      </main>
    </div>
  );
}
