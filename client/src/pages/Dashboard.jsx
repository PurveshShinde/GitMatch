import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice.js";
import {
  LayoutDashboard,
  User,
  Trophy,
  Target,
  Users,
  LogOut,
  Settings,
  GitPullRequest,
  GitCommit,
  Zap,
  Terminal,
  Search,
  Bell,
  Star,
  Code2,
  Clock,
  BookOpen,
  CheckSquare,
  Briefcase,
  MessageSquare,
  ChevronRight,
  Medal,
  Flame,
  Activity,
  Send,
  MoreVertical,
  Filter,
  CheckCircle2,
  ExternalLink,
  FolderGit,
  GitFork,
  Github,
  LayoutGrid,
  List as ListIcon,
  AlignJustify,
  GitMerge,
  Plus,
  Trash2,
  Loader2,
  Lock,
  ShieldCheck,
  Menu as MenuIcon, // <-- Using the imported alias
} from "lucide-react";

// --- FIREBASE IMPORTS (for Firestore goals only — messaging moved to MongoDB) ---
import { auth, db } from "../firebase";
import {
  doc,
  setDoc,
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";

import RecommendedIssues from "../components/issues/RecommendedIssues.jsx";
import { initSocket, getSocket, disconnectSocket } from "../utils/socket.js";

const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || "http://localhost:3000";
const appId = "gitmatch-production";

// --- SUB-VIEWS COMPONENTS (No change) ---

const OverviewView = ({
  profile,
  skillData,
  goals,
  toggleGoal,
  addGoal,
  removeGoal,
  activity,
}) => (
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="lg:col-span-4 space-y-8">
      <ProfileCard profile={profile} />
      <SkillMatrix data={skillData} skills={profile.coreSkills} />
    </div>
    <div className="lg:col-span-5 space-y-8">
      <Achievements profile={profile} />
      <WeeklyGoals
        goals={goals}
        toggleGoal={toggleGoal}
        addGoal={addGoal}
        removeGoal={removeGoal}
      />
    </div>
    <div className="lg:col-span-3 space-y-8">
      <ActivityFeed events={activity} username={profile.githubUsername} />
    </div>
  </div>
);

// IssuesView — replaced by RecommendedIssues (skill-based recommendation engine)

// --- LAYOUT OPTIONS COMPONENT (No change) ---
const LayoutToggle = ({ layout, setLayout }) => (
  <div className="flex bg-[#0f111a] border border-slate-800 rounded-lg p-1">
    <button
      onClick={() => setLayout("grid")}
      className={`p-1.5 rounded ${
        layout === "grid"
          ? "bg-slate-800 text-white"
          : "text-slate-500 hover:text-slate-300"
      }`}
      title="Grid View"
    >
      <LayoutGrid className="w-4 h-4" />
    </button>
    <button
      onClick={() => setLayout("list")}
      className={`p-1.5 rounded ${
        layout === "list"
          ? "bg-slate-800 text-white"
          : "text-slate-500 hover:text-slate-300"
      }`}
      title="List View"
    >
      <ListIcon className="w-4 h-4" />
    </button>
    <button
      onClick={() => setLayout("compact")}
      className={`p-1.5 rounded ${
        layout === "compact"
          ? "bg-slate-800 text-white"
          : "text-slate-500 hover:text-slate-300"
      }`}
      title="Compact View"
    >
      <AlignJustify className="w-4 h-4" />
    </button>
  </div>
);

const CollaboratorsView = ({ followers }) => {
  const [layout, setLayout] = useState("grid");

  return (
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
        {followers && followers.length > 0 ? (
          followers.map((dev) => (
            <div
              key={dev.id}
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
                  src={dev.avatar_url}
                  alt={dev.login}
                  className="w-full h-full rounded-full"
                />
              </div>

              <div className={layout === "list" ? "flex-1 text-left" : ""}>
                <h3
                  className={`${
                    layout === "compact" ? "text-xs" : "text-lg"
                  } font-bold text-white truncate w-full`}
                >
                  {dev.login}
                </h3>
                {layout === "list" && (
                  <p className="text-xs text-slate-500">GitHub User</p>
                )}
              </div>

              {layout !== "compact" && (
                <button
                  onClick={() => window.open(dev.html_url, "_blank")}
                  className={`
                  ${layout === "grid" ? "mt-6 w-full" : "px-4"}
                  py-2 rounded-lg text-xs font-bold bg-white text-black hover:bg-slate-200 transition-all flex items-center justify-center gap-2
                `}
                >
                  {layout === "grid" ? (
                    "View Profile"
                  ) : (
                    <ExternalLink className="w-3 h-3" />
                  )}
                  {layout === "grid" && <ExternalLink className="w-3 h-3" />}
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-slate-500 py-10">
            No followers found yet.
          </div>
        )}
      </div>
    </div>
  );
};

// --- REPOSITORIES VIEW (No change) ---
const RepositoriesView = ({ username, navigate }) => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [layout, setLayout] = useState("grid"); // grid, list, compact

  useEffect(() => {
    if (!username) {
      setLoading(false);
      return;
    }

    const fetchRepos = async () => {
      try {
        const res = await fetch(
          `https://api.github.com/users/${username}/repos?sort=updated&per_page=12`
        );
        if (!res.ok) throw new Error("Failed to fetch repositories");
        const data = await res.json();
        setRepos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, [username]);

  if (!username) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 animate-in fade-in zoom-in-95">
        <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mb-2">
          <Github className="w-8 h-8 text-slate-500" />
        </div>
        <h3 className="text-xl font-bold text-white">No GitHub Connected</h3>
        <p className="text-slate-400 max-w-md">
          Connect your GitHub account in settings to view your repositories
          here.
        </p>
        <button
          onClick={() => navigate("/settings")}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
        >
          Go to Settings
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-40 bg-[#0f111a] border border-slate-800 rounded-xl"
          ></div>
        ))}
      </div>
    );
  }

  return (
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
        {repos.map((repo) => (
          <div
            key={repo.id}
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
        ))}
      </div>
    </div>
  );
};

const MessagesView = ({ followers, following, currentUser, token }) => {
  const [activeChat, setActiveChat] = useState(null);
  const [peerUser, setPeerUser] = useState(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loadingChat, setLoadingChat] = useState(false);
  const [socketReady, setSocketReady] = useState(false);
  const messagesEndRef = useRef(null);
  // Keep a stable ref to the active chatId so event handlers don't go stale
  const activeChatIdRef = useRef(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Combine followers and following for the chat list, remove duplicates
  const network = [...(followers || []), ...(following || [])].filter(
    (v, i, a) => a.findIndex((v2) => v2.id === v.id) === i
  );

  // ─── Socket init: one connection per session ──────────────────────────────
  useEffect(() => {
    if (!token) return;

    const sock = initSocket(token);

    const onConnect = () => {
      console.log("[Socket] Connected:", sock.id);
      setSocketReady(true);
    };
    const onDisconnect = () => {
      console.log("[Socket] Disconnected");
      setSocketReady(false);
    };

    // If already connected (e.g. hot-reload), fire immediately
    if (sock.connected) {
      setSocketReady(true);
    } else {
      sock.on("connect", onConnect);
    }
    sock.on("disconnect", onDisconnect);

    return () => {
      sock.off("connect", onConnect);
      sock.off("disconnect", onDisconnect);
      disconnectSocket();
      setSocketReady(false);
    };
  }, [token]);

  // ─── 1. RESOLVE PEER via MongoDB API ────────────────────────────────────────
  useEffect(() => {
    if (!activeChat || !currentUser) return;

    const resolveUser = async () => {
      setLoadingChat(true);
      setPeerUser(null);
      setMessages([]);

      try {
        const res = await fetch(
          `/api/users/lookup?githubUsername=${encodeURIComponent(activeChat.login)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();

        if (data.success && data.user) {
          // Server already returns { uid, displayName, githubUsername }
          setPeerUser(data.user);
        } else {
          // Contact isn't on GitMatch yet — messaging not supported
          setPeerUser({
            uid: `gh_${activeChat.login}`,
            displayName: activeChat.login,
            isVirtual: true,
          });
        }
      } catch (e) {
        console.error("[Chat] Error resolving user:", e);
        setLoadingChat(false);
      }
    };

    resolveUser();
  }, [activeChat, currentUser, token]);

  // ─── 2. LOAD HISTORY + JOIN SOCKET ROOM ────────────────────────────────────
  // Re-runs whenever peerUser resolves OR socket becomes ready
  useEffect(() => {
    if (!peerUser || !currentUser || !socketReady) {
      if (!peerUser || !currentUser) setLoadingChat(false);
      return;
    }

    const sock = getSocket();
    if (!sock) return;

    // chatId: two sorted MongoDB ObjectId strings joined by "_"
    const myId = currentUser._id || currentUser.uid;
    const chatId = [myId, peerUser.uid].sort().join("_");
    activeChatIdRef.current = chatId;

    // Join the Socket.io room
    sock.emit("joinChat", chatId);

    // Fetch message history from MongoDB
    setLoadingChat(true);
    fetch(`/api/messages/${chatId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setMessages(data.messages);
      })
      .catch((err) => console.error("[Chat] History fetch error:", err))
      .finally(() => setLoadingChat(false));

    // Real-time: listen for incoming messages
    const handleNewMessage = (msg) => {
      // Guard: only append if still in the same chat room
      if (msg.chatId === activeChatIdRef.current) {
        setMessages((prev) => {
          // Deduplicate by _id to avoid double-append
          if (prev.some((m) => m._id === msg._id)) return prev;
          return [...prev, msg];
        });
      }
    };
    sock.on("newMessage", handleNewMessage);

    return () => {
      sock.emit("leaveChat", chatId);
      sock.off("newMessage", handleNewMessage);
      activeChatIdRef.current = null;
    };
  }, [peerUser, currentUser, token, socketReady]);

  // ─── 3. SEND via Socket.io (server saves to MongoDB + broadcasts) ──────────
  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || !peerUser || peerUser.isVirtual) return;

    const sock = getSocket();
    if (!sock?.connected) return;

    const myId = currentUser._id || currentUser.uid;
    const chatId = [myId, peerUser.uid].sort().join("_");
    sock.emit("sendMessage", { chatId, text: input.trim() });
    setInput(""); // Optimistic clear — message arrives back via newMessage event
  };

  return (
    <div className="h-[calc(100vh-140px)] bg-[#0f111a] border border-slate-800 rounded-xl overflow-hidden flex animate-in fade-in zoom-in-95 duration-300">
      {/* Sidebar */}
      <div className="w-80 border-r border-slate-800 flex flex-col">
        <div className="p-4 border-b border-slate-800">
          <h3 className="font-bold text-white mb-4">Messages</h3>
          <p className="text-xs text-slate-500 mb-2">GitHub Network</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {network.length > 0 ? (
            network.map((user) => (
              <div
                key={user.id}
                onClick={() => setActiveChat(user)}
                className={`p-4 border-b border-slate-800/50 cursor-pointer hover:bg-slate-800/30 transition-colors ${
                  activeChat?.id === user.id
                    ? "bg-blue-900/10 border-l-2 border-l-blue-500"
                    : ""
                }`}
              >
                <div className="flex gap-3">
                  <img
                    src={user.avatar_url}
                    className="w-10 h-10 rounded-full bg-slate-800"
                    alt=""
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <span className="font-semibold text-slate-200 text-sm truncate">
                      {user.login}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {activeChat?.id === user.id ? "Active" : "Tap to chat"}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-xs text-slate-500 text-center">
              No network contacts found. Connect on GitHub to see people here.
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-[#0a0a0f]">
        {activeChat ? (
          <>
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-[#0f111a]">
              <div className="flex items-center gap-3">
                <img
                  src={activeChat.avatar_url}
                  className="w-8 h-8 rounded-full"
                  alt=""
                />
                <div>
                  <div className="font-bold text-white text-sm">
                    {activeChat.login}
                  </div>
                  {peerUser?.isVirtual && (
                    <span className="text-[10px] text-yellow-500 bg-yellow-500/10 px-1.5 rounded border border-yellow-500/20">
                      Not on GitMatch
                    </span>
                  )}
                </div>
              </div>
              <a
                href={activeChat.html_url}
                target="_blank"
                rel="noreferrer"
                className="text-slate-500 hover:text-white"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {loadingChat ? (
                <div className="flex items-center justify-center h-full text-slate-500 gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Loading chat...
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center text-xs text-slate-600 my-10">
                  <p>Start of conversation with {activeChat.login}</p>
                  {peerUser?.isVirtual && (
                    <p className="mt-2 text-yellow-600">
                      Note: This user hasn't joined GitMatch yet. They won't see
                      this message until they sign up.
                    </p>
                  )}
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`flex ${
                      msg.senderId === currentUser.uid
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-xl text-sm ${
                        msg.senderId === currentUser.uid
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-slate-800 text-slate-200 rounded-bl-none"
                      }`}
                    >
                      <p>{msg.text}</p>
                      <span
                        className={`text-[10px] block mt-1 ${
                          msg.senderId === currentUser.uid
                            ? "text-blue-200"
                            : "text-slate-500"
                        }`}
                      >
                        {msg.createdAt
                          ? new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "Sending..."}
                      </span>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <form
              onSubmit={handleSend}
              className="p-4 border-t border-slate-800 bg-[#0f111a] flex gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                type="text"
                placeholder="Type a message..."
                disabled={loadingChat}
                className="flex-1 bg-[#0a0a0f] border border-slate-800 rounded-lg px-4 py-2 text-sm text-white focus:border-blue-500 outline-none disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loadingChat || !input.trim()}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
            <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
            <p>Select a contact from your network to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser, token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);

  // User object for Firebase chat compatibility
  const user = currentUser ? { uid: currentUser._id, displayName: currentUser.username, ...currentUser } : null;

  // Initialize with null to show loading screen initially
  const [profile, setProfile] = useState(null);
  const [githubIssues, setGithubIssues] = useState([]);
  const [githubRepos, setGithubRepos] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [activity, setActivity] = useState([]);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");
  const [searchTerm, setSearchTerm] = useState("");

  // E2E Encryption state removed — using plaintext messaging for now

  // Goals state is now initialized as an empty array, populated by Firestore
  const [goals, setGoals] = useState([]);

  // --- GOAL ACTIONS (UPDATED FOR FIRESTORE) ---

  const getGoalsCollectionRef = (uid) => {
    if (!db) return null;
    return collection(db, "artifacts", appId, "users", uid, "goals");
  };

  const toggleGoal = async (id, completed) => {
    if (!user) return;
    try {
      const goalDocRef = doc(getGoalsCollectionRef(user.uid), id);
      await updateDoc(goalDocRef, {
        completed: !completed,
        updatedAt: serverTimestamp(),
      });
    } catch (e) {
      console.error("Error toggling goal:", e);
    }
  };

  const addGoal = async (text) => {
    if (!user || !text.trim()) return;
    try {
      await addDoc(getGoalsCollectionRef(user.uid), {
        text: text.trim(),
        completed: false,
        createdAt: serverTimestamp(),
      });
    } catch (e) {
      console.error("Error adding goal:", e);
    }
  };

  const removeGoal = async (id) => {
    if (!user) return;
    try {
      const goalDocRef = doc(getGoalsCollectionRef(user.uid), id);
      await deleteDoc(goalDocRef);
    } catch (e) {
      console.error("Error removing goal:", e);
    }
  };

  // --- GITHUB API HELPERS (No change) ---
  const fetchGitHubData = async (username, primaryLanguage) => {
    if (!username || username === "gitmatch") return;

    try {
      // 1. Fetch Public Activity (Real)
      const activityRes = await fetch(
        `https://api.github.com/users/${username}/events?per_page=5`
      );
      if (activityRes.ok) {
        const events = await activityRes.json();
        setActivity(events);
      }

      // Fetch Followers for Network Tab
      const followersRes = await fetch(
        `https://api.github.com/users/${username}/followers?per_page=10`
      );
      if (followersRes.ok) setFollowers(await followersRes.json());

      // 3. Fetch Following (For Messages)
      const followingRes = await fetch(
        `https://api.github.com/users/${username}/following?per_page=10`
      );
      if (followingRes.ok) setFollowing(await followingRes.json());

      // 4. Fetch Relevant Issues
      const lang = primaryLanguage || "javascript";
      const issuesRes = await fetch(
        `https://api.github.com/search/issues?q=language:${lang}+is:issue+is:open+label:"good first issue"&sort=created&order=desc&per_page=12`
      );

      if (issuesRes.ok) {
        const data = await issuesRes.json();
        const formattedIssues = data.items.map((item) => ({
          id: item.id,
          title: item.title,
          repoName: item.repository_url.split("/").slice(-2).join("/"),
          url: item.html_url,
          labels: item.labels,
          comments: item.comments,
        }));
        setGithubIssues(formattedIssues);
      }

      // 3. Fetch User Stats for "True Level" Calculation
      const userRes = await fetch(`https://api.github.com/users/${username}`);
      if (userRes.ok) {
        const ghData = await userRes.json();
        // True Level Calculation
        const trueScore =
          100 +
          ghData.public_repos * 10 +
          ghData.followers * 5 +
          ghData.public_gists * 2;
        const trueLevel = Math.max(1, Math.floor(Math.sqrt(trueScore / 50)));

        setProfile((prev) => ({
          ...prev,
          level: trueLevel,
          xp: trueScore,
          nextLevelXp: (trueLevel + 1) ** 2 * 50,
        }));
      }
    } catch (error) {
      console.error("GitHub API Error:", error);
    }
  };

  // --- AUTHENTICATION & DATA FETCHING (from Redux + MongoDB) ---
  useEffect(() => {
    if (!currentUser) {
      navigate("/auth");
      return;
    }

    // Build profile from MongoDB user data (onboardingData)
    const onboarding = currentUser.onboardingData || {};
    const userData = {
      displayName: currentUser.username || "Developer",
      githubUsername: onboarding.githubUsername || "",
      experienceYears: onboarding.experienceYears || "0-1",
      weeklyAvailability: onboarding.weeklyAvailability || "10-20",
      primaryLanguage: onboarding.primaryLanguage || "JavaScript",
      coreSkills: onboarding.coreSkills || ["JavaScript"],
      preferredTeamSize: onboarding.preferredTeamSize || "3-5",
      preferredCommunication: onboarding.preferredCommunication || "Async",
      role: onboarding.primaryLanguage || "Developer",
      level: 1, // Will be overwritten by GitHub stats
      xp: 0,
      nextLevelXp: 200,
    };

    setProfile(userData);
    setLoading(false);

    const ghUser = userData.githubUsername;
    if (ghUser && ghUser !== "gitmatch") {
      fetchGitHubData(ghUser, userData.primaryLanguage);
    } else {
      fetchGitHubData("facebook", userData.primaryLanguage);
    }
  }, [currentUser, navigate]);

  // Sync current user into Firestore so peers can find them by githubUsername
  useEffect(() => {
    if (!currentUser?._id || !db) return;
    const syncUser = async () => {
      try {
        const userDocRef = doc(db, "artifacts", appId, "users", currentUser._id);
        await setDoc(
          userDocRef,
          {
            githubUsername: currentUser.onboardingData?.githubUsername || "",
            displayName: currentUser.username || "",
          },
          { merge: true }
        );
      } catch (err) {
        console.warn("[Firestore] User sync failed:", err);
      }
    };
    syncUser();
  }, [currentUser?._id]);

  // --- FIREBASE GOALS LISTENER ---
  useEffect(() => {
    if (!user || !db) return;

    const goalsRef = getGoalsCollectionRef(user.uid);
    // Query ordered by creation time to show newer goals last/at the bottom
    const goalsQuery = query(goalsRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(
      goalsQuery,
      (snapshot) => {
        const loadedGoals = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setGoals(loadedGoals);
      },
      (error) => {
        console.error("Error listening to goals:", error);
      }
    );

    // Initial population for a new user if the list is empty
    if (goals.length === 0 && !localStorage.getItem("goals_initialized")) {
      const initialGoals = [
        { text: "Solve one good first issue", completed: false },
        { text: "Review a pull request in Network", completed: false },
        { text: "Update profile with primary stack", completed: true },
      ];

      initialGoals.forEach(async (goal) => {
        await addDoc(goalsRef, {
          ...goal,
          createdAt: serverTimestamp(),
        });
      });
      // Use local storage flag to prevent re-adding initial goals on every mount
      localStorage.setItem("goals_initialized", "true");
    }

    return () => unsubscribe();
  }, [user, db]); // Rerun when user changes (logs in/out)

  // --- LOGOUT ---
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

  const skillData = [
    { label: "Frontend", value: 85 },
    { label: "Backend", value: 60 },
    { label: "DevOps", value: 40 },
    { label: "Design", value: 70 },
    { label: "Testing", value: 50 },
  ];

  // --- RENDER HELPERS (No change) ---
  const renderContent = () => {
    if (!profile) return null;

    switch (activeTab) {
      case "Overview":
        return (
          <OverviewView
            profile={profile}
            skillData={skillData}
            goals={goals}
            toggleGoal={toggleGoal}
            addGoal={addGoal}
            removeGoal={removeGoal}
            activity={activity}
          />
        );
      case "Issues":
        return <RecommendedIssues />;
      case "Repos":
        return (
          <RepositoriesView
            username={profile.githubUsername}
            navigate={navigate}
          />
        );
      case "Network":
        return <CollaboratorsView followers={followers} />;
      case "Chat":
        return (
          <MessagesView
            followers={followers}
            following={following}
            currentUser={user}
            token={token}
          />
        );
      default:
        return <OverviewView />;
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center text-blue-500 font-mono">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-sm animate-pulse tracking-widest">
            VERIFYING IDENTITY...
          </p>
        </div>
      </div>
    );

  return (
    <div className="flex min-h-screen bg-[#050508] text-slate-200 font-sans selection:bg-blue-500/30 overflow-hidden">
      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR NAVIGATION */}
      <aside
        className={`
        fixed top-0 left-0 z-50 h-screen w-64 bg-[#0a0a0f] border-r border-slate-800/50 p-6 flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:sticky
      `}
      >
        {/* LOGO LINK */}
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
        {/* END LOGO LINK */}

        <div className="space-y-8 flex-1">
          <div>
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-3">
              Main Menu
            </h3>
            <nav className="space-y-1">
              {[
                { name: "Dashboard", icon: LayoutDashboard, id: "Overview" },
                { name: "Find Issues", icon: Search, id: "Issues" },
                { name: "Repositories", icon: FolderGit, id: "Repos" },
                { name: "Network", icon: Users, id: "Network" },
                { name: "Messages", icon: MessageSquare, id: "Chat" },
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                    setSearchTerm("");
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                    activeTab === item.id
                      ? "bg-blue-600/10 text-blue-400 border border-blue-600/20 shadow-[0_0_15px_-5px_rgba(37,99,235,0.3)]"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                  }`}
                >
                  <item.icon
                    className={`w-4 h-4 ${
                      activeTab === item.id
                        ? "text-blue-400"
                        : "text-slate-500 group-hover:text-white"
                    }`}
                  />
                  {item.name}
                </button>
              ))}
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

      {/* MAIN SCROLLABLE CONTENT */}
      <main className="flex-1 min-w-0 h-screen overflow-y-auto">
        {/* TOP NAVBAR */}
        <header className="sticky top-0 z-30 bg-[#050508]/80 backdrop-blur-xl border-b border-slate-800/50 px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-slate-400 hover:text-white p-2 -ml-2"
          >
            <MenuIcon />
          </button>

          <div className="hidden md:flex items-center bg-[#0a0a0f] border border-slate-800 rounded-full px-4 py-2 w-96 focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/20 transition-all">
            <Search className="w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Search in ${activeTab}...`}
              className="bg-transparent border-none outline-none text-sm text-white placeholder:text-slate-600 w-full ml-3"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative text-slate-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-[#050508]"></span>
            </button>

            <div className="h-6 w-px bg-slate-800 hidden sm:block"></div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block leading-tight">
                <div className="text-sm font-bold text-white">
                  {/* Display Name (Real Data) */}
                  {profile?.displayName || "User"}
                </div>
                <div className="text-[10px] text-slate-500 font-mono uppercase">
                  {/* Level / Username fallback */}
                  {profile?.githubUsername
                    ? `@${profile.githubUsername}`
                    : `Level ${profile?.level || 1} Dev`}
                </div>
              </div>
              {/* Avatar (Real Data) */}
              <img
                src={
                  profile?.githubUsername
                    ? `https://github.com/${profile.githubUsername}.png`
                    : "https://github.com/ghost.png" // Fallback
                }
                onError={(e) => (e.target.src = "https://github.com/ghost.png")}
                alt="Avatar"
                className="w-9 h-9 rounded-lg border border-slate-700/50 shadow-sm bg-slate-800"
              />
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-10 max-w-7xl mx-auto pb-20">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

// --- SMALL SUBCOMPONENTS (No change) ---
const ProfileCard = ({ profile }) => (
  <div className="bg-[#0f111a] border border-slate-800 rounded-xl p-6 shadow-lg relative overflow-hidden">
    <div className="absolute top-0 right-0 p-4 opacity-5">
      <User className="w-24 h-24" />
    </div>
    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
      <User className="w-5 h-5 text-blue-500" /> Developer DNA
    </h3>
    <div className="space-y-5 relative z-10">
      <InfoRow
        icon={Clock}
        label="Experience"
        value={`${profile?.experienceYears || "0-1"} Yrs`}
      />
      <InfoRow
        icon={Code2}
        label="Primary Role"
        value={profile?.primaryLanguage || "Developer"}
      />
      <InfoRow
        icon={Users}
        label="Team Size"
        value={profile?.preferredTeamSize || "Any"}
      />
      <InfoRow
        icon={MessageSquare}
        label="Communication"
        value={profile?.preferredCommunication || "Async"}
      />
      <InfoRow
        icon={Zap}
        label="Availability"
        value={
          typeof profile?.weeklyAvailability === "string" &&
          profile.weeklyAvailability.includes("<")
            ? profile.weeklyAvailability
            : `${profile?.weeklyAvailability || 0}h / week`
        }
      />
    </div>
  </div>
);

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center justify-between text-sm group">
    <div className="flex items-center gap-3 text-slate-400 group-hover:text-slate-300 transition-colors">
      <div className="p-1.5 bg-[#0a0a0f] rounded border border-slate-800">
        <Icon className="w-3.5 h-3.5" />
      </div>
      <span>{label}</span>
    </div>
    <span className="font-medium text-slate-200 text-right truncate max-w-[120px] font-mono text-xs bg-[#0a0a0f] px-2 py-1 rounded border border-slate-800/50">
      {value || "N/A"}
    </span>
  </div>
);

const SkillMatrix = ({ data, skills }) => (
  <div className="bg-[#0f111a] border border-slate-800 rounded-xl p-6 shadow-lg flex flex-col items-center">
    <h3 className="text-lg font-bold text-white mb-2 w-full flex items-center gap-2">
      <Activity className="w-5 h-5 text-violet-500" /> Skill Matrix
    </h3>
    <SimpleRadarChart data={data} />
    <div className="mt-2 flex flex-wrap gap-2 justify-center">
      {skills &&
        skills.map((s) => (
          <span
            key={s}
            className="text-[10px] uppercase font-bold tracking-wider text-slate-500 bg-[#0a0a0f] px-2 py-1 rounded border border-slate-800"
          >
            {s}
          </span>
        ))}
    </div>
  </div>
);

const SimpleRadarChart = ({ data }) => {
  const size = 200;
  const center = size / 2;
  const radius = (size - 40) / 2;
  const angleStep = (Math.PI * 2) / data.length;
  const points = data
    .map((item, i) => {
      const value = item.value / 100;
      const angle = i * angleStep - Math.PI / 2;
      return `${center + radius * value * Math.cos(angle)},${
        center + radius * value * Math.sin(angle)
      }`;
    })
    .join(" ");
  const gridLevels = [0.25, 0.5, 0.75, 1];

  return (
    <div className="flex flex-col items-center justify-center py-4">
      <svg width={size} height={size} className="overflow-visible">
        {gridLevels.map((level, idx) => (
          <polygon
            key={idx}
            points={data
              .map((_, i) => {
                const angle = i * angleStep - Math.PI / 2;
                return `${center + radius * level * Math.cos(angle)},${
                  center + radius * level * Math.sin(angle)
                }`;
              })
              .join(" ")}
            fill={
              idx === gridLevels.length - 1 ? "rgba(15, 23, 42, 0.5)" : "none"
            }
            stroke="#334155"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        ))}
        <polygon
          points={points}
          fill="rgba(59, 130, 246, 0.2)"
          stroke="#3b82f6"
          strokeWidth="2"
        />
        {data.map((item, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const labelRadius = radius + 25;
          return (
            <text
              key={i}
              x={center + labelRadius * Math.cos(angle)}
              y={center + labelRadius * Math.sin(angle)}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-[10px] fill-slate-400 font-mono uppercase tracking-wider"
            >
              {item.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

const Achievements = ({ profile }) => (
  <div className="bg-[#0f111a] border border-slate-800 rounded-xl p-6 shadow-lg">
    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
      <Medal className="w-5 h-5 text-yellow-500" /> Achievements
    </h3>
    <div className="mb-6 bg-[#0a0a0f] p-3 rounded-lg border border-slate-800">
      <div className="flex justify-between text-xs mb-2 font-mono">
        <span className="text-blue-400">Level {profile.level}</span>
        <span className="text-slate-500">
          {profile.xp} / {profile.nextLevelXp} XP
        </span>
      </div>
      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
        <div
          className="bg-gradient-to-r from-blue-500 to-violet-500 h-1.5 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
          style={{ width: `${(profile.xp / profile.nextLevelXp) * 100}%` }}
        ></div>
      </div>
    </div>
    <div className="grid grid-cols-4 gap-2">
      {["Bug Slayer", "First PR", "Team Player", "Early Bird"].map(
        (badge, i) => (
          <div
            key={i}
            className="aspect-square rounded-lg bg-[#0a0a0f] border border-slate-800 flex flex-col items-center justify-center gap-1 hover:border-yellow-500/30 hover:bg-yellow-500/5 transition-all cursor-help group"
            title={badge}
          >
            <Medal
              className={`w-5 h-5 ${
                i === 0
                  ? "text-yellow-500"
                  : "text-slate-600 group-hover:text-yellow-500"
              }`}
            />
          </div>
        )
      )}
    </div>
  </div>
);

// --- ENHANCED WEEKLY GOALS (Uses Firestore props) ---
const WeeklyGoals = ({ goals, toggleGoal, addGoal, removeGoal }) => {
  const [newGoal, setNewGoal] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (newGoal.trim() && !isAdding) {
      setIsAdding(true);
      await addGoal(newGoal);
      setNewGoal("");
      setIsAdding(false);
    }
  };

  const handleToggle = (goal) => {
    toggleGoal(goal.id, goal.completed);
  };

  const incompleteGoals = goals.filter((g) => !g.completed);
  const completedGoals = goals.filter((g) => g.completed);

  const renderGoal = (goal) => (
    <div
      key={goal.id}
      className={`flex items-center justify-between gap-3 p-3 rounded-lg border cursor-pointer transition-all select-none group ${
        goal.completed
          ? "bg-green-900/10 border-green-900/30 opacity-60"
          : "bg-[#0a0a0f] border-slate-800"
      }`}
    >
      <div
        className="flex items-center gap-3 flex-1"
        onClick={() => handleToggle(goal)}
      >
        <div
          className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center border transition-colors ${
            goal.completed
              ? "bg-green-500 border-green-500"
              : "border-slate-600 bg-slate-800"
          }`}
        >
          {goal.completed && <CheckSquare className="w-3.5 h-3.5 text-white" />}
        </div>
        <span
          className={`text-xs ${
            goal.completed ? "line-through text-slate-500" : "text-slate-300"
          }`}
        >
          {goal.text}
        </span>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevents toggle from firing when clicking trash
          removeGoal(goal.id);
        }}
        className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-500 transition-all"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );

  return (
    <div className="bg-[#0f111a] border border-slate-800 rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Target className="w-5 h-5 text-red-500" /> Weekly Goals
      </h3>

      <div className="space-y-3 mb-4">
        {incompleteGoals.length === 0 && completedGoals.length === 0 ? (
          <div className="text-center text-slate-500 text-xs py-4">
            No goals found. Add one below!
          </div>
        ) : (
          <>
            {incompleteGoals.map(renderGoal)}
            {completedGoals.length > 0 && (
              <div className="pt-4 border-t border-slate-800/50">
                <p className="text-xs text-slate-600 mb-2">
                  Completed ({completedGoals.length})
                </p>
                {completedGoals.map(renderGoal)}
              </div>
            )}
          </>
        )}
      </div>

      <form
        onSubmit={handleAdd}
        className="flex gap-2 pt-2 border-t border-slate-800/50"
      >
        <input
          type="text"
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
          placeholder="Add new goal..."
          disabled={isAdding}
          className="flex-1 bg-[#0a0a0f] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 outline-none disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!newGoal.trim() || isAdding}
          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:bg-blue-900 disabled:text-slate-500"
        >
          {isAdding ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
        </button>
      </form>
    </div>
  );
};

// --- ACTIVITY FEED (No change) ---
const ActivityFeed = ({ events, username }) => (
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

// --- REMOVED REDUNDANT MenuIcon DECLARATION ---

export default Dashboard;
