import { dataSets } from "../data-loader.js";
import { pick, pickOrEmpty, filterByKeywords } from "../utils/random.js";
import { bodyBuild } from "./body-builder.js";

export function generateModel(filters = {}) {
  const eyes = filterByKeywords(dataSets.eyes, filters.eyes || []);
  const hair = filterByKeywords(dataSets.hair, filters.hair || []);
  const skinTones = filterByKeywords(dataSets.skinTones, filters.skinTones || []);
  
  return `She has ${pickOrEmpty(eyes)}.
She has ${pickOrEmpty(hair)}.
She has a ${bodyBuild(filters)}.
She has ${pickOrEmpty(skinTones)}.`;
}
