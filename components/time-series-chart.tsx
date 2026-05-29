"use client";

import { useState } from 'react';

const SERIES = [
  {
    label: 'Sargasses (t/km²)',
    color: '#a3a832',
    data: [
      { date: '01/05', value: 12.4 },
      { date: '05/05', value: 18.7 },
      { date: '10/05', value: 24.1 },
      { date: '15/05', value: 31.6 },
      { date: '20/05', value: 28.3 },
      { date: '25/05', value: 35.9 },
      { date: '28/05', value: 41.2 },
    ],
  },
  {
    label: 'Temp. surface (°C)',
    color: '#e85d3a',
    data: [
      { date: '01/05', value: 28.1 },
      { date: '05/05', value: 28.6 },
      { date: '10/05', value: 29.2 },
      { date: '15/05', value: 29.8 },
      { date: '20/05', value: 30.1 },
      { date: '25/05', value: 29.5 },
      { date: '28/05', value: 30.4 },
    ],
  },
];

function normalize(values: number[]): number[] {
  const min = Math.min(...values);
  const max = Math.max(...values);
  return values.map((v) => (max === min ? 0.5 : (v - min) / (max - min)));
}

function buildPath(normalized: number[], w: number, h: number, pad: number): string {
  const points = normalized.map((n, i) => {
    const x = pad + (i / (normalized.length - 1)) * (w - 2 * pad);
    const y = pad + (1 - n) * (h - 2 * pad);
    return `${x},${y}`;
  });
  return `M ${points.join(' L ')}`;
}

function buildArea(normalized: number[], w: number, h: number, pad: number): string {
  const line = buildPath(normalized, w, h, pad);
  const lastX = pad + (w - 2 * pad);
  const firstX = pad;
  const baseY = pad + (h - 2 * pad);
  return `${line} L ${lastX},${baseY} L ${firstX},${baseY} Z`;
}

export function TimeSeriesChart() {
  const [active, setActive] = useState(0);
  const W = 560;
  const H = 200;
  const PAD = 24;

  return (
    <div className="rounded-[6px] border border-border bg-surface p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-mono text-[11px] font-semibold text-zinc-300 tracking-widest uppercase">
          Séries temporelles — 28 jours
        </h2>
        <div className="flex gap-2">
          {SERIES.map((s, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`font-mono text-[10px] px-2 py-0.5 border ${
                active === i
                  ? 'border-zinc-400 text-zinc-200'
                  : 'border-zinc-700 text-zinc-500'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-48"
        aria-label={`Graphique ${SERIES[active].label}`}
      >
        {/* Grid lines */}
        {[0.25, 0.5, 0.75, 1].map((t) => {
          const y = PAD + (1 - t) * (H - 2 * PAD);
          return (
            <line
              key={t}
              x1={PAD}
              y1={y}
              x2={W - PAD}
              y2={y}
              stroke="#3f3f46"
              strokeWidth="0.5"
              strokeDasharray="4 4"
            />
          );
        })}
        {/* Area fill */}
        <path
          d={buildArea(
            normalize(SERIES[active].data.map((d) => d.value)),
            W,
            H,
            PAD
          )}
          fill={SERIES[active].color}
          fillOpacity={0.12}
        />
        {/* Line */}
        <path
          d={buildPath(
            normalize(SERIES[active].data.map((d) => d.value)),
            W,
            H,
            PAD
          )}
          fill="none"
          stroke={SERIES[active].color}
          strokeWidth="1.5"
        />
        {/* Data points + labels */}
        {SERIES[active].data.map((d, i) => {
          const norm = normalize(SERIES[active].data.map((p) => p.value));
          const x = PAD + (i / (SERIES[active].data.length - 1)) * (W - 2 * PAD);
          const y = PAD + (1 - norm[i]) * (H - 2 * PAD);
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={3} fill={SERIES[active].color} />
              <text
                x={x}
                y={H - 6}
                textAnchor="middle"
                fontSize={8}
                fill="#71717a"
                fontFamily="monospace"
              >
                {d.date}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="mt-2 flex justify-between font-mono text-[9px] text-zinc-600">
        <span>Source: NOAA SARGASSUM WATCH SYSTEM</span>
        <span>Simulation mock — mai 2025</span>
      </div>
    </div>
  );
}
