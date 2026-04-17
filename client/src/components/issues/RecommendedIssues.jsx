import React from "react";
import { Search, RefreshCw, AlertTriangle, Zap, ChevronLeft, ChevronRight } from "lucide-react";
import useRecommendedIssues from "../../hooks/useRecommendedIssues.js";
import IssueCard from "./IssueCard.jsx";
import IssueFilters from "./IssueFilters.jsx";
import IssueCardSkeleton from "./IssueCardSkeleton.jsx";

/**
 * Main container component for the issue recommendation system.
 * Replaces the old IssuesView that did simple GitHub API fetches.
 */
export default function RecommendedIssues() {
  const {
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
    refetch,
  } = useRecommendedIssues();

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2" style={{ margin: 0 }}>
            <Zap style={{ width: 24, height: 24, color: "#8b5cf6" }} />
            Smart Issue Finder
          </h2>
          <p style={{ fontSize: 13, color: "#64748b", marginTop: 4, fontFamily: "monospace" }}>
            {meta?.totalIssuesIndexed
              ? `${meta.totalIssuesIndexed} issues indexed • Matched to your skills`
              : "Analyzing your skills for the best matches..."}
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* User skill badges */}
          {userProfile?.skills && (
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {userProfile.skills.slice(0, 4).map((skill) => (
                <span
                  key={skill}
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    fontFamily: "monospace",
                    textTransform: "uppercase",
                    padding: "3px 8px",
                    borderRadius: "9999px",
                    backgroundColor: "rgba(139,92,246,0.1)",
                    color: "#a78bfa",
                    border: "1px solid rgba(139,92,246,0.2)",
                  }}
                >
                  {skill}
                </span>
              ))}
              {userProfile.skills.length > 4 && (
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    fontFamily: "monospace",
                    padding: "3px 8px",
                    borderRadius: "9999px",
                    backgroundColor: "rgba(51,65,85,0.3)",
                    color: "#64748b",
                    border: "1px solid rgba(51,65,85,0.4)",
                  }}
                >
                  +{userProfile.skills.length - 4}
                </span>
              )}
            </div>
          )}

          <button
            onClick={refetch}
            disabled={loading}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 14px",
              borderRadius: 8,
              border: "1px solid rgba(51,65,85,0.5)",
              backgroundColor: "rgba(15,17,26,0.8)",
              color: "#94a3b8",
              fontSize: 11,
              fontFamily: "monospace",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.5 : 1,
              transition: "all 0.15s ease",
            }}
          >
            <RefreshCw style={{ width: 13, height: 13, animation: loading ? "spin 1s linear infinite" : "none" }} />
            Refresh
          </button>
        </div>
      </div>

      {/* Layout: Filters + Issue Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 20, alignItems: "start" }}>
        {/* Sidebar Filters */}
        <div style={{ position: "sticky", top: 80 }}>
          <IssueFilters
            filters={filters}
            onFilterChange={updateFilters}
            userSkills={userProfile?.skills || []}
          />

          {/* Index info */}
          {meta && (
            <div
              style={{
                marginTop: 12,
                padding: 12,
                backgroundColor: "#0f111a",
                border: "1px solid rgba(51,65,85,0.3)",
                borderRadius: 8,
                fontSize: 10,
                fontFamily: "monospace",
                color: "#475569",
              }}
            >
              <div>Indexed: {meta.totalIssuesIndexed || 0} issues</div>
              {meta.cachedAt && (
                <div style={{ marginTop: 2 }}>
                  Updated: {new Date(meta.cachedAt).toLocaleTimeString()}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div>
          {/* Error State */}
          {error && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "12px 16px",
                backgroundColor: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: 10,
                marginBottom: 16,
                fontSize: 13,
                color: "#fca5a5",
              }}
            >
              <AlertTriangle style={{ width: 16, height: 16, flexShrink: 0 }} />
              {error}
              <button
                onClick={refetch}
                style={{
                  marginLeft: "auto",
                  padding: "4px 12px",
                  borderRadius: 6,
                  border: "1px solid rgba(239,68,68,0.3)",
                  backgroundColor: "transparent",
                  color: "#f87171",
                  fontSize: 11,
                  fontFamily: "monospace",
                  cursor: "pointer",
                }}
              >
                Retry
              </button>
            </div>
          )}

          {/* Loading State */}
          {loading && <IssueCardSkeleton count={6} />}

          {/* Issues Grid */}
          {!loading && issues.length > 0 && (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
                  gap: 16,
                }}
              >
                {issues.map((item, idx) => (
                  <IssueCard
                    key={item.issue?.githubId || idx}
                    data={item}
                    onFeedback={submitFeedback}
                  />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    marginTop: 24,
                  }}
                >
                  <button
                    onClick={() => goToPage(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      padding: "6px 14px",
                      borderRadius: 8,
                      border: "1px solid rgba(51,65,85,0.5)",
                      backgroundColor: "rgba(15,17,26,0.8)",
                      color: pagination.page <= 1 ? "#334155" : "#94a3b8",
                      fontSize: 11,
                      fontFamily: "monospace",
                      cursor: pagination.page <= 1 ? "not-allowed" : "pointer",
                    }}
                  >
                    <ChevronLeft style={{ width: 14, height: 14 }} /> Prev
                  </button>

                  <span
                    style={{
                      fontSize: 11,
                      fontFamily: "monospace",
                      color: "#64748b",
                      padding: "6px 12px",
                      backgroundColor: "rgba(15,17,26,0.6)",
                      borderRadius: 6,
                      border: "1px solid rgba(51,65,85,0.3)",
                    }}
                  >
                    {pagination.page} / {pagination.totalPages}
                    <span style={{ color: "#475569", marginLeft: 8 }}>
                      ({pagination.total} total)
                    </span>
                  </span>

                  <button
                    onClick={() => goToPage(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      padding: "6px 14px",
                      borderRadius: 8,
                      border: "1px solid rgba(51,65,85,0.5)",
                      backgroundColor: "rgba(15,17,26,0.8)",
                      color: pagination.page >= pagination.totalPages ? "#334155" : "#94a3b8",
                      fontSize: 11,
                      fontFamily: "monospace",
                      cursor: pagination.page >= pagination.totalPages ? "not-allowed" : "pointer",
                    }}
                  >
                    Next <ChevronRight style={{ width: 14, height: 14 }} />
                  </button>
                </div>
              )}
            </>
          )}

          {/* Empty State */}
          {!loading && !error && issues.length === 0 && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "60px 20px",
                textAlign: "center",
              }}
            >
              <Search style={{ width: 48, height: 48, color: "#1e293b", marginBottom: 16 }} />
              <h3 style={{ fontSize: 16, fontWeight: 600, color: "#64748b", marginBottom: 8 }}>
                No matching issues found
              </h3>
              <p style={{ fontSize: 13, color: "#475569", maxWidth: 400, lineHeight: 1.5 }}>
                Try broadening your filters or updating your skill profile.
                New issues are indexed regularly from GitHub.
              </p>
              <button
                onClick={() => {
                  updateFilters({
                    issueType: null,
                    difficulty: null,
                    repoScale: null,
                    sort: "relevance",
                    skills: null,
                  });
                }}
                style={{
                  marginTop: 16,
                  padding: "8px 20px",
                  borderRadius: 8,
                  border: "1px solid rgba(99,102,241,0.3)",
                  backgroundColor: "rgba(99,102,241,0.1)",
                  color: "#a5b4fc",
                  fontSize: 12,
                  fontFamily: "monospace",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* CSS for spin animation */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
