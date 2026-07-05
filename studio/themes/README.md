# CodeCanvas Themes Workspace

This workspace manages the creation, customization, and compilation of themes for the CodeCanvas
VS Code extension. It uses a template-based system and a build script to generate full theme
definition files locally.

## Workspace Structure

The package is organized as follows:

- `package.json`: Contains workspace dependencies, exports the `dist/` folder, and declares scripts.
- `build.ts`: Compilation entry point that compiles raw themes to the local `dist/` folder.
- `tsconfig.json`: TypeScript configuration extending the shared base config.
- `tailwind.config.ts`: Tailwind configuration utilizing colors extracted from the theme CSS.
- `src/templates/`: Base JSON templates (`dark-template.json`, `light-template.json`) defining the
  standard editor colors.
- `src/defaults/`: Customized theme override definitions categorized by directory structure.
- `src/core/`: TypeScript services managing build execution and theme resolution.

## Development Workflow

New themes are created by defining a JSON overrides file, which is then merged with a base
template by the compiler.

1. **Create the Theme Override File**

   Create a file ending with `-theme.json` in `src/defaults/`.
   Example path: `src/defaults/anime/bleach/themes/yoruichi_dark.purple-theme.json`

2. **Configure Colors and Properties**

   Specify the base template (`dark` or `light`) and overrides for `colors`, `tokenColors`, and
   `backgroundConfig`.

   ```json
   {
     "template": "dark",
     "colors": {
       "editor.background": "#0f0f0f",
       "activityBar.background": "#ff00ff"
     },
     "backgroundConfig": {
       "editor": {
         "images": ["https://example.com/yoruichi.png"],
         "style": {
           "opacity": 0.2
         }
       }
     }
   }
   ```

## Available Scripts

From the root of the monorepo, you can trigger the build using:

- `pnpm --filter @codecanvas-studio/themes build`: Compiles all themes and generates output JSON
  files in the local `dist/` directory.
- `pnpm --filter @codecanvas-studio/themes dev`: Runs the compiler in watch mode.

## Project Guardrails

- Do not edit the compiled JSON files in `dist/` directly; they are overwritten on every
  compilation.
- These themes are consumed by `@codecanvas/extension` which copies them and registers them inside
  `extension/package.json` during the extension's compilation phase.
