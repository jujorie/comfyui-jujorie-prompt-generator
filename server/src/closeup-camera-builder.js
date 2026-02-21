import { dataSets } from "./data-loader.js";
import { pick, pickCloseupShot } from "./utils/random.js";

export function generateCloseupCamera() {
  return `${pickCloseupShot(dataSets.shots)}, ${pick(dataSets.angles)}, ${pick(dataSets.compositions)}`;
}
