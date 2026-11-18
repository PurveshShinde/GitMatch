# Getting Started & Setup Guide

This guide walks through configuring, installing, running, and deploying **GitMatch** locally or in production environments.

---

## 1. Prerequisites

Before installing GitMatch, ensure your environment meets the following specifications:

| Dependency | Minimum Version | Notes |
|:---|:---|:---|
| **Node.js** | `>= 24.0.0` (ES Modules required) | Check via `node -v` |
| **npm** | `>= 10.0.0` | Ships with Node.js |
| **MongoDB** | `>= 7.0` | Local instance or MongoDB Atlas Cluster |
| **Git** | `>= 2.30.0` | For source code management |
| **GitHub Account** | Active developer account | Needed to create an OAuth Application |
| **Firebase Project** | Active Firebase Console project | Needed for Google OAuth & client SDK |

---

## 2. Repository Layout

```
GitMatch/
├── api/                       # Express 5 backend REST API & WebSocket server
│   ├── controllers/           # Route handler controllers (auth, issues, messages, users)
│   ├── data/                  # Static taxonomies and seed datasets
│   ├── middleware/            # Auth guards, error handlers, rate-limiters
│   ├── models/                # Mongoose models (User, EnrichedIssue, Message, etc.)
│   ├── routes/                # Express router endpoints
│   ├── services/              # Core business logic (matching, extraction, telemetry)
│   └── utils/                 # Cryptographic and system helpers
├── client/                    # Vite + React 19 single-page frontend application
│   ├── src/                   # React components, pages, hooks, Redux store
│   ├── public/                # Static public assets
│   └── package.json           # Frontend dependencies
├── scripts/                   # Utility and maintenance scripts (e.g., ping.js)
├── assets/                    # Project screenshots, diagrams, and publications
├── .env                       # Root environment variables (Backend)
├── .env.example               # Example root environment variables template
├── package.json               # Root dependencies and script orchestration
├── SETUP.md                   # This setup guide
├── ARCHITECTURE.md            # System architecture and data modeling
├── AGENTS.md                  # Autonomous agent and NLP extraction specifications
├── CONTRIBUTING.md            # Development & pull request guidelines
├── CODE_OF_CONDUCT.md         # Community behavioral standard
├── SECURITY.md                # Vulnerability disclosures & privacy policy
└── LICENSE                    # MIT License
```

---

## 3. Environment Variables Configuration

GitMatch requires two separate configuration files:
1. **Root `.env`**: Backend server configuration (database, secrets, mailer, GitHub OAuth).
2. **`client/.env`**: Frontend configuration (API base URLs, Firebase credentials, GitHub OAuth client).

### A. Backend Configuration (`.env`)

Create a `.env` file in the repository root by copying the template:

```bash
cp .env.example .env
```

Populate the variables as described below:

```ini
# -------------------------------------------------------------
# Database Configuration
# -------------------------------------------------------------
# MongoDB connection URI (Atlas or local instance)
MONGO="mongodb+srv://<username>:<password>@cluster.mongodb.net/gitmatch?retryWrites=true&w=majority"

# -------------------------------------------------------------
# JWT & Session Security
# -------------------------------------------------------------
# Cryptographic secret key used to sign authentication tokens
JWT_SECRET="generate_a_secure_random_64_character_hex_string"
# JWT token lifespan
JWT_EXPIRES_IN="7d"

# -------------------------------------------------------------
# Email Verification & Password Reset (Nodemailer)
# -------------------------------------------------------------
# SMTP sender address
EMAIL_USER="your_email@domain.com"
# SMTP application-specific password
EMAIL_PASS="your_smtp_app_password"

# -------------------------------------------------------------
# Network & CORS Configuration
# -------------------------------------------------------------
# Comma-separated list of allowed frontend origins (local and production)
# Example: http://localhost:5173 or http://localhost:5173,https://your-frontend.vercel.app
CLIENT_URL="http://localhost:5173"

# Backend server URL (used for local development or hosted deployment)
# Example: http://localhost:3000 or https://your-backend.onrender.com
SERVER_URL="http://localhost:3000"
# Frequency of keep-alive pings (in minutes)
KEEP_ALIVE_INTERVAL_MINUTES=8
# Enable or disable automated self-pinging ("true" | "false")
# Set to "false" to conserve free hosting tier hours (Render)
ENABLE_KEEP_ALIVE="false"

# -------------------------------------------------------------
# GitHub OAuth Credentials
# -------------------------------------------------------------
# Created in GitHub Developer Settings -> OAuth Apps
GITHUB_CLIENT_ID="your_github_client_id"
GITHUB_CLIENT_SECRET="your_github_client_secret"

# Optional: Personal Access Token for GitHub Search API issue ingestion
GITHUB_TOKEN="ghp_your_github_personal_access_token"
```

