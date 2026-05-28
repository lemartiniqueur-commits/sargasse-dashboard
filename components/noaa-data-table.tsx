"use client";

import { MOCK } from "@/lib/mock-data";
import { ArrowUpRight, CircleNotch, Archive, Broadcast } from "@phosphor-icons/react";

function StatusBadge({ status }: { status: "live" | "pending" | "archived" }) {
  switch (status) {
    case "live":
      return (
        <div className="flex items-center gap-1.5">
          <Broadcast size={12} weight="fill" className="text-accent" />
          <span className="font-mono text-[10px] uppercase tracking-wider text-accent">Live</span>
        </div>
      );
    case "pending":
      return (
        <div className="flex items-center gap-1.5">
          <CircleNotch size={12} className="text-alert" />
          <span className="font-mono text-[10px] uppercase tracking-wider text-alert">Pending</span>
        </div>
      );
    case "archived":
      return (
        <div className="flex items-center gap-1.5">
          <Archive size={12} className="text-zinc-500" />
          <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">Archived</span>
        </div>
      );
  }
}

const COLUMNS = [
  { key: "id", label: "ID Passage" },
  { key: "satellite", label: "Satellite" },
  { key: "coverage", label: "Couverture" },
  { key: "sargassumIndex", label: "Index Sargasse" },
  { key: "timestamp", label: "Timestamp" },
  { key: "status", label: "Statut" },
];

export function NoaaDataTable() {
  return (
    <div className="rounded-[6px] border border-border bg-surface">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted">Sources satellites</p>
          <h3 className="text-sm font-semibold text-foreground mt-0.5">Données NOAA Sargassum Monitoring</h3>
        </div>
        <button className="flex items-center gap-1 font-mono text-xs text-accent hover:text-accent/80 border border-border px-3 py-1.5 rounded-[4px] transition-colors">
          <ArrowUpRight size={12} />
          Exporter CSV
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-zinc-500"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {MOCK.noaaMonitoring.map((record, idx) => (
              <tr key={record.id} className={idx % 2 === 0 ? "bg-transparent" : "bg-surface-elevated/30"}>
                <td className="px-4 py-3 font-mono text-xs text-zinc-300">{record.id}</td>
                <td className="px-4 py-3 font-mono text-xs text-zinc-300">{record.satellite}</td>
                <td className="px-4 py-3 font-mono text-xs text-zinc-300">{record.coverage}</td>
                <td className="px-4 py-3 font-mono text-sm tabular-nums">
                  <span className={record.sargassumIndex > 0.65 ? "text-alert" : "text-zinc-300"}>
                    {record.sargassumIndex.toFixed(2)}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-zinc-500">{record.timestamp}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={record.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-border">
        <span className="font-mono text-[10px] text-zinc-500">
          {MOCK.noaaMonitoring.length} enregistrements affichés — données mock (simulation)
        </span>
        <div className="flex gap-2">
          <button className="font-mono text-xs text-zinc-400 hover:text-zinc-200 px-2 py-1 border border-border rounded-[4px] transition-colors">Précédent</button>
          <button className="font-mono text-xs text-zinc-400 hover:text-zinc-200 px-2 py-1 border border-border rounded-[4px] transition-colors">Suivant</button>
        </div>
      </div>
    </div>
  );
}
