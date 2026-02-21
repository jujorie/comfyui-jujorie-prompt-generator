import express from "express";
import cors from "cors";
import { buildPrompt, buildCloseupPrompt } from "./templates/index.js";
import { pick } from "./utils/random.js";
import { dataSets } from "./data-loader.js";
import { generateModel, generateCamera, generateCloseupCamera, generateFinishes, generateSummary } from "./builders/index.js";

const PORT = 3005;

const app = express();
app.use(cors());
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