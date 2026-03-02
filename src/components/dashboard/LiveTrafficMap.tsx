"use client";

import { useState, useEffect } from "react";
import type { Intersection } from "@/lib/types";
import { getDensityColor } from "@/lib/utils";

interface LiveTrafficMapProps {
  intersections: Intersection[];
}

export default function LiveTrafficMap({ intersections }: LiveTrafficMapProps) {
  const [selected, setSelected] = useState<Intersection | null>(null);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setPulse((p) => !p), 2000);
    return () => clearInterval(interval);
  }, []);

  // Map positions (normalized 0-100 for the SVG viewport)
  const positions: Record<string, { x: number; y: number }> = {
    "int-001": { x: 45, y: 50 },
    "int-002": { x: 55, y: 30 },
    "int-003": { x: 30, y: 65 },
    "int-004": { x: 25, y: 45 },
    "int-005": { x: 60, y: 48 },
    "int-006": { x: 80, y: 72 },
  };

  const statusColor: Record<string, string> = {
    normal: "#22c55e",
    warning: "#eab308",
    critical: "#ef4444",
    offline: "#6b7280",
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Live Traffic Map</h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs text-gray-400">Live</span>
        </div>
      </div>

      <div className="relative bg-gray-800 rounded-lg overflow-hidden" style={{ height: "320px" }}>
        {/* Grid lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
          {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((v) => (
            <g key={v}>
              <line x1={v} y1="0" x2={v} y2="100" stroke="#fff" strokeWidth="0.3" />
              <line x1="0" y1={v} x2="100" y2={v} stroke="#fff" strokeWidth="0.3" />
            </g>
          ))}
        </svg>

        {/* Road network */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Main roads */}
          <line x1="0" y1="50" x2="100" y2="50" stroke="#374151" strokeWidth="1.5" />
          <line x1="45" y1="0" x2="45" y2="100" stroke="#374151" strokeWidth="1.5" />
          <line x1="0" y1="30" x2="100" y2="30" stroke="#374151" strokeWidth="1" />
          <line x1="55" y1="0" x2="55" y2="100" stroke="#374151" strokeWidth="1" />
          <line x1="0" y1="65" x2="100" y2="65" stroke="#374151" strokeWidth="1" />
          <line x1="25" y1="0" x2="25" y2="100" stroke="#374151" strokeWidth="1" />
          <line x1="80" y1="0" x2="80" y2="100" stroke="#374151" strokeWidth="1" />
          <line x1="0" y1="72" x2="100" y2="72" stroke="#374151" strokeWidth="1" />
        </svg>

        {/* Intersection nodes */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
          {intersections.map((intersection) => {
            const pos = positions[intersection.id];
            if (!pos) return null;
            const color = statusColor[intersection.status];
            const isSelected = selected?.id === intersection.id;

            return (
              <g
                key={intersection.id}
                onClick={() => setSelected(isSelected ? null : intersection)}
                style={{ cursor: "pointer" }}
              >
                {/* Pulse ring for critical/warning */}
                {(intersection.status === "critical" || intersection.status === "warning") && (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={pulse ? 5 : 3.5}
                    fill="none"
                    stroke={color}
                    strokeWidth="0.5"
                    opacity={pulse ? 0.3 : 0.6}
                    style={{ transition: "all 1s ease" }}
                  />
                )}
                {/* Main dot */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isSelected ? 3.5 : 2.5}
                  fill={color}
                  stroke={isSelected ? "#fff" : "transparent"}
                  strokeWidth="0.5"
                />
                {/* Label */}
                <text
                  x={pos.x}
                  y={pos.y - 4}
                  textAnchor="middle"
                  fontSize="2.5"
                  fill="#9ca3af"
                >
                  {intersection.name.split("&")[0].trim().substring(0, 8)}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="absolute bottom-3 left-3 flex gap-3">
          {[
            { color: "bg-green-500", label: "Normal" },
            { color: "bg-yellow-500", label: "Warning" },
            { color: "bg-red-500", label: "Critical" },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${color}`} />
              <span className="text-xs text-gray-400">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Selected intersection info */}
      {selected && (
        <div className="mt-3 bg-gray-800 rounded-lg p-3 border border-gray-700">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-white text-sm font-medium">{selected.name}</h4>
              <p className="text-gray-400 text-xs">{selected.location}</p>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="text-gray-500 hover:text-gray-300 text-xs"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-2">
            <div>
              <div className="text-white text-sm font-bold">{selected.vehicleCount}</div>
              <div className="text-gray-500 text-xs">Vehicles</div>
            </div>
            <div>
              <div className="text-white text-sm font-bold">{selected.avgSpeed} km/h</div>
              <div className="text-gray-500 text-xs">Avg Speed</div>
            </div>
            <div>
              <div className={`text-sm font-bold capitalize ${getDensityColor(selected.density)}`}>
                {selected.density}
              </div>
              <div className="text-gray-500 text-xs">Density</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
