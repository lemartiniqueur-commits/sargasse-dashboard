"use client";

import {
  Compass,
  MapPin,
  WarningCircle,
  Clock,
  Globe,
  Gear,
  type Icon,
} from "@phosphor-icons/react";

const NAV_ITEMS: Array<{ icon: Icon; label: string; active: boolean }> = [
  { icon: Compass, label: "Vue globale", active: true },
  { icon: MapPin, label: "Cartographie", active: false },
  { icon: WarningCircle, label: "Alertes", active: false },
  { icon: Clock, label: "Historique", active: false },
  { icon: Globe, label: "Données NOAA", active: false },
  { icon: Gear, label: "Configuration", active: false },
];

export function SidebarNav() {
  return (
    <nav className="flex h-screen flex-col border-r border-border bg-surface p-4">
      {/* Brand */}
      <div className="mb-8 flex items-center gap-2 px-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-accent/15">
          <div className="h-2 w-2 rounded-none bg-accent animate-pulse-dot" />
        </div>
        <div>
          <div className="font-mono text-[11px] font-medium uppercase tracking-wider text-zinc-100">
            Sargasse
          </div>
          <div className="font-mono text-[9px] uppercase tracking-widest text-zinc-500">
            Monitor v2.4
          </div>
        </div>
      </div>

      {/* Navigation items */}
      <div className="flex flex-col gap-0.5">
        {NAV_ITEMS.map((item) => {
          const NavIcon = item.icon;
          return (
            <button
              key={item.label}
              className={`flex items-center gap-3 rounded-[6px] px-3 py-2.5 text-left transition-colors ${
                item.active
                  ? "bg-accent/10 text-accent"
                  : "text-zinc-400 hover:bg-surface-elevated hover:text-zinc-200"
              }`}
            >
              <NavIcon size={16} weight={item.active ? "fill" : "regular"} />
              <span className="font-mono text-xs">{item.label}</span>
              {item.active && (
                <span className="ml-auto h-1 w-1 bg-accent" />
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom section */}
      <div className="mt-auto border-t border-border pt-4">
        <div className="rounded-[6px] border border-border-strong bg-surface-elevated p-3">
          <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-500 mb-1">Station active</p>
          <p className="font-mono text-xs font-medium text-zinc-100">MQ-ATL-04</p>
          <p className="font-mono text-[10px] text-zinc-500 mt-0.5">14.64°N 61.02°W</p>
        </div>
      </div>
    </nav>
  );
}
