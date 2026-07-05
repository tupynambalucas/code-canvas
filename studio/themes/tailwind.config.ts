import { ColorExtractor } from "./src/core/ColorExtractor";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const extractor = new ColorExtractor(path.resolve(__dirname, "./src/defaults"));
const themeColors = extractor.extract();

export default {
  content: ["./src/**/*.{json,css,ts}"],
  theme: {
    extend: { colors: themeColors },
  },
  plugins: [
    ({
      addUtilities,
    }: {
      addUtilities: (utils: Record<string, Record<string, string>>) => void;
    }): void => {
      const utils: Record<string, Record<string, string>> = {};
      Object.entries(themeColors).forEach(([name, val]) => {
        utils[`.${name}`] = { color: val };
      });
      addUtilities(utils);
    },
  ],
};
