import type { ZoneStats } from "@/lib/types";
import { getCongestionBarColor } from "@/lib/utils";

interface ZoneOverviewProps {
  zones: ZoneStats[];
}

const statusDot: Record<string, string> = {
  normal: "bg-green-400",
  warning: "bg-yellow-400",
  critical: "bg-red-400",
};

export default function ZoneOverview({ zones }: ZoneOverviewProps) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <h3 className="text-white font-semibold mb-4">Zone Status</h3>
      <div className="space-y-3">
        {zones.map((zone) => (
          <div key={zone.zone} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${statusDot[zone.status]}`} />
                <span className="text-gray-300 text-sm">{zone.zone}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span>{zone.intersections} intersections</span>
                {zone.activeIncidents > 0 && (
                  <span className="text-red-400 font-medium">
                    {zone.activeIncidents} incident{zone.activeIncidents > 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-700 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all duration-500 ${getCongestionBarColor(zone.avgCongestion)}`}
                  style={{ width: `${zone.avgCongestion}%` }}
                />
              </div>
              <span className={`text-xs font-medium w-8 text-right ${
                zone.avgCongestion < 30
                  ? "text-green-400"
                  : zone.avgCongestion < 60
                  ? "text-yellow-400"
                  : zone.avgCongestion < 80
                  ? "text-orange-400"
                  : "text-red-400"
              }`}>
                {zone.avgCongestion}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
