import { MOCK } from "@/lib/mock-data";
import { getStatusColor, getStatusTextColor } from "@/lib/utils";
import {
  CaretUp,
  CaretDown,
  Minus,
} from "@phosphor-icons/react";

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
        <div className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
          Statut par commune
        </div>
        <h3 className="mt-1 text-base font-medium text-zinc-100">
          Communes — côte atlantique
        </h3>
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
              key={commune.code}
              className="group flex items-center justify-between rounded-[6px] border border-border bg-bg px-3 py-2.5 transition-colors hover:border-border-strong"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className={`h-2 w-2 rounded-full ${statusColor}`} />
                  {commune.status === "critical" && (
                    <div
                      className={`absolute inset-0 h-2 w-2 rounded-full ${statusColor} animate-pulse-ring`}
                    />
                  )}
                </div>
                <div>
                  <div className="text-[13px] font-medium text-zinc-200 group-hover:text-zinc-50">
                    {commune.name}
                  </div>
              {commune.code} · {commune.lastUpdate}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className={`font-mono text-sm tabular-nums ${textColor}`}>
                    {commune.concentration}
                  </div>
                  <div className="font-mono text-[9px] text-zinc-600">t/km²</div>
                </div>
                <div className={`flex items-center gap-0.5 ${trendColor}`}>
                  <TrendIcon direction={commune.trend} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
