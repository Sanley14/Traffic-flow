import Header from "@/components/layout/Header";
import StatCard from "@/components/ui/StatCard";
import LiveTrafficMap from "@/components/dashboard/LiveTrafficMap";
import RecentIncidents from "@/components/dashboard/RecentIncidents";
import ZoneOverview from "@/components/dashboard/ZoneOverview";
import { intersections, incidents, currentStats, zoneStats } from "@/lib/data";

export default function DashboardPage() {
  const activeIncidents = incidents.filter((i) => i.status !== "resolved");
  const criticalIntersections = intersections.filter(
    (i) => i.status === "critical"
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header
        title="Traffic Control Dashboard"
        subtitle="Real-time city traffic monitoring and management"
      />

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Critical Alert Banner */}
        {criticalIntersections.length > 0 && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
            <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg
                className="w-4 h-4 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div>
              <p className="text-red-400 font-medium text-sm">
                Critical Alert: {criticalIntersections.length} intersection
                {criticalIntersections.length > 1 ? "s" : ""} in critical state
              </p>
              <p className="text-red-400/70 text-xs mt-0.5">
                {criticalIntersections.map((i) => i.name).join(", ")} —
                Immediate attention required
              </p>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Vehicles"
            value={currentStats.totalVehicles.toLocaleString()}
            change="12%"
            changeType="up"
            color="blue"
            icon={
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
            }
          />
          <StatCard
            title="Average Speed"
            value={currentStats.avgSpeed}
            unit="km/h"
            change="8%"
            changeType="down"
            color="yellow"
            icon={
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            }
          />
          <StatCard
            title="Active Incidents"
            value={activeIncidents.length}
            change="2 new"
            changeType="up"
            color="red"
            icon={
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            }
          />
          <StatCard
            title="Throughput"
            value={currentStats.throughput.toLocaleString()}
            unit="veh/hr"
            change="5%"
            changeType="neutral"
            color="green"
            icon={
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            }
          />
        </div>

        {/* Congestion Overview */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Network Congestion</h3>
            <span
              className={`text-sm font-bold ${
                currentStats.congestionLevel < 30
                  ? "text-green-400"
                  : currentStats.congestionLevel < 60
                  ? "text-yellow-400"
                  : currentStats.congestionLevel < 80
                  ? "text-orange-400"
                  : "text-red-400"
              }`}
            >
              {currentStats.congestionLevel}% congested
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-4 mb-3">
            <div
              className={`h-4 rounded-full transition-all duration-500 ${
                currentStats.congestionLevel < 30
                  ? "bg-green-500"
                  : currentStats.congestionLevel < 60
                  ? "bg-yellow-500"
                  : currentStats.congestionLevel < 80
                  ? "bg-orange-500"
                  : "bg-red-500"
              }`}
              style={{ width: `${currentStats.congestionLevel}%` }}
            />
          </div>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-green-400 text-xs font-medium">0–30%</div>
              <div className="text-gray-500 text-xs">Free Flow</div>
            </div>
            <div>
              <div className="text-yellow-400 text-xs font-medium">30–60%</div>
              <div className="text-gray-500 text-xs">Moderate</div>
            </div>
            <div>
              <div className="text-orange-400 text-xs font-medium">60–80%</div>
              <div className="text-gray-500 text-xs">Heavy</div>
            </div>
            <div>
              <div className="text-red-400 text-xs font-medium">80–100%</div>
              <div className="text-gray-500 text-xs">Gridlock</div>
            </div>
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <LiveTrafficMap intersections={intersections} />
          </div>
          <div className="space-y-6">
            <ZoneOverview zones={zoneStats} />
          </div>
        </div>

        {/* Incidents + Intersection Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentIncidents incidents={incidents} />

          {/* Intersection Quick Status */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Intersection Status</h3>
              <a
                href="/intersections"
                className="text-blue-400 text-xs hover:text-blue-300 transition-colors"
              >
                Manage →
              </a>
            </div>
            <div className="space-y-2">
              {intersections.map((intersection) => (
                <div
                  key={intersection.id}
                  className="flex items-center justify-between bg-gray-800 rounded-lg px-3 py-2.5"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        intersection.status === "normal"
                          ? "bg-green-400"
                          : intersection.status === "warning"
                          ? "bg-yellow-400 animate-pulse"
                          : intersection.status === "critical"
                          ? "bg-red-400 animate-pulse"
                          : "bg-gray-400"
                      }`}
                    />
                    <div>
                      <div className="text-gray-200 text-sm font-medium">
                        {intersection.name}
                      </div>
                      <div className="text-gray-500 text-xs">
                        {intersection.location}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-300 text-sm">
                      {intersection.vehicleCount} veh
                    </div>
                    <div className="text-gray-500 text-xs">
                      {intersection.avgSpeed} km/h
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
