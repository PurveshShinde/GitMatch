import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  Medal, 
  ShieldCheck, 
  GitBranch, 
  Terminal, 
  Star, 
  Award, 
  Users, 
  Flame, 
  FileCode, 
  History, 
  Hourglass, 
  RefreshCw 
} from "lucide-react";
import { updateUser } from "../../../redux/authSlice";

const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || "http://localhost:3000";

export const Achievements = React.memo(({ profile }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState(null);

  if (!profile) return null;

  const stats = profile.githubStats || {
    publicRepos: 0,
    followers: 0,
    publicGists: 0,
    totalStars: 0,
    accountAgeYears: 0,
    recentEventsCount: 0
  };

  // Define achievements
  const badgesList = [
    {
      id: "certified",
      name: "GitMatch Certified",
      description: "Successfully linked your GitHub account to GitMatch.",
      requirement: "Link GitHub",
      icon: ShieldCheck,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30 hover:border-emerald-500",
      glow: "shadow-[0_0_15px_rgba(16,185,129,0.25)]",
      isUnlocked: !!profile.githubUsername,
      progress: profile.githubUsername ? "1/1" : "0/1"
    },
    {
      id: "repo_pioneer",
      name: "Repo Pioneer",
      description: "Created at least 1 public repository on GitHub.",
      requirement: "1+ Public Repos",
      icon: GitBranch,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/30 hover:border-blue-500",
      glow: "shadow-[0_0_15px_rgba(59,130,246,0.25)]",
      isUnlocked: stats.publicRepos >= 1,
      progress: `${stats.publicRepos}/1`
    },
    {
      id: "code_machine",
      name: "Code Machine",
      description: "Created 15 or more public repositories on GitHub.",
      requirement: "15+ Public Repos",
      icon: Terminal,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/30 hover:border-purple-500",
      glow: "shadow-[0_0_15px_rgba(168,85,247,0.25)]",
      isUnlocked: stats.publicRepos >= 15,
      progress: `${stats.publicRepos}/15`
    },
    {
      id: "starstruck",
      name: "Starstruck",
      description: "Earned your first star on a public repository.",
      requirement: "1+ Stars",
      icon: Star,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/30 hover:border-yellow-500",
      glow: "shadow-[0_0_15px_rgba(234,179,8,0.25)]",
      isUnlocked: stats.totalStars >= 1,
      progress: `${stats.totalStars}/1`
    },
    {
      id: "superstar",
      name: "Superstar",
      description: "Earned 50 or more stars across public repositories.",
      requirement: "50+ Stars",
      icon: Award,
      color: "text-orange-400",
      bg: "bg-orange-500/10",
      border: "border-orange-500/30 hover:border-orange-500",
      glow: "shadow-[0_0_15px_rgba(249,115,22,0.25)]",
      isUnlocked: stats.totalStars >= 50,
      progress: `${stats.totalStars}/50`
    },
    {
      id: "followed_leader",
      name: "Followed Leader",
      description: "Acquired 5 or more followers on GitHub.",
      requirement: "5+ Followers",
      icon: Users,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/30 hover:border-cyan-500",
      glow: "shadow-[0_0_15px_rgba(6,182,212,0.25)]",
      isUnlocked: stats.followers >= 5,
      progress: `${stats.followers}/5`
    },
    {
      id: "crowd_favorite",
      name: "Crowd Favorite",
      description: "Acquired 50 or more followers on GitHub.",
      requirement: "50+ Followers",
      icon: Medal,
      color: "text-rose-400",
      bg: "bg-rose-500/10",
      border: "border-rose-500/30 hover:border-rose-500",
      glow: "shadow-[0_0_15px_rgba(244,63,94,0.25)]",
      isUnlocked: stats.followers >= 50,
      progress: `${stats.followers}/50`
    },
    {
      id: "gist_creator",
      name: "Gist Creator",
      description: "Created at least 1 public gist on GitHub.",
      requirement: "1+ Gists",
      icon: FileCode,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/30 hover:border-amber-500",
      glow: "shadow-[0_0_15px_rgba(245,158,11,0.25)]",
      isUnlocked: stats.publicGists >= 1,
      progress: `${stats.publicGists}/1`
    },
    {
      id: "vanguard",
      name: "Vanguard",
      description: "GitHub account age is 3 years or older.",
      requirement: "3+ Years Old",
      icon: Hourglass,
      color: "text-teal-400",
      bg: "bg-teal-500/10",
      border: "border-teal-500/30 hover:border-teal-500",
      glow: "shadow-[0_0_15px_rgba(20,184,166,0.25)]",
      isUnlocked: stats.accountAgeYears >= 3,
      progress: `${Math.floor(stats.accountAgeYears)}/3`
    },
    {
      id: "veteran",
      name: "Veteran",
      description: "GitHub account age is 7 years or older.",
      requirement: "7+ Years Old",
      icon: History,
      color: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/30 hover:border-red-500",
      glow: "shadow-[0_0_15px_rgba(239,68,68,0.25)]",
      isUnlocked: stats.accountAgeYears >= 7,
      progress: `${Math.floor(stats.accountAgeYears)}/7`
    },
    {
      id: "active_spark",
      name: "Active Spark",
      description: "Recent activity detected in the events feed.",
      requirement: "Active Events",
      icon: Flame,
      color: "text-orange-500",
      bg: "bg-orange-600/10",
      border: "border-orange-600/30 hover:border-orange-500",
      glow: "shadow-[0_0_15px_rgba(249,115,22,0.3)]",
      isUnlocked: stats.recentEventsCount > 0,
      progress: stats.recentEventsCount > 0 ? "Active" : "None"
    }
  ];

  const handleSync = async () => {
    if (syncing) return;
    setSyncing(true);
    setSyncError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/sync-github`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to sync GitHub stats. Please try again.");
      }

      const data = await response.json();
      if (data.success && data.user) {
        // Update local Redux store user
        dispatch(updateUser(data.user));
      } else {
        throw new Error(data.message || "Failed to update profile.");
      }
    } catch (err) {
      console.error(err);
      setSyncError(err.message);
    } finally {
      setSyncing(false);
    }
  };

  const unlockedCount = badgesList.filter(b => b.isUnlocked).length;

  return (
    <div className="bg-[#0f111a] border border-slate-800 rounded-xl p-6 shadow-lg relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Medal className="w-5 h-5 text-yellow-500" /> GitHub Achievements
        </h3>
        
        {profile.githubUsername && (
          <button
            onClick={handleSync}
            disabled={syncing}
            className="p-1.5 bg-[#0a0a0f] hover:bg-[#13141f] border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-all flex items-center gap-1.5 text-xs font-mono disabled:opacity-50"
            title="Sync GitHub Stats"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin text-blue-400" : ""}`} />
            {syncing ? "Syncing..." : "Sync Stats"}
          </button>
        )}
      </div>

      {syncError && (
        <p className="text-xs text-red-400 mb-3 font-mono">{syncError}</p>
      )}

      {/* Level and XP progress bar */}
      <div className="mb-6 bg-[#0a0a0f] p-4 rounded-xl border border-slate-800/80">
        <div className="flex justify-between items-center text-xs mb-2 font-mono">
          <div className="flex items-center gap-2">
            <span className="text-blue-400 font-bold text-sm">Level {profile.level || 1}</span>
            <span className="text-slate-500 text-[10px] uppercase font-semibold">
              ({badgesList.filter(b => b.isUnlocked).length} / {badgesList.length} Badges)
            </span>
          </div>
          <span className="text-slate-400 font-bold">
            {profile.xp || 0} / {profile.nextLevelXp || 200} XP
          </span>
        </div>
        <div className="w-full bg-slate-900 border border-slate-800/60 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-violet-500 h-2 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.4)] transition-all duration-500"
            style={{ width: `${Math.min(100, ((profile.xp || 0) / (profile.nextLevelXp || 200)) * 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-4 gap-3">
        {badgesList.map((badge) => {
          const BadgeIcon = badge.icon;
          return (
            <div
              key={badge.id}
              className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all duration-300 relative group border cursor-help ${
                badge.isUnlocked
                  ? `${badge.bg} ${badge.border} ${badge.glow}`
                  : "bg-slate-950/40 border-slate-900/60 opacity-25 hover:opacity-40 border-dashed"
              }`}
            >
              <BadgeIcon
                className={`w-6 h-6 ${
                  badge.isUnlocked ? badge.color : "text-slate-600"
                }`}
              />
              
              <span className={`text-[9px] font-mono font-bold uppercase truncate max-w-[65px] ${
                badge.isUnlocked ? "text-slate-300" : "text-slate-600"
              }`}>
                {badge.isUnlocked ? badge.progress : "LOCKED"}
              </span>

              {/* Enhanced Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 p-3 bg-[#0a0a0f] border border-slate-700 rounded-lg shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 text-left">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-bold text-white">{badge.name}</h4>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${
                    badge.isUnlocked ? "bg-green-500/20 text-green-400" : "bg-slate-800 text-slate-400"
                  }`}>
                    {badge.isUnlocked ? "Unlocked" : "Locked"}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed mb-2">
                  {badge.description}
                </p>
                <div className="flex items-center justify-between border-t border-slate-800/80 pt-1.5 text-[9px] font-mono">
                  <span className="text-slate-500">Required:</span>
                  <span className="text-blue-400 font-bold">{badge.requirement}</span>
                </div>
                <div className="flex items-center justify-between text-[9px] font-mono mt-0.5">
                  <span className="text-slate-500">Current:</span>
                  <span className="text-slate-300 font-bold">{badge.progress}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

Achievements.displayName = "Achievements";
