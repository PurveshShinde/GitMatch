import { useState, useEffect } from "react";
import { getGithubUser, calculateTrueLevel } from "../services/githubService";

export const useGithubProfile = (currentUser) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const loadProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const onboarding = currentUser.onboardingData || {};
        const baseProfile = {
          displayName: currentUser.username || "Developer",
          githubUsername: currentUser.githubUsername || onboarding.githubUsername || "",
          experienceYears: onboarding.experienceYears || "0-1",
          weeklyAvailability: onboarding.weeklyAvailability || "10-20",
          primaryLanguage: onboarding.primaryLanguage || "JavaScript",
          coreSkills: onboarding.coreSkills || ["JavaScript"],
          preferredTeamSize: onboarding.preferredTeamSize || "3-5",
          preferredCommunication: onboarding.preferredCommunication || "Async",
          role: onboarding.primaryLanguage || "Developer",
          level: 1,
          xp: 0,
          nextLevelXp: 200,
        };

        let level = 1;
        let xp = 0;
        let nextLevelXp = 200;
        let stats = null;

        if (currentUser.githubStats && currentUser.githubStats.updatedAt) {
          level = currentUser.githubStats.level;
          xp = currentUser.githubStats.xp;
          nextLevelXp = currentUser.githubStats.nextLevelXp;
          stats = currentUser.githubStats;
        } else {
          const targetUser = baseProfile.githubUsername && baseProfile.githubUsername !== "gitmatch" 
            ? baseProfile.githubUsername 
            : "facebook";

          const ghData = await getGithubUser(targetUser);
          const computed = calculateTrueLevel(ghData);
          level = computed.level;
          xp = computed.xp;
          nextLevelXp = computed.nextLevelXp;
          stats = {
            publicRepos: ghData.public_repos || 0,
            followers: ghData.followers || 0,
            publicGists: ghData.public_gists || 0,
            totalStars: 0,
            accountAgeYears: 0,
            recentEventsCount: 0
          };
        }

        setProfile({
          ...baseProfile,
          level,
          xp,
          nextLevelXp,
          githubStats: stats,
        });
      } catch (err) {
        console.error("Failed to load GitHub profile:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [currentUser]);

  return { profile, loading, error };
};
