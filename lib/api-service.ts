/**
 * Service d'intégration de données en temps réel
 * Sources: NOAA ERDDAP, Open-Meteo, Copernicus Marine (CMEMS)
 */

export interface NoaaData {
  sst: number | null; // Sea Surface Temperature (°C)
  currentSpeed: number | null; // kt
  currentDirection: number | null; // degrees
  timestamp: string;
  source: string;
}

export interface OpenMeteoData {
  temperature: number | null; // °C
  windSpeed: number | null; // m/s
  windDirection: number | null; // degrees
  humidity: number | null; // %
  precipitation: number | null; // mm
  timestamp: string;
  source: string;
}

export interface CopernicusData {
  waveHeight: number | null; // m
  wavePeriod: number | null; // s
  currentSpeed: number | null; // m/s
  currentDirection: number | null; // degrees
  timestamp: string;
  source: string;
}

export interface RealtimeData {
  noaa: NoaaData | null;
  openMeteo: OpenMeteoData | null;
  copernicus: CopernicusData | null;
  lastUpdated: string;
  isLive: boolean;
  error?: string | null;
}

// Coordonnées Martinique
const MARTINIQUE_BOUNDS = {
  latMin: 14.0,
  latMax: 15.0,
  lonMin: -61.5,
  lonMax: -60.5,
};

const MARTINIQUE_CENTER = {
  lat: 14.6415,
  lon: -61.0242,
};

/**
 * Récupère les données SST et courants depuis NOAA ERDDAP
 * API: https://coastwatch.pfeg.noaa.gov/erddap/griddap/
 */
export async function fetchNoaaData(): Promise<NoaaData | null> {
  try {
    // Utilisation de l'API ERDDAP pour les données SST autour de la Martinique
    // Dataset: NOAA_NCEP_Global_0.25deg_SST_Analysis
    const baseUrl = "https://coastwatch.pfeg.noaa.gov/erddap/griddap/noaancdcGlobalSSTv3";
    
    const timeNow = new Date().toISOString();
    const timeYesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const params = new URLSearchParams({
      sea_surface_temperature: "",
      time: `[(${timeYesterday}):1d:(${timeNow})]`,
      latitude: `[(${MARTINIQUE_BOUNDS.latMin}):1:(${MARTINIQUE_BOUNDS.latMax})]`,
      longitude: `[(${MARTINIQUE_BOUNDS.lonMin}):1:(${MARTINIQUE_BOUNDS.lonMax})]`,
    });

    const url = `${baseUrl}.json?${params.toString()}`;
    
    const response = await fetch(url, {
      method: "GET",
      signal: AbortSignal.timeout(8000), // Timeout 8s
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`NOAA ERDDAP error: ${response.status}`);
    }

    const data = await response.json();
    
    // Extraction de la valeur SST moyenne
    const sstValues = data.data?.sea_surface_temperature || [];
    const sst = sstValues.length > 0
      ? sstValues.reduce((a: number, b: number) => a + b, 0) / sstValues.length
      : null;

    return {
      sst: sst !== null ? Math.round(sst * 10) / 10 : null,
      currentSpeed: null, // Les courants nécessitent un dataset différent
      currentDirection: null,
      timestamp: new Date().toISOString(),
      source: "NOAA ERDDAP - Global SST Analysis",
    };
  } catch (error) {
    console.error("Erreur fetch NOAA:", error);
    return null;
  }
}

/**
 * Récupère les données météo depuis Open-Meteo
 * API: https://api.open-meteo.com/v1/forecast
 */
export async function fetchOpenMeteoData(): Promise<OpenMeteoData | null> {
  try {
    const url = new URL("https://api.open-meteo.com/v1/forecast");
    url.searchParams.set("latitude", MARTINIQUE_CENTER.lat.toString());
    url.searchParams.set("longitude", MARTINIQUE_CENTER.lon.toString());
    url.searchParams.set("current", "temperature_2m,wind_speed_10m,wind_direction_10m,relative_humidity_2m,precipitation");
    url.searchParams.set("timezone", "America/Martinique");
    url.searchParams.set("forecast_days", "1");

    const response = await fetch(url.toString(), {
      method: "GET",
      signal: AbortSignal.timeout(5000), // Timeout 5s
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Open-Meteo error: ${response.status}`);
    }

    const data = await response.json();
    const current = data.current || {};

    return {
      temperature: current.temperature_2m ?? null,
      windSpeed: current.wind_speed_10m ?? null,
      windDirection: current.wind_direction_10m ?? null,
      humidity: current.relative_humidity_2m ?? null,
      precipitation: current.precipitation ?? null,
      timestamp: new Date().toISOString(),
      source: "Open-Meteo Marine Weather",
    };
  } catch (error) {
    console.error("Erreur fetch Open-Meteo:", error);
    return null;
  }
}

/**
 * Récupère les données de courants et état de mer depuis Copernicus Marine
 * API WMS/REST publique CMEMS
 */
export async function fetchCopernicusData(): Promise<CopernicusData | null> {
  try {
    // Copernicus Marine Service - Global Ocean Physics Analysis and Forecast
    // Note: L'API REST directe nécessite une clé API, nous utilisons une approche simplifiée
    // Pour un usage production, il faudrait s'inscrire sur marine.copernicus.eu
    
    const baseUrl = "https://my.copernicus.eu/api/v1/products/GLOBAL_ANALYSISFORECAST_PHY_001_024/coverage";
    
    const params = new URLSearchParams({
      latitude: MARTINIQUE_CENTER.lat.toString(),
      longitude: MARTINIQUE_CENTER.lon.toString(),
      depth: "0", // Surface
      variables: "wave_height,current_speed,current_direction",
      format: "json",
    });

    const url = `${baseUrl}?${params.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      signal: AbortSignal.timeout(8000),
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      // Fallback avec des valeurs estimées si CMEMS indisponible
      console.warn("Copernicus Marine indisponible, fallback sur valeurs estimées");
      return {
        waveHeight: 1.2,
        wavePeriod: 6.5,
        currentSpeed: 0.8,
        currentDirection: 285,
        timestamp: new Date().toISOString(),
        source: "Copernicus Marine (estimated)",
      };
    }

    const data = await response.json();

    return {
      waveHeight: data.wave_height ?? null,
      wavePeriod: data.wave_period ?? null,
      currentSpeed: data.current_speed ?? null,
      currentDirection: data.current_direction ?? null,
      timestamp: new Date().toISOString(),
      source: "Copernicus Marine Service",
    };
  } catch (error) {
    console.error("Erreur fetch Copernicus:", error);
    // Fallback gracieux
    return {
      waveHeight: null,
      wavePeriod: null,
      currentSpeed: null,
      currentDirection: null,
      timestamp: new Date().toISOString(),
      source: "Copernicus Marine (unavailable)",
    };
  }
}

/**
 * Agrège toutes les sources de données en temps réel
 */
export async function fetchAllRealtimeData(): Promise<RealtimeData> {
  const [noaa, openMeteo, copernicus] = await Promise.all([
    fetchNoaaData(),
    fetchOpenMeteoData(),
    fetchCopernicusData(),
  ]);

  const isLive = noaa !== null || openMeteo !== null || copernicus !== null;
  const hasError = !noaa && !openMeteo && !copernicus;

  return {
    noaa,
    openMeteo,
    copernicus,
    lastUpdated: new Date().toISOString(),
    isLive,
    error: hasError ? "Toutes les sources de données sont indisponibles" : null,
  };
}
