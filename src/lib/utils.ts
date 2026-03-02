import type {
  SignalState,
  TrafficDensity,
  IncidentSeverity,
  IncidentStatus,
} from "./types";

export function getSignalColor(state: SignalState): string {
  switch (state) {
    case "green":
      return "bg-green-500";
    case "yellow":
      return "bg-yellow-400";
    case "red":
      return "bg-red-500";
  }
}

export function getSignalTextColor(state: SignalState): string {
  switch (state) {
    case "green":
      return "text-green-400";
    case "yellow":
      return "text-yellow-400";
    case "red":
      return "text-red-400";
  }
}

export function getDensityColor(density: TrafficDensity): string {
  switch (density) {
    case "low":
      return "text-green-400";
    case "moderate":
      return "text-yellow-400";
    case "heavy":
      return "text-orange-400";
    case "gridlock":
      return "text-red-400";
  }
}

export function getDensityBg(density: TrafficDensity): string {
  switch (density) {
    case "low":
      return "bg-green-500/20 text-green-400 border-green-500/30";
    case "moderate":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "heavy":
      return "bg-orange-500/20 text-orange-400 border-orange-500/30";
    case "gridlock":
      return "bg-red-500/20 text-red-400 border-red-500/30";
  }
}

export function getSeverityBg(severity: IncidentSeverity): string {
  switch (severity) {
    case "low":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "medium":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "high":
      return "bg-orange-500/20 text-orange-400 border-orange-500/30";
    case "critical":
      return "bg-red-500/20 text-red-400 border-red-500/30";
  }
}

export function getStatusBg(
  status: "normal" | "warning" | "critical" | "offline"
): string {
  switch (status) {
    case "normal":
      return "bg-green-500/20 text-green-400 border-green-500/30";
    case "warning":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "critical":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    case "offline":
      return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
}

export function getIncidentStatusBg(status: IncidentStatus): string {
  switch (status) {
    case "active":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    case "responding":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "resolved":
      return "bg-green-500/20 text-green-400 border-green-500/30";
  }
}

export function formatRelativeTime(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "Just now";
}

export function formatDuration(isoDate: string): string {
  const diff = new Date(isoDate).getTime() - Date.now();
  if (diff < 0) return "Overdue";
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  if (hours > 0) return `~${hours}h ${minutes % 60}m`;
  return `~${minutes}m`;
}

export function getCongestionBarColor(level: number): string {
  if (level < 30) return "bg-green-500";
  if (level < 60) return "bg-yellow-500";
  if (level < 80) return "bg-orange-500";
  return "bg-red-500";
}

export function getIncidentTypeIcon(
  type: string
): string {
  switch (type) {
    case "accident":
      return "🚗";
    case "breakdown":
      return "🔧";
    case "roadwork":
      return "🚧";
    case "flooding":
      return "🌊";
    case "signal_fault":
      return "🚦";
    case "congestion":
      return "🚕";
    default:
      return "⚠️";
  }
}
