import { MOCK } from "@/lib/mock-data";
import {
  ArrowUpRight,
  CircleNotch,
  Archive,
  Broadcast,
} from "@phosphor-icons/react";

function StatusBadge({ status }: { status: "live" | "pending" | "archived" }) {
  switch (status) {
    case "live":
      return (
        <div className="flex items-center gap-1.5">
          <Broadcast size={12} weight="fill" className="text-accent" />
          <span className="font-mono text-[10px] uppercase tracking-wider text-accent">
            Live
          </span>
        </div>
      );
    case "pending":
      return (
        <div className="flex items-center gap-1.5">
          <CircleNotch size={12} className="text-alert" />
          <span className="font-mono text-[10px] uppercase tracking-wider text-alert">
            Pending
          </span>
        </div>
      );
    case "archived":
      return (
        <div className="flex items-center gap-1.5">
          <Archive size={12} className="text-zinc-500" />
          <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
            Archived
          </span>
        </div>
      );
  }
}

export function NoaaDataTable() {
  return (
    <div className="rounded-[6px] border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border p-5">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
            Sources satellites
          </div>
          <h3 className="mt-1 text-base font-medium text-zinc-100">
            Données NOAA Sargassum Monitoring
          </h3>
        </div>
        <button className="flex items-center gap-1.5 rounded-[6px] border border-border bg-bg px-3 py-1.5 text-xs text-zinc-400 transition-colors hover:border-border-strong hover:text-zinc-200">
          <span className="font-mono text-[11px]">Exporter CSV</span>
          <ArrowUpRight size={12} />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-5 py-3 text-left font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                ID Passage
              </th>
              <th className="px-5 py-3 text-left font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                Satellite
              </th>
              <th className="px-5 py-3 text-left font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                Couverture
              </th>
              <th className="px-5 py-3 text-left font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                Index Sargasse
              </th>
              <th className="px-5 py-3 text-left font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                Timestamp
              </th>
              <th className="px-5 py-3 text-left font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                Statut
              </th>
            </tr>
          </thead>
          <tbody>
            {MOCK.noaaMonitoring.map((record, idx) => (
              <tr
                key={record.id}
                className={`group transition-colors hover:bg-zinc-800/30 ${
                  idx < MOCK.noaaMonitoring.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <td className="px-5 py-3">
                  <span className="font-mono text-xs tabular-nums text-zinc-300">
                    {record.id}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <span className="text-[13px] text-zinc-200">{record.satellite}</span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs tabular-nums text-zinc-300">
                      {record.coverage}
                    </span>
                    <div className="h-1 w-16 overflow-hidden rounded-full bg-zinc-800">
                      <div
                        className="h-full rounded-full bg-accent"
                        style={{ width: record.coverage }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`font-mono text-sm tabular-nums ${
                      record.sargassumIndex > 0.65
                        ? "text-alert"
                        : "text-zinc-300"
                    }`}
                  >
                    {record.sargassumIndex.toFixed(2)}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <span className="font-mono text-xs tabular-nums text-zinc-500">
                    {record.timestamp}
                  </span>
                </td>
                <td className="px-5 py-3">
              </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-border px-5 py-3">
        <div className="font-mono text-[10px] text-zinc-500">
          {MOCK.noaaMonitoring.length} enregistrements affichés — données mock (simulation)
        </div>
        <div className="flex items-center gap-1">
          <button className="rounded-[4px] border border-border bg-bg px-2 py-0.5 font-mono text-[10px] text-zinc-500 hover:text-zinc-300">
            Précédent
          </button>
          <button className="rounded-[4px] border border-border bg-bg px-2 py-0.5 font-mono text-[10px] text-zinc-500 hover:text-zinc-300">
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
}
