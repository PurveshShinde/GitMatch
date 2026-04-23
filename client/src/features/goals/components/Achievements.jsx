import React from "react";
import { Medal } from "lucide-react";

export const Achievements = React.memo(({ profile }) => {
  if (!profile) return null;

  return (
    <div className="bg-[#0f111a] border border-slate-800 rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Medal className="w-5 h-5 text-yellow-500" /> Achievements
      </h3>
      <div className="mb-6 bg-[#0a0a0f] p-3 rounded-lg border border-slate-800">
        <div className="flex justify-between text-xs mb-2 font-mono">
          <span className="text-blue-400">Level {profile.level || 1}</span>
          <span className="text-slate-500">
            {profile.xp || 0} / {profile.nextLevelXp || 200} XP
          </span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-violet-500 h-1.5 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
            style={{ width: `${Math.min(100, ((profile.xp || 0) / (profile.nextLevelXp || 200)) * 100)}%` }}
          ></div>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {["Bug Slayer", "First PR", "Team Player", "Early Bird"].map(
          (badge, i) => (
            <div
              key={i}
              className="aspect-square rounded-lg bg-[#0a0a0f] border border-slate-800 flex flex-col items-center justify-center gap-1 hover:border-yellow-500/30 hover:bg-yellow-500/5 transition-all cursor-help group"
              title={badge}
            >
              <Medal
                className={`w-5 h-5 ${
                  i === 0
                    ? "text-yellow-500"
                    : "text-slate-600 group-hover:text-yellow-500"
                }`}
              />
            </div>
          )
        )}
      </div>
    </div>
  );
});

Achievements.displayName = "Achievements";
