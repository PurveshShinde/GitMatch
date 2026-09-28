<p align="center">
  <img src="https://img.shields.io/badge/GitMatch-Developer%20Matching%20Platform-blueviolet?style=for-the-badge&logo=github" alt="GitMatch Banner" />
</p>

<h1 align="center">🚀 GitMatch</h1>

<p align="center">
  <strong>Discover, analyze, and connect with developers through the power of GitHub data.</strong>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#%EF%B8%8F-tech-stack">Tech Stack</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-api-reference">API Reference</a> •
  <a href="#-contributing">Contributing</a> •
  <a href="#-license">License</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen?style=flat-square&logo=node.js" alt="Node Version" />
  <img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="License" />
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square" alt="PRs Welcome" />
  <img src="https://img.shields.io/badge/platform-web-lightgrey?style=flat-square" alt="Platform" />
</p>

---

## 📖 Overview

**GitMatch** is a full-stack developer platform that leverages the **GitHub API** to intelligently match developers with relevant open-source issues, facilitate real-time collaboration, and provide deep insights into developer profiles and repositories.

Built as a B.Tech Major Project, GitMatch goes beyond a simple profile viewer — it features a **multi-signal ranking engine** that scores GitHub issues against a developer's skill vector, a **real-time messaging system** powered by WebSockets, and a **gamification layer** with XP and leveling based on GitHub activity.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔍 **Smart Issue Matching** | Multi-signal ranking engine matches GitHub issues to your skills, experience level, and preferences using weighted scoring across 7 dimensions |
| 🧠 **Skill Extraction Engine** | NLP-powered skill extraction from issue titles, labels, body text, and repo metadata using a canonical taxonomy |
| 📊 **Developer Analytics** | XP & leveling system computed from public repos, stars, followers, gists, and recent activity |
| 💬 **Real-time Chat** | Socket.io-powered messaging with JWT-authenticated WebSocket connections and persistent message history |
| 🔐 **Multi-Provider Auth** | Local (email/password), Google OAuth (via Firebase), and GitHub OAuth with email verification flow |
| 🎯 **Personalized Onboarding** | Guided onboarding wizard that captures skill preferences, experience level, and collaboration style |
| 🌐 **Community Discovery** | Browse and connect with other developers based on shared skills and interests |
| 🔄 **GitHub Account Linking** | Link/unlink GitHub accounts post-registration to enrich your profile with live data |
| 📈 **Repository Explorer** | Browse your connected GitHub repositories with stats and insights |
| 🛡️ **Rate Limiting** | Per-endpoint, IP-based rate limiting on sensitive auth routes |

---

## 🏗️ Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                        CLIENT (React + Vite)                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐  │
│  │ Auth     │ │Dashboard │ │ Chat     │ │ Settings/Profile │  │
│  │ Pages    │ │ Features │ │ Feature  │ │ Pages            │  │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────────┬─────────┘  │
│       │            │            │                 │            │
│  ┌────┴────────────┴────────────┴─────────────────┴────────┐  │
│  │         Redux Toolkit (State Management)                 │  │
│  │         + Redux Persist (Local Storage)                  │  │
│  └────────────────────────┬────────────────────────────────┘  │
│                           │                                    │
│  Firebase Auth ───────────┤       Socket.io Client ────────┐  │
└───────────────────────────┼────────────────────────────────┼──┘
                            │ REST API (Vite Proxy)          │ WebSocket
                            ▼                                ▼
