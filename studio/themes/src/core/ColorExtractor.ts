import fs from "node:fs";
import path from "node:path";

export class ColorExtractor {
  private srcDir: string;
  private variableRegex: RegExp;

  constructor(srcDir: string) {
    this.srcDir = srcDir;
    this.variableRegex = /--([\w-]+):\s*(#[a-fA-F0-9]{3,8})/g;
  }

  extract(): Record<string, string> {
    const colors: Record<string, string> = {};
    const cssFiles = this._getFiles(this.srcDir, ".css");

    cssFiles.forEach((file) => {
      const content = fs.readFileSync(file, "utf8");
      for (const match of content.matchAll(this.variableRegex)) {
        colors[match[1]] = match[2];
      }
    });
    return colors;
  }

  private _getFiles(dir: string, ext: string): string[] {
    let results: string[] = [];
    if (!fs.existsSync(dir)) {
      return results;
    }
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
      const filePath = path.join(dir, file);
      if (fs.statSync(filePath).isDirectory()) {
        results = results.concat(this._getFiles(filePath, ext));
      } else if (file.endsWith(ext)) {
        results.push(filePath);
      }
    });
    return results;
  }
}
