import { Router } from "express";
import { buildPrompt, buildCloseupPrompt } from "../templates/index.js";
import { pick } from "../utils/random.js";
import { extractFilters, applyFilters } from "../utils/filter.js";
import { dataSets } from "../data-loader.js";
import { generateModel, generateCamera, generateCloseupCamera, generateFinishes, generateSummary } from "../builders/index.js";
import { validateQueryParameters, validateMode, validateStyle, validateFormat } from "../validations.js";

export function promptRoute() {
  const router = Router();

  function validations(req, _res, next) {
    try {
      validateQueryParameters(req.query);
      validateMode(req.query.mode);
      validateStyle(req.query.style);
      validateFormat(req.query.format);
      next();
    } catch (error) {
      next(error);
    }
  }

  router.get("/", validations, (req, res, next) => {
    try {
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

  router.get("/closeup", validations, (req, res, next) => {
    try {
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

  return router;
}
