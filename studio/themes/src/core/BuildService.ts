import fs from "node:fs";
import path from "node:path";
import fg from "fast-glob";
import { ColorExtractor } from "./ColorExtractor";
import {
  ThemeResolver,
  type DevTheme,
  type TemplateData,
} from "./ThemeResolver";

export interface BuildPaths {
  DEFAULTS_PATH: string;
  TEMPLATES_PATH: string;
  OUTPUT_PATH: string;
}

export class BuildService {
  private paths: BuildPaths;
  private extractor: ColorExtractor;

  constructor(paths: BuildPaths) {
    this.paths = paths;
    this.extractor = new ColorExtractor(paths.DEFAULTS_PATH);
  }

  private _formatLabel(str: string): string {
    return str
      .split(".")
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(" ");
  }

  run(): void {
    // eslint-disable-next-line no-console
    console.log("🚀 Iniciando build profissional de temas...");
    const themeVariables = this.extractor.extract();
    const resolver = new ThemeResolver(themeVariables);

    if (!fs.existsSync(this.paths.OUTPUT_PATH)) {
      fs.mkdirSync(this.paths.OUTPUT_PATH, { recursive: true });
    }

    const themeFiles = fg.sync(
      `${this.paths.DEFAULTS_PATH}/**/*-theme.json`.replace(/\\/g, "/"),
    );

    for (const filePath of themeFiles) {
      const relativeFromDefaults = path.relative(
        this.paths.DEFAULTS_PATH,
        filePath,
      );
      const pathParts = relativeFromDefaults.split(path.sep);
      const category = pathParts[0];
      const subCategory = pathParts[1];

      const fileName = path.basename(filePath);
      const [rawName, rest] = fileName.split("_");
      const colorsPart = rest.replace("-theme.json", "");

      const themeNameLabel = rawName.charAt(0).toUpperCase() + rawName.slice(1);
      const subCatLabel =
        subCategory.charAt(0).toUpperCase() + subCategory.slice(1);
      const formattedColorLabel = this._formatLabel(colorsPart);

      const devTheme = JSON.parse(
        fs.readFileSync(filePath, "utf8"),
      ) as DevTheme;
      const templatePath = path.join(
        this.paths.TEMPLATES_PATH,
        `${devTheme.template ?? "dark"}-template.json`,
      );

      if (!fs.existsSync(templatePath)) {
        continue;
      }

      const templateData = JSON.parse(
        fs.readFileSync(templatePath, "utf8"),
      ) as TemplateData;
      const generatedTheme = resolver.resolve(templateData, devTheme);

      generatedTheme.name = `${themeNameLabel} (${subCatLabel}) - ${formattedColorLabel}`;

      const safeColorId = colorsPart.replace(/\./g, "-");
      const outputFileName = `${category}.${subCategory}.${rawName}.${safeColorId}.json`;
      const outputPath = path.join(this.paths.OUTPUT_PATH, outputFileName);

      fs.writeFileSync(outputPath, JSON.stringify(generatedTheme, null, 2));

      // eslint-disable-next-line no-console
      console.log(`✅ Gerado: ${outputFileName}`);
    }
    // eslint-disable-next-line no-console
    console.log("✨ Build de temas concluída!");
  }
}
