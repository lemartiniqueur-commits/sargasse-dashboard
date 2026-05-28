// Skeletons form-matching — reproduisent la shape exacte des composants finaux

export function MetricSkeleton() {
  return (
    <div className="rounded-[6px] border border-border bg-surface p-5">
      <div className="animate-skeleton h-3 w-20 rounded bg-zinc-800" />
      <div className="mt-3 flex items-baseline gap-2">
        <div className="animate-skeleton h-10 w-20 rounded bg-zinc-800 md:h-12" />
        <div className="animate-skeleton h-3 w-8 rounded bg-zinc-800" />
      </div>
      <div className="mt-2 animate-skeleton h-3 w-14 rounded bg-zinc-800" />
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="rounded-[6px] border border-border bg-surface p-5">
      <div className="animate-skeleton h-3 w-28 rounded bg-zinc-800" />
      <div className="mt-1 animate-skeleton h-4 w-48 rounded bg-zinc-800" />
      <div className="mt-6 flex h-[280px] items-end gap-2">
        {[65, 78, 85, 92, 105, 125, 140].map((h, i) => (
          <div
            key={i}
            className="animate-skeleton flex-1 rounded-t bg-zinc-800"
            style={{ height: `${h}px`, animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
    </div>
  );
}

export function MapSkeleton() {
  return (
    <div className="rounded-[6px] border border-border bg-surface p-5">
      <div className="animate-skeleton h-3 w-32 rounded bg-zinc-800" />
      <div className="mt-1 animate-skeleton h-4 w-52 rounded bg-zinc-800" />
      <div className="mt-4 flex h-[480px] items-center justify-center rounded-[6px] bg-zinc-900">
        <div className="animate-skeleton h-[380px] w-[150px] rounded-full bg-zinc-800" />
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="border-b border-border">
      <td className="px-5 py-3">
        <div className="animate-skeleton h-3 w-28 rounded bg-zinc-800" />
      </td>
      <td className="px-5 py-3">
        <div className="animate-skeleton h-3 w-16 rounded bg-zinc-800" />
      </td>
      <td className="px-5 py-3">
        <div className="animate-skeleton h-3 w-12 rounded bg-zinc-800" />
      </td>
      <td className="px-5 py-3">
Add components/skeleton-loaders.tsx      </td>
      <td className="px-5 py-3">
        <div className="animate-skeleton h-3 w-20 rounded bg-zinc-800" />
      </td>
      <td className="px-5 py-3">
        <div className="animate-skeleton h-3 w-10 rounded bg-zinc-800" />
      </td>
    </tr>
  );
}

export function AlertSkeleton() {
  return (
    <div className="rounded-[6px] border border-border border-l-2 border-l-zinc-700 bg-bg p-3">
      <div className="mb-2 flex items-center gap-2">
        <div className="animate-skeleton h-4 w-4 rounded bg-zinc-800" />
        <div className="animate-skeleton h-4 w-16 rounded bg-zinc-800" />
      </div>
      <div className="mb-1.5 animate-skeleton h-3 w-24 rounded bg-zinc-800" />
      <div className="animate-skeleton h-8 w-full rounded bg-zinc-800" />
    </div>
  );
}
