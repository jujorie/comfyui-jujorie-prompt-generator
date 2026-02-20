import { dataSets } from "./data-loader.js";
import { pickMultiple } from "./utils/random.js";

export function generateFinishes(maxQualities, maxFinishes, presetFinish = null) {
  const quality = pickMultiple(dataSets.quality, maxQualities);
  const finish = presetFinish || pickMultiple(dataSets.finishes, maxFinishes);
  return `${quality}, ${finish}`;
}
