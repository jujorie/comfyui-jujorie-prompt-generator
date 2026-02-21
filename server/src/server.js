import express from "express";
import cors from "cors";
import { buildPrompt, buildCloseupPrompt } from "./templates/index.js";
import { pick, pickOrEmpty, filterByKeywords } from "./utils/random.js";
import { dataSets } from "./data-loader.js";
import { generateModel, generateCamera, generateCloseupCamera, generateFinishes, generateSummary } from "./builders/index.js";

const PORT = 3005;

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

function extractFilters(queryParams) {
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

function applyFilters(data, filters) {
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

const app = express();
app.use(cors());
app.get("/prompt", (req, res) => {
  const { style, lighting, mode, format = "json" } = req.query;

  const preset = dataSets.presets[style] || {};
  const activeMode = dataSets.modes[mode] || dataSets.modes.cinematic;
  
  // Extraer filtros de los query params
  const filters = extractFilters(req.query);

  const data = {
    summary: generateSummary(mode, filters),
    model: generateModel(filters),
    location: pick(dataSets.locations),
    pose: pick(dataSets.poses),
    camera: generateCamera(filters),
    lighting:
      lighting ||
      activeMode.forceLighting ||
      preset.lighting ||
      pick(dataSets.lighting),
    finishes: generateFinishes(
      activeMode.maxQualities,
      activeMode.maxFinishes,
      preset.finish,
      filters
    )
  };
  
  // Aplicar filtros adicionales a location y pose
  const filteredData = applyFilters(data, filters);

  const prompt = buildPrompt(filteredData);

  if (format === "text") {
    res.set("Content-Type", "text/plain");
    res.send(prompt);
  } else {
    res.json({
      prompt,
      mode: mode || "cinematic",
      config: filteredData
    });
  }
});

app.get("/prompt/closeup", (req, res) => {
  const { style, lighting, mode, format = "json" } = req.query;

  const preset = dataSets.presets[style] || {};
  const activeMode = dataSets.modes[mode] || dataSets.modes.cinematic;
  
  // Extraer filtros de los query params
  const filters = extractFilters(req.query);

  const data = {
    summary: generateSummary(mode, filters),
    model: generateModel(filters),
    location: pick(dataSets.locations),
    pose: pick(dataSets.poses),
    camera: generateCloseupCamera(filters),
    lighting:
      lighting ||
      activeMode.forceLighting ||
      preset.lighting ||
      pick(dataSets.lighting),
    finishes: generateFinishes(
      activeMode.maxQualities,
      activeMode.maxFinishes,
      preset.finish,
      filters
    )
  };
  
  // Aplicar filtros adicionales a location y pose
  const filteredData = applyFilters(data, filters);

  const prompt = buildCloseupPrompt(filteredData);

  if (format === "text") {
    res.set("Content-Type", "text/plain");
    res.send(prompt);
  } else {
    res.json({
      prompt,
      mode: mode || "cinematic",
      config: filteredData
    });
  }
});

app.get("/options", (req, res) => {
  res.json(dataSets);
});

app.listen(PORT, () => {
  console.log("Prompt generator running on port", PORT);
});