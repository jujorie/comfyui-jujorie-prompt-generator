import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function load(file) {
  return JSON.parse(
    fs.readFileSync(path.join(__dirname, "..", "data", file))
  );
}

export const dataSets = {
  bodyTypes: load("body-types.json"),
  bodyShapes: load("body-shapes.json"),
  bodyProportions: load("body-proportions.json"),
  bodyDetails: load("body-details.json"),
  shots: load("shots.json"),
  lighting: load("lighting.json"),
  finishes: load("finishes.json"),
  skinTones: load("skin-tones.json"),
  compositions: load("compositions.json"),
  quality: load("quality.json"),
  presets: load("presets.json"),
  eyes: load("eyes.json"),
  hair: load("hair.json"),
  locations: load("locations.json"),
  poses: load("poses.json"),
  angles: load("angles.json"),
  modes: load("modes.json"),
  summary: load("summary.json"),
  summarySpicy: load("summary-spicy.json")
};
