# CodeCanvas Agents Context

This document serves as the root context router for AI agents operating in the CodeCanvas monorepo.

## Bounded Contexts

- [docs](./docs/): Documentation and guides.
- [shared](./shared/): Shared configurations and utilities.
- [studio](./studio/): Design assets, Penpot integration, and themes.
- [tools](./tools/): Tooling for agents, GitHub, MCP, and Turborepo.
- [src](./extension/src/): Core Visual Studio Code extension source code.
- [extension](./extension/): VS Code Extension package.

## Global Constraints

- MUST write all documentation in English (en-US).
- MUST NOT use emojis in any technical document, README, or skill file.
- MUST NOT use placeholders (e.g., TODO, TBD).
- MUST use relative paths for all Markdown links. Absolute filesystem paths are strictly forbidden.
- MUST format all files according to Prettier standards (2-space indent, max 100-character line width).

## Routing

When working within a specific bounded context, agents MUST refer to the local `AGENTS.md` file within that directory for scoped instructions.
