import path from "node:path";
import { fileURLToPath } from "node:url";

import eslint from "@eslint/js";
import type { Linter } from "eslint";
import { defineConfig } from "eslint/config";
import { fixupPluginRules } from "@eslint/compat";
import importPlugin from "eslint-plugin-import";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import reactRefreshPlugin from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import eslintPluginPrettier from "eslint-plugin-prettier";
import eslintConfigPrettier from "eslint-config-prettier";
import * as mdx from "eslint-plugin-mdx";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig([
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,

  // ========================================================================
  // 1. CONFIGURAÇÃO GLOBAL - Base para todo o monorepo (Rigor Máximo)
  // ========================================================================
  {
    name: "monorepo/global-typescript-config",
    files: ["**/*.{js,mjs,ts,tsx}"],
    ignores: ["**/*.md/**", "**/*.mdx/**"],
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ["vite.config.ts"],
        },
        tsconfigRootDir: __dirname,
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      import: importPlugin,
    },
    settings: {
      "import/core-modules": ["vscode"],
      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".tsx"],
      },
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: [
            "tsconfig.json",
            "docs/tsconfig.json",
            "shared/*/tsconfig.json",
            "studio/*/tsconfig.json",
            "tools/*/tsconfig.json",
            "extension/tsconfig.json",
          ],
        },
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
      "import/ignore": [
        ".css$",
        ".scss$",
        ".sass$",
        ".less$",
        ".styl$",
        ".module.(css|scss|sass|less|styl)$",
      ],
    },
    rules: {
      // 🔴 REGRAS CRÍTICAS - Previnem bugs em produção
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unsafe-assignment": "error",
      "@typescript-eslint/no-unsafe-member-access": "error",
      "@typescript-eslint/no-unsafe-call": "error",
      "@typescript-eslint/no-unsafe-return": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/no-unnecessary-condition": "warn",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "no-console": ["warn", { allow: ["warn", "error", "info"] }],
      "no-debugger": "error",
      "prefer-const": "error",
      "no-var": "error",
      eqeqeq: ["error", "always", { null: "ignore" }],

      // 🟡 REGRAS IMPORTANTES - Qualidade & Padronização
      "@typescript-eslint/require-await": "warn",
      "@typescript-eslint/prefer-nullish-coalescing": "warn",
      "@typescript-eslint/prefer-optional-chain": "warn",
      "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
      "@typescript-eslint/array-type": ["error", { default: "array-simple" }],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          disallowTypeAnnotations: false,
          fixStyle: "separate-type-imports",
        },
      ],
      "@typescript-eslint/ban-ts-comment": "error",
      "@typescript-eslint/naming-convention": "off",

      // 🟢 REGRAS DE IMPORTAÇÃO
      "import/no-duplicates": "warn",
      "import/no-unresolved": [
        "error",
        {
          ignore: [
            ".css$",
            ".scss$",
            ".sass$",
            ".less$",
            ".styl$",
            ".module.(css|scss|sass|less|styl)$",
          ],
        },
      ],
      "import/order": "off",
      "import/newline-after-import": "off",
      "import/first": "off",
      "import/no-default-export": "off",
    },
  },

  // ========================================================================
  // 2. CONFIG FILES - Suporte para Ferramentas na Raiz
  // ========================================================================
  {
    name: "monorepo/root-config-files",
    files: [
      "*.{js,mjs,ts}",
      "*.config.{js,mjs,ts}",
      "**/*.config.{js,mjs,ts}",
      "**/postcss.config.{js,mjs,cjs,ts}",
      "docs/loaders/**/*.js",
      "docs/src/mock-asset.js",
    ],
    languageOptions: {
      globals: {
        module: "writable",
        require: "readonly",
        process: "readonly",
        __dirname: "readonly",
        exports: "writable",
        URLSearchParams: "readonly",
      },
    },
    rules: {
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
    },
  },

  // ========================================================================
  // 7. TOOLS WORKSPACE - Strict TypeScript Rules for MCP Infrastructure
  // ========================================================================
  {
    name: "monorepo/tools-workspace",
    files: ["tools/**/*.ts"],
    ignores: ["**/*.md/**", "**/*.mdx/**"],
    rules: {
      // Server-side code may log to stdout/stderr for operational visibility
      "no-console": ["warn", { allow: ["info", "warn", "error"] }],
      // Enforce explicit return types on all exported functions for clarity
      "@typescript-eslint/explicit-function-return-type": "warn",
      "@typescript-eslint/explicit-module-boundary-types": "warn",
      // Strict boolean expressions — no implicit truthiness checks
      "@typescript-eslint/strict-boolean-expressions": "error",
      // Floating promise prevention is critical for Fastify async handlers
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": [
        "error",
        {
          checksVoidReturn: false,
        },
      ],
      // Prevent implicit any types leaking into infrastructure code
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unsafe-assignment": "error",
      "@typescript-eslint/no-unsafe-member-access": "error",
      "@typescript-eslint/no-unsafe-call": "error",
      "@typescript-eslint/no-unsafe-return": "error",
      // Enforce await correctness
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/require-await": "warn",
    },
  },

  // ========================================================================
  // 8. STUDIO WORKSPACE - Strict TypeScript Rules for Design System and Scripts
  // ========================================================================
  {
    name: "monorepo/studio-workspace",
    files: ["studio/**/*.ts", "studio/**/*.tsx"],
    ignores: ["**/*.md/**", "**/*.mdx/**"],
    rules: {
      "no-console": ["warn", { allow: ["info", "warn", "error"] }],
      "@typescript-eslint/explicit-function-return-type": "warn",
      "@typescript-eslint/explicit-module-boundary-types": "warn",
      "@typescript-eslint/strict-boolean-expressions": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": [
        "error",
        {
          checksVoidReturn: false,
        },
      ],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unsafe-assignment": "error",
      "@typescript-eslint/no-unsafe-member-access": "error",
      "@typescript-eslint/no-unsafe-call": "error",
      "@typescript-eslint/no-unsafe-return": "error",
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/require-await": "warn",
    },
  },

  // ========================================================================
  // 9. DOCS WORKSPACE & MDX CONFIGURATIONS
  // ========================================================================
  {
    name: "monorepo/docs-workspace",
    files: ["docs/**/*.{ts,tsx,js,jsx}"],
    rules: {
      "no-console": ["warn", { allow: ["info", "warn", "error"] }],
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-unnecessary-type-assertion": "off",
      "@typescript-eslint/consistent-type-definitions": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-empty-object-type": "off",
      "import/no-unresolved": [
        "error",
        {
          ignore: ["^@docusaurus/", "^@theme/", "^@site/"],
        },
      ],
    },
  },
  {
    ...mdx.flat,
    name: "monorepo/mdx-files",
    files: ["**/*.mdx"],
    processor: mdx.createRemarkProcessor({
      lintCodeBlocks: false,
    }),
  },
  {
    name: "monorepo/disable-typecheck-for-non-ts",
    files: ["**/*.{js,cjs,mjs,jsx,mdx}"],
    ...tseslint.configs.disableTypeChecked,
  },
  {
    name: "monorepo/mdx-prettier",
    files: ["**/*.mdx"],
    rules: {
      "prettier/prettier": ["error", { parser: "mdx" }],
    },
  },

  // ========================================================================
  // 10. TEST FILES - Regras Relaxadas para Testes
  // ========================================================================
  {
    name: "monorepo/test-files",
    files: [
      "**/*.{test,spec}.{js,mjs,ts,tsx}",
      "**/__tests__/**/*.{js,mjs,ts,tsx}",
    ],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-floating-promises": "off",
      "no-console": "off",
    },
  },

  // ========================================================================
  // 11. IGNORES GLOBAIS
  // ========================================================================
  {
    name: "monorepo/ignores",
    ignores: [
      "**/dist/**",
      "**/node_modules/**",
      "**/build/**",
      "**/.next/**",
      "**/coverage/**",
      "**/.turbo/**",
      "**/.eslintcache",
      "**/*.json",
      "**/*.css",
      "**/*.scss",
      "**/*.sass",
      "**/*.less",
      "**/*.styl",
      "mongo-keyfile",
      "docker-compose*.yaml",
      "**/types/**/*.d.ts",
      "**/*.d.ts",
      "**/vite-env.d.ts",
      "**/.docusaurus/**",
    ],
  },

  // ========================================================================
  // 12. PRETTIER INTEGRATION
  // ========================================================================
  {
    name: "monorepo/prettier",
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      "prettier/prettier": ["error", { endOfLine: "auto" }],
    },
  },
  eslintConfigPrettier,

  // ========================================================================
  // 13. EXTENSION WORKSPACE - Rules for VS Code Extension
  // ========================================================================
  {
    name: "monorepo/extension-workspace",
    files: ["extension/**/*.ts", "extension/**/*.tsx"],
    ignores: ["**/*.md/**", "**/*.mdx/**"],
    rules: {
      "no-console": ["warn", { allow: ["info", "warn", "error"] }],
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/strict-boolean-expressions": "off",
      "@typescript-eslint/no-floating-promises": "warn",
      "@typescript-eslint/no-misused-promises": [
        "warn",
        {
          checksVoidReturn: false,
        },
      ],
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/await-thenable": "warn",
      "@typescript-eslint/require-await": "warn",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/restrict-template-expressions": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-base-to-string": "off",
      "@typescript-eslint/no-unsafe-function-type": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-redundant-type-constituents": "off",
    },
  },
]);
