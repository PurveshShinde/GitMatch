import React from "react";

/**
 * Skill tag pill — green for matched skills, grey-dashed for missing skills.
 */
export default function SkillTag({ skill, matched = true }) {
  const style = matched
    ? {
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: "9999px",
        fontSize: "10px",
        fontWeight: 600,
        fontFamily: "monospace",
        textTransform: "uppercase",
        letterSpacing: "0.04em",
        color: "#86efac",
        backgroundColor: "rgba(34,197,94,0.1)",
        border: "1px solid rgba(34,197,94,0.25)",
      }
    : {
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: "9999px",
        fontSize: "10px",
        fontWeight: 600,
        fontFamily: "monospace",
        textTransform: "uppercase",
        letterSpacing: "0.04em",
        color: "#94a3b8",
        backgroundColor: "rgba(100,116,139,0.08)",
        border: "1px dashed rgba(100,116,139,0.3)",
      };

  return (
    <span style={style} title={matched ? "Matches your skills" : "Skill not in your profile"}>
      {skill}
    </span>
  );
}
