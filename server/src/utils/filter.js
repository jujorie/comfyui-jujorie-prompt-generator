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

export function validateQueryParameters(queryParams) {
  const allValidParams = new Set([...RESERVED_PARAMS, ...Object.keys(DATASET_MAP)]);
  
  for (const param of Object.keys(queryParams)) {
    if (!allValidParams.has(param)) {
      return {
        valid: false,
        invalidParam: param,
        validParams: Array.from(allValidParams).sort()
      };
    }
  }
  
  return { valid: true };
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

export function validateMode(mode) {
  const validModes = Object.keys(dataSets.modes).filter(key => key !== "$schema");
  if (!validModes.includes(mode)) {
    return {
      valid: false,
      parameter: "mode",
      value: mode,
      validValues: validModes
    };
  }
  return { valid: true };
}

export function validateStyle(style) {
  const validStyles = Object.keys(dataSets.presets).filter(key => key !== "$schema");
  if (!validStyles.includes(style)) {
    return {
      valid: false,
      parameter: "style",
      value: style,
      validValues: validStyles
    };
  }
  return { valid: true };
}

export function validateFormat(format) {
  const validFormats = ["json", "text"];
  if (!validFormats.includes(format)) {
    return {
      valid: false,
      parameter: "format",
      value: format,
      validValues: validFormats
    };
  }
  return { valid: true };
}
