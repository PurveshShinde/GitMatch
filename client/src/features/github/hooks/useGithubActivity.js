import { useState, useEffect } from "react";
import { getGithubActivity } from "../services/githubService";

export const useGithubActivity = (username) => {
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!username) {
      setLoading(false);
      return;
    }

    const loadActivity = async () => {
      setLoading(true);
      setError(null);
      try {
        const targetUser = username === "gitmatch" ? "facebook" : username;
        const data = await getGithubActivity(targetUser);
        setActivity(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadActivity();
  }, [username]);

  return { activity, loading, error };
};
