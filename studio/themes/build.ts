import path from "node:path";
import { fileURLToPath } from "node:url";
import { BuildService } from "./src/core/BuildService";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const paths = {
  DEFAULTS_PATH: path.join(__dirname, "src", "defaults"),
  TEMPLATES_PATH: path.join(__dirname, "src", "templates"),
  OUTPUT_PATH: path.join(__dirname, "dist"),
};

new BuildService(paths).run();
