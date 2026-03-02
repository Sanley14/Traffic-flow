"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import TrafficSignalDisplay from "@/components/ui/TrafficSignalDisplay";
import CongestionBar from "@/components/ui/CongestionBar";
import { intersections } from "@/lib/data";
import { getDensityBg, getStatusBg } from "@/lib/utils";
import type { Intersection } from "@/lib/types";

export default function IntersectionsPage() {
  const [selected, setSelected] = useState<Intersection | null>(null);
  const [filter, setFilter] = useState<"all" | "normal" | "warning" | "critical">("all");
  const [search, setSearch] = useState("");

  const filtered = intersections.filter((i) => {
    const matchesFilter = filter === "all" || i.status === filter;
    const matchesSearch =
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.location.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const densityToPercent = {
    low: 20,
    moderate: 50,
    heavy: 75,
    gridlock: 95,
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header
        title="Intersections"
        subtitle={`Managing ${intersections.length} intersections across the network`}
      />

      <main className="flex-1 overflow-y-auto p-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search intersections..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-9 pr-4 py-2 text-gray-200 text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex gap-2">
            {(["all", "normal", "warning", "critical"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                  filter === f
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:text-white border border-gray-700"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Intersection List */}
          <div className="lg:col-span-1 space-y-3">
            {filtered.map((intersection) => (
              <button
                key={intersection.id}
                onClick={() => setSelected(intersection)}
                className={`w-full text-left bg-gray-900 border rounded-xl p-4 transition-all hover:border-gray-600 ${
                  selected?.id === intersection.id
                    ? "border-blue-500 bg-blue-500/5"
                    : "border-gray-800"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-white text-sm font-medium">
                      {intersection.name}
                    </h3>
                    <p className="text-gray-400 text-xs mt-0.5">
                      {intersection.location}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border capitalize ${getStatusBg(intersection.status)}`}
                  >
                    {intersection.status}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-400 mb-2">
                  <span>{intersection.vehicleCount} vehicles</span>
                  <span>{intersection.avgSpeed} km/h</span>
                  <span
                    className={`capitalize font-medium px-1.5 py-0.5 rounded border text-xs ${getDensityBg(intersection.density)}`}
                  >
                    {intersection.density}
                  </span>
                </div>

                <CongestionBar
                  level={densityToPercent[intersection.density]}
                  showLabel={false}
                  height="sm"
                />
              </button>
            ))}

            {filtered.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No intersections match your filters
              </div>
            )}
          </div>

          {/* Detail Panel */}
          <div className="lg:col-span-2">
            {selected ? (
              <div className="space-y-4">
                {/* Header */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-white text-lg font-semibold">
                        {selected.name}
                      </h2>
                      <p className="text-gray-400 text-sm">{selected.location}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {selected.cameraActive && (
                        <span className="flex items-center gap-1 text-xs text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-1 rounded-full">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                          Camera Live
                        </span>
                      )}
                      <span
                        className={`text-xs px-2 py-1 rounded-full border capitalize ${getStatusBg(selected.status)}`}
                      >
                        {selected.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-800 rounded-lg p-3 text-center">
                      <div className="text-white text-xl font-bold">
                        {selected.vehicleCount}
                      </div>
                      <div className="text-gray-400 text-xs">Vehicles</div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3 text-center">
                      <div className="text-white text-xl font-bold">
                        {selected.avgSpeed}
                        <span className="text-sm text-gray-400 ml-1">km/h</span>
                      </div>
                      <div className="text-gray-400 text-xs">Avg Speed</div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3 text-center">
                      <div
                        className={`text-xl font-bold capitalize ${getDensityBg(selected.density).split(" ")[1]}`}
                      >
                        {selected.density}
                      </div>
                      <div className="text-gray-400 text-xs">Density</div>
                    </div>
                  </div>
                </div>

                {/* Signals */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                  <h3 className="text-white font-semibold mb-4">
                    Traffic Signals
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {selected.signals.map((signal) => (
                      <TrafficSignalDisplay key={signal.id} signal={signal} />
                    ))}
                  </div>
                </div>

                {/* Controls */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                  <h3 className="text-white font-semibold mb-4">
                    Signal Controls
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-colors">
                      Auto Mode
                    </button>
                    <button className="bg-orange-600 hover:bg-orange-700 text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-colors">
                      Manual Override
                    </button>
                    <button className="bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-colors">
                      Flash Mode
                    </button>
                    <button className="bg-gray-700 hover:bg-gray-600 text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-colors">
                      All Red
                    </button>
                  </div>
                  <div className="mt-3 p-3 bg-gray-800 rounded-lg">
                    <p className="text-gray-400 text-xs">
                      ⚠️ Signal control changes take effect immediately and are
                      logged for audit purposes.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
                <div className="text-5xl mb-4">🚦</div>
                <h3 className="text-white font-medium mb-2">
                  Select an Intersection
                </h3>
                <p className="text-gray-400 text-sm">
                  Click on an intersection from the list to view details and
                  manage signals
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
