import { dataSets } from "./data-loader.js";
import { pick } from "./utils/random.js";

export function generateCamera() {
  return `${pick(dataSets.shots)}, ${pick(dataSets.angles)}, ${pick(dataSets.compositions)}`;
}
