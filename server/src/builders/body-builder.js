import { dataSets } from "../data-loader.js";
import { pickOrEmpty, filterByKeywords } from "../utils/random.js";

export function bodyBuild(filters = {}) {
  const bodyTypes = filterByKeywords(dataSets.bodyTypes, filters.bodyTypes || []);
  const bodyShapes = filterByKeywords(dataSets.bodyShapes, filters.bodyShapes || []);
  const bodyProportions = filterByKeywords(dataSets.bodyProportions, filters.bodyProportions || []);
  const bodyDetails = filterByKeywords(dataSets.bodyDetails, filters.bodyDetails || []);
  
  const parts = [
    pickOrEmpty(bodyTypes),
    pickOrEmpty(bodyShapes),
    pickOrEmpty(bodyProportions),
    pickOrEmpty(bodyDetails)
  ];
  
  const body = parts.filter(part => part.trim() !== '').join(', ');
  
  return body.trim() !== '' ? `a ${body}` : '';
}
