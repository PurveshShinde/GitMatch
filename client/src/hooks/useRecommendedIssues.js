import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";

const API_BASE_URL =
  import.meta.env?.VITE_API_BASE_URL || "http://localhost:3000";

/**
 * Custom hook for fetching recommended issues from the backend API.
 * Handles loading, error, pagination, filtering, and feedback.
 */
export default function useRecommendedIssues() {
  const { token } = useSelector((state) => state.auth);

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [userProfile, setUserProfile] = useState(null);
  const [meta, setMeta] = useState(null);

  // Filters state
  const [filters, setFilters] = useState({
    skills: null,
    issueType: null,
    difficulty: null,
    repoScale: null,
    minMatchScore: 0.1,
    sort: "relevance",
  });

  /**
   * Fetch recommended issues from the API.
   */
  const fetchIssues = useCallback(
    async (page = 1) => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        params.set("page", page.toString());
        params.set("limit", pagination.limit.toString());

        if (filters.skills) params.set("skills", filters.skills);
        if (filters.issueType) params.set("issueType", filters.issueType);
        if (filters.difficulty) params.set("difficulty", filters.difficulty);
        if (filters.repoScale) params.set("repoScale", filters.repoScale);
        if (filters.minMatchScore > 0.1)
          params.set("minMatchScore", filters.minMatchScore.toString());
        if (filters.sort !== "relevance") params.set("sort", filters.sort);

        const response = await fetch(
          `${API_BASE_URL}/api/issues/recommended?${params.toString()}`,
          {
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            credentials: "include",
          }
        );

        const data = await response.json();

        if (data.success && data.data) {
          setIssues(data.data.issues || []);
          setPagination(data.data.pagination || pagination);
          setUserProfile(data.data.userProfile || null);
          setMeta(data.data.meta || null);
        } else {
          setError(data.message || "Failed to fetch recommendations");
          setIssues([]);
        }
      } catch (err) {
        console.error("[useRecommendedIssues] Fetch error:", err);
        setError("Network error. Please check your connection.");
        setIssues([]);
      } finally {
        setLoading(false);
      }
    },
    [token, filters, pagination.limit]
  );

  /**
   * Submit feedback for an issue.
   */
  const submitFeedback = useCallback(
    async (issueId, action, matchScore) => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/issues/feedback`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          credentials: "include",
          body: JSON.stringify({ issueId, action, matchScore }),
        });

        const data = await response.json();

        if (action === "hide" && data.success) {
          // Remove from local state immediately
          setIssues((prev) =>
            prev.filter((item) => item.issue.githubId !== issueId)
          );
        }

        return data.success;
      } catch (err) {
        console.error("[useRecommendedIssues] Feedback error:", err);
        return false;
      }
    },
    [token]
  );

  /**
   * Update filters — will trigger a re-fetch.
   */
  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  /**
   * Go to a specific page.
   */
  const goToPage = useCallback(
    (page) => {
      fetchIssues(page);
    },
    [fetchIssues]
  );

  // Fetch on mount and when filters change
  useEffect(() => {
    fetchIssues(1);
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    issues,
    loading,
    error,
    pagination,
    userProfile,
    meta,
    filters,
    updateFilters,
    submitFeedback,
    goToPage,
    refetch: () => fetchIssues(pagination.page),
  };
}
