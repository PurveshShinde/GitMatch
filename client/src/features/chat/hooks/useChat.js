import { useState, useEffect, useRef, useCallback } from "react";
import { resolvePeerUser, fetchMessageHistory } from "../services/chatService";

export const useChat = (activeChatUser, currentUser, token, socketReady, socket) => {
  const [peerUser, setPeerUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingChat, setLoadingChat] = useState(false);
  
  const activeChatIdRef = useRef(null);

  // 1. Resolve Peer User
  useEffect(() => {
    if (!activeChatUser || !currentUser || !token) return;

    const resolveUser = async () => {
      setLoadingChat(true);
      setPeerUser(null);
      setMessages([]);
      
      try {
        const user = await resolvePeerUser(activeChatUser.login, token);
        setPeerUser(user);
      } catch (e) {
        console.error("[Chat] Error resolving user:", e);
      } finally {
        // Will be set to false after history loads in next effect
        // Or if no peer found
        if (!user) setLoadingChat(false);
      }
    };

    resolveUser();
  }, [activeChatUser, currentUser, token]);

  // 2. Load History + Join Socket Room
  useEffect(() => {
    if (!peerUser || !currentUser || !socketReady || !socket) {
      if (!peerUser || !currentUser) setLoadingChat(false);
      return;
    }

    const myId = currentUser._id || currentUser.uid;
    const chatId = [myId, peerUser.uid].sort().join("_");
    activeChatIdRef.current = chatId;

    // Join room
    socket.emit("joinChat", chatId);

    // Fetch history
    setLoadingChat(true);
    fetchMessageHistory(chatId, token)
      .then((history) => {
        setMessages(history);
      })
      .catch((err) => console.error("[Chat] History fetch error:", err))
      .finally(() => setLoadingChat(false));

    // Handle new messages
    const handleNewMessage = (msg) => {
      if (msg.chatId === activeChatIdRef.current) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === msg._id)) return prev;
          // Keep only last 50 messages to prevent performance issues
          const newMessages = [...prev, msg];
          return newMessages.length > 50 ? newMessages.slice(newMessages.length - 50) : newMessages;
        });
      }
    };
    
    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.emit("leaveChat", chatId);
      socket.off("newMessage", handleNewMessage);
      activeChatIdRef.current = null;
    };
  }, [peerUser, currentUser, token, socketReady, socket]);

  // 3. Send Message
  const sendMessage = useCallback((text) => {
    if (!text.trim() || !peerUser || peerUser.isVirtual || !socket?.connected) return false;

    const myId = currentUser._id || currentUser.uid;
    const chatId = [myId, peerUser.uid].sort().join("_");
    socket.emit("sendMessage", { chatId, text: text.trim() });
    
    return true; // Success, caller can clear input
  }, [peerUser, currentUser, socket]);

  return { peerUser, messages, loadingChat, sendMessage };
};
