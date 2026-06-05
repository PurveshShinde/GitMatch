import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Users } from "lucide-react";
import { useGithubProfile } from "../../github/hooks/useGithubProfile";
import { useGithubNetwork } from "../../github/hooks/useGithubNetwork";
import { UserCard } from "../../github/components/UserCard";
import LayoutToggle from "../../../components/common/LayoutToggle";
import GithubAuthRequired from "../../../components/common/GithubAuthRequired";

const NetworkPage = () => {
  const { currentUser } = useSelector((state) => state.auth);
  const { profile } = useGithubProfile(currentUser);
  
  const username = profile?.githubUsername;
  const { followers, loading } = useGithubNetwork(username);
  const [layout, setLayout] = useState("grid");

  return (
    <GithubAuthRequired title="Network Locked">
      <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Users className="w-6 h-6 text-pink-500" /> Your Network (Followers)
        </h2>
        <LayoutToggle layout={layout} setLayout={setLayout} />
      </div>

      <div
        className={`grid gap-4 ${
          layout === "grid"
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            : layout === "list"
            ? "grid-cols-1"
            : "grid-cols-2 md:grid-cols-4 lg:grid-cols-6"
        }`}
      >
        {loading ? (
          <div className="col-span-full text-center text-slate-500 py-10">
            Loading network...
          </div>
        ) : followers && followers.length > 0 ? (
          followers.map((dev) => (
            <UserCard key={dev.id} user={dev} layout={layout} />
          ))
        ) : (
          <div className="col-span-full text-center text-slate-500 py-10">
            No followers found yet.
          </div>
        )}
      </div>
    </div>
    </GithubAuthRequired>
  );
};

export default NetworkPage;
