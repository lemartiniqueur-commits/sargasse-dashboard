"use client";

import { MOCK } from "@/lib/mock-data";
import { getStatusColor, getStatusTextColor } from "@/lib/utils";
import { CaretUp, CaretDown, Minus } from "@phosphor-icons/react";

function TrendIcon({ direction }: { direction: "up" | "down" | "stable" }) {
  switch (direction) {
    case "up":
      return <CaretUp className="h-3 w-3" weight="fill" />;
    case "down":
      return <CaretDown className="h-3 w-3" weight="fill" />;
    case "stable":
      return <Minus className="h-3 w-3" weight="bold" />;
  }
}

export function CommuneStatus() {
  const sortedCommunes = [...MOCK.communes].sort((a, b) => {
    const order = { critical: 0, alert: 1, normal: 2 };
    return order[a.status] - order[b.status];
  });

  return (
    <div className="rounded-[6px] border border-border bg-surface p-5">
      <div className="mb-4">
        <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Statut par commune</p>
        <h3 className="mt-1 text-base font-medium text-zinc-100">Communes — côte atlantique</h3>
      </div>

      <div className="flex flex-col gap-1.5">
        {sortedCommunes.map((commune) => {
          const statusColor = getStatusColor(commune.status);
          const textColor = getStatusTextColor(commune.status);
          const trendColor =
            commune.trend === "up"
              ? commune.status === "normal"
                ? "text-alert"
                : textColor
              : commune.trend === "down"
              ? "text-accent"
              : "text-zinc-500";
          return (
            <div
              key={commune.id}
              className={`flex items-center justify-between rounded-[4px] border ${statusColor} px-3 py-2`}
            >
              <div className="flex items-center gap-2">
                {commune.status === "critical" && (
                  <span className="h-1.5 w-1.5 rounded-none bg-critical animate-pulse" />
                )}
                <div>
                  <p className="text-sm font-medium text-zinc-100">{commune.name}</p>
                  <p className="font-mono text-[10px] text-zinc-500">
                    {commune.code} · {commune.lastUpdate}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className={`font-mono text-base font-bold tabular-nums ${textColor}`}>
                  {commune.concentration}
                </div>
                <div className={`flex items-center justify-end gap-0.5 font-mono text-[10px] ${trendColor}`}>
                  <TrendIcon direction={commune.trend} />
                  <span>t/km²</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
