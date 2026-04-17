import React from "react";

/**
 * Circular match percentage badge with color gradient.
 * Green > 80%, Yellow 50-80%, Orange < 50%
 */
export default function MatchBadge({ score, size = "md" }) {
  const percentage = Math.round((score || 0) * 100);

  const getColor = () => {
    if (percentage >= 80) return { ring: "#22c55e", bg: "rgba(34,197,94,0.1)", text: "#4ade80" };
    if (percentage >= 50) return { ring: "#eab308", bg: "rgba(234,179,8,0.1)", text: "#facc15" };
    return { ring: "#f97316", bg: "rgba(249,115,22,0.1)", text: "#fb923c" };
  };

  const color = getColor();
  const sizes = {
    sm: { box: 40, radius: 16, stroke: 3, font: "10px" },
    md: { box: 52, radius: 20, stroke: 3.5, font: "12px" },
    lg: { box: 64, radius: 26, stroke: 4, font: "14px" },
  };
  const s = sizes[size] || sizes.md;
  const circumference = 2 * Math.PI * s.radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div
      style={{
        position: "relative",
        width: s.box,
        height: s.box,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      title={`${percentage}% match`}
    >
      <svg
        width={s.box}
        height={s.box}
        style={{ position: "absolute", transform: "rotate(-90deg)" }}
      >
        {/* Background ring */}
        <circle
          cx={s.box / 2}
          cy={s.box / 2}
          r={s.radius}
          fill="none"
          stroke="rgba(100,116,139,0.2)"
          strokeWidth={s.stroke}
        />
        {/* Progress ring */}
        <circle
          cx={s.box / 2}
          cy={s.box / 2}
          r={s.radius}
          fill="none"
          stroke={color.ring}
          strokeWidth={s.stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <span
        style={{
          fontSize: s.font,
          fontWeight: 700,
          fontFamily: "monospace",
          color: color.text,
          position: "relative",
          zIndex: 1,
        }}
      >
        {percentage}%
      </span>
    </div>
  );
}
