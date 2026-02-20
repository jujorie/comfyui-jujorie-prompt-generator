import express from "express";
import { buildPrompt } from "./template.js";
import { buildCloseupPrompt } from "./closeup-template.js";
import { pick, pickMultiple, pickOrDefault } from "./utils/random.js";
import { dataSets } from "./data-loader.js";
import { generateModel } from "./model-builder.js";
import { generateCamera } from "./camera-builder.js";
import { generateCloseupCamera } from "./closeup-camera-builder.js";
import { generateFinishes } from "./finish-builder.js";
import { generateSummary } from "./summary-builder.js";

const PORT = 3005;

const app = express();

app.get("/prompt", (req, res) => {
  const { style, lighting, mode, format = "json" } = req.query;

  const preset = dataSets.presets[style] || {};
  const activeMode = dataSets.modes[mode] || dataSets.modes.cinematic;

  const data = {
    summary: generateSummary(mode),
    model: generateModel(),
    location: pick(dataSets.locations),
    pose: pick(dataSets.poses),
    camera: generateCamera(),
    lighting:
      lighting ||
      activeMode.forceLighting ||
      preset.lighting ||
      pick(dataSets.lighting),
    finishes: generateFinishes(
      activeMode.maxQualities,
      activeMode.maxFinishes,
      preset.finish
    )
  };

  const prompt = buildPrompt(data);

  if (format === "text") {
    res.set("Content-Type", "text/plain");
    res.send(prompt);
  } else {
    res.json({
      prompt,
      mode: mode || "cinematic",
      config: data
    });
  }
});

app.get("/prompt/closeup", (req, res) => {
  const { style, lighting, mode, format = "json" } = req.query;

  const preset = dataSets.presets[style] || {};
  const activeMode = dataSets.modes[mode] || dataSets.modes.cinematic;

  const data = {
    summary: generateSummary(mode),
    model: generateModel(),
    location: pick(dataSets.locations),
    pose: pick(dataSets.poses),
    camera: generateCloseupCamera(),
    lighting:
      lighting ||
      activeMode.forceLighting ||
      preset.lighting ||
      pick(dataSets.lighting),
    finishes: generateFinishes(
      activeMode.maxQualities,
      activeMode.maxFinishes,
      preset.finish
    )
  };

  const prompt = buildCloseupPrompt(data);

  if (format === "text") {
    res.set("Content-Type", "text/plain");
    res.send(prompt);
  } else {
    res.json({
      prompt,
      mode: mode || "cinematic",
      config: data
    });
  }
});

app.get("/options", (req, res) => {
  res.json(dataSets);
});

app.listen(PORT, () => {
  console.log("Prompt generator running on port", PORT);
});