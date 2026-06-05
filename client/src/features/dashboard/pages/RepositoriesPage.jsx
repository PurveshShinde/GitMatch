import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FolderGit, Github } from "lucide-react";
import { useGithubProfile } from "../../github/hooks/useGithubProfile";
import { useGithubRepos } from "../../github/hooks/useGithubRepos";
import { RepoCard } from "../../github/components/RepoCard";
import RepoSkeleton from "../../github/components/RepoSkeleton";
import LayoutToggle from "../../../components/common/LayoutToggle";
import GithubAuthRequired from "../../../components/common/GithubAuthRequired";

const RepositoriesPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.auth);
  const { profile } = useGithubProfile(currentUser);
  
  const username = profile?.githubUsername;
  const { repos, loading, error } = useGithubRepos(username);
  const [layout, setLayout] = useState("grid");

  return (
    <GithubAuthRequired title="Repositories Locked">
      <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <FolderGit className="w-6 h-6 text-blue-500" /> My Repositories
          </h2>
          <span className="text-xs text-slate-500 font-mono pt-1">
            Showing latest
          </span>
        </div>
        <LayoutToggle layout={layout} setLayout={setLayout} />
      </div>

      {error && (
        <div className="p-4 bg-red-900/10 border border-red-900/20 text-red-400 rounded-lg text-sm">
          Error: {error}. Try checking your username in settings.
        </div>
      )}

      <div
        className={`grid gap-4 ${
          layout === "grid"
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            : layout === "list"
            ? "grid-cols-1"
            : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        }`}
      >
        {loading ? (
          [...Array(6)].map((_, i) => <RepoSkeleton key={i} />)
        ) : repos.map((repo) => (
          <RepoCard key={repo.id} repo={repo} layout={layout} />
        ))}
      </div>
      </div>
    </GithubAuthRequired>
  );
};

export default RepositoriesPage;
