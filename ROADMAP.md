# Roadmap

All planned and completed milestones for each key workspace context in the CodeCanvas ecosystem, aligning our immediate features with long-term platform transformations.

## Core Architecture & Strategy

This section outlines the strategic monorepo architecture, catalog configurations, and logical multi-tenant isolation goals for the CodeCanvas project.

## Current Development Focus: "Single-Extension Mastery"

**CRITICAL STRATEGY:** Our immediate and absolute priority is to deliver a **complete, 100% functional, and polished single-extension application** (`@codecanvas/*`).

While we have a long-term vision of becoming a multi-tenant SaaS platform, **SaaS architectural complexities must not be implemented at this stage.** All current development (codebase, database schemas, UI/UX) must remain focused on producing the best possible version of a standalone system for an ecovillage. The transition to a full SaaS model (Phase 6 of the Master Plan) will only be considered after the single-extension application is stable and fully operational.

---

## Completed Milestones

### Monorepo Architecture & Workspace Setup

- **Monorepo Workspace Segregation**: Structured workspace layers via PNPM Workspaces v11 and Turborepo, segregating `extension/`, `studio/`, `studio/`, `tools/`, and `docs/` domains.
- **High-Performance Task Orchestration**: Integrated **Turborepo** to orchestrate pipelines, enabling smart target caching and parallel execution of scripts.
- **Unified Configuration Inheritances**: Configured root-level `tsconfig.base.json` and `eslint.config.ts` extendable by workspace packages via TSConfig extends and ESLint config array definitions.
- **Node 22 & TypeScript ESM Configuration**: Converted all packages to use ECMAScript Modules (`"type": "module"`) and compiled with target `ESNext` for modern syntax support.

### Bounded Contexts & Domain Security

- **Strict Bounded Context Isolation**: Configured custom ESLint import restrictions (`no-restricted-imports`) in `eslint.config.ts` preventing cross-workspace dependencies (e.g., Extension context importing from studio context, and vice-versa) to guarantee clean, decoupled business logic.
- **Domain-Core Pattern Integration**: Established `packages/core` in both `extension` and `studio` as the Single Source of Truth (SSOT) for data models and schema validators.
- **Unified Dependency Management via Catalogs**: Integrated PNPM v11 Catalogs feature in `pnpm-workspace.yaml` to govern third-party tool versions (e.g., Fastify 5, React 19, TSX, ESLint) across the entire monorepo.

## Planned Focus

- **Logical Multi-Tenant Isolation**: Ensure extension and studio run completely isolated execution domains.
- **SaaS Platform Evolution**: Transition from single-extension deployments to a centralized multi-tenant marketplace model, utilizing a centralized Traefik Edge Router as a single point of entry to dynamically route requests to isolated backend environments.

---

## Studio (Design Hub)

This section covers the Penpot environment, design-token sync automation, and custom UI asset design.

> [!WARNING]
> The Studio workspace was reused from another project. It needs to be updated to be specific to CodeCanvas (instead of the previous project). Future updates are required to clean up environment files, bucket configurations, and design assets to reflect the CodeCanvas brand.

## Completed Milestones

### Collaborative Design Environment

- **Self-Hosted Design Hub**: Deployed a containerized Penpot v2 extension (Aide-supported design workspace) inside the `@codecanvas-studio/assets` environment, enabling secure local collaborative styling mockups.
- **Centralized Design System Packages**: Structured `@codecanvas-studio/assets` to serve as the unified package for brand guidelines, typography styles, spacing configurations, and palette design tokens.

### Asset Pipelines

- **Branding Assets Export**: Standardized export assets (including SVG vectors, logo marks, and color sheets) in the project repositories, providing raw templates for web applications.
- **Cloud-Based Asset Hosting**: Implemented a bidirectional asset synchronization CLI engine under `@codecanvas-studio/assets/bucket`, enabling seamless replication of brand-identity sources and web-ready assets with Cloudflare R2 Object Storage, eliminating heavy assets from Git history.

## Planned Focus

- **Sync Integration**: Automate the pipeline to sync tokens from Penpot directly into codebase design systems.
- **Extended Suite Assets**: Design custom marketing and UI asset libraries.

---

## Tools (Infrastructure & MCP)

This section outlines the gateway proxy infrastructure, containerized MCP servers, and agent sandboxes.

> [!WARNING]
> The Tools workspace was reused from another project. It requires a full review and update to ensure all MCP servers, infrastructure scripts, and agent configurations are properly adjusted to function for the CodeCanvas project.

## Completed Milestones

### Gateway Proxy & Networking

