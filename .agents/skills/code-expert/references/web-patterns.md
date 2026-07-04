# Web Implementation Patterns

The frontend utilizes React 19, Zustand for global state, and a combination of TailwindCSS v4 + CSS Modules for styling.

## 🏗️ Feature Organization (FSD & DDD)

We follow a hybrid architecture blending Domain-Driven Design (DDD) with Feature-Sliced Design (FSD):

1. **Global Domains (`src/domains/`)**: Contains entity definitions (e.g., `auth`, `product`, `cycle`), Zustand state stores, API clients, and **Domain Hooks**.
2. **Features (`src/features/`)**: High-level modules representing user workflows (e.g., `admin`, `shop`). Features orchestrate multiple global domains. **Feature-to-feature imports are strictly prohibited**.
3. **Feature-Specific Private Domains (`src/features/*/domains/`)**: Private sub-domains that only make sense within a specific feature (e.g., `cart` inside the `shop` feature), preventing global namespace pollution.
4. **Shared UI Layer (`src/shared/ui/`)**: Reusable, domain-agnostic UI elements (e.g., buttons, inputs, loaders). Global domains and core entities **MUST NOT** import from features.

---

## ⚛️ Zustand & Atomic Selectors Pattern

To prevent monolithic store imports and unnecessary re-renders in React 19, stores MUST separate state from actions and be consumed via atomic selector hooks.

### 1. Store Definition

```typescript
// src/domains/cycle/cycle.store.ts
import { create } from "zustand";
import type { ICycle } from "@elo-instance/core";

interface CycleState {
  activeCycle: ICycle | null;
  actions: {
    setActiveCycle: (cycle: ICycle | null) => void;
  };
}

export const useCycleStore = create<CycleState>((set) => ({
  activeCycle: null,
  actions: {
    setActiveCycle: (cycle) => set({ activeCycle: cycle }),
  },
}));
```

### 2. Domain Hooks (Atomic Selectors)

```typescript
// src/domains/cycle/hooks/useCycle.ts
import { useCycleStore } from "../cycle.store";

export const useActiveCycle = () => useCycleStore((state) => state.activeCycle);
export const useCycleActions = () => useCycleStore((state) => state.actions);
```

### 3. Component Usage

```tsx
// src/features/admin/components/ActiveCycleDashboard.tsx
import { useActiveCycle } from "@/domains/cycle/hooks/useCycle";
import styles from "./ActiveCycleDashboard.module.css";

export const ActiveCycleDashboard = () => {
  const activeCycle = useActiveCycle();

  if (activeCycle === null) return null;

  return (
    <div className={styles.container}>
      <h2 className="text-xl font-bold text-emerald-800">{activeCycle.name}</h2>
      <p className={styles.description}>{activeCycle.description}</p>
    </div>
  );
};
```

---

## 🛡️ Bot Protection (Turnstile Client-Side)

Forms executing authentication or sensitive actions must integrate Cloudflare Turnstile in Managed Mode.

```tsx
import { Turnstile } from "@marsidev/react-turnstile";
import { useState } from "react";

export const LoginForm = () => {
  const [token, setToken] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (token === null) return;
    // Call login service with token...
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form Fields */}
      <Turnstile
        siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
        onSuccess={(token) => setToken(token)}
        onExpire={() => setToken(null)}
      />
      <button type="submit" disabled={token === null}>
        Sign In
      </button>
    </form>
  );
};
```

---

## 🎨 Styling (TailwindCSS v4 & CSS Modules)

- Use **TailwindCSS v4** for layouts and utility-based styling, combined with **CSS Modules** (`.module.css`) for scoped component layouts.
- **The use of `px` is strictly forbidden** for spacing/sizes. Use `rem` (1rem = 16px) or relative units.
- Use CSS logical functions (`clamp()`, `calc()`) for fluid typography and spacing.

```css
/* styles.module.css */
.container {
  padding: 1.5rem; /* 24px */
  border-radius: 0.5rem; /* 8px */
  gap: clamp(1rem, 2vw, 2rem);
}
```

---

## 🚨 Code Guardrails

- **Strict Booleans**: Always use explicit boolean comparisons in rendering and conditions.
  - `{hasErrors === true && <ErrorMsg />}`
  - `if (isValid === true) { ... }`
- **Stable Keys**: Do not use array indexes as keys. Always use stable unique identifiers (e.g., `_id`).
- **Floating Promises**: Use the `void` operator for intentional unawaited async operations in handlers.
  - `const handleClick = () => { void fetchUserData(); };`
- **React 19 Hooks**: Use the `use()` hook to resolve promises/context inline.
