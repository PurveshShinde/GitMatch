/**
 * Key Manager — GitMatch
 *
 * Persists the user's RSA key pair in the browser's IndexedDB.
 * Keys are stored as Base64 strings (SPKI for public, PKCS8 for private),
 * NOT as raw CryptoKey objects — this ensures safe serialization across
 * all browsers and avoids issues with structured clone algorithm variations.
 *
 * Schema:
 *   Database : "GitMatchKeys" (version 1)
 *   Store    : "keys"
 *   Entries  :
 *     "publicKey"  → Base64 SPKI string
 *     "privateKey" → Base64 PKCS8 string
 *
 * Private keys NEVER leave the browser. Public keys are synced to
 * MongoDB and Firestore so peers can encrypt messages for this user.
 */

const DB_NAME = "GitMatchKeys";
const DB_VERSION = 1;
const STORE_NAME = "keys";

// ─── Internal: Open / upgrade IndexedDB ──────────────────────────────────────

const openDB = () =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Saves both keys as Base64 strings to IndexedDB.
 * Overwrites any currently stored keys (use only during initial key generation).
 *
 * @param {string} publicKeyB64  - Base64 SPKI-encoded public key.
 * @param {string} privateKeyB64 - Base64 PKCS8-encoded private key.
 * @returns {Promise<void>}
 */
export const saveKeyPair = async (publicKeyB64, privateKeyB64) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.put(publicKeyB64, "publicKey");
    store.put(privateKeyB64, "privateKey");
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => reject(tx.error);
  });
};

/**
 * Loads the stored key pair from IndexedDB.
 * Returns null if no keys have been saved yet (first login on this device).
 *
 * @returns {Promise<{ publicKeyB64: string, privateKeyB64: string } | null>}
 */
export const loadKeyPair = async () => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const pubReq = store.get("publicKey");
    const privReq = store.get("privateKey");

    tx.oncomplete = () => {
      db.close();
      if (pubReq.result && privReq.result) {
        resolve({ publicKeyB64: pubReq.result, privateKeyB64: privReq.result });
      } else {
        resolve(null);
      }
    };
    tx.onerror = () => reject(tx.error);
  });
};
