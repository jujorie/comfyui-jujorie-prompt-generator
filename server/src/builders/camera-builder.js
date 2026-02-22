import { dataSets } from "../data-loader.js";
import { pickOrEmpty, filterByKeywords } from "../utils/random.js";

export function generateCamera(filters = {}) {
  const shots = filterByKeywords(dataSets.shots, filters.shots || []);
  const angles = filterByKeywords(dataSets.angles, filters.angles || []);
  const compositions = filterByKeywords(dataSets.compositions, filters.compositions || []);
  
  const parts = [
    pickOrEmpty(shots),
    pickOrEmpty(angles),
    pickOrEmpty(compositions)
  ];
  
  return parts.filter(part => part.trim() !== '').join(', ');
}
