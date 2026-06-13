import React from "react";
import { Menu as MenuIcon } from "lucide-react";

export const Topbar = ({ profile, setSidebarOpen }) => {
  return (
    <header className="sticky top-0 z-30 bg-[#050508]/80 backdrop-blur-xl border-b border-slate-800/50 px-6 py-4 flex items-center justify-between lg:justify-end">
      {/* Sidebar Toggle for Mobile */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden text-slate-400 hover:text-white p-2 -ml-2"
      >
        <MenuIcon />
      </button>

      {/* User Profile Section */}
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block leading-tight">
          <div className="text-sm font-bold text-white">
            {profile?.displayName || "Loading..."}
          </div>
          <div className="text-[10px] text-slate-500 font-mono uppercase">
            {profile?.githubUsername
              ? `@${profile.githubUsername}`
              : `Level ${profile?.level || 1} Dev`}
          </div>
        </div>
        <img
          src={
            profile?.githubUsername
              ? `https://github.com/${profile.githubUsername}.png`
              : "https://github.com/ghost.png"
          }
          onError={(e) => (e.target.src = "https://github.com/ghost.png")}
          alt="Avatar"
          className="w-9 h-9 rounded-lg border border-slate-700/50 shadow-sm bg-slate-800"
        />
      </div>
    </header>
  );
};
