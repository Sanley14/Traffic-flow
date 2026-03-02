"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import { hourlyData, zoneStats, intersections, incidents } from "@/lib/data";

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<"today" | "week" | "month">("today");

  const maxVehicles = Math.max(...hourlyData.map((d) => d.vehicles));
  const maxSpeed = Math.max(...hourlyData.map((d) => d.avgSpeed));

  const peakHour = hourlyData.reduce((a, b) =>
    a.vehicles > b.vehicles ? a : b
  );
  const offPeakHour = hourlyData.reduce((a, b) =>
    a.vehicles < b.vehicles ? a : b
  );
  const totalIncidentsToday = hourlyData.reduce(
    (acc, d) => acc + d.incidents,
    0
  );
  const avgDailySpeed =
    Math.round(
      hourlyData.reduce((acc, d) => acc + d.avgSpeed, 0) / hourlyData.length
    );

  const resolvedIncidents = incidents.filter((i) => i.status === "resolved").length;
  const incidentResolutionRate = Math.round(
    (resolvedIncidents / incidents.length) * 100
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header
        title="Analytics & Reports"
        subtitle="Traffic performance metrics and trend analysis"
      />

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Time Range Selector */}
        <div className="flex items-center gap-2">
          {(["today", "week", "month"] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                timeRange === range
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:text-white border border-gray-700"
              }`}
            >
              {range === "today" ? "Today" : range === "week" ? "This Week" : "This Month"}
            </button>
          ))}
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Peak Hour",
              value: peakHour.hour,
              sub: `${peakHour.vehicles.toLocaleString()} vehicles`,
              color: "text-orange-400",
              icon: "🔺",
            },
            {
              label: "Off-Peak Hour",
              value: offPeakHour.hour,
              sub: `${offPeakHour.vehicles.toLocaleString()} vehicles`,
              color: "text-green-400",
              icon: "🔻",
            },
            {
              label: "Avg Daily Speed",
              value: `${avgDailySpeed} km/h`,
              sub: "Network average",
              color: "text-blue-400",
              icon: "⚡",
            },
            {
              label: "Resolution Rate",
              value: `${incidentResolutionRate}%`,
              sub: `${resolvedIncidents}/${incidents.length} incidents`,
              color: "text-purple-400",
              icon: "✅",
            },
          ].map(({ label, value, sub, color, icon }) => (
            <div
              key={label}
              className="bg-gray-900 border border-gray-800 rounded-xl p-4"
            >
              <div className="text-2xl mb-2">{icon}</div>
              <div className={`text-xl font-bold ${color}`}>{value}</div>
              <div className="text-gray-400 text-sm mt-0.5">{label}</div>
              <div className="text-gray-500 text-xs mt-0.5">{sub}</div>
            </div>
          ))}
        </div>

        {/* Hourly Traffic Volume Chart */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-6">
            Hourly Traffic Volume
          </h3>
          <div className="relative">
            {/* Y-axis labels */}
            <div className="flex">
              <div className="flex flex-col justify-between text-xs text-gray-500 pr-3 h-40">
                <span>{maxVehicles.toLocaleString()}</span>
                <span>{Math.round(maxVehicles * 0.75).toLocaleString()}</span>
                <span>{Math.round(maxVehicles * 0.5).toLocaleString()}</span>
                <span>{Math.round(maxVehicles * 0.25).toLocaleString()}</span>
                <span>0</span>
              </div>
              {/* Bars */}
              <div className="flex-1 flex items-end gap-1 h-40">
                {hourlyData.map((d) => {
                  const height = (d.vehicles / maxVehicles) * 100;
                  const isCurrentHour =
                    d.hour === `${new Date().getHours().toString().padStart(2, "0")}:00`;
                  return (
                    <div
                      key={d.hour}
                      className="flex-1 flex flex-col items-center gap-1 group relative"
                    >
                      {/* Tooltip */}
                      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-700 text-white text-xs rounded px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                        {d.hour}: {d.vehicles.toLocaleString()} veh
                        <br />
                        Avg: {d.avgSpeed} km/h
                        {d.incidents > 0 && (
                          <>
                            <br />
                            {d.incidents} incident{d.incidents > 1 ? "s" : ""}
                          </>
                        )}
                      </div>
                      <div
                        className={`w-full rounded-t transition-all duration-300 ${
                          isCurrentHour
                            ? "bg-blue-500"
                            : d.vehicles > maxVehicles * 0.8
                            ? "bg-red-500/70"
                            : d.vehicles > maxVehicles * 0.6
                            ? "bg-orange-500/70"
                            : "bg-blue-500/40 hover:bg-blue-500/60"
                        }`}
                        style={{ height: `${height}%` }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
            {/* X-axis labels */}
            <div className="flex ml-10 mt-2">
              {hourlyData
                .filter((_, i) => i % 4 === 0)
                .map((d) => (
                  <div
                    key={d.hour}
                    className="flex-1 text-center text-xs text-gray-500"
                  >
                    {d.hour}
                  </div>
                ))}
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-500 rounded" />
              <span>Current hour</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-500/70 rounded" />
              <span>Peak (&gt;80%)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-orange-500/70 rounded" />
              <span>Heavy (&gt;60%)</span>
            </div>
          </div>
        </div>

        {/* Speed Trend Chart */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-6">
            Average Speed Trend (km/h)
          </h3>
          <div className="relative h-32">
            <svg
              className="w-full h-full"
              viewBox={`0 0 ${hourlyData.length * 10} 100`}
              preserveAspectRatio="none"
            >
              {/* Grid lines */}
              {[25, 50, 75].map((y) => (
                <line
                  key={y}
                  x1="0"
                  y1={y}
                  x2={hourlyData.length * 10}
                  y2={y}
                  stroke="#374151"
                  strokeWidth="0.5"
                  strokeDasharray="2,2"
                />
              ))}
              {/* Area fill */}
              <path
                d={`M 0 ${100 - (hourlyData[0].avgSpeed / maxSpeed) * 100} ${hourlyData
                  .map(
                    (d, i) =>
                      `L ${i * 10} ${100 - (d.avgSpeed / maxSpeed) * 100}`
                  )
                  .join(" ")} L ${(hourlyData.length - 1) * 10} 100 L 0 100 Z`}
                fill="rgba(59, 130, 246, 0.1)"
              />
              {/* Line */}
              <path
                d={`M 0 ${100 - (hourlyData[0].avgSpeed / maxSpeed) * 100} ${hourlyData
                  .map(
                    (d, i) =>
                      `L ${i * 10} ${100 - (d.avgSpeed / maxSpeed) * 100}`
                  )
                  .join(" ")}`}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="1.5"
              />
              {/* Data points */}
              {hourlyData.map((d, i) => (
                <circle
                  key={i}
                  cx={i * 10}
                  cy={100 - (d.avgSpeed / maxSpeed) * 100}
                  r="1.5"
                  fill="#3b82f6"
                />
              ))}
            </svg>
            {/* Y labels */}
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 -ml-8">
              <span>{maxSpeed}</span>
              <span>{Math.round(maxSpeed / 2)}</span>
              <span>0</span>
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>00:00</span>
            <span>06:00</span>
            <span>12:00</span>
            <span>18:00</span>
            <span>23:00</span>
          </div>
        </div>

        {/* Zone Performance + Incident Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Zone Performance */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h3 className="text-white font-semibold mb-4">Zone Performance</h3>
            <div className="space-y-4">
              {zoneStats.map((zone) => (
                <div key={zone.zone}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-300 text-sm">{zone.zone}</span>
                    <div className="flex items-center gap-2">
                      {zone.activeIncidents > 0 && (
                        <span className="text-red-400 text-xs">
                          {zone.activeIncidents} incident{zone.activeIncidents > 1 ? "s" : ""}
                        </span>
                      )}
                      <span
                        className={`text-xs font-medium ${
                          zone.avgCongestion < 30
                            ? "text-green-400"
                            : zone.avgCongestion < 60
                            ? "text-yellow-400"
                            : zone.avgCongestion < 80
                            ? "text-orange-400"
                            : "text-red-400"
                        }`}
                      >
                        {zone.avgCongestion}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        zone.avgCongestion < 30
                          ? "bg-green-500"
                          : zone.avgCongestion < 60
                          ? "bg-yellow-500"
                          : zone.avgCongestion < 80
                          ? "bg-orange-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${zone.avgCongestion}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Incident Type Breakdown */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h3 className="text-white font-semibold mb-4">
              Incident Breakdown
            </h3>
            <div className="space-y-3">
              {Object.entries(
                incidents.reduce(
                  (acc, i) => {
                    acc[i.type] = (acc[i.type] || 0) + 1;
                    return acc;
                  },
                  {} as Record<string, number>
                )
              )
                .sort(([, a], [, b]) => b - a)
                .map(([type, count]) => {
                  const pct = Math.round((count / incidents.length) * 100);
                  return (
                    <div key={type}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-gray-300 text-sm capitalize">
                          {type.replace("_", " ")}
                        </span>
                        <span className="text-gray-400 text-xs">
                          {count} ({pct}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-blue-500 transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Intersection Performance Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">
            Intersection Performance
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 text-xs border-b border-gray-800">
                  <th className="text-left pb-3 font-medium">Intersection</th>
                  <th className="text-left pb-3 font-medium">Zone</th>
                  <th className="text-right pb-3 font-medium">Vehicles</th>
                  <th className="text-right pb-3 font-medium">Avg Speed</th>
                  <th className="text-right pb-3 font-medium">Density</th>
                  <th className="text-right pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {intersections
                  .sort((a, b) => b.vehicleCount - a.vehicleCount)
                  .map((intersection) => (
                    <tr key={intersection.id} className="hover:bg-gray-800/50">
                      <td className="py-3 text-gray-200">
                        {intersection.name}
                      </td>
                      <td className="py-3 text-gray-400">
                        {intersection.location}
                      </td>
                      <td className="py-3 text-right text-gray-200">
                        {intersection.vehicleCount.toLocaleString()}
                      </td>
                      <td className="py-3 text-right text-gray-200">
                        {intersection.avgSpeed} km/h
                      </td>
                      <td className="py-3 text-right">
                        <span
                          className={`capitalize text-xs ${
                            intersection.density === "low"
                              ? "text-green-400"
                              : intersection.density === "moderate"
                              ? "text-yellow-400"
                              : intersection.density === "heavy"
                              ? "text-orange-400"
                              : "text-red-400"
                          }`}
                        >
                          {intersection.density}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <span
                          className={`capitalize text-xs ${
                            intersection.status === "normal"
                              ? "text-green-400"
                              : intersection.status === "warning"
                              ? "text-yellow-400"
                              : intersection.status === "critical"
                              ? "text-red-400"
                              : "text-gray-400"
                          }`}
                        >
                          {intersection.status}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Today's Summary */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">
            Today&apos;s Summary
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: "Total Vehicles Processed",
                value: hourlyData
                  .reduce((acc, d) => acc + d.vehicles, 0)
                  .toLocaleString(),
                icon: "🚗",
              },
              {
                label: "Total Incidents",
                value: totalIncidentsToday,
                icon: "⚠️",
              },
              {
                label: "Signal Cycles",
                value: "14,280",
                icon: "🚦",
              },
              {
                label: "Network Efficiency",
                value: "73%",
                icon: "📊",
              },
            ].map(({ label, value, icon }) => (
              <div
                key={label}
                className="bg-gray-800 rounded-lg p-4 text-center"
              >
                <div className="text-2xl mb-2">{icon}</div>
                <div className="text-white text-xl font-bold">{value}</div>
                <div className="text-gray-400 text-xs mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
