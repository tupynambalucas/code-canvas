# Themes Workspace Agents Context

This workspace contains the CodeCanvas theme generation engine, default theme definitions, and templates.

## Bounded Context

- This workspace handles compile-time generation of CodeCanvas themes.
- Outputs MUST be compiled into the local `dist/` directory through the build script.
- The `dist/` directory is exported and consumed by `@codecanvas/extension` which registers
  contributions in its package manifest.

## Scoped Guidelines

- NEVER manually edit JSON files inside `dist/`. Always modify theme overrides in
  `src/defaults/`.
- All TypeScript compiler files in `src/core/` MUST adhere to strictly-typed configurations.
- Use `build.ts` to execute the theme build process.

## Routing

- Global standards defined in the root [AGENTS.md](../../AGENTS.md) apply here.
