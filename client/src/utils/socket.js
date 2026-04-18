/**
 * Socket.io Client Singleton — GitMatch
 *
 * Maintains a single socket connection for the entire app session.
 * Initialize once on login, disconnect on logout.
 *
 * Socket.io path is set to /api/socket.io so it goes through
 * the Vite dev proxy (and later through the reverse proxy in production).
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

  socketInstance = io({
    path: "/api/socket.io",
    auth: { token },
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socketInstance.on("connect", () => {
    console.log("[Socket] Connected:", socketInstance.id);
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
