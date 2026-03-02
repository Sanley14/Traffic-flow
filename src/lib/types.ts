export type SignalState = "red" | "yellow" | "green";
export type SignalMode = "auto" | "manual" | "flashing" | "off";
export type IncidentSeverity = "low" | "medium" | "high" | "critical";
export type IncidentStatus = "active" | "responding" | "resolved";
export type TrafficDensity = "low" | "moderate" | "heavy" | "gridlock";

export interface TrafficSignal {
  id: string;
  intersectionId: string;
  direction: "north" | "south" | "east" | "west";
  state: SignalState;
  mode: SignalMode;
  greenDuration: number; // seconds
  yellowDuration: number;
  redDuration: number;
  cyclePosition: number; // 0-100%
  lastChanged: string; // ISO date
}

export interface Intersection {
  id: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
  signals: TrafficSignal[];
  density: TrafficDensity;
  vehicleCount: number;
  avgSpeed: number; // km/h
  status: "normal" | "warning" | "critical" | "offline";
  cameraActive: boolean;
  lastUpdated: string;
}

export interface Incident {
  id: string;
  type:
    | "accident"
    | "breakdown"
    | "roadwork"
    | "flooding"
    | "signal_fault"
    | "congestion";
  title: string;
  description: string;
  intersectionId: string | null;
  location: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  reportedAt: string;
  resolvedAt: string | null;
  affectedLanes: number;
  estimatedClearance: string | null;
}

export interface TrafficStats {
  totalVehicles: number;
  avgSpeed: number;
  activeIncidents: number;
  signalFaults: number;
  congestionLevel: number; // 0-100
  throughput: number; // vehicles/hour
  timestamp: string;
}

export interface HourlyData {
  hour: string;
  vehicles: number;
  avgSpeed: number;
  incidents: number;
}

export interface ZoneStats {
  zone: string;
  intersections: number;
  activeIncidents: number;
  avgCongestion: number;
  status: "normal" | "warning" | "critical";
}
