import express from "express";
import cors from "cors";
import { buildPrompt, buildCloseupPrompt } from "./templates/index.js";
import { pick } from "./utils/random.js";
import { extractFilters, applyFilters } from "./utils/filter.js";
import { dataSets } from "./data-loader.js";
import { generateModel, generateCamera, generateCloseupCamera, generateFinishes, generateSummary } from "./builders/index.js";
import { getOpenApi } from "./open-api.js";
import { validateQueryParameters, validateMode, validateStyle, validateFormat } from "./validations.js";

const openapi = getOpenApi();

const PORT = 3005;

const app = express();
app.use(cors());

app.get("/prompt", (req, res, next) => {
  try {
    validateQueryParameters(req.query);
    validateMode(req.query.mode);
    validateStyle(req.query.style);
    validateFormat(req.query.format);

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
  } catch (error) {
    next(error);
  }
});

app.get("/prompt/closeup", (req, res, next) => {
  try {
    validateQueryParameters(req.query);
    validateMode(req.query.mode);
    validateStyle(req.query.style);
    validateFormat(req.query.format || "json");

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
  } catch (error) {
    next(error);
  }
});

app.get("/options", (req, res) => {
  res.json(dataSets);
});

app.get("/api", (req, res) => {
  res.json(openapi);
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const response = {
    error: err.code || "INTERNAL_SERVER_ERROR",
    message: err.message || "An unexpected error occurred"
  };

  if (err.parameter) {
    response.parameter = err.parameter;
  }
  if (err.value !== undefined) {
    response.value = err.value;
  }

  res.status(statusCode).json(response);
});

app.listen(PORT, () => {
  console.log("Prompt generator running on port", PORT);
});