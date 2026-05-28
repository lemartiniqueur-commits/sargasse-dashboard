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
    <div className="flex h-screen flex-col border-l border-border bg-surface">
      {/* Header */}
      <div className="border-b border-border p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
              Centre d'alertes
            </div>
            <h3 className="mt-1 text-base font-medium text-zinc-100">
              Alertes terrain
            </h3>
          </div>
          <LiveIndicator label="Streaming" />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-[6px] border border-border bg-bg p-3">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-critical animate-pulse-dot" />
              <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                Critiques
              </span>
            </div>
            <div className="mt-1 font-mono text-2xl font-light tabular-nums text-critical">
              {criticalCount}
            </div>
          </div>
          <div className="rounded-[6px] border border-border bg-bg p-3">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-alert" />
              <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                Alertes
              </span>
            </div>
            <div className="mt-1 font-mono text-2xl font-light tabular-nums text-alert">
              {alertCount}
            </div>
          </div>
        </div>
      </div>

      {/* Alerts list */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="flex flex-col gap-2">
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
                className={`rounded-[6px] border border-border border-l-2 ${severityColor} bg-bg p-3 transition-colors hover:bg-surface-elevated`}
              >
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className={iconColor}>
                      <SeverityIcon severity={alert.severity} />
                    </div>
                    <SeverityLabel severity={alert.severity} />
                  </div>
                  <span className="font-mono text-[10px] tabular-nums text-zinc-600">
                    {alert.timestamp}
                  </span>
                </div>

                <div className="mb-1.5 flex items-center gap-1.5">
                  <MapPin size={11} className="text-zinc-500" />
                  <span className="text-[13px] font-medium text-zinc-200">
                    {alert.commune}
                  </span>
Add components/alerts-panel.tsx
                <p className="text-[12px] leading-relaxed text-zinc-400">
                  {alert.message}
                </p>

                <div className="mt-2 font-mono text-[9px] text-zinc-600">
                  Source: {alert.source}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border p-4">
        <button className="w-full rounded-[6px] border border-border bg-bg py-2 text-[12px] font-medium text-zinc-400 transition-colors hover:border-border-strong hover:text-zinc-200">
          Historique complet →
        </button>
      </div>
    </div>
  );
}