---

### B. Frontend Configuration (`client/.env`)

Create a `.env` file inside the `client/` folder:

```ini
# -------------------------------------------------------------
# Firebase Client SDK Credentials
# -------------------------------------------------------------
VITE_FIREBASE_API_KEY="AIzaSy..."
VITE_FIREBASE_AUTH_DOMAIN="gitmatch-project.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="gitmatch-project"
VITE_FIREBASE_STORAGE_BUCKET="gitmatch-project.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="123456789012"
VITE_FIREBASE_APP_ID="1:123456789012:web:abcdef..."

# -------------------------------------------------------------
# GitHub OAuth (Client Side)
# -------------------------------------------------------------
VITE_GITHUB_CLIENT_ID="your_github_client_id"
VITE_GITHUB_REDIRECT_URI="http://localhost:5173/auth/github/callback"

# -------------------------------------------------------------
# Backend API Base URL
# -------------------------------------------------------------
# Leave blank to use Vite's local dev proxy, or provide target URL:
VITE_API_BASE_URL="http://localhost:3000"
```

---

## 4. Installation Steps

### Step 1: Install Backend Dependencies
From the repository root:
```bash
npm install
```

### Step 2: Install Frontend Dependencies
Navigate to the client directory and install dependencies:
```bash
cd client
npm install
cd ..
```

---

## 5. Running the Application

### Development Mode

Open two terminal sessions:

#### Terminal 1 — Backend API & WebSockets (Port 3000)
```bash
npm run dev
```
* Runs the Express server with `nodemon` for auto-reloading.
* Initializes the MongoDB connection, taxonomy caches, and WebSocket listener.

#### Terminal 2 — Frontend Application (Port 5173)
```bash
cd client
npm run dev
```
* Starts the Vite development server with SWC compilation and Hot Module Replacement (HMR).
* Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 6. Testing & Utility Scripts

* **Backend Health Check & Keep-Alive Ping**:
  ```bash
  npm run ping
  ```
  Tests outgoing ping logic to verify server availability.

* **Frontend Code Quality & Linting**:
  ```bash
  cd client
  npm run lint
  ```

---

## 7. Production Build & Deployment

### Production Build (Frontend)
```bash
cd client
npm run build
```
Generates an optimized static production bundle in `client/dist`.

### Production Execution (Backend)
```bash
npm run start
```
Starts the production server using native `node api/index.js`.

---

## 8. Common Troubleshooting

| Issue | Cause | Solution |
|:---|:---|:---|
| `Unsupported Node.js version` | Running Node < 24 | Update Node.js to version `24.x` or switch using `nvm use 24`. |
| `MongooseServerSelectionError` | IP not whitelisted in Atlas | Add your current IP address to the Network Access whitelist in MongoDB Atlas. |
| `CORS Error: Access-Control-Allow-Origin` | Origin not present in `CLIENT_URL` | Add your client URL (e.g., `http://localhost:5173`) to `CLIENT_URL` in root `.env`. |
| `GitHub OAuth Redirect URI Mismatch` | Callback mismatch | Ensure `http://localhost:5173/auth/github/callback` is registered in GitHub OAuth app settings. |
| `E2EE Key Generation Fails` | Insecure Context | Web Crypto API requires `https://` or `localhost`. Avoid accessing by raw remote IP without SSL. |

