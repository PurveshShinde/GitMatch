/**
 * Manual/Standalone Keep-Alive Ping Runner
 *
 * Usage:
 *   node scripts/ping.js
 *   node scripts/ping.js https://gitmatch-feqo.onrender.com
 */

const targetBase =
  process.argv[2] ||
  process.env.SERVER_URL ||
  process.env.RENDER_EXTERNAL_URL ||
  "https://gitmatch-feqo.onrender.com";

const targetUrl = `${targetBase.replace(/\/+$/, "")}/api/health`;

console.log(`[Ping] Pinging endpoint: ${targetUrl}`);
const start = Date.now();

try {
  const res = await fetch(targetUrl, {
    headers: { "User-Agent": "GitMatch-Manual-Ping/1.0" },
    signal: AbortSignal.timeout(30000),
  });
  const duration = Date.now() - start;
  const data = await res.json().catch(() => ({}));

  if (res.ok) {
    console.log(`[Ping] Success (${res.status}) in ${duration}ms:`, data);
  } else {
    console.warn(`[Ping] Server replied with status ${res.status} in ${duration}ms:`, data);
  }
} catch (err) {
  const duration = Date.now() - start;
  console.error(`[Ping] Request failed after ${duration}ms:`, err.message);
  process.exit(1);
}
