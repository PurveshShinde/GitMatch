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
          githubUsername: onboarding.githubUsername || "",
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

        const targetUser = baseProfile.githubUsername && baseProfile.githubUsername !== "gitmatch" 
          ? baseProfile.githubUsername 
          : "facebook";

        const ghData = await getGithubUser(targetUser);
        const { level, xp, nextLevelXp } = calculateTrueLevel(ghData);

        setProfile({
          ...baseProfile,
          level,
          xp,
          nextLevelXp,
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
