import { useState, useEffect } from "react";
import { getGithubFollowers, getGithubFollowing } from "../services/githubService";

export const useGithubNetwork = (username) => {
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!username) {
      setLoading(false);
      return;
    }

    const loadNetwork = async () => {
      setLoading(true);
      setError(null);
      try {
        const targetUser = username === "gitmatch" ? "facebook" : username;
        const [followersData, followingData] = await Promise.all([
          getGithubFollowers(targetUser),
          getGithubFollowing(targetUser)
        ]);
        
        setFollowers(followersData || []);
        setFollowing(followingData || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadNetwork();
  }, [username]);

  return { followers, following, loading, error };
};
