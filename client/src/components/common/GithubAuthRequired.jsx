import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Github, Lock, Loader2 } from "lucide-react";
import { githubAuthUser } from "../../redux/authSlice";

export default function GithubAuthRequired({ children, title = "GitHub Required" }) {
  const { currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isLinkingGithub, setIsLinkingGithub] = useState(false);
  const [error, setError] = useState(null);

  const handleGitHubAuth = async () => {
    const githubClientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    const githubRedirectUri = import.meta.env.VITE_GITHUB_REDIRECT_URI;

    if (!githubClientId || !githubRedirectUri) {
      setError("GitHub OAuth credentials not configured.");
      return;
    }

    const state =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem("github_oauth_state", state);

    const authUrl = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${encodeURIComponent(githubRedirectUri)}&scope=read:user,user:email&state=${state}`;

    window.open(
      authUrl,
      "github_auth",
      "width=500,height=600,menubar=no,toolbar=no,location=no,status=no"
    );
  };

  useEffect(() => {
    const handleMessage = async (event) => {
      if (event.origin !== window.location.origin) return;

      if (event.data?.type === "github_auth_complete" && event.data?.code) {
        setIsLinkingGithub(true);
        setError(null);
        try {
          await dispatch(
            githubAuthUser({ code: event.data.code })
          ).unwrap();
        } catch (err) {
          setError(err || "GitHub verification failed.");
        } finally {
          setIsLinkingGithub(false);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [dispatch]);

  if (!currentUser?.githubUsername) {
    return (
      <div className="flex-1 h-full min-h-[400px] flex items-center justify-center p-6 bg-[#0a0a0f] border border-slate-800 rounded-xl">
        <div className="max-w-md w-full bg-[#0f111a] border border-slate-700 rounded-xl p-8 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500" />
          
          <div className="w-20 h-20 bg-slate-800/80 rounded-2xl flex items-center justify-center mx-auto mb-6 relative">
            <Github className="w-10 h-10 text-slate-400" />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center border-4 border-[#0f111a]">
              <Lock className="w-4 h-4 text-white" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-3 font-mono">{title}</h2>
          <p className="text-slate-400 text-sm mb-8 leading-relaxed">
            You must link your GitHub account to access this feature. We need to verify your identity to protect the community.
          </p>

          {error && (
            <p className="text-red-400 text-sm mb-4">{error}</p>
          )}

          <button
            onClick={handleGitHubAuth}
            disabled={isLinkingGithub}
            className="w-full py-3 bg-[#2ea043] hover:bg-[#2c974b] text-white rounded-lg font-mono font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-900/20 disabled:opacity-50"
          >
            {isLinkingGithub ? <Loader2 className="w-5 h-5 animate-spin" /> : <Github className="w-5 h-5" />}
            {isLinkingGithub ? "Verifying..." : "Connect GitHub"}
          </button>
        </div>
      </div>
    );
  }

  return children;
}
