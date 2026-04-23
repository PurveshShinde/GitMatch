import React from "react";
import { Search, Bell, Menu as MenuIcon } from "lucide-react";

export const Topbar = ({ profile, setSidebarOpen }) => {
  return (
    <header className="sticky top-0 z-30 bg-[#050508]/80 backdrop-blur-xl border-b border-slate-800/50 px-6 py-4 flex items-center justify-between">
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden text-slate-400 hover:text-white p-2 -ml-2"
      >
        <MenuIcon />
      </button>

      <div className="hidden md:flex items-center bg-[#0a0a0f] border border-slate-800 rounded-full px-4 py-2 w-96 focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/20 transition-all">
        <Search className="w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search GitMatch..."
          className="bg-transparent border-none outline-none text-sm text-white placeholder:text-slate-600 w-full ml-3"
        />
      </div>

      <div className="flex items-center gap-6">
        <button className="relative text-slate-400 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-[#050508]"></span>
        </button>

        <div className="h-6 w-px bg-slate-800 hidden sm:block"></div>

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
      </div>
    </header>
  );
};
