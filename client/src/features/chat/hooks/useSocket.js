import { useState, useEffect } from "react";
import { initSocket, getSocket, disconnectSocket } from "../../../utils/socket";

export const useSocket = (token) => {
  const [socketReady, setSocketReady] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!token) return;

    const sock = initSocket(token);
    setSocket(sock);

    const onConnect = () => {
      console.log("[Socket] Connected:", sock.id);
      setSocketReady(true);
    };
    
    const onDisconnect = () => {
      console.log("[Socket] Disconnected");
      setSocketReady(false);
    };

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
      setSocket(null);
    };
  }, [token]);

  return { socketReady, socket: getSocket() };
};
