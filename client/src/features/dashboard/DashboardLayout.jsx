import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { Sidebar } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";
import { useGithubProfile } from "../github/hooks/useGithubProfile";
import { syncUserToFirestore } from "../goals/services/goalService";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser, token } = useSelector((state) => state.auth);
  
  // Fetch global profile data used by Layout (like Topbar)
  const { profile } = useGithubProfile(currentUser);

  // Sync user to Firestore once on mount
  useEffect(() => {
    if (currentUser?._id && profile?.githubUsername) {
      syncUserToFirestore(currentUser._id, profile.githubUsername, profile.displayName);
    }
  }, [currentUser?._id, profile?.githubUsername, profile?.displayName]);

  return (
    <div className="flex min-h-screen bg-[#050508] text-slate-200 font-sans selection:bg-blue-500/30 overflow-hidden">
      <Sidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        token={token} 
      />

      <main className="flex-1 min-w-0 h-screen overflow-y-auto">
        <Topbar 
          profile={profile} 
          setSidebarOpen={setSidebarOpen} 
        />

        <div className="p-6 lg:p-10 max-w-7xl mx-auto pb-20">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
