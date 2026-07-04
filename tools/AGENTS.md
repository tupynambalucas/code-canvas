# Workspace Context: Tools & Automation

This file defines the domain rules, containerized services, and directory structure for the **Tools and AI Agents Workspace** (`tools/`).

---

## Tools Navigation

Before editing or analyzing code in this tools context, read the local rules for the specific sub-stack:

- **MCP Ecosystem**: [mcp/AGENTS.md](./mcp/AGENTS.md) — Fastify SSE adapters, Model Context Protocol routing, and browser/git wrappers.
- **AI Agents**: [agents/AGENTS.md](./agents/AGENTS.md) — Docker-out-of-Docker containerized terminals and shell environments.
- **Turborepo**: [turborepo/AGENTS.md](./turborepo/AGENTS.md) — Self-hosted Remote Cache server.
- **Workspace Documentation**: Refer to the tools documentation in [docs/workspaces/tools/overview.mdx](../docs/workspaces/tools/overview.mdx).
- **Workspace Roadmap**: Refer to the tools roadmap in [docs/roadmap/05-tools.md](../docs/roadmap/05-tools.md).

---

## Workspace Architecture

The Tools workspace manages the infrastructure for development automation, AI integration layers, and developer shell environments.

- **MCP Gateway**: Containerized gateway translating command-line integrations (Context7, GitHub, Playwright) into Model Context Protocol Server-Sent Events (SSE).
- **Session Containers**: Local developer workspaces mounted with shell agents (Google Antigravity CLI and GitHub Copilot) to ensure environment parity and OAuth persistence.
- **Turborepo Remote Cache**: Dockerized server storing Turborepo build artifacts to accelerate continuous integration and local builds.

---

## Tools Guardrails

1. **Isolation Policy**: Code in this directory represents automation utilities. Do not import business domain models or schemas from `instance/` or `portal/`.
2. **DooD Safety**: When executing commands or mapping volumes for Docker-out-of-Docker (DooD), ensure `/var/run/docker.sock` is mounted securely, and container user permissions are aligned to prevent file ownership issues on the host.

---

## Scoped Commands

Run these scripts from the monorepo root to manage the tools:

- `pnpm mcp:up`: Launches the development MCP gateway and downstream tools adapters in detached Docker containers.
- `pnpm mcp:down`: Stops the development MCP stack containers.
- `pnpm mcp:reset`: Prunes development volumes, rebuilds adapters, and restarts the gateway.
- `pnpm mcp:prod:up`: Launches the production MCP stack with detached containers.
- `pnpm mcp:prod:down`: Stops the production MCP stack containers.
- `pnpm mcp:staging:up`: Launches the staging MCP stack with detached containers.
- `pnpm mcp:staging:down`: Stops the staging MCP stack containers.
- `pnpm agents:up`: Launches development containerized AI terminals.
- `pnpm agents:down`: Stops the development agent containers.
- `pnpm agents:reset`: Wipes development agent session caches and rebuilds the containers.
- `pnpm turbo:cache:up` / `pnpm turbo:cache:down`: Manages the development self-hosted remote cache containers.
- `pnpm agents:prod:up` / `pnpm agents:prod:down`: Manages the production agent stack.
- `pnpm agents:staging:up` / `pnpm agents:staging:down`: Manages the staging agent stack.
- `pnpm antigravity:auth` / `pnpm copilot:auth`: Runs OAuth authorization inside development containers.
- `pnpm antigravity:prod:auth` / `pnpm copilot:prod:auth`: Runs OAuth authorization inside production containers.
- `pnpm antigravity:staging:auth` / `pnpm copilot:staging:auth`: Runs OAuth authorization inside staging containers.
- `pnpm typecheck`: Validates TypeScript type safety across scripts and adapters.
