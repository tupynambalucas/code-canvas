export type ThemeColors = Record<string, unknown>;

export interface DevTheme {
  type?: string;
  template?: string;
  colors?: ThemeColors;
  tokenColors?: unknown[];
  backgroundConfig?: Record<string, unknown>;
}

export interface TemplateData {
  type?: string;
  colors?: ThemeColors;
  tokenColors?: unknown[];
}

export class ThemeResolver {
  private colorMap: Record<string, string>;

  constructor(colorMap: Record<string, string>) {
    this.colorMap = colorMap;
  }

  resolve(
    templateData: TemplateData,
    devTheme: DevTheme,
  ): Record<string, unknown> {
    const rawColors = { ...templateData.colors, ...devTheme.colors };
    const resolvedColors: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(rawColors)) {
      if (typeof value === "string") {
        const cleanKey = value.replace(/^--/, "");
        resolvedColors[key] = this.colorMap[cleanKey] ?? value;
      } else {
        resolvedColors[key] = value;
      }
    }

    return {
      $schema: "vscode://schemas/color-theme",
      type: templateData.type ?? "dark",
      colors: resolvedColors,
      tokenColors: [
        ...(templateData.tokenColors ?? []),
        ...(devTheme.tokenColors ?? []),
      ],
      backgroundConfig: devTheme.backgroundConfig ?? {},
    };
  }
}
