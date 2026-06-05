/**
 * GitHub API Service
 * Handles data fetching and caching to prevent rate-limiting.
 */

const cache = new Map();

const fetchWithCache = async (key, fetcher, ttlMs = 5 * 60 * 1000) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < ttlMs) {
    return cached.data;
  }

  const data = await fetcher();
  cache.set(key, { data, timestamp: Date.now() });
  return data;
};

export const getGithubUser = async (username) => {
  if (!username || username === "gitmatch") return null;
  
  return fetchWithCache(`user_${username}`, async () => {
    const res = await fetch(`https://api.github.com/users/${username}`);
    if (!res.ok) throw new Error("Failed to fetch user");
    return res.json();
  });
};

export const getGithubActivity = async (username) => {
  if (!username || username === "gitmatch") return [];
  
  return fetchWithCache(`activity_${username}`, async () => {
    const res = await fetch(`https://api.github.com/users/${username}/events?per_page=5`);
    if (!res.ok) throw new Error("Failed to fetch activity");
    return res.json();
  });
};

export const getGithubFollowers = async (username) => {
  if (!username || username === "gitmatch") return [];

  return fetchWithCache(`followers_${username}`, async () => {
    const res = await fetch(`https://api.github.com/users/${username}/followers?per_page=10`);
    if (!res.ok) throw new Error("Failed to fetch followers");
    return res.json();
  });
};

export const getGithubFollowing = async (username) => {
  if (!username || username === "gitmatch") return [];

  return fetchWithCache(`following_${username}`, async () => {
    const res = await fetch(`https://api.github.com/users/${username}/following?per_page=10`);
    if (!res.ok) throw new Error("Failed to fetch following");
    return res.json();
  });
};

export const getGithubRepos = async (username) => {
  if (!username || username === "gitmatch") return [];

  return fetchWithCache(`repos_${username}`, async () => {
    const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=12`);
    if (!res.ok) throw new Error("Failed to fetch repos");
    return res.json();
  });
};

export const getGithubIssues = async (language = "javascript") => {
  return fetchWithCache(`issues_${language}`, async () => {
    const res = await fetch(
      `https://api.github.com/search/issues?q=language:${language}+is:issue+is:open+label:"good first issue"&sort=created&order=desc&per_page=12`
    );
    if (!res.ok) throw new Error("Failed to fetch issues");
    const data = await res.json();
    return data.items.map((item) => ({
      id: item.id,
      title: item.title,
      repoName: item.repository_url.split("/").slice(-2).join("/"),
      url: item.html_url,
      labels: item.labels,
      comments: item.comments,
    }));
  });
};

export const calculateTrueLevel = (ghData) => {
  if (!ghData) return { level: 1, xp: 0, nextLevelXp: 200 };
  
  const stars = ghData.totalStars || 0;
  const age = ghData.accountAgeYears || 0;
  const recentEvents = ghData.recentEventsCount || 0;
  const repos = ghData.public_repos !== undefined ? ghData.public_repos : (ghData.publicRepos || 0);
  const followers = ghData.followers !== undefined ? ghData.followers : 0;
  const gists = ghData.public_gists !== undefined ? ghData.public_gists : (ghData.publicGists || 0);

  const trueScore = Math.round(
    100 +
    (repos * 10) +
    (followers * 5) +
    (gists * 2) +
    (stars * 15) +
    (age * 25) +
    (recentEvents * 3)
  );
  
  const trueLevel = Math.max(1, Math.floor(Math.sqrt(trueScore / 50)));
  
  return {
    level: trueLevel,
    xp: trueScore,
    nextLevelXp: (trueLevel + 1) ** 2 * 50
  };
};
