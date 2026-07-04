# Workspace Context: Studio Workspace

This file defines the domain rules, local stack services, and directory structure for the **Studio Bounded Context** (`studio/`).

---

## Studio Navigation

Before editing or analyzing design files or brand tokens, read the local rules for the specific workspace:

- **Penpot Collaborative Design**: [penpot/AGENTS.md](./penpot/AGENTS.md) — Self-hosted Penpot setup, S3 bucket mappings, PostgreSQL, and Penpot AI assistant (aide).
- **Cloudflare R2 Storage Sync**: [bucket/AGENTS.md](./bucket/AGENTS.md) — Dynamic synchronization engine for design assets, vectors, and web-ready vectors with Cloudflare R2 bucket.
- **Workspace Documentation**: Refer to the studio documentation in [docs/workspaces/studio/overview.mdx](../docs/workspaces/studio/overview.mdx).
- **Workspace Roadmap**: Refer to the studio roadmap in [docs/roadmap/04-studio.md](../docs/roadmap/04-studio.md).

---

## Workspace Architecture

The Studio workspace centralizes brand visual assets, CSS design tokens, and SVG icon wrappers:

- **[src/tokens/](./src/tokens/)**: Canonical design token definitions (color variables, typography mappings) consumed by both Instance and Portal clients.
- **[src/icons/](./src/icons/)**: Scoped React SVG wrapper components generated from raw vectors.
- **[assets/sources/](./assets/sources/)**: Raw vector archives (Penpot templates, Adobe Illustrator/Photoshop files).

---

## Studio Guardrails

1. **Token Invariance**: Brand CSS color tokens and variables MUST be maintained in this workspace and exported. AI agents MUST NEVER define hardcoded hex values in local application CSS modules.
2. **Asset Organization**: AI agents MUST NEVER commit heavy binary design backups to git branches. Keep source design vectors in [assets/sources/](./assets/sources/) and load final web-ready SVGs into [src/icons/](./src/icons/).

---

## Scoped Commands

Run these scripts from the monorepo root to manage the design stack:

- `pnpm penpot:up`: Launches the Penpot collaborative design services at `http://localhost:9005`.
- `pnpm penpot:down`: Stops the Penpot services.
- `pnpm penpot:aide:up`: Starts the Penpot AI assistant (aide) interface.
- `pnpm penpot:aide:down`: Stops the Penpot AI assistant.
