import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  ExternalLink,
  BookOpen,
  Star,
  GitFork,
  MessageSquare,
  Bookmark,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Info,
  Clock,
} from "lucide-react";
import MatchBadge from "./MatchBadge.jsx";
import DifficultyBadge from "./DifficultyBadge.jsx";
import SkillTag from "./SkillTag.jsx";

/**
 * Individual issue card with match score, skills, explanation.
 */
export default function IssueCard({ data, onFeedback }) {
  const [showExplanation, setShowExplanation] = useState(false);
  const { currentUser } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleAction = (actionCallback) => {
    if (!currentUser?.githubUsername) {
      if (window.confirm("You must link your GitHub account in Settings to use this feature. Go to Settings?")) {
        navigate("/settings");
      }
      return;
    }
    actionCallback();
  };

  const { issue, matchScore, explanation } = data;

  const timeAgo = (dateStr) => {
    if (!dateStr) return "";
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "today";
    if (days === 1) return "yesterday";
    if (days < 30) return `${days}d ago`;
    if (days < 365) return `${Math.floor(days / 30)}mo ago`;
    return `${Math.floor(days / 365)}yr ago`;
  };

  const scaleLabel = {
    small: "Small",
    medium: "Medium",
    large: "Large OSS",
  };

  return (
    <div
      style={{
        backgroundColor: "#0f111a",
        border: "1px solid rgba(51,65,85,0.5)",
        borderRadius: 12,
        padding: 20,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "all 0.2s ease",
        minHeight: 280,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(99,102,241,0.35)";
        e.currentTarget.style.boxShadow = "0 0 20px -5px rgba(99,102,241,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(51,65,85,0.5)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Accent bar on hover */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 3,
          height: "100%",
          background: "linear-gradient(to bottom, #6366f1, #8b5cf6)",
          opacity: 0.6,
          borderRadius: "12px 0 0 12px",
        }}
      />

      {/* Top section */}
      <div>
        {/* Header: repo + match badge */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <BookOpen style={{ width: 13, height: 13, color: "#64748b", flexShrink: 0 }} />
              <span
                style={{
                  fontSize: 11,
                  color: "#64748b",
                  fontFamily: "monospace",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {issue.repo?.fullName}
              </span>
            </div>
            {/* Repo stats */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 10, color: "#475569" }}>
              {issue.repo?.stars > 0 && (
                <span style={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Star style={{ width: 10, height: 10 }} /> {issue.repo.stars >= 1000 ? `${(issue.repo.stars / 1000).toFixed(1)}k` : issue.repo.stars}
                </span>
              )}
              {issue.repo?.forks > 0 && (
                <span style={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <GitFork style={{ width: 10, height: 10 }} /> {issue.repo.forks}
                </span>
              )}
              {issue.repo?.scale && (
                <span
                  style={{
                    padding: "1px 5px",
                    borderRadius: 4,
                    fontSize: 9,
                    fontFamily: "monospace",
                    fontWeight: 600,
                    backgroundColor: "rgba(51,65,85,0.3)",
                    border: "1px solid rgba(51,65,85,0.4)",
                    color: "#94a3b8",
                    textTransform: "uppercase",
                  }}
                >
                  {scaleLabel[issue.repo.scale] || issue.repo.scale}
                </span>
              )}
            </div>
          </div>
          <MatchBadge score={matchScore?.overall || 0} size="md" />
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: "#e2e8f0",
            margin: "8px 0 10px",
            lineHeight: 1.4,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {issue.title}
        </h3>

        {/* Difficulty + Type + Time */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
          <DifficultyBadge difficulty={issue.skillProfile?.difficulty} />
          {issue.skillProfile?.issueType && issue.skillProfile.issueType !== "other" && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                fontFamily: "monospace",
                padding: "2px 8px",
                borderRadius: "9999px",
                backgroundColor: "rgba(99,102,241,0.1)",
                color: "#a5b4fc",
                border: "1px solid rgba(99,102,241,0.2)",
                textTransform: "uppercase",
              }}
            >
              {issue.skillProfile.issueType}
            </span>
          )}
          <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 10, color: "#475569" }}>
            <Clock style={{ width: 10, height: 10 }} />
            {timeAgo(issue.issueCreatedAt)}
          </span>
          {issue.comments > 0 && (
            <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 10, color: "#475569" }}>
              <MessageSquare style={{ width: 10, height: 10 }} />
              {issue.comments}
            </span>
          )}
        </div>

        {/* Skill tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
          {(explanation?.matchedSkills || []).slice(0, 5).map((skill) => (
            <SkillTag key={skill} skill={skill} matched={true} />
          ))}
          {(explanation?.missingSkills || []).slice(0, 2).map((skill) => (
            <SkillTag key={skill} skill={skill} matched={false} />
          ))}
        </div>

        {/* Explanation toggle */}
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 11,
            color: "#8b5cf6",
            fontFamily: "monospace",
            padding: "2px 0",
            marginBottom: 6,
          }}
        >
          <Info style={{ width: 12, height: 12 }} />
          Why recommended?
          {showExplanation ? (
            <ChevronUp style={{ width: 12, height: 12 }} />
          ) : (
            <ChevronDown style={{ width: 12, height: 12 }} />
          )}
        </button>

        {showExplanation && explanation && (
          <div
            style={{
              backgroundColor: "rgba(99,102,241,0.05)",
              border: "1px solid rgba(99,102,241,0.15)",
              borderRadius: 8,
              padding: 10,
              marginBottom: 10,
            }}
          >
            <p style={{ fontSize: 11, color: "#c7d2fe", fontWeight: 600, marginBottom: 6 }}>
              {explanation.primaryReason}
            </p>
            {explanation.reasons?.map((reason, i) => (
              <p key={i} style={{ fontSize: 10, color: "#94a3b8", margin: "3px 0", display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ fontSize: 12 }}>
                  {reason.icon === "skill" ? "🎯" : reason.icon === "difficulty" ? "📊" : reason.icon === "type" ? "🏷️" : "📐"}
                </span>
                {reason.text}
              </p>
            ))}
            {/* Score breakdown */}
            <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
              {Object.entries(matchScore?.breakdown || {}).map(([key, val]) => (
                <span
                  key={key}
                  style={{
                    fontSize: 9,
                    fontFamily: "monospace",
                    color: "#64748b",
                    backgroundColor: "rgba(15,17,26,0.6)",
                    padding: "1px 5px",
                    borderRadius: 4,
                    border: "1px solid rgba(51,65,85,0.3)",
                  }}
                >
                  {key}: {Math.round(val * 100)}%
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom actions */}
      <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
        <button
          onClick={() => handleAction(() => {
            onFeedback?.(issue.githubId, "open_github", matchScore?.overall);
            window.open(issue.htmlUrl, "_blank");
          })}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            padding: "8px 0",
            borderRadius: 8,
            border: "none",
            fontSize: 11,
            fontWeight: 700,
            fontFamily: "monospace",
            backgroundColor: "#4f46e5",
            color: "white",
            cursor: "pointer",
            transition: "background-color 0.15s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#4338ca")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#4f46e5")}
        >
          VIEW ON GITHUB <ExternalLink style={{ width: 12, height: 12 }} />
        </button>

        <button
          onClick={() => handleAction(() => onFeedback?.(issue.githubId, "save", matchScore?.overall))}
          title="Save for later"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "8px 10px",
            borderRadius: 8,
            border: "1px solid rgba(51,65,85,0.5)",
            backgroundColor: "rgba(15,17,26,0.6)",
            color: "#94a3b8",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(234,179,8,0.4)";
            e.currentTarget.style.color = "#facc15";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(51,65,85,0.5)";
            e.currentTarget.style.color = "#94a3b8";
          }}
        >
          <Bookmark style={{ width: 14, height: 14 }} />
        </button>

        <button
          onClick={() => handleAction(() => onFeedback?.(issue.githubId, "hide", matchScore?.overall))}
          title="Not interested"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "8px 10px",
            borderRadius: 8,
            border: "1px solid rgba(51,65,85,0.5)",
            backgroundColor: "rgba(15,17,26,0.6)",
            color: "#94a3b8",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(239,68,68,0.3)";
            e.currentTarget.style.color = "#f87171";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(51,65,85,0.5)";
            e.currentTarget.style.color = "#94a3b8";
          }}
        >
          <EyeOff style={{ width: 14, height: 14 }} />
        </button>
      </div>
    </div>
  );
}
