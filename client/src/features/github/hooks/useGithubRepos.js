import { useState, useEffect } from "react";
import { getGithubRepos } from "../services/githubService";

export const useGithubRepos = (username) => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!username) {
      setLoading(false);
      return;
    }

    const loadRepos = async () => {
      setLoading(true);
      setError(null);
      try {
        const targetUser = username === "gitmatch" ? "facebook" : username;
        const data = await getGithubRepos(targetUser);
        setRepos(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadRepos();
  }, [username]);

  return { repos, loading, error };
};
