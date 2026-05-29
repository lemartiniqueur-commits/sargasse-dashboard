"use client";

import { MOCK, type Metric } from "@/lib/mock-data";
import { getStatusTextColor } from "@/lib/utils";
import { CaretUp, CaretDown, Minus } from "@phosphor-icons/react";
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
    <div className="rounded-[6px] border border-border bg-surface p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
          {label}
        </span>
        {metric.status !== "normal" && (
          <span className={`font-mono text-[9px] font-bold ${statusColor}`}>
            {metric.status === "critical" ? "CRIT" : "ALERT"}
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-1">
        <span className={`font-mono text-2xl font-bold tabular-nums ${statusColor}`}>
          {metric.value.toFixed(
            metric.unit === "kt" || metric.unit === "m/s" || metric.unit === "\u00b0C" ? 1 : 0
          )}
        </span>
        <span className="font-mono text-xs text-zinc-500">{metric.unit}</span>
      </div>

      <div className={`flex items-center gap-1 font-mono text-xs ${trendColor}`}>
        <TrendIcon direction={metric.trendDirection} />
        <span>{metric.trend}</span>
      </div>
    </div>
  );
}

export function MetricsHeader() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-mono text-muted uppercase tracking-widest">Métriques principales</p>
          <h2 className="text-sm font-semibold text-foreground mt-0.5">Vue temps réel — Côte atlantique</h2>
        </div>
        <div className="flex items-center gap-3">
          <LiveIndicator />
          <div className="text-right">
            <p className="font-mono text-[10px] text-zinc-500 uppercase">Dernière MAJ</p>
            <p className="font-mono text-xs text-foreground">{MOCK.lastUpdatedDisplay}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <MetricCard label="Sargasses" metric={MOCK.metrics.sargasseIndex} />
        <MetricCard label="Temp. mer" metric={MOCK.metrics.seaTemp} />
        <MetricCard label="Houle" metric={MOCK.metrics.swellHeight} />
        <MetricCard label="Vent" metric={MOCK.metrics.windSpeed} />
        <MetricCard label="UV" metric={MOCK.metrics.uvIndex} />
        <MetricCard label="Qualité air" metric={MOCK.metrics.airQuality} />
      </div>
    </div>
  );
}
