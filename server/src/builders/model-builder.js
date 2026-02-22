import { dataSets } from "../data-loader.js";
import { pick, pickOrEmpty, filterByKeywords } from "../utils/random.js";
import { bodyBuild } from "./body-builder.js";

export function generateModel(filters = {}) {
  const eyes = filterByKeywords(dataSets.eyes, filters.eyes || []);
  const hair = filterByKeywords(dataSets.hair, filters.hair || []);
  const skinTones = filterByKeywords(dataSets.skinTones, filters.skinTones || []);
  
  const parts = [
    pickOrEmpty(eyes),
    pickOrEmpty(hair),
    bodyBuild(filters),
    pickOrEmpty(skinTones)
  ];
  
  return parts
    .filter(part => part.trim() !== '')
    .map(part => `She has ${part}.`)
    .join('\n');
}
