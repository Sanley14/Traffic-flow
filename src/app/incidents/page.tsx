"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import { incidents as initialIncidents } from "@/lib/data";
import {
  getSeverityBg,
  getIncidentStatusBg,
  formatRelativeTime,
  formatDuration,
  getIncidentTypeIcon,
} from "@/lib/utils";
import type { Incident, IncidentSeverity } from "@/lib/types";

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);
  const [filter, setFilter] = useState<"all" | "active" | "responding" | "resolved">("all");
  const [severityFilter, setSeverityFilter] = useState<"all" | IncidentSeverity>("all");
  const [showNewForm, setShowNewForm] = useState(false);
  const [newIncident, setNewIncident] = useState({
    title: "",
    type: "accident" as Incident["type"],
    location: "",
    severity: "medium" as IncidentSeverity,
    description: "",
  });

  const filtered = incidents.filter((i) => {
    const matchesStatus = filter === "all" || i.status === filter;
    const matchesSeverity = severityFilter === "all" || i.severity === severityFilter;
    return matchesStatus && matchesSeverity;
  });

  const handleResolve = (id: string) => {
    setIncidents((prev) =>
      prev.map((i) =>
        i.id === id
          ? { ...i, status: "resolved", resolvedAt: new Date().toISOString() }
          : i
      )
    );
  };

  const handleRespond = (id: string) => {
    setIncidents((prev) =>
      prev.map((i) =>
        i.id === id && i.status === "active" ? { ...i, status: "responding" } : i
      )
    );
  };

  const handleSubmitNew = () => {
    if (!newIncident.title || !newIncident.location) return;
    const incident: Incident = {
      id: `inc-${Date.now()}`,
      ...newIncident,
      intersectionId: null,
      status: "active",
      reportedAt: new Date().toISOString(),
      resolvedAt: null,
      affectedLanes: 1,
      estimatedClearance: new Date(Date.now() + 60 * 60000).toISOString(),
    };
    setIncidents((prev) => [incident, ...prev]);
    setNewIncident({
      title: "",
      type: "accident",
      location: "",
      severity: "medium",
      description: "",
    });
    setShowNewForm(false);
  };

  const counts = {
    all: incidents.length,
    active: incidents.filter((i) => i.status === "active").length,
    responding: incidents.filter((i) => i.status === "responding").length,
    resolved: incidents.filter((i) => i.status === "resolved").length,
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header
        title="Incidents & Alerts"
        subtitle="Monitor and manage traffic incidents across the network"
      />

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total", count: counts.all, color: "text-white", bg: "bg-gray-800" },
            { label: "Active", count: counts.active, color: "text-red-400", bg: "bg-red-500/10" },
            { label: "Responding", count: counts.responding, color: "text-yellow-400", bg: "bg-yellow-500/10" },
            { label: "Resolved", count: counts.resolved, color: "text-green-400", bg: "bg-green-500/10" },
          ].map(({ label, count, color, bg }) => (
            <div key={label} className={`${bg} border border-gray-800 rounded-xl p-4 text-center`}>
              <div className={`text-2xl font-bold ${color}`}>{count}</div>
              <div className="text-gray-400 text-sm mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Filters + New Incident */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {(["all", "active", "responding", "resolved"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
                  filter === f
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:text-white border border-gray-700"
                }`}
              >
                {f} {f !== "all" && `(${counts[f]})`}
              </button>
            ))}
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as "all" | IncidentSeverity)}
              className="bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 px-3 py-1.5 focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <button
            onClick={() => setShowNewForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Report Incident
          </button>
        </div>

        {/* New Incident Form */}
        {showNewForm && (
          <div className="bg-gray-900 border border-blue-500/30 rounded-xl p-5">
            <h3 className="text-white font-semibold mb-4">Report New Incident</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-xs mb-1 block">Title *</label>
                <input
                  type="text"
                  value={newIncident.title}
                  onChange={(e) => setNewIncident((p) => ({ ...p, title: e.target.value }))}
                  placeholder="Brief incident title"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-200 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs mb-1 block">Location *</label>
                <input
                  type="text"
                  value={newIncident.location}
                  onChange={(e) => setNewIncident((p) => ({ ...p, location: e.target.value }))}
                  placeholder="Street address or intersection"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-200 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs mb-1 block">Type</label>
                <select
                  value={newIncident.type}
                  onChange={(e) => setNewIncident((p) => ({ ...p, type: e.target.value as Incident["type"] }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-200 text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="accident">Accident</option>
                  <option value="breakdown">Breakdown</option>
                  <option value="roadwork">Roadwork</option>
                  <option value="flooding">Flooding</option>
                  <option value="signal_fault">Signal Fault</option>
                  <option value="congestion">Congestion</option>
                </select>
              </div>
              <div>
                <label className="text-gray-400 text-xs mb-1 block">Severity</label>
                <select
                  value={newIncident.severity}
                  onChange={(e) => setNewIncident((p) => ({ ...p, severity: e.target.value as IncidentSeverity }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-200 text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="text-gray-400 text-xs mb-1 block">Description</label>
                <textarea
                  value={newIncident.description}
                  onChange={(e) => setNewIncident((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Detailed description of the incident..."
                  rows={3}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-200 text-sm focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleSubmitNew}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Submit Report
              </button>
              <button
                onClick={() => setShowNewForm(false)}
                className="bg-gray-700 hover:bg-gray-600 text-gray-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Incidents List */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-16 bg-gray-900 border border-gray-800 rounded-xl">
              <div className="text-5xl mb-3">✅</div>
              <p className="text-white font-medium">No incidents found</p>
              <p className="text-gray-400 text-sm mt-1">
                {filter !== "all" ? "Try changing your filters" : "All clear!"}
              </p>
            </div>
          ) : (
            filtered.map((incident) => (
              <div
                key={incident.id}
                className={`bg-gray-900 border rounded-xl p-5 transition-colors ${
                  incident.status === "resolved"
                    ? "border-gray-800 opacity-60"
                    : incident.severity === "critical"
                    ? "border-red-500/30"
                    : "border-gray-800"
                }`}
              >
                <div className="flex items-start gap-4">
                  <span className="text-2xl mt-0.5 flex-shrink-0">
                    {getIncidentTypeIcon(incident.type)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-white font-medium">
                            {incident.title}
                          </h3>
                          <span className={`text-xs px-2 py-0.5 rounded border ${getSeverityBg(incident.severity)}`}>
                            {incident.severity}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded border ${getIncidentStatusBg(incident.status)}`}>
                            {incident.status}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm mt-1">
                          📍 {incident.location}
                        </p>
                        {incident.description && (
                          <p className="text-gray-500 text-sm mt-1">
                            {incident.description}
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      {incident.status !== "resolved" && (
                        <div className="flex gap-2 flex-shrink-0">
                          {incident.status === "active" && (
                            <button
                              onClick={() => handleRespond(incident.id)}
                              className="text-xs bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1.5 rounded-lg transition-colors"
                            >
                              Respond
                            </button>
                          )}
                          <button
                            onClick={() => handleResolve(incident.id)}
                            className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg transition-colors"
                          >
                            Resolve
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-500">
                      <span>
                        Reported {formatRelativeTime(incident.reportedAt)}
                      </span>
                      {incident.affectedLanes > 0 && (
                        <span className="text-orange-400">
                          {incident.affectedLanes} lane
                          {incident.affectedLanes > 1 ? "s" : ""} affected
                        </span>
                      )}
                      {incident.estimatedClearance && incident.status !== "resolved" && (
                        <span className="text-blue-400">
                          ETA: {formatDuration(incident.estimatedClearance)}
                        </span>
                      )}
                      {incident.resolvedAt && (
                        <span className="text-green-400">
                          Resolved {formatRelativeTime(incident.resolvedAt)}
                        </span>
                      )}
                      <span className="capitalize bg-gray-800 px-2 py-0.5 rounded">
                        {incident.type.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
