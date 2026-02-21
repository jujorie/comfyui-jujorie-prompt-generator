import { dataSets } from "../data-loader.js";
import { pick } from "../utils/random.js";

export function bodyBuild() {
  return `${pick(dataSets.bodyTypes)}, ${pick(dataSets.bodyShapes)}, ${pick(dataSets.bodyProportions)}, ${pick(dataSets.bodyDetails)}`;
}
