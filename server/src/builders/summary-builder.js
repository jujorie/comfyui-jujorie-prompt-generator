import { dataSets } from "../data-loader.js";
import { pickOrEmpty, filterByKeywords } from "../utils/random.js";

export function generateSummary(mode, filters = {}) {
  if (mode === "spicy") {
    const summarySpicy = filterByKeywords(dataSets.summarySpicy, filters.summary || []);
    return pickOrEmpty(summarySpicy);
  } else if (mode === "zero") {
    return "A professional photo of a woman.";
  } else {
    const summary = filterByKeywords(dataSets.summary, filters.summary || []);
    return pickOrEmpty(summary);
  }
}
