"use client";

import type { TrafficSignal } from "@/lib/types";

interface TrafficSignalDisplayProps {
  signal: TrafficSignal;
  compact?: boolean;
}

export default function TrafficSignalDisplay({
  signal,
  compact = false,
}: TrafficSignalDisplayProps) {
  const isGreen = signal.state === "green";
  const isYellow = signal.state === "yellow";
  const isRed = signal.state === "red";

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex flex-col gap-0.5 bg-gray-800 rounded p-1">
          <div className={`w-3 h-3 rounded-full ${isRed ? "bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.8)]" : "bg-gray-700"}`} />
          <div className={`w-3 h-3 rounded-full ${isYellow ? "bg-yellow-400 shadow-[0_0_6px_rgba(250,204,21,0.8)]" : "bg-gray-700"}`} />
          <div className={`w-3 h-3 rounded-full ${isGreen ? "bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.8)]" : "bg-gray-700"}`} />
        </div>
        <div>
          <div className="text-xs text-gray-400 capitalize">{signal.direction}</div>
          <div className={`text-xs font-medium capitalize ${
            isGreen ? "text-green-400" : isYellow ? "text-yellow-400" : "text-red-400"
          }`}>
            {signal.state}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-300 text-sm font-medium capitalize">
          {signal.direction}
        </span>
        <span className={`text-xs px-2 py-0.5 rounded-full border ${
          signal.mode === "auto"
            ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
            : signal.mode === "manual"
            ? "bg-orange-500/20 text-orange-400 border-orange-500/30"
            : signal.mode === "flashing"
            ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
            : "bg-gray-500/20 text-gray-400 border-gray-500/30"
        }`}>
          {signal.mode}
        </span>
      </div>

      {/* Signal lights */}
      <div className="flex justify-center mb-3">
        <div className="bg-gray-900 rounded-lg p-2 flex flex-col gap-2 border border-gray-700">
          <div className={`w-8 h-8 rounded-full transition-all duration-300 ${
            isRed
              ? "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]"
              : "bg-gray-700"
          }`} />
          <div className={`w-8 h-8 rounded-full transition-all duration-300 ${
            isYellow
              ? "bg-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.8)]"
              : "bg-gray-700"
          }`} />
          <div className={`w-8 h-8 rounded-full transition-all duration-300 ${
            isGreen
              ? "bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.8)]"
              : "bg-gray-700"
          }`} />
        </div>
      </div>

      {/* Cycle progress */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Cycle</span>
          <span>{signal.cyclePosition}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-1.5">
          <div
            className={`h-1.5 rounded-full transition-all duration-1000 ${
              isGreen ? "bg-green-500" : isYellow ? "bg-yellow-400" : "bg-red-500"
            }`}
            style={{ width: `${signal.cyclePosition}%` }}
          />
        </div>
      </div>

      {/* Timing */}
      <div className="mt-3 grid grid-cols-3 gap-1 text-center">
        <div>
          <div className="text-red-400 text-xs font-mono">{signal.redDuration}s</div>
          <div className="text-gray-600 text-xs">Red</div>
        </div>
        <div>
          <div className="text-yellow-400 text-xs font-mono">{signal.yellowDuration}s</div>
          <div className="text-gray-600 text-xs">Yellow</div>
        </div>
        <div>
          <div className="text-green-400 text-xs font-mono">{signal.greenDuration}s</div>
          <div className="text-gray-600 text-xs">Green</div>
        </div>
      </div>
    </div>
  );
}
