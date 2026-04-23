import React from "react";
import { MessageSquare } from "lucide-react";

const ChatSkeleton = () => {
  return (
    <div className="h-[calc(100vh-140px)] bg-[#0f111a] border border-slate-800 rounded-xl overflow-hidden flex animate-pulse">
      {/* Sidebar Skeleton */}
      <div className="w-80 border-r border-slate-800 flex flex-col hidden md:flex">
        <div className="p-4 border-b border-slate-800">
          <div className="w-24 h-5 bg-slate-800 rounded mb-4"></div>
          <div className="w-16 h-3 bg-slate-800 rounded mb-2"></div>
        </div>
        <div className="flex-1 p-2 space-y-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-800 shrink-0"></div>
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                <div className="h-2 bg-slate-800 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area Skeleton */}
      <div className="flex-1 flex flex-col bg-[#0a0a0f]">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-[#0f111a]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-800"></div>
            <div className="w-32 h-4 bg-slate-800 rounded"></div>
          </div>
          <div className="w-5 h-5 bg-slate-800 rounded"></div>
        </div>

        <div className="flex-1 p-6 space-y-6">
          <div className="flex justify-start">
            <div className="w-2/3 h-16 bg-slate-800 rounded-xl rounded-bl-none"></div>
          </div>
          <div className="flex justify-end">
            <div className="w-1/2 h-12 bg-blue-900/20 rounded-xl rounded-br-none border border-blue-900/30"></div>
          </div>
          <div className="flex justify-start">
            <div className="w-1/3 h-10 bg-slate-800 rounded-xl rounded-bl-none"></div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-800 bg-[#0f111a] flex gap-2">
          <div className="flex-1 bg-[#0a0a0f] border border-slate-800 rounded-lg h-10"></div>
          <div className="w-10 h-10 bg-slate-800 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default ChatSkeleton;
