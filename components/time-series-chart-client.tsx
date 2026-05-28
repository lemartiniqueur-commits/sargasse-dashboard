"use client";

import dynamic from 'next/dynamic';

const TimeSeriesChart = dynamic(
  () => import('@/components/time-series-chart').then((m) => m.TimeSeriesChart),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-[6px] border border-border bg-surface p-4 h-64 flex items-center justify-center">
        <span className="font-mono text-[11px] text-zinc-500">Chargement du graphique...</span>
      </div>
    ),
  }
);

export { TimeSeriesChart };