┌────────────────────────────────────────────────────────────────┐
│                      SERVER (Node.js + Express)                │
│  ┌────────────────────────────────────────────────────────────┐│
│  │                     Middleware Layer                        ││
│  │  JWT Auth │ Rate Limiter │ CORS │ Cookie Parser            ││
│  └──────┬─────────────┬──────────────┬────────────────────────┘│
│         │             │              │                         │
│  ┌──────┴──────┐ ┌────┴────┐ ┌──────┴──────┐ ┌────────────┐  │
│  │ Auth        │ │ Issues  │ │ Users       │ │ Messages   │  │
│  │ Controller  │ │ Ctrl    │ │ Controller  │ │ Controller │  │
│  └──────┬──────┘ └────┬────┘ └──────┬──────┘ └─────┬──────┘  │
│         │             │             │               │          │
│  ┌──────┴─────────────┴─────────────┴───────────────┴──────┐  │
│  │                    Service Layer                         │  │
│  │  Skill Extraction │ Issue Matching │ GitHub Stats │ ...  │  │
│  └──────────────────────────┬──────────────────────────────┘  │
│                             │                                  │
│  ┌──────────────────────────┴──────────────────────────────┐  │
│  │              MongoDB (via Mongoose ODM)                  │  │
│  │  Users │ EnrichedIssues │ Messages │ SkillTaxonomy │ ...│  │
│  └─────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| [React](https://react.dev/) | `^19.1.1` | UI library with hooks and Suspense for lazy-loaded pages |
| [Vite](https://vitejs.dev/) | `^7.1.6` | Build tool with HMR, dev proxy for API, and SWC-based React plugin |
| [Tailwind CSS v4](https://tailwindcss.com/) | `^4.1.13` | Utility-first CSS framework via `@tailwindcss/vite` plugin |
| [Redux Toolkit](https://redux-toolkit.js.org/) | `^2.11.2` | State management with `createSlice` and `createAsyncThunk` |
| [Redux Persist](https://github.com/rt2zz/redux-persist) | `^6.0.0` | Persist auth state to `localStorage` across sessions |
| [React Router DOM](https://reactrouter.com/) | `^7.9.6` | Client-side routing with protected & onboarded route guards |
| [Firebase](https://firebase.google.com/) | `^12.6.0` | Google OAuth authentication and Firestore integration |
| [Socket.io Client](https://socket.io/) | `^4.8.3` | Real-time messaging via WebSocket with JWT handshake auth |
| [Shadcn UI](https://ui.shadcn.com/) | `^0.9.5` | Accessible, composable component primitives |
| [Lucide React](https://lucide.dev/) | `^0.554.0` | Modern icon library |
| [class-variance-authority](https://cva.style/) | `^0.7.1` | Type-safe component variant management |
| [clsx](https://github.com/lukeed/clsx) + [tailwind-merge](https://github.com/dcastil/tailwind-merge) | — | Conditional className utilities |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| [Node.js](https://nodejs.org/) | `≥20.x` | JavaScript runtime (ES Modules) |
| [Express](https://expressjs.com/) | `^5.2.1` | HTTP framework (Express 5 with async error support) |
| [MongoDB Atlas](https://www.mongodb.com/atlas) | Cloud | Primary database (NoSQL) |
| [Mongoose](https://mongoosejs.com/) | `^9.4.1` | MongoDB ODM with schema validation, pre-save hooks, and indexing |
| [Socket.io](https://socket.io/) | `^4.8.3` | Real-time bidirectional WebSocket server |
| [JSON Web Tokens](https://github.com/auth0/node-jsonwebtoken) | `^9.0.2` | Stateless authentication (cookie + bearer token) |
| [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | `^3.0.2` | Password hashing with salted rounds |
| [Nodemailer](https://nodemailer.com/) | `^9.0.5` | Email verification and password reset emails |
| [cookie-parser](https://github.com/expressjs/cookie-parser) | `^1.4.7` | Parse cookies for JWT auth extraction |
| [cors](https://github.com/expressjs/cors) | `^2.8.6` | Cross-origin resource sharing configuration |
| [dotenv](https://github.com/motdotla/dotenv) | `^17.4.1` | Environment variable management |

### APIs & External Services

| Service | Purpose |
|---|---|
| [GitHub REST API](https://docs.github.com/en/rest) | Fetch developer profiles, repositories, events, and open-source issues |
| [GitHub OAuth](https://docs.github.com/en/developers/apps/building-oauth-apps) | User authentication and account linking via OAuth 2.0 |
| [Google OAuth (Firebase)](https://firebase.google.com/docs/auth) | Google sign-in provider |
| [MongoDB Atlas](https://www.mongodb.com/atlas) | Managed cloud database |

### Dev Tools

| Tool | Purpose |
|---|---|
| [Nodemon](https://nodemon.io/) | Auto-restart server on file changes |
| [ESLint](https://eslint.org/) | Code linting with React Hooks and Refresh plugins |
| [@vitejs/plugin-react-swc](https://github.com/nicolo-ribaudo/vite-plugin-react-swc) | Rust-based SWC compiler for faster React transforms |
| [Vercel](https://vercel.com/) | Frontend deployment with SPA rewrites |

---

## 📁 Project Structure

```
GitMatch/
├── api/                          # Backend (Express API server)
│   ├── index.js                  # Server entry: Express + Socket.io + MongoDB
│   ├── controllers/
│   │   ├── auth.controller.js    # Signup, signin, Google/GitHub OAuth, password reset
│   │   ├── issues.controller.js  # Issue matching and recommendation endpoints
│   │   ├── messages.controller.js# Chat message retrieval
│   │   └── users.controller.js   # User profile, public key management, GitHub stats
│   ├── models/
│   │   ├── user.model.js         # User schema with bcrypt hashing, token generation
│   │   ├── enrichedIssue.model.js# Enriched GitHub issue with skill profiles
│   │   ├── message.model.js      # Chat message schema
│   │   ├── skillTaxonomy.model.js# Canonical skill taxonomy for NLP matching
│   │   └── issueFeedback.model.js# User feedback on recommended issues
│   ├── services/
│   │   ├── skillExtraction.service.js  # NLP skill extraction from text/labels/repos
│   │   ├── issueMatching.service.js    # Multi-signal ranking engine (7 dimensions)
│   │   ├── issueIngestion.service.js   # GitHub API issue fetcher and enricher
│   │   ├── githubStats.service.js      # XP/level calculator from GitHub activity
│   │   ├── userProfile.service.js      # User skill vector builder
│   │   └── issueCache.service.js       # Issue data caching layer
│   ├── middleware/
│   │   ├── auth.middleware.js          # JWT verification (cookie + bearer)
│   │   └── rateLimit.middleware.js     # In-memory IP-based rate limiter
│   ├── routes/
│   │   ├── auth.route.js               # Auth endpoints with rate limiting
│   │   ├── issues.route.js             # Issue recommendation endpoints
│   │   ├── messages.route.js           # Chat message endpoints
│   │   └── users.route.js              # User profile endpoints
│   ├── data/
│   │   └── skillTaxonomySeed.js        # Seed data: 100+ skills with aliases
│   └── utils/
│       ├── email.js                    # Email templates (verification, password reset)
│       └── error.js                    # Error handler factory
│
├── client/                       # Frontend (React + Vite)
│   ├── src/
│   │   ├── App.jsx               # Root router with Protected/Onboarded route guards
│   │   ├── main.jsx              # Redux Provider + React DOM entry
│   │   ├── firebase.js           # Firebase initialization (env-driven config)
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Landing page
│   │   │   ├── Auth.jsx          # Login/signup with validation
│   │   │   ├── Settings.jsx      # Profile settings + GitHub linking
│   │   │   ├── VerifyEmail.jsx   # Email verification handler
│   │   │   ├── ForgotPassword.jsx# Password reset request
│   │   │   ├── ResetPassword.jsx # Password reset form
│   │   │   ├── GitHubCallback.jsx# GitHub OAuth callback handler
│   │   │   ├── SkillTest.jsx     # Skill assessment page
│   │   │   └── ResendVerification.jsx
│   │   ├── features/
│   │   │   ├── dashboard/        # Dashboard layout, sidebar, topbar
│   │   │   │   ├── DashboardLayout.jsx
│   │   │   │   ├── components/   # Sidebar.jsx, Topbar.jsx
│   │   │   │   └── pages/        # Overview, Issues, Repos, Network, Messages, Community
│   │   │   ├── chat/             # Real-time messaging components, hooks, services
│   │   │   ├── github/           # GitHub integration components and services
│   │   │   └── goals/            # Goal tracking feature module
│   │   ├── components/
│   │   │   ├── OnBoarding.jsx    # Multi-step onboarding wizard
│   │   │   ├── PasswordStrength.jsx
│   │   │   ├── common/           # ErrorBoundary, GithubAuthRequired, etc.
│   │   │   ├── issues/           # Issue card components
│   │   │   └── ui/               # Shadcn UI primitives (Alert, etc.)
│   │   └── redux/
│   │       ├── store.js          # Redux store with persist config
│   │       └── authSlice.js      # Auth state management
│   ├── vite.config.js            # Vite config with Tailwind plugin + API proxy
│   └── vercel.json               # Vercel SPA rewrite rules
│
├── .env.example                  # Environment variable template
├── .gitignore                    # Git ignore rules (includes .env)
├── LICENSE                       # MIT License
└── package.json                  # Root package (backend dependencies + scripts)
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** `≥ 20.x` — [Download](https://nodejs.org/)
- **MongoDB Atlas** account — [Free tier](https://www.mongodb.com/atlas)
- **GitHub OAuth App** — [Create one](https://github.com/settings/developers)
- **Firebase Project** — [Console](https://console.firebase.google.com/) (for Google Auth)

### 1. Clone the Repository

```bash
git clone https://github.com/PurveshShinde/GitMatch.git
cd GitMatch
```

### 2. Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 3. Configure Environment Variables

**Backend** — create `.env` in the project root:

```env
# MongoDB Atlas
MONGO="mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>"

# JWT Config
JWT_SECRET="your-256-bit-random-secret"
JWT_EXPIRES_IN="7d"

# Email Configuration (for verification & password reset)
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"

# Client URL
CLIENT_URL="http://localhost:5173"

# GitHub OAuth App Credentials
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

**Frontend** — create `.env` inside `client/`:

```env
# Firebase Config
VITE_FIREBASE_API_KEY="your-firebase-api-key"
VITE_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-project-id"
VITE_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
VITE_FIREBASE_APP_ID="your-app-id"
VITE_FIREBASE_MEASUREMENT_ID="your-measurement-id"

# GitHub OAuth (Client ID only — no secret on frontend)
VITE_GITHUB_CLIENT_ID="your-github-client-id"
VITE_GITHUB_REDIRECT_URI="http://localhost:5173/auth/github/callback"
```

### 4. Run the Application

```bash
# Terminal 1 — Start the backend (port 3000)
npm run dev

# Terminal 2 — Start the frontend (port 5173)
cd client
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 📡 API Reference

All endpoints are prefixed with `/api`.

### Authentication

| Method | Endpoint | Description | Rate Limit |
|---|---|---|---|
| `POST` | `/api/auth/signup` | Register a new user | 5 / 15 min |
| `POST` | `/api/auth/signin` | Login with email & password | 5 / 5 min |
| `POST` | `/api/auth/google` | Google OAuth login | — |
| `POST` | `/api/auth/github` | GitHub OAuth login | — |
| `GET` | `/api/auth/verify-email` | Verify email with token | — |
| `POST` | `/api/auth/resend-verify` | Resend verification email | 5 / 15 min |
| `POST` | `/api/auth/forgot-password` | Request password reset | 3 / 1 hr |
| `POST` | `/api/auth/reset-password` | Reset password with token | 5 / 15 min |
| `POST` | `/api/auth/onboarding` | Save onboarding data | 🔒 Auth |
| `GET` | `/api/auth/me` | Get current user profile | 🔒 Auth |
| `POST` | `/api/auth/signout` | Sign out (clear cookie) | 🔒 Auth |

### Issues

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/issues` | Get matched issues for current user |

### Users

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/users` | User profile and settings endpoints |

### Messages

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/messages` | Retrieve chat message history |

### WebSocket Events (Socket.io)

| Event | Direction | Payload | Description |
|---|---|---|---|
| `joinChat` | Client → Server | `chatId` | Join a chat room |
| `leaveChat` | Client → Server | `chatId` | Leave a chat room |
| `sendMessage` | Client → Server | `{ chatId, text }` | Send a message |
| `newMessage` | Server → Client | `{ _id, chatId, senderId, senderName, text, createdAt }` | Receive a new message |
| `messageError` | Server → Client | `{ error }` | Message send failure |

---

## 🧠 How the Matching Engine Works

The issue matching engine in [`issueMatching.service.js`](api/services/issueMatching.service.js) scores each issue across **7 weighted dimensions**:

| Signal | Weight (w/ GitHub) | Weight (w/o GitHub) | Description |
|---|---|---|---|
| **Skill Match** | 0.35 | 0.50 | Cosine-like similarity between user skills and issue required skills |
| **Difficulty Fit** | 0.20 | 0.25 | Maps seniority tier to ideal difficulty score range |
| **Issue Type Fit** | 0.15 | 0.15 | Preference match (bug, feature, docs, optimization) |
| **Repo Scale Fit** | 0.10 | 0.10 | Preferred repo size (small/medium/large) |
| **Availability Fit** | 0.08 | — | Estimated hours vs. available hours |
| **Activity Fit** | 0.07 | — | User activity level vs. repo activity level |
| **Collaboration Fit** | 0.05 | — | Team size and communication style preferences |

Additional modifiers:
- **Confidence multiplier** — scales score by average skill confidence
- **Staleness penalty** — down-ranks issues older than 60/180 days
- **Assignment penalty** — down-ranks already-assigned issues
- **Repeated view penalty** — down-ranks clicked-but-not-saved issues

---

## 🤝 Contributors

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/PurveshShinde">
        <img src="https://github.com/PurveshShinde.png" width="100px;" alt="Purvesh Shailesh Shinde"/><br />
        <sub><b>Purvesh Shailesh Shinde</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/pawar-kaustubh">
        <img src="https://github.com/pawar-kaustubh.png" width="100px;" alt="Kaustubh Pawar"/><br />
        <sub><b>Kaustubh Pawar</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/ameyg11">
        <img src="https://github.com/ameyg11.png" width="100px;" alt="अमेय"/><br />
        <sub><b>अमेय (Amey)</b></sub>
      </a>
    </td>
  </tr>
</table>

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feat/amazing-feature`
3. **Commit** your changes: `git commit -m "feat: add amazing feature"`
4. **Push** to the branch: `git push origin feat/amazing-feature`
5. **Open** a Pull Request

Please read the existing code style and follow the established patterns.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Made with ❤️ by the GitMatch Team
</p>
