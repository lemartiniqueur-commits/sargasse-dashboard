/**
 * Service d'intégration de données en temps réel
 * Sources: NOAA ERDDAP, Open-Meteo, OpenWeatherMap, Copernicus Marine
 */

export interface NoaaData {
  sst: number | null;
  currentSpeed: number | null;
  currentDirection: number | null;
  timestamp: string;
  source: string;
}

export interface OpenMeteoData {
  temperature: number | null;
  windSpeed: number | null;
  windDirection: number | null;
  humidity: number | null;
  precipitation: number | null;
  timestamp: string;
  source: string;
}

export interface CopernicusData {
  waveHeight: number | null;
  wavePeriod: number | null;
  currentSpeed: number | null;
  currentDirection: number | null;
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

// Coordonnées Le François, Martinique
const MARTINIQUE_CENTER = {
  lat: 14.6415,
  lon: -61.0242,
};

/**
 * Récupère les données météo depuis OpenWeatherMap (clé API requise)
 * Priorité 1 : données météo locales précises
 */
export async function fetchOpenWeatherData(): Promise<OpenMeteoData | null> {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) {
      console.warn('OPENWEATHER_API_KEY non définie, fallback sur Open-Meteo');
      return null;
    }
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${MARTINIQUE_CENTER.lat}&lon=${MARTINIQUE_CENTER.lon}&appid=${apiKey}&units=metric&lang=fr`;
    const response = await fetch(url, {
      signal: AbortSignal.timeout(6000),
      next: { revalidate: 900 },
    });
    if (!response.ok) {
      throw new Error(`OpenWeatherMap error: ${response.status}`);
    }
    const data = await response.json();
    return {
      temperature: data.main?.temp ?? null,
      windSpeed: data.wind?.speed ?? null,
      windDirection: data.wind?.deg ?? null,
      humidity: data.main?.humidity ?? null,
      precipitation: data.rain?.['1h'] ?? 0,
      timestamp: new Date().toISOString(),
      source: 'OpenWeatherMap',
    };
  } catch (error) {
    console.error('Erreur fetch OpenWeatherMap:', error);
    return null;
  }
}

/**
 * Récupère les données météo depuis Open-Meteo (gratuit, sans clé)
 * Priorité 2 : fallback si OpenWeatherMap indisponible
 */
export async function fetchOpenMeteoData(): Promise<OpenMeteoData | null> {
  try {
    const url = new URL('https://api.open-meteo.com/v1/forecast');
    url.searchParams.set('latitude', MARTINIQUE_CENTER.lat.toString());
    url.searchParams.set('longitude', MARTINIQUE_CENTER.lon.toString());
    url.searchParams.set('current', 'temperature_2m,wind_speed_10m,wind_direction_10m,relative_humidity_2m,precipitation');
    url.searchParams.set('timezone', 'America/Martinique');
    url.searchParams.set('forecast_days', '1');
    const response = await fetch(url.toString(), {
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error(`Open-Meteo error: ${response.status}`);
    const data = await response.json();
    const current = data.current || {};
    return {
      temperature: current.temperature_2m ?? null,
      windSpeed: current.wind_speed_10m ?? null,
      windDirection: current.wind_direction_10m ?? null,
      humidity: current.relative_humidity_2m ?? null,
      precipitation: current.precipitation ?? null,
      timestamp: new Date().toISOString(),
      source: 'Open-Meteo',
    };
  } catch (error) {
    console.error('Erreur fetch Open-Meteo:', error);
    return null;
  }
}

/**
 * Récupère les données SST depuis NOAA ERDDAP
 */
export async function fetchNoaaData(): Promise<NoaaData | null> {
  try {
    // NOAA CoastWatch SST - point le plus proche de la Martinique
    const url = `https://coastwatch.pfeg.noaa.gov/erddap/griddap/jplMURSST41.json?analysed_sst%5B(last)%5D%5B(${MARTINIQUE_CENTER.lat})%5D%5B(${MARTINIQUE_CENTER.lon})%5D`;
    const response = await fetch(url, {
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error(`NOAA ERDDAP error: ${response.status}`);
    const data = await response.json();
    const rows = data.table?.rows;
    const sst = rows?.[0]?.[1] ?? null;
    return {
      sst: sst !== null ? Math.round(sst * 10) / 10 : null,
      currentSpeed: null,
      currentDirection: null,
      timestamp: new Date().toISOString(),
      source: 'NOAA MUR SST Analysis',
    };
  } catch (error) {
    console.error('Erreur fetch NOAA:', error);
    return null;
  }
}

/**
 * Récupère les données de houle depuis Open-Meteo Marine
 */
export async function fetchCopernicusData(): Promise<CopernicusData | null> {
  try {
    const url = new URL('https://marine-api.open-meteo.com/v1/marine');
    url.searchParams.set('latitude', MARTINIQUE_CENTER.lat.toString());
    url.searchParams.set('longitude', MARTINIQUE_CENTER.lon.toString());
    url.searchParams.set('current', 'wave_height,wave_period,ocean_current_velocity,ocean_current_direction');
    url.searchParams.set('timezone', 'America/Martinique');
    const response = await fetch(url.toString(), {
      signal: AbortSignal.timeout(6000),
    });
    if (!response.ok) throw new Error(`Open-Meteo Marine error: ${response.status}`);
    const data = await response.json();
    const current = data.current || {};
    return {
      waveHeight: current.wave_height ?? null,
      wavePeriod: current.wave_period ?? null,
      currentSpeed: current.ocean_current_velocity ?? null,
      currentDirection: current.ocean_current_direction ?? null,
      timestamp: new Date().toISOString(),
      source: 'Open-Meteo Marine',
    };
  } catch (error) {
    console.error('Erreur fetch Marine:', error);
    return null;
  }
}

/**
 * Agrège toutes les sources — OpenWeatherMap prioritaire sur Open-Meteo
 */
export async function fetchAllRealtimeData(): Promise<RealtimeData> {
  const [owm, openMeteo, noaa, copernicus] = await Promise.all([
    fetchOpenWeatherData(),
    fetchOpenMeteoData(),
    fetchNoaaData(),
    fetchCopernicusData(),
  ]);

  // OpenWeatherMap prioritaire, fallback sur Open-Meteo
  const weather = owm ?? openMeteo;
  const isLive = weather !== null || noaa !== null || copernicus !== null;

  return {
    noaa,
    openMeteo: weather,
    copernicus,
    lastUpdated: new Date().toISOString(),
    isLive,
    error: !isLive ? 'Toutes les sources de données sont indisponibles' : null,
  };
}
