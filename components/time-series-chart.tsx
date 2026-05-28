"use client";

import { MOCK } from "@/lib/mock-data";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-[6px] border border-border-strong bg-surface-elevated p-3 shadow-[0_1px_3px_rgba(0,210,170,0.05)]">
      <div className="mb-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-500">
        {label}
      </div>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex items-center gap-2">
          <span className="font-mono text-xs text-zinc-400">
            {entry.dataKey === "concentration" ? "Sargasses" : entry.dataKey}:
          </span>
          <span className="font-mono text-sm tabular-nums text-zinc-100">
            {entry.value}
          </span>
          <span className="font-mono text-[10px] text-zinc-500">
            {entry.dataKey === "concentration" ? "t/km²" : entry.dataKey === "waterTemp" ? "°C" : "m/s"}
          </span>
        </div>
      ))}
    </div>
  );
}

export function TimeSeriesChart() {
  const data = MOCK.timeSeries;
  const alertThreshold = 100;
  const criticalThreshold = 400;

  return (
    <div className="rounded-[6px] border border-border bg-surface p-5">
      <div className="mb-4">
        <div className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
          Évolution 7 jours
        </div>
        <h3 className="mt-1 text-base font-medium text-zinc-100">
          Concentration sargasses — tendance
        </h3>
        <div className="mt-1 font-mono text-xs text-zinc-500">
          Données USF Optical Marine Imagery
        </div>
      </div>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
          >
            <defs>
              <linearGradient id="concentrationGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00d4aa" stopOpacity={0.25} />
                <stop offset="50%" stopColor="#f97316" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#00d4aa" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.04)"
              vertical={false}
            />

            <XAxis
              dataKey="date"
              stroke="#52525b"
              tick={{ fontSize: 11, fontFamily: "var(--font-geist-mono)" }}
              tickLine={false}
              axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
            />

            <YAxis
              stroke="#52525b"
              tick={{ fontSize: 11, fontFamily: "var(--font-geist-mono)" }}
              tickLine={false}
              axisLine={false}
              domain={[0, "auto"]}
              tickFormatter={(value) => `${value}`}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "rgba(255,255,255,0.08)", strokeWidth: 1 }}
            />

            <ReferenceLine
              y={alertThreshold}
              stroke="#f97316"
              strokeDasharray="4 4"
              strokeOpacity={0.5}
              label={{
                value: "Seuil alerte",
                position: "insideTopRight",
                fill: "#f97316",
                fontSize: 9,
                fontFamily: "var(--font-geist-mono)",
              }}
            />

            <ReferenceLine
              y={criticalThreshold}
              stroke="#ef4444"
              strokeDasharray="4 4"
              strokeOpacity={0.4}
              label={{
                value: "Critique",
                position: "insideTopRight",
                fill: "#ef4444",
                fontSize: 9,
                fontFamily: "var(--font-geist-mono)",
              }}
            />

            <Area
              type="monotone"
              dataKey="concentration"
              stroke="#00d4aa"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#concentrationGradient)"
              dot={false}
              activeDot={{
                r: 4,
                stroke: "#00d4aa",
                strokeWidth: 2,
                fill: "#0a0d0f",
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="h-0.5 w-4 bg-accent" />
            <span className="font-mono text-[10px] text-zinc-500">Concentration</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-px w-4 border-t border-dashed border-alert" />
            <span className="font-mono text-[10px] text-zinc-500">Seuils opérationnels</span>
          </div>
        </div>
        <div className="font-mono text-[10px] tabular-nums text-zinc-600">
          Moyenne: 143.7 t/km²
        </div>
      </div>
    </div>
  );
}
