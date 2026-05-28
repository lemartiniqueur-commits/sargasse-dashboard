import { MOCK, type Metric } from "@/lib/mock-data";
import { getStatusTextColor } from "@/lib/utils";
import {
  CaretUp,
  CaretDown,
  Minus,
} from "@phosphor-icons/react";
import { LiveIndicator } from "./live-indicator";

function TrendIcon({ direction }: { direction: Metric["trendDirection"] }) {
  const iconClass = "h-3.5 w-3.5";
  switch (direction) {
    case "up":
      return <CaretUp className={iconClass} weight="fill" />;
    case "down":
      return <CaretDown className={iconClass} weight="fill" />;
    case "stable":
      return <Minus className={iconClass} weight="bold" />;
  }
}

interface MetricCardProps {
  label: string;
  metric: Metric;
}

function MetricCard({ label, metric }: MetricCardProps) {
  const statusColor = getStatusTextColor(metric.status);
  const trendColor =
    metric.trendDirection === "up"
      ? metric.status === "normal"
        ? "text-alert"
        : statusColor
      : metric.trendDirection === "down"
      ? "text-accent"
      : "text-zinc-500";

  return (
    <div className="rounded-[6px] border border-border bg-surface p-5">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
          {label}
        </span>
        {metric.status !== "normal" && (
          <span
            className={`font-mono text-[9px] uppercase tracking-wider ${statusColor}`}
          >
            {metric.status === "critical" ? "CRIT" : "ALERT"}
          </span>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="font-mono text-4xl font-light tabular-nums text-zinc-50 md:text-5xl">
          {metric.value.toFixed(metric.unit === "kt" || metric.unit === "m/s" || metric.unit === "°C" ? 1 : 0)}
        </span>
        <span className="font-mono text-xs text-zinc-500">{metric.unit}</span>
      </div>

      <div className={`mt-2 flex items-center gap-1 ${trendColor}`}>
        <TrendIcon direction={metric.trendDirection} />
        <span className="font-mono text-xs tabular-nums">{metric.trend}</span>
      </div>
    </div>
  );
}

export function MetricsHeader() {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
            Métriques principales
          </div>
          <h2 className="mt-1 text-lg font-medium text-zinc-100">
            Vue temps réel — Côte atlantique
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <LiveIndicator />
          <div className="text-right">
            <div className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
              Dernière MAJ
            </div>
            <div className="font-mono text-xs tabular-nums text-zinc-400">
              {MOCK.lastUpdatedDisplay}
            </div>
          </div>
Add components/metrics-header.tsx      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard
          label="Concentration sargasses"
          metric={MOCK.metrics.sargassumConcentration}
        />
        <MetricCard
          label="Température eau"
          metric={MOCK.metrics.waterTemperature}
        />
        <MetricCard
          label="Courant marin"
          metric={MOCK.metrics.currentSpeed}
        />
        <MetricCard
          label="Vent"
          metric={MOCK.metrics.windSpeed}
        />
      </div>
    </div>
  );
}
