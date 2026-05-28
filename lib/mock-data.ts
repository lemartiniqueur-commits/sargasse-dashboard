// Données mock réalistes — basées sur les seuils opérationnels réels de monitoring
// des sargasses en Martinique (seuil alerte: 100 t/km², critique: 400 t/km²)

export interface Metric {
  value: number;
  unit: string;
  trend: string;
  trendDirection: "up" | "down" | "stable";
  status: "normal" | "alert" | "critical";
}

export interface Commune {
  id: string;
  name: string;
  code: string;
  coordinates: { lat: number; lon: number };
  concentration: number;
  status: "normal" | "alert" | "critical";
  lastUpdate: string;
  trend: "up" | "down" | "stable";
}

export interface TimeSeriesPoint {
  date: string;
  concentration: number;
  waterTemp: number;
  wind: number;
}

export interface NoaaRecord {
  id: string;
  satellite: string;
  coverage: string;
  timestamp: string;
  status: "live" | "pending" | "archived";
  sargassumIndex: number;
}

export interface Alert {
  id: string;
  severity: "critical" | "alert" | "info";
  commune: string;
  message: string;
  timestamp: string;
  source: string;
}

export const MOCK = {
  lastUpdated: "2026-05-28T09:42:00Z",
  lastUpdatedDisplay: "28/05 09:42 UTC",
  location: {
    name: "Martinique",
    lat: 14.64,
    lon: -61.02,
  },

  metrics: {
    sargasseIndex: {
      value: 72,
      unit: "/100",
      trend: "+8%",
      trendDirection: "up" as const,
      status: "high" as const,
    },
    seaTemp: {
      value: 28.4,
      unit: "°C",
      trend: "+0.2°C",
      trendDirection: "up" as const,
      status: "normal" as const,
    },
    swellHeight: {
      value: 1.2,
      unit: "m",
      trend: "+0.1m",
      trendDirection: "stable" as const,
      status: "normal" as const,
    },
    windSpeed: {
      value: 6.2,
      unit: "m/s",
      trend: "NE 14°",
      trendDirection: "stable" as const,
      status: "normal" as const,
    },
    uvIndex: {
      value: 9,
      unit: "",
      trend: "Élevé",
      trendDirection: "stable" as const,
      status: "alert" as const,
    },
    airQuality: {
      value: 42,
      unit: "AQI",
      trend: "-3",
      trendDirection: "down" as const,
      status: "normal" as const,
    },
  } satisfies Record<string, Metric>,

  communes: [
    {
      id: "97230",
      name: "Trinité",
      code: "97230",
      coordinates: { lat: 14.78, lon: -60.96 },
      concentration: 512,
      status: "critical" as const,
      lastUpdate: "28/05 09:00",
      trend: "up" as const,
    },
    {
      id: "97212",
      name: "Le Robert",
      code: "97212",
      coordinates: { lat: 14.68, lon: -60.93 },
      concentration: 245,
      status: "alert" as const,
      lastUpdate: "28/05 08:15",
      trend: "up" as const,
    },
    {
      id: "97240",
      name: "Le François",
      code: "97240",
      coordinates: { lat: 14.61, lon: -60.90 },
      concentration: 178,
      status: "alert" as const,
      lastUpdate: "28/05 08:45",
      trend: "up" as const,
    },
    {
      id: "97290",
      name: "Le Marin",
      code: "97290",
      coordinates: { lat: 14.47, lon: -60.87 },
      concentration: 42,
      status: "normal" as const,
      lastUpdate: "28/05 08:30",
      trend: "stable" as const,
    },
    {
      id: "97227",
      name: "Sainte-Anne",
      code: "97227",
      coordinates: { lat: 14.43, lon: -60.89 },
      concentration: 15,
      status: "normal" as const,
      lastUpdate: "28/05 08:20",
      trend: "down" as const,
    },
    {
      id: "97200",
      name: "Fort-de-France",
      code: "97200",
      coordinates: { lat: 14.60, lon: -61.07 },
      concentration: 8,
      status: "normal" as const,
      lastUpdate: "28/05 09:10",
      trend: "stable" as const,
    },
    {
      id: "97232",
      name: "Le Lamentin",
      code: "97232",
      coordinates: { lat: 14.61, lon: -61.00 },
      concentration: 22,
      status: "normal" as const,
      lastUpdate: "28/05 08:55",
      trend: "stable" as const,
    },
  ] satisfies Commune[],

  timeSeries: [
    { date: "22/05", concentration: 85, waterTemp: 27.8, wind: 5.1 },
    { date: "23/05", concentration: 102, waterTemp: 27.9, wind: 4.8 },
    { date: "24/05", concentration: 134, waterTemp: 28.1, wind: 5.6 },
    { date: "25/05", concentration: 156, waterTemp: 28.0, wind: 6.0 },
    { date: "26/05", concentration: 168, waterTemp: 28.2, wind: 6.3 },
    { date: "27/05", concentration: 174, waterTemp: 28.3, wind: 5.9 },
    { date: "28/05", concentration: 187, waterTemp: 28.4, wind: 6.2 },
  ] satisfies TimeSeriesPoint[],

  noaaMonitoring: [
    {
      id: "NOAA-2026-0528-001",
      satellite: "GOES-18",
      coverage: "98.2%",
      timestamp: "28/05 09:00",
      status: "live" as const,
      sargassumIndex: 0.72,
    },
    {
      id: "NOAA-2026-0528-002",
      satellite: "GOES-16",
      coverage: "94.8%",
      timestamp: "28/05 08:45",
      status: "live" as const,
      sargassumIndex: 0.68,
    },
    {
      id: "NOAA-2026-0528-003",
      satellite: "Suomi NPP",
      coverage: "87.1%",
      timestamp: "28/05 08:15",
      status: "pending" as const,
      sargassumIndex: 0.61,
    },
    {
      id: "NOAA-2026-0528-004",
      satellite: "Sentinel-2",
      coverage: "72.4%",
      timestamp: "28/05 07:30",
      status: "archived" as const,
      sargassumIndex: 0.58,
    },
    {
      id: "NOAA-2026-0527-012",
      satellite: "GOES-18",
      coverage: "99.1%",
      timestamp: "27/05 22:00",
      status: "archived" as const,
      sargassumIndex: 0.54,
    },
  ] satisfies NoaaRecord[],

  alerts: [
    {
      id: "ALT-2026-0528-001",
      severity: "critical" as const,
      commune: "Trinité",
      message: "Concentration critique détectée — 512 t/km² — intervention terrain recommandée",
      timestamp: "09:00",
      source: "GOES-18 / USF",
    },
    {
      id: "ALT-2026-0528-002",
      severity: "alert" as const,
      commune: "Le Robert",
      message: "Progression rapide +18% en 24h — dérive vers la côte est confirmée",
      timestamp: "08:15",
      source: "GOES-16 / Sargassum Early Warning",
    },
    {
      id: "ALT-2026-0528-003",
      severity: "alert" as const,
      commune: "Le François",
      message: "Détection de banc dense en approche — ETA 4-6h",
      timestamp: "08:45",
      source: "Sentinel-2 / CMEMS",
    },
    {
      id: "ALT-2026-0528-004",
      severity: "info" as const,
      commune: "Sainte-Anne",
      message: "Diminution observée — opérations de nettoyage en cours",
      timestamp: "08:20",
      source: "Rapport terrain",
    },
    {
      id: "ALT-2026-0528-005",
      severity: "info" as const,
      commune: "Le Marin",
      message: "Situation stable — seuils opérationnels non atteints",
      timestamp: "08:30",
      source: "Monitoring automatique",
    },
  ] satisfies Alert[],
};
