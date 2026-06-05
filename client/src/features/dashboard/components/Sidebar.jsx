import React from "react";
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

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/auth/signout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
      });
    } catch (error) {
      console.error("Error signing out", error);
    } finally {
      dispatch(logout());
      navigate("/");
    }
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
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                      isActive
                        ? "bg-blue-600/10 text-blue-400 border border-blue-600/20 shadow-[0_0_15px_-5px_rgba(37,99,235,0.3)]"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                    }`}
                  >
                    <route.icon
                      className={`w-4 h-4 ${
                        isActive
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
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 group"
          >
            <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Disconnect
          </button>
        </div>
      </aside>
    </>
  );
};
