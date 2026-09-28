<p align="center">
  <img src="https://img.shields.io/badge/GitMatch-Developer%20Matching%20Platform-blueviolet?style=for-the-badge&logo=github" alt="GitMatch" />
</p>

<h1 align="center">🚀 GitMatch</h1>

<p align="center">
  <strong>Discover, analyze, and connect with developers through the power of GitHub data.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" />
  <img src="https://img.shields.io/badge/Node.js-Express%205-339933?style=flat-square&logo=node.js" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb" />
  <img src="https://img.shields.io/badge/Socket.io-Realtime-010101?style=flat-square&logo=socket.io" />
  <img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" />
</p>

---

## 📖 About

**GitMatch** is a full-stack web application built as a **B.Tech Major Project**. It uses the GitHub API to intelligently match developers with relevant open-source issues, facilitate real-time collaboration, and provide deep insights into developer profiles.

The platform features a **multi-signal ranking engine** that scores GitHub issues against a developer's skill vector, a **real-time chat system** powered by WebSockets, and a **gamification layer** with XP and leveling based on GitHub activity.

---

## ✨ Features

- 🔍 **Smart Issue Matching** — Multi-signal ranking engine matches GitHub issues to your skills across 7 weighted dimensions
- 🧠 **Skill Extraction** — NLP-powered skill extraction from issue text, labels, and repository metadata using a canonical taxonomy
- 📊 **Developer Analytics** — XP & leveling system computed from repos, stars, followers, and activity
- 💬 **Real-time Chat** — Socket.io messaging with JWT-authenticated WebSocket connections
- 🔐 **Multi-Provider Auth** — Local signup, Google OAuth, and GitHub OAuth with email verification
- 🎯 **Personalized Onboarding** — Guided wizard that captures skill preferences and experience level
- 🌐 **Community Discovery** — Find and connect with developers based on shared skills
- 🔄 **GitHub Linking** — Link your GitHub account to enrich your profile with live data
- 📈 **Repository Explorer** — Browse repositories with stats and insights
- 🛡️ **Rate Limiting** — IP-based rate limiting on sensitive auth routes

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│              CLIENT (React + Vite)                   │
│                                                      │
│  Auth ─── Dashboard ─── Chat ─── Settings            │
│       └──── Redux Toolkit + Persist ────┘            │
│       └──── Firebase (Google Auth) ─────┘            │
└──────────────┬─────────────────────┬─────────────────┘
               │ REST API            │ WebSocket
               ▼                     ▼
┌─────────────────────────────────────────────────────┐
│              SERVER (Node.js + Express)               │
│                                                      │
│  Middleware: JWT Auth │ Rate Limiter │ CORS            │
│  Services:  Skill Extraction │ Issue Matching         │
│             GitHub Stats │ Issue Ingestion             │
│                                                      │
│  └──────── MongoDB Atlas (Mongoose ODM) ──────────┘  │
└─────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| **React 19** (Vite + SWC) | UI with hooks, Suspense, and lazy-loaded pages |
| **Tailwind CSS v4** | Utility-first styling |
| **Redux Toolkit** + Persist | State management with localStorage persistence |
| **React Router v7** | Client-side routing with protected route guards |
| **Firebase** | Google OAuth authentication |
| **Socket.io Client** | Real-time messaging |
| **Shadcn UI** + **Lucide Icons** | Component library and iconography |

### Backend

| Technology | Purpose |
|---|---|
| **Node.js** + **Express 5** | API server (ES Modules) |
| **MongoDB Atlas** + **Mongoose 9** | Database with schema validation and indexing |
| **Socket.io** | WebSocket server for real-time chat |
| **JWT** + **bcryptjs** | Authentication and password hashing |
| **Nodemailer** | Email verification and password reset |

### APIs

| Service | Purpose |
|---|---|
| **GitHub REST API** | Developer profiles, repos, issues, and events |
| **GitHub OAuth** | User authentication and account linking |
| **Google OAuth (Firebase)** | Google sign-in provider |

---

## 🧠 How the Matching Engine Works

Each GitHub issue is scored across **7 weighted dimensions**:

| Signal | Weight | Description |
|---|---|---|
| Skill Match | 0.35 | Similarity between user skills and issue requirements |
| Difficulty Fit | 0.20 | Maps experience level to ideal difficulty range |
| Issue Type Fit | 0.15 | Bug, feature, docs, or optimization preference |
| Repo Scale Fit | 0.10 | Preferred project size (small / medium / large) |
| Availability Fit | 0.08 | Estimated hours vs. available hours |
| Activity Fit | 0.07 | User activity level vs. repo activity |
| Collaboration Fit | 0.05 | Team size and communication preferences |

Results are further adjusted with **confidence multipliers** and **penalties** for stale, over-assigned, or repeatedly-skipped issues.

---

## 👥 Team

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/PurveshShinde">
        <img src="https://github.com/PurveshShinde.png" width="100px;" style="border-radius: 50%;" alt="Purvesh Shailesh Shinde"/><br />
        <sub><b>Purvesh Shinde</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/pawar-kaustubh">
        <img src="https://github.com/pawar-kaustubh.png" width="100px;" style="border-radius: 50%;" alt="Kaustubh Pawar"/><br />
        <sub><b>Kaustubh Pawar</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/ameyg11">
        <img src="https://github.com/ameyg11.png" width="100px;" style="border-radius: 50%;" alt="Amey"/><br />
        <sub><b>Amey</b></sub>
      </a>
    </td>
  </tr>
</table>

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Made with ❤️ as a B.Tech Major Project
</p>
