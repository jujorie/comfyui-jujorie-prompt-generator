import { dataSets } from "../data-loader.js";
import { pickMultiple, filterByKeywords } from "../utils/random.js";

export function generateFinishes(maxQualities, maxFinishes, presetFinish = null, filters = {}) {
  const quality = pickMultiple(filterByKeywords(dataSets.quality, filters.quality || []), maxQualities);
  const finish = presetFinish || pickMultiple(filterByKeywords(dataSets.finishes, filters.finishes || []), maxFinishes);
  return `${quality}, ${finish}`;
}
