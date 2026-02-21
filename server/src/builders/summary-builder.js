import { dataSets } from "../data-loader.js";
import { pick } from "../utils/random.js";

export function generateSummary(mode) {
  if (mode === "spicy") {
    return pick(dataSets.summarySpicy);
  } else if (mode === "zero") {
    return "A professional photo of a woman.";
  } else {
    return pick(dataSets.summary);
  }
}
