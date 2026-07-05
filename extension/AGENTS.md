# Extension Workspace Agents Context

This workspace contains the CodeCanvas VS Code Extension core code.

## Bounded Context

- This workspace is strictly for the VS Code extension logic, patching mechanisms, and
  integration points.
- The detailed guide for the extension configuration options is in
  [CONFIG.md](./CONFIG.md).
- Themes must be compiled first inside `@codecanvas-studio/themes`. The build script
  `build.ts` dynamically registers them into `package.json` contributes and copies
  them to the `dist/themes/` directory during compilation.

## Routing

- Global standards defined in the root [AGENTS.md](../AGENTS.md) apply here.
