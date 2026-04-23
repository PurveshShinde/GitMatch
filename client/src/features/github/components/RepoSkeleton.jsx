import React from "react";

const RepoSkeleton = () => {
  return (
    <div className="bg-[#0f111a] border border-slate-800 rounded-xl p-5 h-full animate-pulse flex flex-col">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-slate-800 shrink-0"></div>
          <div className="h-4 w-32 bg-slate-800 rounded"></div>
        </div>
        <div className="w-12 h-4 bg-slate-800 rounded"></div>
      </div>
      <div className="space-y-2 mb-4 flex-1 mt-2">
        <div className="h-2 w-full bg-slate-800 rounded"></div>
        <div className="h-2 w-3/4 bg-slate-800 rounded"></div>
      </div>
      <div className="flex justify-between items-center pt-4 border-t border-slate-800/50">
        <div className="flex gap-3">
          <div className="w-8 h-3 bg-slate-800 rounded"></div>
          <div className="w-8 h-3 bg-slate-800 rounded"></div>
        </div>
        <div className="w-16 h-3 bg-slate-800 rounded"></div>
      </div>
    </div>
  );
};

export default RepoSkeleton;
