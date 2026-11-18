/**
 * Keep-Alive Ping Service for Render Backend
 *
 * Render free web services spin down after 15 minutes of inactivity.
 * This service pings the server's public health endpoint (/api/health) every 8 minutes
 * to keep the service warm and prevent cold-start delays.
 */

const DEFAULT_INTERVAL_MINUTES = 8;

export function startKeepAliveService(options = {}) {
  const intervalMinutes =
    Number(process.env.KEEP_ALIVE_INTERVAL_MINUTES) ||
    options.intervalMinutes ||
    DEFAULT_INTERVAL_MINUTES;
  const intervalMs = intervalMinutes * 60 * 1000;

  // Resolve the server URL:
  // 1. RENDER_EXTERNAL_URL: Provided automatically by Render in web service environments
  // 2. SERVER_URL: Explicitly set in .env
  // 3. Fallback to local server URL
  const rawUrl =
    process.env.RENDER_EXTERNAL_URL ||
    process.env.SERVER_URL ||
    options.url ||
    "http://localhost:3000";

  const cleanBase = rawUrl.replace(/\/+$/, "");
  const targetUrl = `${cleanBase}/api/health`;

  // Keep-alive is disabled by default to prevent exhausting free tier instance hours.
  // Enable explicitly in your hosting environment (e.g. Render Dashboard) by setting ENABLE_KEEP_ALIVE=true
  const isEnabled = process.env.ENABLE_KEEP_ALIVE === "true";

  if (!isEnabled) {
    console.log(
      `[KeepAlive] Service disabled. Set ENABLE_KEEP_ALIVE=true in your environment variables to enable keep-alive pings.`
    );
    return null;
  }

  // Avoid unnecessary self-pings when running locally unless explicitly requested
  const isLocalhost =
    cleanBase.includes("localhost") || cleanBase.includes("127.0.0.1");

  if (isLocalhost) {
    console.log(
      `[KeepAlive] Local environment detected (${cleanBase}). Keep-alive ping is disabled.`
    );
    return null;
  }

  console.log(
    `[KeepAlive] Service active. Pinging ${targetUrl} every ${intervalMinutes} minutes.`
  );

  const ping = async () => {
    const timestamp = new Date().toLocaleTimeString();
    try {
      const response = await fetch(targetUrl, {
        method: "GET",
        headers: {
          "User-Agent": "GitMatch-KeepAlive/1.0",
          "Cache-Control": "no-cache",
        },
        signal: AbortSignal.timeout(15000), // 15s timeout
      });

      if (response.ok) {
        console.log(
          `[KeepAlive] [${timestamp}] Ping successful: ${targetUrl} (Status: ${response.status})`
        );
      } else {
        console.warn(
          `[KeepAlive] [${timestamp}] Ping returned status ${response.status}: ${targetUrl}`
        );
      }
    } catch (err) {
      console.warn(
        `[KeepAlive] [${timestamp}] Ping failed for ${targetUrl}: ${err.message}`
      );
    }
  };

  // Perform initial ping after 45 seconds to let the server boot up completely
  const initialTimer = setTimeout(ping, 45 * 1000);
  const intervalTimer = setInterval(ping, intervalMs);

  return {
    stop: () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
      console.log("[KeepAlive] Service stopped.");
    },
    pingNow: ping,
  };
}

export default startKeepAliveService;
