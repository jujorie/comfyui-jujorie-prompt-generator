import { dataSets } from "./data-loader.js";
import { PromptServerError } from "./errors.js";

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

export function validateQueryParameters(queryParams) {
  const allValidParams = new Set([...RESERVED_PARAMS, ...Object.keys(DATASET_MAP)]);
  
  for (const param of Object.keys(queryParams)) {
    if (!allValidParams.has(param)) {
      throw new PromptServerError(
        `The parameter '${param}' is not valid. Valid parameters are: ${Array.from(allValidParams).sort().join(", ")}`,
        400,
        { code: "INVALID_PARAMETER", parameter: param }
      );
    }
  }
}

export function validateMode(mode) {
  if (!mode) return;
  
  const validModes = Object.keys(dataSets.modes).filter(key => key !== "$schema");
  if (!validModes.includes(mode)) {
    throw new PromptServerError(
      `Invalid value '${mode}' for parameter 'mode'. Valid values are: ${validModes.join(", ")}`,
      400,
      { code: "INVALID_MODE", parameter: "mode", value: mode }
    );
  }
}

export function validateStyle(style) {
  if (!style) return;
  
  const validStyles = Object.keys(dataSets.presets).filter(key => key !== "$schema");
  if (!validStyles.includes(style)) {
    throw new PromptServerError(
      `Invalid value '${style}' for parameter 'style'. Valid values are: ${validStyles.join(", ")}`,
      400,
      { code: "INVALID_STYLE", parameter: "style", value: style }
    );
  }
}

export function validateFormat(format = "json") {
  const validFormats = ["json", "text"];
  if (!validFormats.includes(format)) {
    throw new PromptServerError(
      `Invalid value '${format}' for parameter 'format'. Valid values are: ${validFormats.join(", ")}`,
      400,
      { code: "INVALID_FORMAT", parameter: "format", value: format }
    );
  }
}
