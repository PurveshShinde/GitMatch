import React, { useState, useEffect, useRef } from "react";
import { ExternalLink, MessageSquare, Loader2, Send } from "lucide-react";
import { useSocket } from "../hooks/useSocket";
import { useChat } from "../hooks/useChat";

export const ChatWindow = React.memo(({ activeChat, currentUser, token }) => {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  
  const { socketReady, socket } = useSocket(token);
  const { peerUser, messages, loadingChat, sendMessage } = useChat(
    activeChat, 
    currentUser, 
    token, 
    socketReady, 
    socket
  );

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (sendMessage(input)) {
      setInput("");
    }
  };

  if (!activeChat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
        <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
        <p>Select a contact from your network to start chatting</p>
      </div>
    );
  }

  return (
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
                msg.senderId === currentUser?.uid || msg.senderId === currentUser?._id
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-xl text-sm ${
                  msg.senderId === currentUser?.uid || msg.senderId === currentUser?._id
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-slate-800 text-slate-200 rounded-bl-none"
                }`}
              >
                <p>{msg.text}</p>
                <span
                  className={`text-[10px] block mt-1 ${
                    msg.senderId === currentUser?.uid || msg.senderId === currentUser?._id
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
          disabled={loadingChat || !input.trim() || peerUser?.isVirtual}
          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </>
  );
});

ChatWindow.displayName = "ChatWindow";
