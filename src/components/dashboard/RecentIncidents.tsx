import type { Incident } from "@/lib/types";
import {
  getSeverityBg,
  getIncidentStatusBg,
  formatRelativeTime,
  getIncidentTypeIcon,
} from "@/lib/utils";
import Link from "next/link";

interface RecentIncidentsProps {
  incidents: Incident[];
  limit?: number;
}

export default function RecentIncidents({
  incidents,
  limit = 5,
}: RecentIncidentsProps) {
  const active = incidents
    .filter((i) => i.status !== "resolved")
    .slice(0, limit);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Active Incidents</h3>
        <Link
          href="/incidents"
          className="text-blue-400 text-xs hover:text-blue-300 transition-colors"
        >
          View all →
        </Link>
      </div>

      {active.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">✅</div>
          <p className="text-gray-400 text-sm">No active incidents</p>
        </div>
      ) : (
        <div className="space-y-3">
          {active.map((incident) => (
            <div
              key={incident.id}
              className="bg-gray-800 rounded-lg p-3 border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-start gap-3">
                <span className="text-xl mt-0.5">
                  {getIncidentTypeIcon(incident.type)}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-white text-sm font-medium truncate">
                      {incident.title}
                    </span>
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded border ${getSeverityBg(incident.severity)}`}
                    >
                      {incident.severity}
                    </span>
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded border ${getIncidentStatusBg(incident.status)}`}
                    >
                      {incident.status}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs mt-0.5 truncate">
                    {incident.location}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-gray-500 text-xs">
                      {formatRelativeTime(incident.reportedAt)}
                    </span>
                    {incident.affectedLanes > 0 && (
                      <span className="text-gray-500 text-xs">
                        {incident.affectedLanes} lane
                        {incident.affectedLanes > 1 ? "s" : ""} affected
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
