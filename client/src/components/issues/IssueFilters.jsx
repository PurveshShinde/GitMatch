import React, { useState } from "react";
import { Filter, X, ChevronDown, ChevronUp } from "lucide-react";

/**
 * Filter sidebar for issue recommendations.
 * Supports: issue type, difficulty, repo scale, sort order.
 */
export default function IssueFilters({ filters, onFilterChange, userSkills = [] }) {
  const [expanded, setExpanded] = useState(true);

  const chipStyle = (active) => ({
    display: "inline-flex",
    alignItems: "center",
    padding: "5px 12px",
    borderRadius: "9999px",
    fontSize: "11px",
    fontFamily: "monospace",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.15s ease",
    border: active ? "1px solid rgba(99,102,241,0.5)" : "1px solid rgba(51,65,85,0.5)",
    backgroundColor: active ? "rgba(99,102,241,0.15)" : "rgba(15,17,26,0.8)",
    color: active ? "#a5b4fc" : "#94a3b8",
  });

  const labelStyle = {
    fontSize: "10px",
    fontWeight: 700,
    fontFamily: "monospace",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "#64748b",
    marginBottom: 6,
    display: "block",
  };

  const sectionStyle = {
    marginBottom: 16,
  };

  const handleChipToggle = (key, value) => {
    onFilterChange({ [key]: filters[key] === value ? null : value });
  };

  const activeCount = [filters.issueType, filters.difficulty, filters.repoScale, filters.sort !== "relevance" ? filters.sort : null]
    .filter(Boolean).length;

  return (
    <div
      style={{
        backgroundColor: "#0f111a",
        border: "1px solid rgba(51,65,85,0.5)",
        borderRadius: 12,
        padding: expanded ? 16 : 12,
        transition: "all 0.2s ease",
      }}
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#e2e8f0",
          padding: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Filter style={{ width: 16, height: 16, color: "#8b5cf6" }} />
          <span style={{ fontSize: 14, fontWeight: 700 }}>Filters</span>
          {activeCount > 0 && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                fontFamily: "monospace",
                padding: "1px 6px",
                borderRadius: "9999px",
                backgroundColor: "rgba(139,92,246,0.2)",
                color: "#a78bfa",
                border: "1px solid rgba(139,92,246,0.3)",
              }}
            >
              {activeCount}
            </span>
          )}
        </div>
        {expanded ? (
          <ChevronUp style={{ width: 14, height: 14, color: "#64748b" }} />
        ) : (
          <ChevronDown style={{ width: 14, height: 14, color: "#64748b" }} />
        )}
      </button>

      {expanded && (
        <div style={{ marginTop: 16 }}>
          {/* Issue Type */}
          <div style={sectionStyle}>
            <span style={labelStyle}>Issue Type</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {["bug", "feature", "docs", "optimization"].map((type) => (
                <button
                  key={type}
                  onClick={() => handleChipToggle("issueType", type)}
                  style={chipStyle(filters.issueType === type)}
                >
                  {type === "bug" ? "🐛 Bug" : type === "feature" ? "✨ Feature" : type === "docs" ? "📝 Docs" : "⚡ Optimization"}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div style={sectionStyle}>
            <span style={labelStyle}>Difficulty</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {["beginner", "intermediate", "advanced"].map((level) => (
                <button
                  key={level}
                  onClick={() => handleChipToggle("difficulty", level)}
                  style={chipStyle(filters.difficulty === level)}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Repo Scale */}
          <div style={sectionStyle}>
            <span style={labelStyle}>Repo Scale</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {[
                { value: "small", label: "🏠 Small" },
                { value: "medium", label: "🏢 Medium" },
                { value: "large", label: "🌐 Large OSS" },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => handleChipToggle("repoScale", value)}
                  style={chipStyle(filters.repoScale === value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div style={sectionStyle}>
            <span style={labelStyle}>Sort By</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {[
                { value: "relevance", label: "Relevance" },
                { value: "newest", label: "Newest" },
                { value: "difficulty_asc", label: "Easiest First" },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => onFilterChange({ sort: value })}
                  style={chipStyle(filters.sort === value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Clear All */}
          {activeCount > 0 && (
            <button
              onClick={() =>
                onFilterChange({
                  issueType: null,
                  difficulty: null,
                  repoScale: null,
                  sort: "relevance",
                  skills: null,
                })
              }
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                background: "none",
                border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: 8,
                padding: "4px 12px",
                fontSize: 11,
                fontFamily: "monospace",
                color: "#f87171",
                cursor: "pointer",
                marginTop: 4,
              }}
            >
              <X style={{ width: 12, height: 12 }} /> Clear all
            </button>
          )}
        </div>
      )}
    </div>
  );
}
