import React from "react";
import { ExternalLink } from "lucide-react";

export const UserCard = React.memo(({ user, layout }) => {
  return (
    <div
      className={`bg-[#0f111a] border border-slate-800 rounded-xl hover:bg-slate-900/50 transition-colors relative group
      ${
        layout === "grid"
          ? "p-6 flex flex-col items-center text-center"
          : layout === "list"
          ? "p-4 flex items-center justify-between"
          : "p-4 flex flex-col items-center text-center gap-2"
      }
    `}
    >
      <div
        className={`
      ${
        layout === "grid"
          ? "w-20 h-20 mb-4"
          : layout === "list"
          ? "w-12 h-12 mr-4"
          : "w-14 h-14 mb-1"
      }
      rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-slate-700 overflow-hidden p-1
    `}
      >
        <img
          src={user.avatar_url}
          alt={user.login}
          className="w-full h-full rounded-full"
        />
      </div>

      <div className={layout === "list" ? "flex-1 text-left" : ""}>
        <h3
          className={`${
            layout === "compact" ? "text-xs" : "text-lg"
          } font-bold text-white truncate w-full`}
        >
          {user.login}
        </h3>
        {layout === "list" && (
          <p className="text-xs text-slate-500">GitHub User</p>
        )}
      </div>

      {layout !== "compact" && (
        <button
          onClick={() => window.open(user.html_url, "_blank")}
          className={`
          ${layout === "grid" ? "mt-6 w-full" : "px-4"}
          py-2 rounded-lg text-xs font-bold bg-white text-black hover:bg-slate-200 transition-all flex items-center justify-center gap-2
        `}
        >
          {layout === "grid" ? "View Profile" : <ExternalLink className="w-3 h-3" />}
          {layout === "grid" && <ExternalLink className="w-3 h-3" />}
        </button>
      )}
    </div>
  );
});

UserCard.displayName = "UserCard";
