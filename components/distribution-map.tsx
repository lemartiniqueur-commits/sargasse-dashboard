import { MOCK } from "@/lib/mock-data";
import { getStatusColor } from "@/lib/utils";
import { LiveIndicator } from "./live-indicator";

// SVG path stylisé de la Martinique (approximation reconnaissable)
const MARTINIQUE_PATH = `
  M 105 30
  C 118 28, 128 35, 135 48
  L 142 70
  C 148 88, 152 108, 150 130
  L 148 165
  C 146 188, 148 210, 152 232
  L 155 260
  C 156 285, 152 308, 144 332
  L 130 358
  C 118 378, 102 388, 88 382
  L 70 368
  C 55 355, 48 335, 45 312
  L 42 280
  C 40 255, 44 228, 50 205
  L 55 175
  C 58 152, 54 128, 48 108
  L 45 80
  C 48 58, 58 42, 72 32
  C 82 26, 95 28, 105 30
  Z
`;

// Positions SVG des communes (coordonnées approximatives sur le viewBox 0 0 200 420)
const COMMUNE_POSITIONS: Record<string, { x: number; y: number }> = {
  "Trinité": { x: 138, y: 95 },
  "Le Robert": { x: 142, y: 155 },
  "Le François": { x: 145, y: 210 },
  "Le Marin": { x: 125, y: 335 },
  "Sainte-Anne": { x: 108, y: 365 },
  "Fort-de-France": { x: 62, y: 225 },
  "Le Lamentin": { x: 85, y: 210 },
};

export function DistributionMap() {
  return (
    <div className="rounded-[6px] border border-border bg-surface p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-mono text-muted uppercase tracking-widest">Carte de distribution</p>
          <h3 className="text-sm font-semibold text-foreground mt-0.5">Concentration sargasses — côte est</h3>
        </div>
        <LiveIndicator />
      </div>

      <div className="relative w-full" style={{ paddingBottom: "210%" }}>
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 200 420"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Gradient de fond */}
          <defs>
            <radialGradient id="oceangradient" cx="50%" cy="50%" r="70%">
              <stop offset="0%" stopColor="#0a1628" />
              <stop offset="100%" stopColor="#060d1a" />
            </radialGradient>
          </defs>
          <rect width="200" height="420" fill="url(#oceangradient)" />

          {/* Grille de coordonnées */}
          {[50, 100, 150].map((x) => (
            <line key={x} x1={x} y1={0} x2={x} y2={420} stroke="#1a2840" strokeWidth="0.5" />
          ))}
          {[70, 140, 210, 280, 350].map((y) => (
            <line key={y} x1={0} y1={y} x2={200} y2={y} stroke="#1a2840" strokeWidth="0.5" />
          ))}

          {/* Île */}
          <path d={MARTINIQUE_PATH} fill="#1e3a2f" stroke="#2d5a42" strokeWidth="1" />

          {/* Zones de concentration (halos) */}
          {MOCK.communes.map((commune) => {
            const pos = COMMUNE_POSITIONS[commune.name];
            if (!pos) return null;
            const radius = Math.max(8, Math.min(35, commune.concentration / 15));
            const color =
              commune.status === "critical"
                ? "rgba(239, 68, 68, 0.35)"
                : commune.status === "alert"
                ? "rgba(249, 115, 22, 0.3)"
                : "rgba(0, 212, 170, 0.15)";
            return (
              <circle
                key={`halo-${commune.name}`}
                cx={pos.x}
                cy={pos.y}
                r={radius}
                fill={color}
                stroke="none"
              />
            );
          })}

          {/* Marqueurs de communes */}
          {MOCK.communes.map((commune) => {
            const pos = COMMUNE_POSITIONS[commune.name];
            if (!pos) return null;
            const dotColor =
              commune.status === "critical"
                ? "#ef4444"
                : commune.status === "alert"
                ? "#f97316"
                : "#00d4aa";
            return (
              <g key={commune.name}>
                {/* Pulse ring for critical/alert */}
                {commune.status !== "normal" && (
                  <circle cx={pos.x} cy={pos.y} r={6} fill="none" stroke={dotColor} strokeWidth="1" opacity="0.5" />
                )}
                <circle cx={pos.x} cy={pos.y} r={3} fill={dotColor} />
                <text
                  x={pos.x + 5}
                  y={pos.y + 4}
                  fontSize="6"
                  fill="#94a3b8"
                  fontFamily="monospace"
                >
                  {commune.name}
                </text>
              </g>
            );
          })}

          {/* Échelle */}
          <line x1={10} y1={405} x2={35} y2={405} stroke="#475569" strokeWidth="1" />
          <text x={10} y={413} fontSize="5" fill="#475569" fontFamily="monospace">~25 km</text>
        </svg>
      </div>

      {/* Légende */}
      <div className="mt-4 flex flex-wrap gap-4 border-t border-border pt-3">
        {[
          { label: "Normal <100", color: "bg-accent" },
          { label: "Alerte 100-400", color: "bg-alert" },
          { label: "Critique >400", color: "bg-critical" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className={`w-2 h-2 ${item.color}`} />
            <span className="text-xs font-mono text-muted">
              {item.label} <span className="text-foreground/40">t/km²</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
