<p align="center">
  <img src="https://img.shields.io/badge/GitMatch-Developer%20Matching%20Platform-blueviolet?style=for-the-badge&logo=github" alt="GitMatch" />
</p>

<h1 align="center">🚀 GitMatch</h1>

<p align="center">
  <strong>Commit Code. Build Legacy.</strong><br/>
  The platform that parses your <code>git log</code> to match you with elite teams.
</p>

<p align="center">
  <a href="https://gitmatch-delta.vercel.app/"><img src="https://img.shields.io/badge/🌐_Live_Demo-gitmatch--delta.vercel.app-blueviolet?style=for-the-badge" alt="Live Demo" /></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" />
  <img src="https://img.shields.io/badge/Node.js-Express%205-339933?style=flat-square&logo=node.js" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb" />
  <img src="https://img.shields.io/badge/Socket.io-Realtime-010101?style=flat-square&logo=socket.io" />
  <img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" />
</p>

---

## 📖 What is GitMatch?

Getting into **open-source contribution** is hard for new developers. You don't know which projects need help, which issues match your skills, or who to collaborate with. **GitMatch solves this.**

GitMatch connects to your GitHub account, analyzes your skills, repositories, and activity — then **intelligently recommends open-source issues** you're best suited to work on. It also connects you with like-minded developers for collaboration through real-time chat, tracks your progress with XP and achievement badges, and ranks contributors on a community leaderboard.

> Stop sending resumes. Start sending PRs.

---

## 📸 Screenshots

### 🏠 Landing Page
<p align="center">
  <img src="assets/home.png" alt="GitMatch Landing Page" width="90%" />
</p>

A developer-themed landing page with a terminal animation that showcases how GitMatch works — from initializing your profile to finding your perfect match.

---

### 🔐 Authentication
<p align="center">
  <img src="assets/auth.gif" alt="GitMatch Auth Flow" width="90%" />
</p>

Sign up with email, Google, or GitHub. Email verification and password reset flows are built-in. Link your GitHub account during onboarding to unlock all features.

---

### 📊 Dashboard — Developer DNA & Achievements
<p align="center">
  <img src="assets/dashboard.png" alt="GitMatch Dashboard" width="90%" />
</p>

Your personalized dashboard shows:
- **Developer DNA** — Experience level, primary role, team size preference, and availability
- **Skill Matrix** — Radar chart visualizing your strengths across Frontend, Backend, DevOps, Design, and Testing
- **GitHub Achievements** — Unlock badges as you grow (Level 3 • Contributor, and 11 badges to earn)
- **Activity Feed** — Live feed of your recent GitHub pushes and contributions
- **Weekly Goals** — Track personal milestones like "Solve one good first issue"

---

### ⚡ Smart Issue Finder
<p align="center">
  <img src="assets/issues.png" alt="Smart Issue Finder" width="90%" />
</p>

The core feature — a **skill-based issue recommendation engine** that:
- Scans open-source repositories and indexes real GitHub issues
- Shows a **match percentage** (e.g., 64%, 59%) based on how well the issue fits your skills
- Filters by **Issue Type** (Bug, Feature, Docs, Optimization), **Difficulty** (Beginner → Advanced), and **Repo Scale** (Small → Large OSS)
- Tags each issue with matched technologies (Java, React, JavaScript, Next.js, etc.)
- Explains **"Why recommended?"** so you understand the match
- One-click **"View on GitHub"** to jump straight into contributing

---

### 🏆 Community Leaderboard
<p align="center">
  <img src="assets/community.png" alt="Community Leaderboard" width="90%" />
</p>

See how you stack up against other developers on GitMatch:
- **GitHub True Level** — Computed from repos, followers, stars, and recent activity (Level 2 • Rookie → Level 3 • Contributor)
- **XP System** — Earn XP from your GitHub activity (453 / 800 XP to next level)
- **Performance Metrics** — Repos, followers, and stars at a glance
- **Ranked Leaderboard** — Compete with verified users in the community

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🔍 **Smart Issue Matching** | 7-dimensional ranking engine matches GitHub issues to your skills, experience, and preferences |
| 🧠 **Skill Extraction** | NLP-powered skill detection from issue text, labels, and repo metadata using a canonical taxonomy |
| 🏅 **Achievement Badges** | Unlock 11 badges as you grow — from first contribution to open-source veteran |
| 📊 **Developer DNA** | Radar chart skill matrix + experience profile built from your GitHub data |
| 💬 **Real-time Chat** | Socket.io-powered messaging to collaborate with matched developers |
| 🏆 **Community Leaderboard** | XP-based ranking system with GitHub True Level (Rookie → Contributor → ...) |
| 🔐 **Multi-Provider Auth** | Email, Google OAuth, and GitHub OAuth with email verification |
| 🎯 **Personalized Onboarding** | Guided wizard to capture skills, experience, and collaboration preferences |
| 📈 **Repository Explorer** | Browse your GitHub repos with stats and insights |
| 🎯 **Weekly Goals** | Set and track personal contribution milestones |

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

<div align="center">
<table>
  <tr>
    <td align="center">
      <a href="https://github.com/PurveshShinde">
        <img src="https://images.weserv.nl/?url=github.com/PurveshShinde.png&w=100&h=100&mask=circle&fit=cover" width="100px" alt="Purvesh Shinde"/><br />
        <sub><b>Purvesh Shinde</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/pawar-kaustubh">
        <img src="https://images.weserv.nl/?url=github.com/pawar-kaustubh.png&w=100&h=100&mask=circle&fit=cover" width="100px" alt="Kaustubh Pawar"/><br />
        <sub><b>Kaustubh Pawar</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/ameyg11">
        <img src="https://images.weserv.nl/?url=github.com/ameyg11.png&w=100&h=100&mask=circle&fit=cover" width="100px" alt="Amey Gawade"/><br />
        <sub><b>Amey Gawade</b></sub>
      </a>
    </td>
  </tr>
</table>
</div>

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Made with ❤️ as a B.Tech Major Project
</p>
