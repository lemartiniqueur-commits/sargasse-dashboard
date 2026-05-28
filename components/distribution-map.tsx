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
          <div className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
            Carte de distribution
          </div>
          <h3 className="mt-1 text-base font-medium text-zinc-100">
            Concentration sargasses — côte est
          </h3>
        </div>
        <LiveIndicator />
      </div>

      <div className="relative">
        <svg
          viewBox="0 0 200 420"
          className="h-auto w-full max-h-[480px]"
          aria-label="Carte de la Martinique avec zones de concentration de sargasses"
        >
          {/* Gradient de fond */}
          <defs>
            <radialGradient id="mapGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#111518" />
              <stop offset="100%" stopColor="#0a0d0f" />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Grille de coordonnées */}
          <g stroke="rgba(255,255,255,0.03)" strokeWidth="0.5">
            {[50, 100, 150].map((x) => (
              <line key={`v-${x}`} x1={x} y1="0" x2={x} y2="420" />
            ))}
            {[70, 140, 210, 280, 350].map((y) => (
              <line key={`h-${y}`} x1="0" y1={y} x2="200" y2={y} />
            ))}
          </g>

          {/* Île */}
          <path
            d={MARTINIQUE_PATH}
            fill="#1a2026"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="0.8"
          />

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
                key={commune.code}
                cx={pos.x}
                cy={pos.y}
                r={radius}
                fill={color}
                filter="url(#glow)"
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
              <g key={commune.code}>
                {/* Pulse ring for critical/alert */}
                {commune.status !== "normal" && (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="4"
                    fill="none"
                    stroke={dotColor}
                    strokeWidth="0.8"
                    opacity="0.6"
                    className="animate-pulse-ring"
                    style={{ transformOrigin: `${pos.x}px ${pos.y}px` }}
                  />
                )}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="3"
                  fill={dotColor}
                  stroke="#0a0d0f"
                  strokeWidth="1.5"
                />
                <text
                  x={pos.x + 6}
                  y={pos.y + 1}
                  fill="#a1a1aa"
                  fontSize="8"
                  fontFamily="var(--font-geist-mono)"
                  dominantBaseline="middle"
                >
                  {commune.name}
                </text>
              </g>
            );
          })}

          {/* Échelle */}
          <g transform="translate(15, 395)">
            <line x1="0" y1="0" x2="30" y2="0" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
            <line x1="0" y1="-2" x2="0" y2="2" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
            <line x1="30" y1="-2" x2="30" y2="2" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
            <text
              x="15"
              y="10"
              fill="#52525b"
              fontSize="7"
              fontFamily="var(--font-geist-mono)"
              textAnchor="middle"
            >
              ~25 km
Add components/distribution-map.tsx          </g>
        </svg>

        {/* Légende */}
        <div className="mt-4 flex flex-wrap gap-4 border-t border-border pt-3">
          {[
            { label: "Normal <100", color: "bg-accent" },
            { label: "Alerte 100-400", color: "bg-alert" },
            { label: "Critique >400", color: "bg-critical" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <div className={`h-2 w-2 rounded-full ${item.color}`} />
              <span className="font-mono text-[10px] text-zinc-500">
                {item.label}
              </span>
              <span className="font-mono text-[9px] text-zinc-600">t/km²</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
