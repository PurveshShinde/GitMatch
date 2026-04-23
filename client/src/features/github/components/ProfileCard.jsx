import React from "react";
import { User, Clock, Code2, Users, MessageSquare, Zap } from "lucide-react";

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center justify-between text-sm group">
    <div className="flex items-center gap-3 text-slate-400 group-hover:text-slate-300 transition-colors">
      <div className="p-1.5 bg-[#0a0a0f] rounded border border-slate-800">
        <Icon className="w-3.5 h-3.5" />
      </div>
      <span>{label}</span>
    </div>
    <span className="font-medium text-slate-200 text-right truncate max-w-[120px] font-mono text-xs bg-[#0a0a0f] px-2 py-1 rounded border border-slate-800/50">
      {value || "N/A"}
    </span>
  </div>
);

export const ProfileCard = ({ profile }) => (
  <div className="bg-[#0f111a] border border-slate-800 rounded-xl p-6 shadow-lg relative overflow-hidden">
    <div className="absolute top-0 right-0 p-4 opacity-5">
      <User className="w-24 h-24" />
    </div>
    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
      <User className="w-5 h-5 text-blue-500" /> Developer DNA
    </h3>
    <div className="space-y-5 relative z-10">
      <InfoRow
        icon={Clock}
        label="Experience"
        value={`${profile?.experienceYears || "0-1"} Yrs`}
      />
      <InfoRow
        icon={Code2}
        label="Primary Role"
        value={profile?.primaryLanguage || "Developer"}
      />
      <InfoRow
        icon={Users}
        label="Team Size"
        value={profile?.preferredTeamSize || "Any"}
      />
      <InfoRow
        icon={MessageSquare}
        label="Communication"
        value={profile?.preferredCommunication || "Async"}
      />
      <InfoRow
        icon={Zap}
        label="Availability"
        value={
          typeof profile?.weeklyAvailability === "string" &&
          profile.weeklyAvailability.includes("<")
            ? profile.weeklyAvailability
            : `${profile?.weeklyAvailability || 0}h / week`
        }
      />
    </div>
  </div>
);
