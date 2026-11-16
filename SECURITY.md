# Security Policy & Privacy Guidelines

The GitMatch engineering team takes the security and privacy of our users, developers, and systems seriously. This document outlines our vulnerability disclosure process, core security safeguards, and data privacy principles.

---

## 1. Supported Versions

Security patches and dependency updates are applied to the active `main` branch.

| Version | Supported | Notes |
|:---|:---:|:---|
| `1.0.x` (current) | :white_check_mark: | Actively supported and patched |
| `< 1.0` | :x: | Deprecated |

---

## 2. Reporting a Vulnerability

If you discover a security vulnerability or weakness within GitMatch, please follow our responsible disclosure protocol:

1. **Do NOT report security vulnerabilities via public GitHub issues, discussions, or pull requests.**
2. Email full technical details to **shindepurvesh007@gmail.com**.
3. Include the following details in your report:
   * Description of the vulnerability and its potential impact.
   * Step-by-step reproduction instructions or proof-of-concept (PoC).
   * Affected endpoints, components, or client platforms.
   * Potential remediation or mitigation strategies (if identified).

### Response & Resolution Timeline
* **Initial Acknowledgement**: Within 48 hours of receipt.
* **Triage & Assessment**: Within 5 business days.
* **Patch Release & Advisory**: We coordinate patches and public release with the reporter before publishing any advisory.

---

## 3. Core Security Architecture

GitMatch is engineered with defense-in-depth principles across its full stack:

### A. End-to-End Encryption (E2EE)
* Peer-to-peer messaging uses client-side asymmetric cryptography (RSA-OAEP) via the browser's native `window.crypto.subtle` API.
* The backend database stores only public keys (`Base64 SPKI`) and encrypted message payloads (`ciphertext`).
* **Zero-Knowledge Guarantee**: The backend cannot decrypt user messages. Private keys never leave the client's local storage.

### B. Session & Authentication Hardening
* JWT tokens are issued with a strict 7-day expiration window.
* Tokens are stored in secure, `HttpOnly`, `SameSite=Strict` cookies to mitigate Cross-Site Scripting (XSS) and token theft.
* Passwords are irreversibly hashed using **bcryptjs** with cryptographic salt rounds.
* Email verification and password reset workflows use time-limited, cryptographically random single-use tokens.

### C. Rate Limiting Protection
GitMatch implements tiered rate-limiting middleware (`api/middleware/rateLimit.middleware.js`):
* **Sign-up**: Maximum 5 attempts per 15 minutes per IP.
* **Sign-in**: Maximum 5 attempts per 5 minutes per IP.
* **Password Reset**: Maximum 3 requests per hour per IP.

### D. CORS & Origin Validation
* Strict CORS policies reject cross-origin requests unless explicitly whitelisted in `CLIENT_URL`.
* Credentials mode (`credentials: "include"`) ensures session cookies are protected across origin boundaries.

---

## 4. Privacy Policy & Data Handling

### What Data We Collect
1. **GitHub Telemetry**: Public repositories, commit frequency, starred repositories, and primary language usage to compute skill compatibility. We never request private repository access unless granted explicitly by the user.
2. **Account Credentials**: Name, email address, avatar, and hashed password (for native credentials).
3. **Public Cryptographic Keys**: User-generated public encryption keys to facilitate peer messaging.
4. **Platform Feedback**: Bookmarked issues, applied issues, and hidden issue preferences.

### What We Do Not Collect or Store
* We do **not** store plaintext passwords.
* We do **not** store client private cryptographic keys.
* We do **not** sell user telemetry or personal data to third parties.

### User Data Rights & Account Management
Users retain full control over their account data:
* **Unlink GitHub**: Users can unlink their GitHub profile via `POST /api/users/unlink-github` at any time.
* **Data Erasure**: Users can request complete profile and message deletion by reaching out to the maintainers.

