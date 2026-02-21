import { dataSets } from "../data-loader.js";
import { pick } from "../utils/random.js";
import { bodyBuild } from "./body-builder.js";

export function generateModel() {
  return `She has ${pick(dataSets.eyes)}.
She has ${pick(dataSets.hair)}.
She has a ${bodyBuild()}.
She has ${pick(dataSets.skinTones)}.`;
}
