import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function getOpenApi() {
  return JSON.parse(fs.readFileSync(`${__dirname}/openapi.json`, "utf-8"));
}
