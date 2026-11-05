/**
 * Socket.io Client Singleton — GitMatch
 *
 * Maintains a single socket connection for the entire app session.
 * Initialize once on login, disconnect on logout.
 *
 * Supports both local development (via Vite dev proxy) and hosted backend
 * (via VITE_API_BASE_URL).
 */

import { io } from "socket.io-client";

let socketInstance = null;

/**
 * Creates and returns the socket connection.
 * Safe to call multiple times — returns existing instance if already connected.
 *
 * @param {string} token - JWT access token for server-side auth
 * @returns {Socket}
 */
export const initSocket = (token) => {
  if (socketInstance?.connected) return socketInstance;

  const targetServer = import.meta.env?.VITE_API_BASE_URL || undefined;

  socketInstance = io(targetServer, {
    path: "/api/socket.io",
    auth: { token },
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socketInstance.on("connect", () => {
    console.log("[Socket] Connected to", targetServer || "local proxy", ":", socketInstance.id);
  });

  socketInstance.on("connect_error", (err) => {
    console.warn("[Socket] Connection error:", err.message);
  });

  return socketInstance;
};

/**
 * Returns the existing socket instance (may be null if never initialized).
 * @returns {Socket|null}
 */
export const getSocket = () => socketInstance;

/**
 * Disconnects and clears the socket instance.
 * Call on user logout or app teardown.
 */
export const disconnectSocket = () => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
    console.log("[Socket] Disconnected.");
  }
};
