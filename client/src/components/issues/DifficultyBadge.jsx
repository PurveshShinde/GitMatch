import React from "react";

const DIFFICULTY_CONFIG = {
  beginner: {
    label: "Beginner",
    color: "#22c55e",
    bg: "rgba(34,197,94,0.1)",
    border: "rgba(34,197,94,0.25)",
  },
  intermediate: {
    label: "Intermediate",
    color: "#eab308",
    bg: "rgba(234,179,8,0.1)",
    border: "rgba(234,179,8,0.25)",
  },
  advanced: {
    label: "Advanced",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.1)",
    border: "rgba(239,68,68,0.25)",
  },
};

export default function DifficultyBadge({ difficulty }) {
  const config = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.intermediate;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "2px 8px",
        borderRadius: "9999px",
        fontSize: "10px",
        fontWeight: 700,
        fontFamily: "monospace",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        color: config.color,
        backgroundColor: config.bg,
        border: `1px solid ${config.border}`,
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          backgroundColor: config.color,
        }}
      />
      {config.label}
    </span>
  );
}
