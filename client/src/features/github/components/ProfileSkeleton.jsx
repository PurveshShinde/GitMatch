import React from "react";

const ProfileSkeleton = () => {
  return (
    <div className="bg-[#0f111a] border border-slate-800 rounded-xl p-6 shadow-lg animate-pulse relative overflow-hidden">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-5 h-5 rounded bg-slate-800"></div>
        <div className="w-32 h-5 rounded bg-slate-800"></div>
      </div>
      <div className="space-y-5">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex justify-between items-center">
            <div className="flex gap-3 items-center">
              <div className="w-6 h-6 rounded bg-slate-800"></div>
              <div className="w-20 h-3 rounded bg-slate-800"></div>
            </div>
            <div className="w-16 h-5 rounded bg-slate-800"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileSkeleton;
