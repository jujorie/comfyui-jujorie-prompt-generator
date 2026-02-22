import express from "express";
import cors from "cors";
import { buildPrompt, buildCloseupPrompt } from "./templates/index.js";
import { pick } from "./utils/random.js";
import { extractFilters, applyFilters, validateQueryParameters } from "./utils/filter.js";
import { dataSets } from "./data-loader.js";
import { generateModel, generateCamera, generateCloseupCamera, generateFinishes, generateSummary } from "./builders/index.js";
import { getOpenApi } from "./open-api.js";

const openapi = getOpenApi();

const PORT = 3005;

const app = express();
app.use(cors());
app.get("/prompt", (req, res) => {
  // Validar parámetros de query
  const validation = validateQueryParameters(req.query);
  if (!validation.valid) {
    return res.status(400).json({
      error: "Invalid parameter",
      parameter: validation.invalidParam,
      message: `The parameter '${validation.invalidParam}' is not valid. Valid parameters are: ${validation.validParams.join(", ")}`
    });
  }

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
  // Validar parámetros de query
  const validation = validateQueryParameters(req.query);
  if (!validation.valid) {
    return res.status(400).json({
      error: "Invalid parameter",
      parameter: validation.invalidParam,
      message: `The parameter '${validation.invalidParam}' is not valid. Valid parameters are: ${validation.validParams.join(", ")}`
    });
  }

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

app.get("/api", (req, res) => {
  res.json(openapi);
});

app.listen(PORT, () => {
  console.log("Prompt generator running on port", PORT);
});