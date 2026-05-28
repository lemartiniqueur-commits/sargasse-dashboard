import { MOCK } from "@/lib/mock-data";
import { getSeverityColor } from "@/lib/utils";
import {
  WarningOctagon,
  WarningCircle,
  Info,
  MapPin,
} from "@phosphor-icons/react";
import { LiveIndicator } from "./live-indicator";

function SeverityIcon({ severity }: { severity: "critical" | "alert" | "info" }) {
  const iconClass = "h-4 w-4";
  switch (severity) {
    case "critical":
      return <WarningOctagon className={iconClass} weight="fill" />;
    case "alert":
      return <WarningCircle className={iconClass} weight="fill" />;
    case "info":
      return <Info className={iconClass} weight="fill" />;
  }
}

function SeverityLabel({ severity }: { severity: "critical" | "alert" | "info" }) {
  const colors = {
    critical: "text-critical bg-critical-muted",
    alert: "text-alert bg-alert-muted",
    info: "text-zinc-400 bg-zinc-800",
  };

  return (
    <span
      className={`inline-flex items-center rounded-[4px] px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider ${colors[severity]}`}
    >
      {severity === "critical" ? "CRITIQUE" : severity === "alert" ? "ALERTE" : "INFO"}
    </span>
  );
}

export function AlertsPanel() {
  const criticalCount = MOCK.alerts.filter((a) => a.severity === "critical").length;
  const alertCount = MOCK.alerts.filter((a) => a.severity === "alert").length;

  return (
    <div className="rounded-[6px] border border-border bg-surface flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-border">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted">Centre d&apos;alertes</p>
          <h3 className="text-sm font-semibold text-foreground mt-0.5">Alertes terrain</h3>
        </div>
        <div className="flex items-center gap-3">
          <LiveIndicator />
          <div className="flex gap-2">
            <div className="text-center">
              <div className="font-mono text-[9px] text-muted uppercase">Critiques</div>
              <div className="font-mono text-lg font-bold text-critical tabular-nums">{criticalCount}</div>
            </div>
            <div className="text-center">
              <div className="font-mono text-[9px] text-muted uppercase">Alertes</div>
              <div className="font-mono text-lg font-bold text-alert tabular-nums">{alertCount}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts list */}
      <div className="flex flex-col divide-y divide-border overflow-y-auto max-h-80">
        {MOCK.alerts.map((alert) => {
          const severityColor =
            alert.severity === "critical"
              ? "border-l-critical"
              : alert.severity === "alert"
              ? "border-l-alert"
              : "border-l-zinc-600";
          const iconColor =
            alert.severity === "critical"
              ? "text-critical"
              : alert.severity === "alert"
              ? "text-alert"
              : "text-zinc-400";
          return (
            <div
              key={alert.id}
              className={`flex gap-3 p-4 border-l-2 ${severityColor} hover:bg-surface-elevated transition-colors`}
            >
              <div className={`shrink-0 mt-0.5 ${iconColor}`}>
                <SeverityIcon severity={alert.severity} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <SeverityLabel severity={alert.severity} />
                    <span className="font-mono text-[10px] text-muted flex items-center gap-0.5">
                      <MapPin size={10} />
                      {alert.commune}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-zinc-500 shrink-0">{alert.timestamp}</span>
                </div>
                <p className="text-sm text-foreground leading-snug">{alert.message}</p>
                <p className="font-mono text-[10px] text-zinc-500 mt-1">Source: {alert.source}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border">
        <button className="font-mono text-xs text-accent hover:text-accent/80 transition-colors">
          Historique complet →
        </button>
      </div>
    </div>
  );
}
