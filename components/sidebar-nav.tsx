"use client";

import {
  Compass,
  MapPin,
  WarningCircle,
  Clock,
  Globe,
  Gear,
} from "@phosphor-icons/react";

const NAV_ITEMS = [
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
          <div className="h-2 w-2 rounded-full bg-accent animate-pulse-dot" />
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
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              className={`flex items-center gap-3 rounded-[6px] px-3 py-2 text-left transition-colors ${
                item.active
                  ? "bg-accent/10 text-accent"
                  : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
              }`}
            >
              <Icon
                size={18}
                weight={item.active ? "fill" : "regular"}
                strokeWidth={1.5}
              />
              <span className="text-[13px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Bottom section */}
      <div className="mt-auto border-t border-border pt-4">
        <div className="rounded-[6px] border border-border bg-bg p-3">
          <div className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
            Station active
          </div>
          <div className="mt-1 font-mono text-[11px] text-zinc-300">
            MQ-ATL-04
          </div>
          <div className="mt-0.5 font-mono text-[10px] text-zinc-600">
            14.64°N 61.02°W
          </div>
        </div>
      </div>
    </nav>
  );
}
