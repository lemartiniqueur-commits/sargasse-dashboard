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
    <div className="rounded-[6px] border border-border-strong bg-surface-elevated p-3" style={{ boxShadow: "0 1px 3px rgba(0,210,170,0.05)" }}>
      <div className="mb-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-500">
        {label}
      </div>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex items-center gap-2">
          <span className="font-mono text-xs text-zinc-400">
            {entry.dataKey === "concentration" ? "Sargasses" : entry.dataKey}:
          </span>
          <span className="font-mono text-sm tabular-nums text-zinc-100">{entry.value}</span>
          <span className="font-mono text-[10px] text-zinc-500">
            {entry.dataKey === "concentration" ? "t/km\u00b2" : entry.dataKey === "waterTemp" ? "\u00b0C" : "m/s"}
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
      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted">Évolution 7 jours</p>
          <h3 className="text-sm font-semibold text-foreground mt-0.5">Concentration sargasses — tendance</h3>
          <p className="font-mono text-[10px] text-zinc-500 mt-0.5">Données USF Optical Marine Imagery</p>
        </div>
        <div className="text-right">
          <p className="font-mono text-[10px] text-zinc-500 uppercase">Moyenne</p>
          <p className="font-mono text-base font-bold tabular-nums text-foreground">143.7 t/km²</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="concentration-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00d4aa" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#00d4aa" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2d3d" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontFamily: "monospace", fontSize: 9, fill: "#64748b" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontFamily: "monospace", fontSize: 9, fill: "#64748b" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: "rgba(255,255,255,0.08)", strokeWidth: 1 }}
          />
          <ReferenceLine y={alertThreshold} stroke="#f97316" strokeDasharray="4 4" strokeWidth={1} />
          <ReferenceLine y={criticalThreshold} stroke="#ef4444" strokeDasharray="4 4" strokeWidth={1} />
          <Area
            type="monotone"
            dataKey="concentration"
            stroke="#00d4aa"
            strokeWidth={1.5}
            fill="url(#concentration-gradient)"
            dot={false}
            activeDot={{ r: 3, fill: "#00d4aa", strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="mt-3 flex items-center gap-4 border-t border-border pt-3">
        <div className="flex items-center gap-1.5">
          <div className="h-px w-4 bg-accent" />
          <span className="font-mono text-[10px] text-zinc-500">Concentration</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="h-px w-4 border-t border-dashed border-alert" />
            <span className="font-mono text-[10px] text-zinc-500">Alerte (100)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-px w-4 border-t border-dashed border-critical" />
            <span className="font-mono text-[10px] text-zinc-500">Critique (400)</span>
          </div>
        </div>
        <span className="ml-auto font-mono text-[10px] text-zinc-500">Seuils opérationnels</span>
      </div>
    </div>
  );
}
