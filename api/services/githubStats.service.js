import User from "../models/user.model.js";

/**
 * Get headers for GitHub API requests.
 * Uses GITHUB_TOKEN or GITHUB_CLIENT_ID/SECRET for authenticated rate limits (5000/hr).
 */
const getGithubHeaders = () => {
  const headers = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "GitMatch-App",
  };
  
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;
  } else if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    const credentials = Buffer.from(
      `${process.env.GITHUB_CLIENT_ID}:${process.env.GITHUB_CLIENT_SECRET}`
    ).toString("base64");
    headers.Authorization = `Basic ${credentials}`;
  }
  
  return headers;
};

/**
 * Fetch a URL from GitHub API with error handling
 */
const fetchGithub = async (url) => {
  try {
    const res = await fetch(url, { headers: getGithubHeaders() });
    if (!res.ok) {
      console.error(`[GITHUB-STATS-SERVICE] GitHub API error: ${res.status} for ${url}`);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.error(`[GITHUB-STATS-SERVICE] Fetch error for ${url}:`, err.message);
    return null;
  }
};

/**
 * Recalculates GitHub stats and level for a user, then saves to MongoDB.
 * 
 * @param {string} userId - The user's MongoDB ID
 * @returns {Promise<Object|null>} The updated user document or null
 */
export const refreshUserGithubStats = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      console.warn(`[GITHUB-STATS-SERVICE] User ${userId} not found for sync.`);
      return null;
    }

    const githubUsername = user.githubUsername || user.onboardingData?.githubUsername;
    if (!githubUsername || githubUsername === "gitmatch") {
      console.warn(`[GITHUB-STATS-SERVICE] User ${userId} has no githubUsername linked.`);
      return user;
    }

    console.log(`[GITHUB-STATS-SERVICE] Refreshing GitHub stats for: ${githubUsername}`);

    // 1. Fetch User profile
    const profileUrl = `https://api.github.com/users/${githubUsername}`;
    const profileData = await fetchGithub(profileUrl);
    if (!profileData) {
      console.error(`[GITHUB-STATS-SERVICE] Failed to fetch profile for ${githubUsername}`);
      return user; // Return unchanged
    }

    // 2. Fetch User repos (up to 100) to calculate stars
    const reposUrl = `https://api.github.com/users/${githubUsername}/repos?per_page=100`;
    const reposData = await fetchGithub(reposUrl) || [];

    // 3. Fetch User events (recent activity)
    const eventsUrl = `https://api.github.com/users/${githubUsername}/events?per_page=30`;
    const eventsData = await fetchGithub(eventsUrl) || [];

    // Parse metrics
    const publicRepos = profileData.public_repos || 0;
    const followers = profileData.followers || 0;
    const publicGists = profileData.public_gists || 0;
    
    // Sum stargazers count across all retrieved repos
    const totalStars = reposData.reduce((acc, repo) => acc + (repo.stargazers_count || 0), 0);
    
    // Account age in years
    const createdAtStr = profileData.created_at;
    let accountAgeYears = 0;
    if (createdAtStr) {
      const createdDate = new Date(createdAtStr);
      const diffMs = Date.now() - createdDate.getTime();
      accountAgeYears = Math.max(0, +(diffMs / (1000 * 60 * 60 * 24 * 365.25)).toFixed(2));
    }

    const recentEventsCount = eventsData.length;

    // Calculate XP and level
    // XP = 100 (base) + repos*10 + followers*5 + gists*2 + stars*15 + age*25 + recentEvents*3
    const xp = Math.round(
      100 +
      (publicRepos * 10) +
      (followers * 5) +
      (publicGists * 2) +
      (totalStars * 15) +
      (accountAgeYears * 25) +
      (recentEventsCount * 3)
    );

    const level = Math.max(1, Math.floor(Math.sqrt(xp / 50)));
    const nextLevelXp = (level + 1) ** 2 * 50;

    user.githubStats = {
      publicRepos,
      followers,
      publicGists,
      totalStars,
      accountAgeYears,
      recentEventsCount,
      level,
      xp,
      nextLevelXp,
      updatedAt: new Date(),
    };

    // Keep top-level fields in sync for compatibility
    if (profileData.avatar_url && !user.avatar) {
      user.avatar = profileData.avatar_url;
    }
    
    await user.save();
    console.log(`[GITHUB-STATS-SERVICE] Successfully updated user ${githubUsername} - Level: ${level}, XP: ${xp}`);
    return user;
  } catch (error) {
    console.error("[GITHUB-STATS-SERVICE] Error in refreshUserGithubStats:", error);
    return null;
  }
};