- **Fastify HTTP Proxy Gateway**: Deployed a containerized gateway (`codecanvas-mcp-gateway`) running on Fastify v5 that proxies and routes incoming local client requests (e.g. from the Antigravity CLI on port `3005`) to downstream context containers.
- **CORS & SSE Stream Handling**: Configured network-level CORS headers and disabled proxy timeouts to guarantee stable, persistent Server-Sent Events (SSE) connections.

### Containerized MCP Ecosystem

- **Playwright Headless Browser Sandbox**: Deployed a Debian-based container running Playwright Google Chrome, with automatic rewrite rules routing loopback/localhost requests back to the host machine bridge (`host.docker.internal`).
- **Structured MCP Servers**: Created Alpine/Debian-based containerized setups for:
  - `GitHub MCP`: Version control execution, issue tracking, and repository queries.
  - `Context7 MCP`: Documentation search targeting dependencies (React 19, Fastify 5, Three.js).
  - `Docker Hub MCP`: Container registry tracking.

### Automation Scripts

- **TypeScript Root Compilation Scripts**: Programmed TypeScript scripts (`generate-changelog.ts` and `generate-roadmap.ts`) running natively via `tsx` to compile workspace metrics and changes directly to root Markdown files.

### Containerized AI Agents (`tools/agents`)

- **Docker-based CLI Provisioning**: Architected and implemented a new `tools/agents` workspace that provisions GitHub Copilot and Google Antigravity CLIs as long-running Docker services, eliminating manual host-level CLI installations.
- **Unified Configuration Injection**: Both CLIs share a single `mcp_config.json` and a unified `skills/` directory, injected via bind mounts at container startup. No configuration is baked into image layers.
- **Persistent Session & Brain Storage**: OAuth tokens, conversation histories, and runtime data are persisted on the host machine via Git-ignored bind-mounted volumes, surviving container rebuilds.
- **Version-Controlled TUI Settings**: Antigravity CLI `settings.json`, `statusline.sh`, and `title.sh` are tracked in the repository and mounted over the container's runtime directory, giving the team direct control over CLI behavior without manual per-machine configuration.
- **Internal Network Routing**: Agent containers resolve all MCP services via the `elo.internal.tools.mcp:3005` custom host alias, allowing the stacks to start and stop completely independently without network configuration errors.
- **Docker-out-of-Docker (DooD)**: Both containers mount the host Docker socket, enabling containerized agents to orchestrate other monorepo stacks (e.g., `pnpm mcp:up`, `pnpm extension:up`) from within the container.
- **VS Code Task Integration**: Tasks registered in `.vscode/tasks.json` using `[Docker]` and `[Host]` prefixes to clearly distinguish container-based from host-global CLI execution during the migration transition period.

## Planned Focus

- **Agent Stack Validation**: End-to-end testing of MCP connectivity, OAuth persistence, and workspace bind mount integrity from within containerized agent sessions.
- **Host CLI Decommission**: After full agent stack validation, remove host-global CLI installations and delete legacy `.agents/` and `.github/copilot/` configuration directories.
- **CI/CD Integrations**: Build context validators and check scripts.
- **Automated Sandbox Reporting**: Expose runtime test and coverage dashboards to local agent environments.

---

## Docs (CodeCanvas Docs)

This section details the central developer studio onboarding references, guidelines, and translation parity tools.

> [!WARNING]
> Cloudflare bucket assets for docs are temporarily disabled. The `studio` workspace was reused from another project and its `assets` and bucket configuration need to be updated for CodeCanvas. For now, only local assets committed to the repository are being used.

## Completed Milestones

### Documentation Engine & Layout

- **Docusaurus Engine Integration**: Configured Docusaurus v3 as our central developer studio (CodeCanvas Docs), providing a responsive documentation engine.
- **Custom MDX Component Pages**: Programmed custom MDX pages (e.g. Tools Workspace ecosystem, Studio Branding) to visual-explain monorepo architecture workflows.
- **Left Navigation Sidebars**: Implemented autogenerated context-based sidebars and structured paths for all sections, simplifying navigation structure.

### Localization & Translation Parity

- **Native Translation Pipelines**: Integrated i18n support, creating a dual locale structure (English source and Portuguese `pt-BR` translation copies) with translation parity protocols.

### CI/CD Deployment

- **Automated Root Compilation**: Integrated build tasks in the GitHub Actions workflow (`deploy-docs.yaml`) to compile and push both `CHANGELOG.md` and `ROADMAP.md` to the repository root.

## Planned Focus

- **Translation Verification Pipeline**: Automate the verification check to ensure 100% documentation sync.
- **API Auto-Generation**: Extract documentation blocks directly from Fastify routing controllers.
