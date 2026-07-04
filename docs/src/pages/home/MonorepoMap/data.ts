export interface WorkspaceInfo {
  id: string;
  name: string;
  path: string;
  description: string;
  stack: string[];
  responsibilities: string[];
  ptBR?: Partial<WorkspaceInfo>;
}

export const MONOREPO_OVERVIEW: WorkspaceInfo = {
  id: "root",
  name: "Elo Orgânico Architecture",
  path: "/",
  description:
    "A high-performance, strictly-typed monorepo built on PNPM Workspaces and Turborepo. This architecture enforces strict domain isolation while sharing critical core logic.",
  stack: ["PNPM v10", "Turborepo", "TypeScript 6", "ESLint 9"],
  responsibilities: [
    "Single Source of Truth (SSOT) via /packages/core",
    "Automated Task Orchestration",
    "Context-Driven Development isolation",
    "Shared Design Tokens & Visual Assets",
  ],
  ptBR: {
    name: "Arquitetura Elo Orgânico",
    description:
      "Um monorepo de alta performance e tipagem estrita construído com PNPM Workspaces e Turborepo. Esta arquitetura impõe um isolamento rigoroso de domínios enquanto compartilha lógica core crítica.",
    responsibilities: [
      "Fonte Única de Verdade (SSOT) via /packages/core",
      "Orquestração de Tarefas Automatizada",
      "Isolamento de Desenvolvimento Orientado a Contexto",
      "Tokens de Design e Ativos Visuais Compartilhados",
    ],
  },
};

export const WORKSPACES: Record<string, WorkspaceInfo> = {
  instance: {
    id: "instance",
    name: "Instance Context",
    path: "/workspaces",
    description:
      'Manages community-specific operations, focusing on the "Community Shop" and local administration.',
    stack: ["React 19", "Fastify v5", "MongoDB", "Zustand"],
    responsibilities: [
      "Community Shop Frontend",
      "Local Management API",
      "Community-scoped domain logic",
    ],
    ptBR: {
      name: "Contexto de Instância",
      description:
        'Gerencia operações específicas da comunidade, focando na "Loja Comunitária" e administração local.',
      responsibilities: [
        "Frontend da Loja Comunitária",
        "API de Gerenciamento Local",
        "Lógica de domínio escopada para a comunidade",
      ],
    },
  },
  portal: {
    id: "portal",
    name: "Portal Context",
    path: "/workspaces/portal",
    description:
      "The global platform face and SaaS onboarding hub for managing multiple tenants.",
    stack: ["React 19", "Fastify v5", "Redis", "BullMQ"],
    responsibilities: [
      "Global Landing Page",
      "Tenant Onboarding Flow",
      "Global User Orchestration",
    ],
    ptBR: {
      name: "Contexto do Portal",
      description:
        "A face global da plataforma e o hub de onboarding SaaS para gerenciar múltiplos inquilinos.",
      responsibilities: [
        "Landing Page Global",
        "Fluxo de Onboarding de Tenants",
        "Orquestração Global de Usuários",
      ],
    },
  },
  studio: {
    id: "studio",
    name: "Studio Context",
    path: "/workspaces/studio",
    description:
      "The single source of truth for visual identity, shared tokens, and UI consistency.",
    stack: ["TailwindCSS v4", "PostCSS", "Style Dictionary"],
    responsibilities: [
      "Canonical Design Tokens",
      "Brand Asset Management",
      "Visual Consistency across contexts",
    ],
    ptBR: {
      name: "Contexto do Studio",
      description:
        "A fonte única de verdade para identidade visual, tokens compartilhados e consistência de UI.",
      responsibilities: [
        "Tokens de Design Canônicos",
        "Gerenciamento de Ativos de Marca",
        "Consistência Visual entre contextos",
      ],
    },
  },
  tools: {
    id: "tools",
    name: "Tools Context",
    path: "/workspaces/tools",
    description:
      "Infrastructure orchestration hub and technical automation backbone.",
    stack: ["Model Context Protocol (MCP)", "Docker", "Shell Scripts"],
    responsibilities: [
      "AI Agent Context Servers",
      "Dev Environment Setup",
      "CI/CD Pipeline Automation",
    ],
    ptBR: {
      name: "Contexto de Ferramentas",
      description:
        "Hub de orquestração de infraestrutura e espinha dorsal de automação técnica.",
      responsibilities: [
        "Servidores de Contexto para Agentes de IA",
        "Configuração de Ambiente de Desenvolvimento",
        "Automação de Pipelines CI/CD",
      ],
    },
  },
  knowledge: {
    id: "knowledge",
    name: "Docs Hub",
    path: "/workspaces/docs",
    description:
      "Centralized technical documentation and engineering masterplan.",
    stack: ["Docusaurus v3", "MDX", "Mermaid.js"],
    responsibilities: [
      "Engineering Architecture Docs",
      "Product Roadmap & Vision",
      "Internal Developer Portal",
    ],
    ptBR: {
      name: "Hub de Documentação",
      description:
        "Documentação técnica centralizada e plano mestre de engenharia.",
      responsibilities: [
        "Docs de Arquitetura de Engenharia",
        "Roadmap e Visão do Produto",
        "Portal Interno do Desenvolvedor",
      ],
    },
  },
};
