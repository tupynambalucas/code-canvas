import esbuild from "esbuild";
import fs from "node:fs";
import path from "node:path";

const production = process.argv.includes("--production");
const watch = process.argv.includes("--watch");

const esbuildProblemMatcherPlugin: esbuild.Plugin = {
  name: "esbuild-problem-matcher",
  setup(build) {
    build.onStart(() => {
      // eslint-disable-next-line no-console
      console.log("[watch] build started");
    });
    build.onEnd((result) => {
      result.errors.forEach(({ text, location }) => {
        console.error(`✘ [ERROR] ${text}`);
        if (location)
          console.error(
            `    ${location.file}:${location.line}:${location.column}:`,
          );
      });
      // eslint-disable-next-line no-console
      console.log("[watch] build finished");
    });
  },
};

function copyThemesAndBuildManifest() {
  const themesDistDir = path.resolve(
    __dirname,
    "..",
    "studio",
    "themes",
    "dist",
  );
  const destDir = path.resolve(__dirname, "dist", "themes");

  if (!fs.existsSync(themesDistDir)) {
    console.warn(
      "Warning: studio/themes/dist not found. Run theme build first.",
    );
    return;
  }

  fs.mkdirSync(destDir, { recursive: true });

  const files = fs
    .readdirSync(themesDistDir)
    .filter((file) => file.endsWith(".json"));
  const contributions = [];

  for (const file of files) {
    const srcPath = path.join(themesDistDir, file);
    const destPath = path.join(destDir, file);

    const themeContent = fs.readFileSync(srcPath, "utf8");
    const themeData = JSON.parse(themeContent);

    const parts = file.replace(".json", "").split(".");
    if (parts.length < 4) {
      continue;
    }
    const subCategory = parts[1];
    const rawName = parts[2];
    const safeColorId = parts[3];
    const id = `codecanvas.${subCategory}-${rawName}-${safeColorId}`;

    fs.copyFileSync(srcPath, destPath);

    contributions.push({
      id,
      label: themeData.name,
      uiTheme: themeData.type === "dark" ? "vs-dark" : "vs",
      path: `./dist/themes/${file}`,
    });

    console.info(`Copied and registered theme: ${file}`);
  }

  const packageJsonPath = path.resolve(__dirname, "package.json");
  const packageJsonContent = fs.readFileSync(packageJsonPath, "utf8");
  const packageData = JSON.parse(packageJsonContent);

  packageData.contributes = packageData.contributes ?? {};
  packageData.contributes.themes = contributions;

  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(packageData, null, 2) + "\n",
  );

  console.info(`Updated package.json with ${contributions.length} themes.`);
}

async function main() {
  copyThemesAndBuildManifest();

  const ctx = await esbuild.context({
    entryPoints: ["src/extension.ts"],
    bundle: true,
    format: "cjs",
    minify: production,
    sourcemap: !production,
    sourcesContent: false,
    platform: "node",
    outfile: "dist/extension.js",
    external: ["vscode"],
    logLevel: "silent",
    plugins: [esbuildProblemMatcherPlugin],
  });
  if (watch) {
    await ctx.watch();
  } else {
    await ctx.rebuild();
    await ctx.dispose();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
