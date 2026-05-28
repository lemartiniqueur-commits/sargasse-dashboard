// Client Component: animation CSS pulse pour indiquer le streaming temps réel

interface LiveIndicatorProps {
  label?: string;
  className?: string;
}

export function LiveIndicator({ label = "LIVE", className = "" }: LiveIndicatorProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative flex h-2 w-2">
        <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
        <span className="animate-pulse-dot relative inline-flex h-2 w-2 rounded-full bg-accent" />
      </div>
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
        {label}
      </span>
    </div>
  );
}
