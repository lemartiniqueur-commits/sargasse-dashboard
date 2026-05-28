/**
 * Calcul de l'Indice de Risque Sargasses (0-100)
 * Basé sur les données NOAA + OpenMeteo combinées
 * 
 * Facteurs:
 * - Température SST > 27°C (favorable à la prolifération)
 * - Vent faible < 5 m/s (favorise l'accumulation côtière)
 * - Courants favorables vers la côte
 */

import { NoaaData, OpenMeteoData, CopernicusData } from "./api-service";

export interface SargassumRiskIndex {
  index: number; // 0-100
  level: "low" | "moderate" | "high" | "critical";
  factors: {
    sstScore: number; // 0-25
    windScore: number; // 0-25
    currentScore: number; // 0-25
    seasonalScore: number; // 0-25
  };
  recommendation: string;
  timestamp: string;
}

/**
 * Calcule le score SST (0-25 points)
 * SST optimale pour sargasses: 28-30°C
 */
function calculateSstScore(sst: number | null): number {
  if (sst === null) return 12; // Valeur neutre si donnée indisponible

  if (sst < 26) return 5; // Trop froid
  if (sst >= 26 && sst < 27) return 10; // Frais
  if (sst >= 27 && sst < 28) return 15; // Favorable
  if (sst >= 28 && sst < 30) return 25; // Optimal
  if (sst >= 30 && sst < 32) return 20; // Très chaud
  return 15; // Extrêmement chaud (peut être défavorable)
}

/**
 * Calcule le score vent (0-25 points)
 * Vent faible (< 5 m/s) favorise l'accumulation
 */
function calculateWindScore(windSpeed: number | null): number {
  if (windSpeed === null) return 12; // Valeur neutre

  if (windSpeed < 3) return 25; // Très faible - accumulation forte
  if (windSpeed >= 3 && windSpeed < 5) return 20; // Faible - accumulation
  if (windSpeed >= 5 && windSpeed < 8) return 10; // Modéré - dispersion
  if (windSpeed >= 8 && windSpeed < 12) return 5; // Fort - dispersion forte
  return 0; // Très fort - dispersion totale
}

/**
 * Calcule le score courants (0-25 points)
 * Courants dirigés vers la côte = risque accru
 */
function calculateCurrentScore(
  currentSpeed: number | null,
  currentDirection: number | null
): number {
  if (currentSpeed === null || currentDirection === null) return 12;

  // Direction moyenne vers la côte ouest de la Martinique (~270°)
  const coastDirection = 270;
  const directionDiff = Math.abs(currentDirection - coastDirection);
  
  // Normalisation de la différence de direction (0-180)
  const normalizedDiff = directionDiff > 180 ? 360 - directionDiff : directionDiff;
  
  // Score basé sur l'alignement avec la côte
  let directionScore = 0;
  if (normalizedDiff < 30) directionScore = 25; // Directement vers la côte
  else if (normalizedDiff < 60) directionScore = 18; // Angle favorable
  else if (normalizedDiff < 90) directionScore = 10; // Angle modéré
  else directionScore = 5; // Direction opposée ou perpendiculaire

  // Score basé sur la vitesse du courant
  let speedScore = 0;
  if (currentSpeed < 0.5) speedScore = 20; // Très lent - stagnation
  else if (currentSpeed < 1.0) speedScore = 15; // Lent
  else if (currentSpeed < 2.0) speedScore = 10; // Modéré
  else speedScore = 5; // Rapide - dispersion

  // Combinaison des deux scores (moyenne pondérée)
  return Math.round((directionScore * 0.6 + speedScore * 0.4));
}

/**
 * Calcule le score saisonnier (0-25 points)
 * Saison des sargasses: Mars à Septembre (pic: Juin-Août)
 */
function calculateSeasonalScore(): number {
  const now = new Date();
  const month = now.getMonth() + 1; // 1-12

  // Saison haute: Mai-Septembre
  if (month >= 5 && month <= 9) {
    if (month >= 6 && month <= 8) return 25; // Peak season (Juin-Août)
    return 20; // Début/fin de saison haute
  }
  
  // Saison moyenne: Mars-Avril, Octobre
  if (month >= 3 && month <= 4) return 15;
  if (month === 10) return 12;
  
  // Saison basse: Novembre-Février
  return 5;
}

/**
 * Détermine le niveau de risque à partir de l'index
 */
function getRiskLevel(index: number): "low" | "moderate" | "high" | "critical" {
  if (index < 25) return "low";
  if (index < 50) return "moderate";
  if (index < 75) return "high";
  return "critical";
}

/**
 * Génère une recommandation basée sur le niveau de risque
 */
function getRecommendation(level: "low" | "moderate" | "high" | "critical"): string {
  switch (level) {
    case "low":
      return "Situation favorable. Surveillance standard recommandée.";
    case "moderate":
      return "Conditions propices à l'accumulation. Renforcer la surveillance côtière.";
    case "high":
      return "Risque élevé d'accumulation. Préparer les équipes d'intervention.";
    case "critical":
      return "Risque critique. Activation du plan d'urgence recommandée.";
  }
}

/**
 * Calcule l'Indice de Risque Sargasses complet
 */
export function calculateSargassumRiskIndex(
  noaa: NoaaData | null,
  openMeteo: OpenMeteoData | null,
  copernicus: CopernicusData | null
): SargassumRiskIndex {
  // Extraction des données pertinentes
  const sst = noaa?.sst ?? null;
  const windSpeed = openMeteo?.windSpeed ?? null;
  
  // Priorité aux courants NOAA, fallback Copernicus
  const currentSpeed = noaa?.currentSpeed ?? copernicus?.currentSpeed ?? null;
  const currentDirection = noaa?.currentDirection ?? copernicus?.currentDirection ?? null;

  // Calcul des scores individuels
  const sstScore = calculateSstScore(sst);
  const windScore = calculateWindScore(windSpeed);
  const currentScore = calculateCurrentScore(currentSpeed, currentDirection);
  const seasonalScore = calculateSeasonalScore();

  // Index total (somme des 4 facteurs, max 100)
  const index = sstScore + windScore + currentScore + seasonalScore;

  // Détermination du niveau et recommandation
  const level = getRiskLevel(index);
  const recommendation = getRecommendation(level);

  return {
    index: Math.min(100, Math.max(0, index)), // Clamp entre 0 et 100
    level,
    factors: {
      sstScore,
      windScore,
      currentScore,
      seasonalScore,
    },
    recommendation,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Convertit le niveau de risque en couleur Tailwind
 */
export function getRiskColor(level: "low" | "moderate" | "high" | "critical"): string {
  switch (level) {
    case "low":
      return "bg-accent text-black"; // Vert
    case "moderate":
      return "bg-yellow-500 text-black"; // Jaune/Orange
    case "high":
      return "bg-orange-500 text-white"; // Orange
    case "critical":
      return "bg-critical text-white"; // Rouge
  }
}

/**
 * Convertit le niveau de risque en couleur de jauge (pour gradient)
 */
export function getRiskGradient(level: "low" | "moderate" | "high" | "critical"): string {
  switch (level) {
    case "low":
      return "from-emerald-500 to-emerald-400";
    case "moderate":
      return "from-yellow-500 to-orange-400";
    case "high":
      return "from-orange-500 to-red-400";
    case "critical":
      return "from-red-600 to-red-500";
  }
}
