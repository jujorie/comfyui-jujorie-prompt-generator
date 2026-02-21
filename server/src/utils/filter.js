import { dataSets } from "../data-loader.js";
import { pickOrEmpty, filterByKeywords } from "./random.js";

// Parámetros que NO son filtros
const RESERVED_PARAMS = new Set(["style", "lighting", "mode", "format"]);

// Mapeo de nombres de parámetros a datasets
const DATASET_MAP = {
  eyes: "eyes",
  hair: "hair",
  skin: "skinTones",
  bodyTypes: "bodyTypes",
  bodyShapes: "bodyShapes",
  bodyProportions: "bodyProportions",
  bodyDetails: "bodyDetails",
  shots: "shots",
  angles: "angles",
  compositions: "compositions",
  locations: "locations",
  poses: "poses",
  quality: "quality",
  finishes: "finishes",
  lighting: "lighting",
  summary: "summary",
  summarySpicy: "summarySpicy"
};

export function extractFilters(queryParams) {
  const filters = {};
  
  for (const [key, value] of Object.entries(queryParams)) {
    // Ignorar parámetros reservados
    if (RESERVED_PARAMS.has(key)) continue;
    
    // Procesar parámetros de filtro
    if (DATASET_MAP[key]) {
      // Convertir valores a array si no lo son
      const keywords = Array.isArray(value) ? value : [value];
      filters[DATASET_MAP[key]] = keywords;
    }
  }
  
  return filters;
}

export function applyFilters(data, filters) {
  const filtered = { ...data };
  
  // Filtrar location
  if (filters.locations) {
    const locations = filterByKeywords(dataSets.locations, filters.locations);
    filtered.location = pickOrEmpty(locations) || data.location;
  }
  
  // Filtrar pose
  if (filters.poses) {
    const poses = filterByKeywords(dataSets.poses, filters.poses);
    filtered.pose = pickOrEmpty(poses) || data.pose;
  }
  
  return filtered;
}
