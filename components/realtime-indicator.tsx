"use client";

/**
 * Composant RealtimeIndicator
 * Affiche:
 * - Badge "LIVE" vert pulsant (ou "SIMULATION" orange)
 * - Dernière mise à jour timestamp
 * - Indice de Risque Sargasses avec jauge colorée
 * - Données météo clés (vent, température mer)
 */

import { useEffect, useState } from "react";
import { LiveIndicator } from "./live-indicator";

interface RealtimeData {
  isLive: boolean;
  dataSource: "live" | "simulation";
  lastUpdated: string;
  sargassumIndex: {
    index: number;
    level: "low" | "moderate" | "high" | "critical";
    recommendation: string;
  };
  weather: {
    temperature: number | null;
    windSpeed: number | null;
    windDirection: number | null;
    humidity: number | null;
  };
  ocean: {
    sst: number | null;
    currentSpeed: number | null;
    currentDirection: number | null;
    waveHeight: number | null;
  };
  error?: string | null;
}

interface RealtimeIndicatorProps {
  className?: string;
}

export function RealtimeIndicator({ className = "" }: RealtimeIndicatorProps) {
  const [data, setData] = useState<RealtimeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRealtimeData() {
      try {
        const response = await fetch("/api/realtime", {
          cache: "no-store", // Force fresh data
        });

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
        setError(result.error ?? null);
      } catch (err) {
        console.error("Erreur fetch realtime:", err);
        setError("Données indisponibles");
      } finally {
        setLoading(false);
      }
    }

    fetchRealtimeData();

    // Polling toutes les 60 secondes pour maintenir les données à jour
    const interval = setInterval(fetchRealtimeData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className={`flex items-center gap-4 ${className}`}>
        <div className="h-8 w-24 bg-surface-elevated rounded animate-skeleton" />
        <div className="h-8 w-32 bg-surface-elevated rounded animate-skeleton" />
      </div>
    );
  }

  const isLive = data?.isLive ?? false;
  const dataSource = data?.dataSource ?? "simulation";
  const lastUpdated = data?.lastUpdated
    ? new Date(data.lastUpdated).toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "America/Martinique",
      })
    : "--:--";

  const riskIndex = data?.sargassumIndex?.index ?? 0;
  const riskLevel = data?.sargassumIndex?.level ?? "low";

  // Couleurs dynamiques selon le niveau de risque
  const getRiskColor = () => {
    switch (riskLevel) {
      case "low":
        return "text-emerald-400";
      case "moderate":
        return "text-yellow-400";
      case "high":
        return "text-orange-400";
      case "critical":
        return "text-red-500";
    }
  };

  const getRiskGradient = () => {
    switch (riskLevel) {
      case "low":
        return "from-emerald-500 to-emerald-400";
      case "moderate":
        return "from-yellow-500 to-orange-400";
      case "high":
        return "from-orange-500 to-red-400";
      case "critical":
        return "from-red-600 to-red-500";
    }
  };

  const sst = data?.ocean?.sst;
  const windSpeed = data?.weather?.windSpeed;

  return (
    <div className={`flex flex-wrap items-center gap-4 ${className}`}>
      {/* Badge LIVE / SIMULATION */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-elevated rounded border border-border">
        {isLive ? (
          <>
            <div className="relative flex h-2.5 w-2.5">
              <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-400 font-semibold">
              LIVE
            </span>
          </>
        ) : (
          <>
            <div className="h-2.5 w-2.5 rounded-full bg-orange-400" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-orange-400 font-semibold">
              SIMULATION
            </span>
          </>
        )}
      </div>

      {/* Timestamp dernière mise à jour */}
      <div className="flex items-center gap-2 text-xs text-zinc-400">
        <span className="font-mono">MAJ:</span>
        <span className="font-mono text-zinc-300">{lastUpdated}</span>
        <span className="font-mono text-[10px] text-zinc-500">UTC-4</span>
      </div>

      {/* Indice de Risque Sargasses avec jauge */}
      <div className="flex items-center gap-3 px-3 py-2 bg-surface-elevated rounded border border-border">
        <span className="font-mono text-[10px] uppercase text-zinc-400">
          RISQUE SARGASSES
        </span>
        
        {/* Jauge circulaire simplifiée */}
        <div className="relative h-10 w-10">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
            {/* Cercle de fond */}
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke="#1f2937"
              strokeWidth="3"
            />
            {/* Cercle de progression */}
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke="url(#riskGradient)"
              strokeWidth="3"
              strokeDasharray={`${riskIndex}, 100`}
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="riskGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" className={riskLevel === "low" ? "stop-emerald-500" : riskLevel === "moderate" ? "stop-yellow-500" : riskLevel === "high" ? "stop-orange-500" : "stop-red-600"} style={{ stopColor: riskLevel === "low" ? "#10b981" : riskLevel === "moderate" ? "#eab308" : riskLevel === "high" ? "#f97316" : "#dc2626" }} />
                <stop offset="100%" className={riskLevel === "low" ? "stop-emerald-400" : riskLevel === "moderate" ? "stop-orange-400" : riskLevel === "high" ? "stop-red-400" : "stop-red-500"} style={{ stopColor: riskLevel === "low" ? "#34d399" : riskLevel === "moderate" ? "#fb923c" : riskLevel === "high" ? "#f87171" : "#ef4444" }} />
              </linearGradient>
            </defs>
          </svg>
          {/* Valeur au centre */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`font-mono text-xs font-bold ${getRiskColor()}`}>
              {riskIndex}
            </span>
          </div>
        </div>

        {/* Niveau texte */}
        <span className={`font-mono text-xs uppercase font-semibold ${getRiskColor()}`}>
          {riskLevel === "low" ? "Faible" : riskLevel === "moderate" ? "Modéré" : riskLevel === "high" ? "Élevé" : "Critique"}
        </span>
      </div>

      {/* Données météo clés */}
      <div className="flex items-center gap-4 px-3 py-2 bg-surface-elevated rounded border border-border">
        {/* Température mer */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-zinc-400">SST</span>
          <span className="font-mono text-sm text-zinc-200">
            {sst !== null ? `${sst.toFixed(1)}°C` : "--.-°C"}
          </span>
        </div>

        {/* Séparateur */}
        <div className="h-4 w-px bg-border" />

        {/* Vent */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-zinc-400">VENT</span>
          <span className="font-mono text-sm text-zinc-200">
            {windSpeed !== null ? `${windSpeed.toFixed(1)} m/s` : "--.- m/s"}
          </span>
        </div>
      </div>

      {/* Message d'erreur discret si présent */}
      {error && !isLive && (
        <div className="hidden xl:flex items-center gap-2 px-2 py-1 bg-orange-500/10 border border-orange-500/20 rounded">
          <span className="font-mono text-[10px] text-orange-400">
            {error}
          </span>
        </div>
      )}
    </div>
  );
}
