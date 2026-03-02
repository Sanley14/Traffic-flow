"use client";

import { useState, useEffect, useCallback } from "react";
import Header from "@/components/layout/Header";
import TrafficSignalDisplay from "@/components/ui/TrafficSignalDisplay";
import { intersections as initialIntersections } from "@/lib/data";
import type { Intersection, SignalState } from "@/lib/types";

function getNextState(current: SignalState): SignalState {
  if (current === "green") return "yellow";
  if (current === "yellow") return "red";
  return "green";
}

export default function SignalsPage() {
  const [intersections, setIntersections] =
    useState<Intersection[]>(initialIntersections);
  const [tick, setTick] = useState(0);

  // Simulate signal cycling
  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);
      setIntersections((prev) =>
        prev.map((intersection) => ({
          ...intersection,
          signals: intersection.signals.map((signal) => {
            if (signal.mode !== "auto") return signal;
            const newPosition = (signal.cyclePosition + 2) % 100;
            const totalCycle =
              signal.greenDuration + signal.yellowDuration + signal.redDuration;
            const elapsed = (newPosition / 100) * totalCycle;
            let newState: SignalState;
            if (elapsed < signal.greenDuration) {
              newState = "green";
            } else if (elapsed < signal.greenDuration + signal.yellowDuration) {
              newState = "yellow";
            } else {
              newState = "red";
            }
            return {
              ...signal,
              cyclePosition: newPosition,
              state: newState,
              lastChanged:
                newState !== signal.state
                  ? new Date().toISOString()
                  : signal.lastChanged,
            };
          }),
        }))
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleModeChange = useCallback(
    (
      intersectionId: string,
      signalId: string,
      mode: "auto" | "manual" | "flashing" | "off"
    ) => {
      setIntersections((prev) =>
        prev.map((i) =>
          i.id === intersectionId
            ? {
                ...i,
                signals: i.signals.map((s) =>
                  s.id === signalId ? { ...s, mode } : s
                ),
              }
            : i
        )
      );
    },
    []
  );

  const handleForceState = useCallback(
    (intersectionId: string, signalId: string, state: SignalState) => {
      setIntersections((prev) =>
        prev.map((i) =>
          i.id === intersectionId
            ? {
                ...i,
                signals: i.signals.map((s) =>
                  s.id === signalId
                    ? {
                        ...s,
                        state,
                        mode: "manual",
                        lastChanged: new Date().toISOString(),
                      }
                    : s
                ),
              }
            : i
        )
      );
    },
    []
  );

  const totalSignals = intersections.reduce(
    (acc, i) => acc + i.signals.length,
    0
  );
  const autoSignals = intersections.reduce(
    (acc, i) => acc + i.signals.filter((s) => s.mode === "auto").length,
    0
  );
  const manualSignals = intersections.reduce(
    (acc, i) => acc + i.signals.filter((s) => s.mode === "manual").length,
    0
  );
  const faultSignals = intersections.reduce(
    (acc, i) =>
      acc + i.signals.filter((s) => s.mode === "flashing" || s.mode === "off").length,
    0
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header
        title="Traffic Signals"
        subtitle="Real-time signal monitoring and control"
      />

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Total Signals",
              value: totalSignals,
              color: "text-white",
              bg: "bg-gray-800",
            },
            {
              label: "Auto Mode",
              value: autoSignals,
              color: "text-blue-400",
              bg: "bg-blue-500/10",
            },
            {
              label: "Manual Override",
              value: manualSignals,
              color: "text-orange-400",
              bg: "bg-orange-500/10",
            },
            {
              label: "Faults/Off",
              value: faultSignals,
              color: "text-red-400",
              bg: "bg-red-500/10",
            },
          ].map(({ label, value, color, bg }) => (
            <div
              key={label}
              className={`${bg} border border-gray-800 rounded-xl p-4 text-center`}
            >
              <div className={`text-2xl font-bold ${color}`}>{value}</div>
              <div className="text-gray-400 text-sm mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Signal Grid by Intersection */}
        <div className="space-y-6">
          {intersections.map((intersection) => (
            <div
              key={intersection.id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-white font-semibold">
                    {intersection.name}
                  </h3>
                  <p className="text-gray-400 text-sm">{intersection.location}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setIntersections((prev) =>
                        prev.map((i) =>
                          i.id === intersection.id
                            ? {
                                ...i,
                                signals: i.signals.map((s) => ({
                                  ...s,
                                  mode: "auto",
                                })),
                              }
                            : i
                        )
                      )
                    }
                    className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition-colors"
                  >
                    All Auto
                  </button>
                  <button
                    onClick={() =>
                      setIntersections((prev) =>
                        prev.map((i) =>
                          i.id === intersection.id
                            ? {
                                ...i,
                                signals: i.signals.map((s) => ({
                                  ...s,
                                  state: "red",
                                  mode: "manual",
                                })),
                              }
                            : i
                        )
                      )
                    }
                    className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg transition-colors"
                  >
                    All Red
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {intersection.signals.map((signal) => (
                  <div key={signal.id} className="space-y-2">
                    <TrafficSignalDisplay signal={signal} />

                    {/* Per-signal controls */}
                    <div className="grid grid-cols-3 gap-1">
                      {(["red", "yellow", "green"] as SignalState[]).map(
                        (state) => (
                          <button
                            key={state}
                            onClick={() =>
                              handleForceState(
                                intersection.id,
                                signal.id,
                                state
                              )
                            }
                            className={`text-xs py-1 rounded font-medium transition-colors ${
                              state === "red"
                                ? "bg-red-500/20 text-red-400 hover:bg-red-500/40"
                                : state === "yellow"
                                ? "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/40"
                                : "bg-green-500/20 text-green-400 hover:bg-green-500/40"
                            }`}
                          >
                            {state.charAt(0).toUpperCase()}
                          </button>
                        )
                      )}
                    </div>

                    <select
                      value={signal.mode}
                      onChange={(e) =>
                        handleModeChange(
                          intersection.id,
                          signal.id,
                          e.target.value as "auto" | "manual" | "flashing" | "off"
                        )
                      }
                      className="w-full bg-gray-800 border border-gray-700 rounded text-xs text-gray-300 px-2 py-1 focus:outline-none focus:border-blue-500"
                    >
                      <option value="auto">Auto</option>
                      <option value="manual">Manual</option>
                      <option value="flashing">Flashing</option>
                      <option value="off">Off</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
