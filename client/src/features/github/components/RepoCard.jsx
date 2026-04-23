import React from "react";
import { BookOpen, Star, GitFork } from "lucide-react";

export const RepoCard = React.memo(({ repo, layout }) => {
  return (
    <div
      className={`bg-[#0f111a] border border-slate-800 rounded-xl hover:border-slate-600 transition-all flex flex-col 
        ${layout === "compact" ? "p-3" : "p-5 h-full"}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 overflow-hidden">
          <BookOpen
            className={`text-slate-500 shrink-0 ${
              layout === "compact" ? "w-3 h-3" : "w-4 h-4"
            }`}
          />
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${
              layout === "compact" ? "text-xs" : "text-sm"
            } font-bold text-blue-400 hover:underline truncate`}
          >
            {repo.name}
          </a>
        </div>
        {layout !== "compact" && (
          <div className="text-[10px] px-2 py-0.5 bg-slate-800 rounded text-slate-400 border border-slate-700">
            {repo.visibility}
          </div>
        )}
      </div>

      {layout !== "compact" && (
        <p className="text-xs text-slate-500 mb-4 flex-1 line-clamp-2">
          {repo.description || "No description available."}
        </p>
      )}

      <div
        className={`flex items-center justify-between text-xs text-slate-400 ${
          layout !== "compact" ? "pt-4 border-t border-slate-800/50" : ""
        }`}
      >
        <div className="flex items-center gap-3">
          {repo.language && (
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
              {layout !== "compact" && repo.language}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Star className="w-3 h-3" /> {repo.stargazers_count}
          </span>
          {layout !== "compact" && (
            <span className="flex items-center gap-1">
              <GitFork className="w-3 h-3" /> {repo.forks_count}
            </span>
          )}
        </div>
        {layout !== "compact" && (
          <span className="text-[10px] text-slate-600">
            {new Date(repo.updated_at).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
});

RepoCard.displayName = "RepoCard";
