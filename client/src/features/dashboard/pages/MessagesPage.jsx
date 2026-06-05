import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useGithubProfile } from "../../github/hooks/useGithubProfile";
import { useGithubNetwork } from "../../github/hooks/useGithubNetwork";
import { ChatWindow } from "../../chat/components/ChatWindow";
import GithubAuthRequired from "../../../components/common/GithubAuthRequired";

const MessagesPage = () => {
  const { currentUser, token } = useSelector((state) => state.auth);
  const { profile } = useGithubProfile(currentUser);
  
  const username = profile?.githubUsername;
  const { followers, following } = useGithubNetwork(username);
  
  const [activeChat, setActiveChat] = useState(null);

  // Combine followers and following for the chat list, remove duplicates
  const network = useMemo(() => {
    return [...(followers || []), ...(following || [])].filter(
      (v, i, a) => a.findIndex((v2) => v2.id === v.id) === i
    );
  }, [followers, following]);

  // Provide a clean user object mimicking the old one needed for chat comparisons
  const chatUser = currentUser ? { uid: currentUser._id, ...currentUser } : null;

  return (
    <GithubAuthRequired title="Messages Locked">
      <div className="h-[calc(100vh-140px)] bg-[#0f111a] border border-slate-800 rounded-xl overflow-hidden flex animate-in fade-in zoom-in-95 duration-300">
        {/* Sidebar */}
      <div className="w-80 border-r border-slate-800 flex flex-col hidden md:flex">
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
        <ChatWindow 
          activeChat={activeChat} 
          currentUser={chatUser} 
          token={token} 
        />
      </div>
    </div>
    </GithubAuthRequired>
  );
};

export default MessagesPage;
