# Contributing to GitMatch

Thank you for your interest in contributing to **GitMatch**! We welcome contributions from developers of all backgrounds, whether you're fixing a bug, adding an issue matching heuristic, improving documentation, or refining UI components.

Please review this document to understand our contribution guidelines and development workflow.

---

## 1. Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please report any unacceptable behavior to the project maintainers.

---

## 2. Getting Started

1. **Fork the Repository**: Create your personal copy of the repository on GitHub.
2. **Clone Locally**:
   ```bash
   git clone https://github.com/<your-username>/GitMatch.git
   cd GitMatch
   ```
3. **Set Up the Environment**: Follow the step-by-step instructions in [SETUP.md](SETUP.md) to configure root `.env` and `client/.env`.
4. **Create a Dedicated Branch**:
   ```bash
   git checkout -b feature/issue-matching-improvement
   ```

---

## 3. Branching Strategy

Follow standard branch naming conventions:

* `feat/<feature-name>`: New capabilities or functional improvements.
* `fix/<bug-name>`: Bug fixes and error resolutions.
* `docs/<topic>`: Documentation updates or corrections.
* `refactor/<component>`: Code restructuring without functional changes.
* `chore/<task>`: Dependency updates, CI/CD, or build configurations.

---

## 4. Coding Standards & Conventions

### Frontend (React 19 & Vite)
* Write functional components using modern React hooks.
* Use **Tailwind CSS v4** utility classes for styling. Avoid inline styles or arbitrary CSS files unless strictly necessary.
* Ensure all icons originate from `lucide-react`.
* Run the frontend linter before committing:
  ```bash
  cd client
  npm run lint
  ```

### Backend (Node.js & Express 5)
* Use native **ES Module** syntax (`import` / `export`). CommonJS `require()` is prohibited.
* Keep controllers lean; business logic, external API calls, and mathematical models belong in `api/services/`.
* Handle errors uniformly through `next(errorHandler(statusCode, message))`.
* Verify script syntax before committing:
  ```bash
  node --check api/index.js
  ```

### Commit Message Guidelines

We follow the **Conventional Commits** specification:

```
<type>(<scope>): <short description>

[optional body]

[optional footer(s)]
```

**Allowed Types:**
* `feat`: A new user-facing or API feature
* `fix`: A bug fix
* `docs`: Documentation-only updates
* `style`: Changes that do not affect code logic (formatting, whitespace)
* `refactor`: Code changes that neither fix a bug nor add a feature
* `perf`: Code changes that improve performance
* `test`: Adding or updating test cases
* `chore`: Maintenance tasks, dependency bumps, or tool configurations

*Example:* `feat(matching): add assignee count penalty to recommendation scoring`

---

## 5. Submitting a Pull Request (PR)

1. **Synchronize with Main**:
   ```bash
   git checkout main
   git pull origin main
   git checkout <your-branch>
   git rebase main
   ```
2. **Push to Your Fork**:
   ```bash
   git push origin <your-branch>
   ```
3. **Open a Pull Request**:
   * Target the `main` branch of `PurveshShinde/GitMatch`.
   * Complete the PR description template detailing:
     * Summary of changes
     * Motivation / Related issue (`Closes #123`)
     * Testing steps and visual proofs (screenshots or GIFs for UI changes)
4. **Code Review**: At least one maintainer review is required before merging. Address any feedback promptly.

---

## 6. Reporting Issues

* **Bug Reports**: Open an issue using GitHub Issues with detailed reproduction steps, expected vs. actual behavior, browser/OS version, and console logs.
* **Feature Requests**: Outline the proposed feature, target user persona, and technical implementation considerations.
* **Security Issues**: Do NOT file public issues for vulnerabilities. Refer to our [Security Policy](SECURITY.md) for confidential disclosure protocols.

