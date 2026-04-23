import React from "react";
import { Activity } from "lucide-react";

const SimpleRadarChart = ({ data }) => {
  const size = 200;
  const center = size / 2;
  const radius = (size - 40) / 2;
  const angleStep = (Math.PI * 2) / data.length;
  const points = data
    .map((item, i) => {
      const value = item.value / 100;
      const angle = i * angleStep - Math.PI / 2;
      return `${center + radius * value * Math.cos(angle)},${
        center + radius * value * Math.sin(angle)
      }`;
    })
    .join(" ");
  const gridLevels = [0.25, 0.5, 0.75, 1];

  return (
    <div className="flex flex-col items-center justify-center py-4">
      <svg width={size} height={size} className="overflow-visible">
        {gridLevels.map((level, idx) => (
          <polygon
            key={idx}
            points={data
              .map((_, i) => {
                const angle = i * angleStep - Math.PI / 2;
                return `${center + radius * level * Math.cos(angle)},${
                  center + radius * level * Math.sin(angle)
                }`;
              })
              .join(" ")}
            fill={
              idx === gridLevels.length - 1 ? "rgba(15, 23, 42, 0.5)" : "none"
            }
            stroke="#334155"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        ))}
        <polygon
          points={points}
          fill="rgba(59, 130, 246, 0.2)"
          stroke="#3b82f6"
          strokeWidth="2"
        />
        {data.map((item, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const labelRadius = radius + 25;
          return (
            <text
              key={i}
              x={center + labelRadius * Math.cos(angle)}
              y={center + labelRadius * Math.sin(angle)}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-[10px] fill-slate-400 font-mono uppercase tracking-wider"
            >
              {item.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

export const SkillMatrix = ({ data, skills }) => (
  <div className="bg-[#0f111a] border border-slate-800 rounded-xl p-6 shadow-lg flex flex-col items-center">
    <h3 className="text-lg font-bold text-white mb-2 w-full flex items-center gap-2">
      <Activity className="w-5 h-5 text-violet-500" /> Skill Matrix
    </h3>
    <SimpleRadarChart data={data} />
    <div className="mt-2 flex flex-wrap gap-2 justify-center">
      {skills &&
        skills.map((s) => (
          <span
            key={s}
            className="text-[10px] uppercase font-bold tracking-wider text-slate-500 bg-[#0a0a0f] px-2 py-1 rounded border border-slate-800"
          >
            {s}
          </span>
        ))}
    </div>
  </div>
);
