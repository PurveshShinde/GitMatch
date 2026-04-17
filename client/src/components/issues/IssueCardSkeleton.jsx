import React from "react";

/**
 * Loading skeleton for issue cards — shimmer animation grid.
 */
export default function IssueCardSkeleton({ count = 6 }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16 }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            backgroundColor: "#0f111a",
            border: "1px solid rgba(51,65,85,0.5)",
            borderRadius: 12,
            padding: 20,
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* Shimmer overlay */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "-100%",
              width: "200%",
              height: "100%",
              background: "linear-gradient(90deg, transparent 25%, rgba(100,116,139,0.06) 50%, transparent 75%)",
              animation: "shimmer 1.8s infinite",
            }}
          />

          {/* Skeleton lines */}
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ width: 120, height: 12, backgroundColor: "rgba(100,116,139,0.15)", borderRadius: 6 }} />
            <div style={{ width: 50, height: 18, backgroundColor: "rgba(100,116,139,0.15)", borderRadius: 9 }} />
          </div>
          <div style={{ width: "90%", height: 16, backgroundColor: "rgba(100,116,139,0.12)", borderRadius: 6, marginBottom: 8 }} />
          <div style={{ width: "70%", height: 16, backgroundColor: "rgba(100,116,139,0.10)", borderRadius: 6, marginBottom: 16 }} />
          <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
            <div style={{ width: 56, height: 20, backgroundColor: "rgba(100,116,139,0.10)", borderRadius: 10 }} />
            <div style={{ width: 64, height: 20, backgroundColor: "rgba(100,116,139,0.10)", borderRadius: 10 }} />
            <div style={{ width: 48, height: 20, backgroundColor: "rgba(100,116,139,0.10)", borderRadius: 10 }} />
          </div>
          <div style={{ width: "100%", height: 36, backgroundColor: "rgba(100,116,139,0.10)", borderRadius: 8 }} />

          {/* Inject keyframes via style tag */}
          <style>{`
            @keyframes shimmer {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }
          `}</style>
        </div>
      ))}
    </div>
  );
}
