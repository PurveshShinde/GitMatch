import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  LayoutDashboard,
  Search,
  FolderGit,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  Terminal,
  Trophy,
} from "lucide-react";
import { logout } from "../../../redux/authSlice";
import { auth } from "../../../firebase";
import { signOut } from "firebase/auth";

const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || "http://localhost:3000";

const routes = [
  { name: "Overview", icon: LayoutDashboard, path: "/dashboard" },
  { name: "Find Issues", icon: Search, path: "/dashboard/issues" },
  { name: "Repositories", icon: FolderGit, path: "/dashboard/repos" },
  { name: "Network", icon: Users, path: "/dashboard/network" },
  { name: "Community", icon: Trophy, path: "/dashboard/community" },
  { name: "Messages", icon: MessageSquare, path: "/dashboard/messages" },
];

export const Sidebar = ({ sidebarOpen, setSidebarOpen, token }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.auth);

  const githubUsername = currentUser?.githubUsername || currentUser?.onboardingData?.githubUsername;

  const visibleRoutes = routes.filter(route => {
    if (route.path === "/dashboard/community") {
      return !!githubUsername;
    }
    return true;
  });

  const executeLogout = () => {
    setShowLogoutModal(false);

    // Instantly navigate and clear Redux state (optimistic update)
    navigate("/");
    setTimeout(() => {
      dispatch(logout());
    }, 10);

    // Fire off backend and Firebase logouts in the background so the UI doesn't hang
    if (auth) {
      signOut(auth).catch(err => console.error("Firebase signout error:", err));
    }

    fetch(`${API_BASE_URL}/api/auth/signout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
    }).catch(err => console.error("Backend signout error:", err));
  };

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={`
        fixed top-0 left-0 z-50 h-screen w-64 bg-[#0a0a0f] border-r border-slate-800/50 p-6 flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:sticky
      `}
      >
        <Link
          to="/"
          className="flex items-center gap-3 font-bold text-xl text-white mb-10 font-mono tracking-tighter cursor-pointer group"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-violet-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:shadow-blue-500/40 transition-shadow">
            <Terminal className="w-5 h-5 text-white" />
          </div>
          <span className="group-hover:text-blue-200 transition-colors">
            GitMatch<span className="text-blue-500 animate-pulse">_</span>
          </span>
        </Link>

        <div className="space-y-8 flex-1">
          <div>
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-3">
              Main Menu
            </h3>
            <nav className="space-y-1">
              {visibleRoutes.map((route) => {
                const isActive = location.pathname === route.path;
                return (
                  <Link
                    key={route.name}
                    to={route.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${isActive
                        ? "bg-blue-600/10 text-blue-400 border border-blue-600/20 shadow-[0_0_15px_-5px_rgba(37,99,235,0.3)]"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                      }`}
                  >
                    <route.icon
                      className={`w-4 h-4 ${isActive
                          ? "text-blue-400"
                          : "text-slate-500 group-hover:text-white"
                        }`}
                    />
                    {route.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div>
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-3">
              System
            </h3>
            <button
              onClick={() => navigate("/settings")}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all"
            >
              <Settings className="w-4 h-4 text-slate-500 group-hover:text-white" />
              Settings
            </button>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/50">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 group"
          >
            <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Logout
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="bg-[#0f111a] border border-slate-800 rounded-xl p-6 w-full max-w-sm shadow-2xl shadow-black/50 transform transition-all animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
                <LogOut className="w-5 h-5 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-white font-mono tracking-tight">Confirm Logout</h3>
            </div>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Are you sure you want to log out of GitMatch? You will need to sign in again to access your dashboard.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800/50 hover:bg-slate-700 border border-slate-700/50 rounded-lg transition-all"
              >
                Cancel
              </button>
              <button
                onClick={executeLogout}
                className="px-4 py-2 text-sm font-bold text-white bg-red-500 hover:bg-red-400 border border-red-500/50 rounded-lg shadow-lg shadow-red-500/20 transition-all flex items-center gap-2"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
