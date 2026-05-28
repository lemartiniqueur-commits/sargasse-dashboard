/**
 * API Route Next.js pour l'agrégation des données temps réel
 * Cache: 15 minutes (revalidate)
 * Fallback automatique sur les mock data si les APIs externes sont indisponibles
 */

import { NextResponse } from "next/server";
import { fetchAllRealtimeData } from "@/lib/api-service";
import { calculateSargassumRiskIndex } from "@/lib/sargasse-index";
import { MOCK } from "@/lib/mock-data";

export interface AggregatedRealtimeResponse {
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

// Force dynamic rendering pour éviter le cache statique
export const dynamic = "force-dynamic";

// Cache de 15 minutes pour les données agrégées
export const revalidate = 900;

export async function GET() {
  try {
    // Récupération des données temps réel
    const realtimeData = await fetchAllRealtimeData();

    // Calcul de l'indice de risque sargasses
    const riskIndex = calculateSargassumRiskIndex(
      realtimeData.noaa,
      realtimeData.openMeteo,
      realtimeData.copernicus
    );

    // Construction de la réponse agrégée
    const response: AggregatedRealtimeResponse = {
      isLive: realtimeData.isLive && !realtimeData.error,
      dataSource: realtimeData.isLive && !realtimeData.error ? "live" : "simulation",
      lastUpdated: realtimeData.lastUpdated,
      sargassumIndex: {
        index: riskIndex.index,
        level: riskIndex.level,
        recommendation: riskIndex.recommendation,
      },
      weather: {
        temperature: realtimeData.openMeteo?.temperature ?? null,
        windSpeed: realtimeData.openMeteo?.windSpeed ?? null,
        windDirection: realtimeData.openMeteo?.windDirection ?? null,
        humidity: realtimeData.openMeteo?.humidity ?? null,
      },
      ocean: {
        sst: realtimeData.noaa?.sst ?? null,
        currentSpeed: realtimeData.noaa?.currentSpeed ?? realtimeData.copernicus?.currentSpeed ?? null,
        currentDirection: realtimeData.noaa?.currentDirection ?? realtimeData.copernicus?.currentDirection ?? null,
        waveHeight: realtimeData.copernicus?.waveHeight ?? null,
      },
      error: realtimeData.error,
    };

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600",
      },
    });
  } catch (error) {
    console.error("Erreur API realtime:", error);

    // Fallback gracieux sur les données mock
    // On retourne un indice de risque basé sur les données mock
    const fallbackRiskIndex = calculateSargassumRiskIndex(
      {
        sst: MOCK.metrics.seaTemp.value,
        currentSpeed: 0.8, // Valeur estimée en m/s
        currentDirection: 285,
        timestamp: MOCK.lastUpdated,
        source: "MOCK",
      },
      {
        temperature: 28,
        windSpeed: MOCK.metrics.windSpeed.value,
        windDirection: null,
        humidity: 75,
        precipitation: 0,
        timestamp: MOCK.lastUpdated,
        source: "MOCK",
      },
      null
    );

    const fallbackResponse: AggregatedRealtimeResponse = {
      isLive: false,
      dataSource: "simulation",
      lastUpdated: new Date().toISOString(),
      sargassumIndex: {
        index: fallbackRiskIndex.index,
        level: fallbackRiskIndex.level,
        recommendation: fallbackRiskIndex.recommendation,
      },
      weather: {
        temperature: 28,
        windSpeed: MOCK.metrics.windSpeed.value,
        windDirection: null,
        humidity: 75,
      },
      ocean: {
        sst: MOCK.metrics.seaTemp.value,
        currentSpeed: 0.8,
        currentDirection: 285,
        waveHeight: 1.2,
      },
      error: "Données temps réel indisponibles - mode simulation activé",
    };

    return NextResponse.json(fallbackResponse, {
      status: 200, // On retourne 200 même en fallback pour ne pas casser le frontend
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  }
}
