import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Search, Trophy, Medal, Star, Users, FolderGit, ExternalLink, Loader2, RefreshCw } from "lucide-react";

const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || "http://localhost:3000";

const getLevelTier = (level) => {
  if (level >= 11) return "Open Source Legend";
  if (level >= 8) return "Maintainer";
  if (level >= 5) return "Builder";
  if (level >= 3) return "Contributor";
  return "Rookie";
};

const getLevelColor = (level) => {
  if (level >= 11) return "from-red-500 to-purple-600 text-red-100 border-red-500/30";
  if (level >= 8) return "from-orange-500 to-amber-600 text-orange-100 border-orange-500/30";
  if (level >= 5) return "from-blue-500 to-indigo-600 text-blue-100 border-blue-500/30";
  if (level >= 3) return "from-green-500 to-emerald-600 text-green-100 border-green-500/30";
  return "from-slate-600 to-slate-700 text-slate-100 border-slate-700/30";
};

export default function CommunityPage() {
  const { token, currentUser } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const fetchCommunity = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/community`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch community leaderboard.");
      }

      const data = await response.json();
      if (data.success) {
        setUsers(data.users || []);
      } else {
        throw new Error(data.message || "Something went wrong.");
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCommunity();
  }, [token]);

  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase().trim();
    return (
      user.username.toLowerCase().includes(query) ||
      (user.displayName && user.displayName.toLowerCase().includes(query)) ||
      (user.githubUsername && user.githubUsername.toLowerCase().includes(query))
    );
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Trophy className="w-7 h-7 text-yellow-500 animate-bounce" />
            GitMatch Leaderboard
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Meet the most active contributors on GitMatch, ranked by their GitHub activity and repo stars.
          </p>
        </div>
        <button
          onClick={() => fetchCommunity(true)}
          disabled={refreshing || loading}
          className="self-start md:self-auto px-4 py-2 bg-[#0f111a] hover:bg-[#151826] border border-slate-800 text-slate-300 hover:text-white rounded-lg flex items-center gap-2 text-sm transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          {refreshing ? "Updating..." : "Refresh"}
        </button>
      </div>

      {/* Filter and stats row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-8 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search developers by name or GitHub handle..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-[#0f111a] border border-slate-800 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 text-white placeholder:text-slate-600 rounded-xl text-sm outline-none transition-all"
          />
        </div>
        <div className="md:col-span-4 bg-[#0f111a] border border-slate-800 rounded-xl px-4 py-3 flex items-center justify-between text-sm text-slate-400">
          <span>Total Verified Users:</span>
          <span className="font-mono font-bold text-white text-base">{users.length}</span>
        </div>
      </div>

      {/* Leaderboard content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[350px] bg-[#0f111a]/50 border border-slate-800 rounded-xl">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-3" />
          <p className="text-slate-400 text-sm font-mono">Fetching latest leaderboard data...</p>
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-xl text-center">
          <p className="font-semibold mb-2">Error Loading Leaderboard</p>
          <p className="text-sm">{error}</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="bg-[#0f111a] border border-slate-800 p-12 rounded-xl text-center">
          <p className="text-slate-400 text-sm">No developers found matching "{searchQuery}"</p>
        </div>
      ) : (
        <div className="bg-[#0f111a] border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-[#0a0a0f] border-b border-slate-800 text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
            <div className="col-span-1 text-center">Rank</div>
            <div className="col-span-4">Developer</div>
            <div className="col-span-3">GitHub True Level</div>
            <div className="col-span-3">Performance Metrics</div>
            <div className="col-span-1 text-right">GitHub</div>
          </div>

          {/* Leaderboard items */}
          <div className="divide-y divide-slate-800/60">
            {filteredUsers.map((user, idx) => {
              const rank = idx + 1;
              const isCurrentUser = user._id === currentUser?._id;
              const level = user.githubStats?.level || 1;
              const xp = user.githubStats?.xp || 0;
              const nextLevelXp = user.githubStats?.nextLevelXp || 200;
              const percent = Math.min(100, (xp / nextLevelXp) * 100);
              const tier = getLevelTier(level);
              
              // Rank styling
              let rankBadge = (
                <span className="w-7 h-7 rounded-full bg-slate-800 text-slate-300 font-mono text-xs flex items-center justify-center font-bold">
                  {rank}
                </span>
              );
              let rowBg = isCurrentUser ? "bg-blue-600/5 hover:bg-blue-600/10" : "hover:bg-slate-800/20";
              
              if (rank === 1) {
                rankBadge = (
                  <div className="w-8 h-8 rounded-lg bg-yellow-500/15 border border-yellow-500/30 flex items-center justify-center relative group-hover:scale-105 transition-transform">
                    <Trophy className="w-4 h-4 text-yellow-400" />
                  </div>
                );
              } else if (rank === 2) {
                rankBadge = (
                  <div className="w-8 h-8 rounded-lg bg-slate-400/15 border border-slate-400/30 flex items-center justify-center">
                    <Medal className="w-4 h-4 text-slate-400" />
                  </div>
                );
              } else if (rank === 3) {
                rankBadge = (
                  <div className="w-8 h-8 rounded-lg bg-amber-700/15 border border-amber-700/30 flex items-center justify-center">
                    <Medal className="w-4 h-4 text-amber-600" />
                  </div>
                );
              }

              return (
                <div
                  key={user._id}
                  className={`grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-5 items-center transition-all ${rowBg}`}
                >
                  {/* Rank Column */}
                  <div className="col-span-1 flex items-center justify-between md:justify-center">
                    <span className="text-xs font-mono font-bold text-slate-500 uppercase md:hidden">Rank</span>
                    {rankBadge}
                  </div>

                  {/* Profile Info Column */}
                  <div className="col-span-4 flex items-center gap-3">
                    <img
                      src={user.avatar || `https://github.com/${user.githubUsername}.png`}
                      onError={(e) => { e.target.src = "https://github.com/ghost.png"; }}
                      alt={user.username}
                      className="w-10 h-10 rounded-xl border border-slate-800 bg-slate-900 object-cover shadow-inner"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white truncate">
                          {user.displayName || user.username}
                        </span>
                        {isCurrentUser && (
                          <span className="text-[9px] font-mono font-bold bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/30">
                            YOU
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-500 font-mono truncate block">
                        @{user.githubUsername}
                      </span>
                    </div>
                  </div>

                  {/* Level & XP Column */}
                  <div className="col-span-3 space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded bg-gradient-to-r ${getLevelColor(level)} border`}>
                        Level {level} • {tier}
                      </span>
                      <span className="text-slate-500 font-bold">{xp} / {nextLevelXp} XP</span>
                    </div>
                    <div className="w-full bg-slate-900 border border-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-violet-500 h-2 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.3)] transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Key Stats Column */}
                  <div className="col-span-3">
                    <div className="flex items-center gap-5 text-xs text-slate-400 font-mono">
                      <div className="flex items-center gap-1.5 hover:text-white transition-colors" title="Public Repos">
                        <FolderGit className="w-3.5 h-3.5 text-blue-400" />
                        <span>{user.githubStats?.publicRepos || 0}</span>
                      </div>
                      <div className="flex items-center gap-1.5 hover:text-white transition-colors" title="Followers">
                        <Users className="w-3.5 h-3.5 text-purple-400" />
                        <span>{user.githubStats?.followers || 0}</span>
                      </div>
                      <div className="flex items-center gap-1.5 hover:text-white transition-colors" title="Repo Stars">
                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500/20" />
                        <span className="font-bold text-yellow-400">{user.githubStats?.totalStars || 0}</span>
                      </div>
                    </div>
                  </div>

                  {/* External Link Column */}
                  <div className="col-span-1 flex justify-end">
                    <a
                      href={`https://github.com/${user.githubUsername}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-[#0a0a0f] hover:bg-[#1a1b26] border border-slate-800 rounded-lg text-slate-400 hover:text-white hover:border-slate-700 transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
