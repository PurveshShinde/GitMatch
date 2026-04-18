/**
 * E2E Encryption Utilities — GitMatch
 *
 * Algorithm:
 *   Message content → AES-GCM 256-bit (encrypted per message)
 *   AES key         → RSA-OAEP 2048-bit (encrypted separately for receiver AND sender)
 *
 * Dual-key design ensures the sender can also decrypt their own sent messages.
 * All keys are transported/stored as Base64 strings.
 * Private keys NEVER leave the browser.
 *
 * Uses the Web Crypto API exclusively — zero external dependencies.
 */

const RSA_ALGORITHM = {
  name: "RSA-OAEP",
  modulusLength: 2048,
  publicExponent: new Uint8Array([1, 0, 1]),
  hash: "SHA-256",
};

const AES_ALGORITHM = { name: "AES-GCM", length: 256 };

// ─── Encoding Helpers ─────────────────────────────────────────────────────────

const arrayBufferToBase64 = (buffer) => {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

const base64ToArrayBuffer = (base64) => {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
};

// ─── Key Generation ───────────────────────────────────────────────────────────

/**
 * Generates a new RSA-OAEP 2048-bit key pair.
 * @returns {Promise<CryptoKeyPair>}
 */
export const generateKeyPair = () =>
  crypto.subtle.generateKey(RSA_ALGORITHM, true, ["encrypt", "decrypt"]);

// ─── Key Export (CryptoKey → Base64) ─────────────────────────────────────────

/**
 * Exports a CryptoKey public key to Base64 SPKI format.
 * Safe to store in MongoDB / Firestore.
 * @param {CryptoKey} cryptoKey
 * @returns {Promise<string>} Base64 string
 */
export const exportPublicKey = async (cryptoKey) => {
  const exported = await crypto.subtle.exportKey("spki", cryptoKey);
  return arrayBufferToBase64(exported);
};

/**
 * Exports a CryptoKey private key to Base64 PKCS8 format.
 * Must ONLY be stored in IndexedDB — never transmitted.
 * @param {CryptoKey} cryptoKey
 * @returns {Promise<string>} Base64 string
 */
export const exportPrivateKey = async (cryptoKey) => {
  const exported = await crypto.subtle.exportKey("pkcs8", cryptoKey);
  return arrayBufferToBase64(exported);
};

// ─── Key Import (Base64 → CryptoKey) ─────────────────────────────────────────

/**
 * Imports a Base64 SPKI public key back into a usable CryptoKey.
 * @param {string} base64
 * @returns {Promise<CryptoKey>}
 */
export const importPublicKey = (base64) =>
  crypto.subtle.importKey(
    "spki",
    base64ToArrayBuffer(base64),
    RSA_ALGORITHM,
    true,
    ["encrypt"]
  );

/**
 * Imports a Base64 PKCS8 private key back into a usable CryptoKey.
 * @param {string} base64
 * @returns {Promise<CryptoKey>}
 */
export const importPrivateKey = (base64) =>
  crypto.subtle.importKey(
    "pkcs8",
    base64ToArrayBuffer(base64),
    RSA_ALGORITHM,
    true,
    ["decrypt"]
  );

// ─── Message Encryption ───────────────────────────────────────────────────────

/**
 * Encrypts a plaintext message using AES-GCM, then encrypts the AES key
 * twice — once for the receiver's RSA public key, once for the sender's.
 * This allows BOTH parties to decrypt the message from Firestore history.
 *
 * @param {string} plaintext            - The message to encrypt.
 * @param {string} receiverPublicKeyB64 - Receiver's RSA public key (Base64 SPKI).
 * @param {string} senderPublicKeyB64   - Sender's own RSA public key (Base64 SPKI).
 * @returns {Promise<{
 *   ciphertext: string,
 *   encryptedKeyReceiver: string,
 *   encryptedKeySender: string,
 *   iv: string
 * }>} All fields are Base64-encoded.
 */
export const encryptMessage = async (
  plaintext,
  receiverPublicKeyB64,
  senderPublicKeyB64
) => {
  // 1. Generate a fresh single-use AES-GCM 256-bit key for this message
  const aesKey = await crypto.subtle.generateKey(AES_ALGORITHM, true, [
    "encrypt",
    "decrypt",
  ]);

  // 2. Generate a random 96-bit IV (required for AES-GCM)
  const iv = crypto.getRandomValues(new Uint8Array(12));

  // 3. Encrypt the plaintext with AES-GCM
  const encodedText = new TextEncoder().encode(plaintext);
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    aesKey,
    encodedText
  );

  // 4. Export raw AES key bytes so we can wrap them with RSA
  const rawAesKey = await crypto.subtle.exportKey("raw", aesKey);

  // 5. Wrap AES key with receiver's public RSA key
  const receiverCryptoKey = await importPublicKey(receiverPublicKeyB64);
  const encryptedKeyReceiver = await crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    receiverCryptoKey,
    rawAesKey
  );

  // 6. Wrap the same AES key with sender's public RSA key (self-decryption)
  const senderCryptoKey = await importPublicKey(senderPublicKeyB64);
  const encryptedKeySender = await crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    senderCryptoKey,
    rawAesKey
  );

  return {
    ciphertext: arrayBufferToBase64(ciphertext),
    encryptedKeyReceiver: arrayBufferToBase64(encryptedKeyReceiver),
    encryptedKeySender: arrayBufferToBase64(encryptedKeySender),
    iv: arrayBufferToBase64(iv),
  };
};

// ─── Message Decryption ───────────────────────────────────────────────────────

/**
 * Decrypts an E2E-encrypted message.
 *
 * The caller must select the correct wrapped AES key:
 *   - If YOU sent the message  → pass `msg.encryptedKeySender`
 *   - If YOU received the message → pass `msg.encryptedKeyReceiver`
 *
 * @param {{ ciphertext: string, iv: string }} msgData     - Encrypted payload fields.
 * @param {string}                              encryptedKeyB64 - The wrapped AES key for THIS user (Base64).
 * @param {string}                              privateKeyB64   - Your RSA private key (Base64 PKCS8).
 * @returns {Promise<string>} Decrypted plaintext.
 */
export const decryptMessage = async (
  { ciphertext, iv },
  encryptedKeyB64,
  privateKeyB64
) => {
  // 1. Reconstruct the RSA private key
  const privateKey = await importPrivateKey(privateKeyB64);

  // 2. Unwrap the AES key using our RSA private key
  const rawAesKey = await crypto.subtle.decrypt(
    { name: "RSA-OAEP" },
    privateKey,
    base64ToArrayBuffer(encryptedKeyB64)
  );

  // 3. Reconstruct the AES-GCM key
  const aesKey = await crypto.subtle.importKey(
    "raw",
    rawAesKey,
    AES_ALGORITHM,
    false,
    ["decrypt"]
  );

  // 4. Decrypt the ciphertext
  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: base64ToArrayBuffer(iv) },
    aesKey,
    base64ToArrayBuffer(ciphertext)
  );

  return new TextDecoder().decode(decryptedBuffer);
};
