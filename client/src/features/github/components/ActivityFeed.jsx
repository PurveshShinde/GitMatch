import React from "react";
import { GitCommit, GitPullRequest, GitMerge, Activity } from "lucide-react";

export const ActivityFeed = ({ events, username }) => (
  <div className="bg-[#0f111a] border border-slate-800 rounded-xl p-6 shadow-lg">
    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
      <GitCommit className="w-5 h-5 text-slate-400" /> Activity
    </h3>

    {!username ? (
      <div className="text-xs text-slate-500 text-center py-4">
        Connect GitHub to see activity.
      </div>
    ) : !events || events.length === 0 ? (
      <div className="text-xs text-slate-500 text-center py-4">
        No recent public activity found.
      </div>
    ) : (
      <div className="space-y-6 relative pl-2">
        <div className="absolute top-2 left-[11px] h-[85%] w-px bg-gradient-to-b from-slate-700 to-transparent"></div>
        {events.slice(0, 5).map((event) => (
          <div key={event.id} className="flex gap-4 relative z-10 group">
            <div className="w-6 h-6 rounded-full bg-[#0a0a0f] border border-slate-700 flex items-center justify-center shrink-0 group-hover:border-blue-500 transition-colors shadow-lg">
              {event.type === "PushEvent" ? (
                <GitCommit className="w-3 h-3 text-blue-400" />
              ) : event.type === "PullRequestEvent" ? (
                <GitPullRequest className="w-3 h-3 text-purple-400" />
              ) : event.type === "CreateEvent" ? (
                <GitMerge className="w-3 h-3 text-green-400" />
              ) : (
                <Activity className="w-3 h-3 text-slate-400" />
              )}
            </div>
            <div>
              <p className="text-xs text-slate-300 font-medium group-hover:text-white transition-colors">
                {event.type === "PushEvent"
                  ? `Pushed to ${event.repo.name}`
                  : event.type === "PullRequestEvent"
                  ? `${event.payload.action} PR in ${event.repo.name}`
                  : event.type === "CreateEvent"
                  ? `Created ${event.payload.ref_type} in ${event.repo.name}`
                  : `Activity in ${event.repo.name}`}
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5 font-mono">
                {new Date(event.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);
