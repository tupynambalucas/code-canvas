# API Implementation Patterns

The backend follows a domain-based layered architecture using Fastify 5, MongoDB/Mongoose, and BullMQ + Redis.

---

## 🏛️ Layers of Responsibility

Each domain context operates under a strict hierarchy:
Controller -> Service -> Repository -> Model

### 1. Core First Guardrail

All data contracts, TypeScript interfaces, and Zod schemas MUST reside in the context core package (e.g., `@elo-instance/core` or `@elo-portal/core`) before they are consumed by the API.

### 2. Controller

Responsible for HTTP I/O, route definitions, extracting parameters, Zod request body validation, and mapping response objects.

```typescript
// instance/apps/api/src/domains/auth/auth.controller.ts
import type { FastifyRequest, FastifyReply } from "fastify";
import { loginDTOSchema } from "@elo-instance/core";
import type { AuthService } from "./auth.service";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  public login = async (
    req: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> => {
    const data = loginDTOSchema.parse(req.body);
    const result = await this.authService.authenticate(data, req.ip);

    // Set HTTP-Only Cookie for session protection
    void reply
      .setCookie("token", result.token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        signed: true,
      })
      .send({ user: result.user });
  };
}
```

### 3. Service

Orchestrates business rules, handles Mongoose replica set database transactions, and manages external service integrations (e.g., Turnstile).

```typescript
// instance/apps/api/src/domains/auth/auth.service.ts
import { AppError } from "@/shared/errors";
import type { LoginDTO, IUserRepository } from "@elo-instance/core";

export class AuthService {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly turnstileSecretKey: string,
  ) {}

  public async authenticate(data: LoginDTO, ip: string): Promise<AuthResult> {
    // 1. Verify Cloudflare Turnstile Token
    const isHuman = await this.verifyTurnstile(data.turnstileToken, ip);
    if (isHuman === false) {
      throw new AppError("BOT_VERIFICATION_FAILED", 400);
    }

    // 2. Perform credential check with User Enumeration prevention
    const user = await this.userRepo.findByEmail(data.email);

    // Perform Bcrypt comparison even if user doesn't exist to prevent timing attacks
    const isValidPassword =
      user !== null
        ? await user.comparePassword(data.password)
        : await this.fakeBcryptCompare();

    if (user === null || isValidPassword === false) {
      // 3. User Lockout tracking (handled in repository/model)
      if (user !== null) {
        await this.userRepo.incrementFailedAttempts(user);
      }
      throw new AppError("INVALID_CREDENTIALS", 401);
    }

    if (user.isLocked === true) {
      throw new AppError("ACCOUNT_LOCKED", 403);
    }

    // Success flow ...
  }
}
```

### 4. Repository (DI & Decoupling)

Abstracts data persistence. Interacts directly with the Mongoose model. Accepts model injections for testability.

```typescript
// instance/apps/api/src/domains/auth/auth.repository.ts
import type { Model } from "mongoose";
import type { IUser, IUserRepository } from "@elo-instance/core";

export class UserRepository implements IUserRepository {
  constructor(private readonly userModel: Model<IUser>) {}

  public async findByEmail(email: string): Promise<IUser | null> {
    return this.userModel.findOne({ email }).exec();
  }

  public async incrementFailedAttempts(user: IUser): Promise<void> {
    const attempts = user.loginAttempts + 1;
    const update: Record<string, any> = { loginAttempts: attempts };

    if (attempts >= 5) {
      update.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
    }

    await this.userModel.updateOne({ _id: user._id }, { $set: update }).exec();
  }
}
```

---

## 🛡️ API Security & Architecture Guardrails

- **User Enumeration Prevention**: Use unified error codes (`INVALID_CREDENTIALS`) and constant-time cryptographic validation for both correct and missing usernames.
- **Brute-Force Rate Limiting**: Apply `@fastify/rate-limit` limits:
  - Base: 100 requests/minute per IP.
  - Sensitive Auth Routes (`/login`, `/register`): **5 attempts/minute per IP** (HTTP Status `429`).
- **Account Lockout**: Lock user accounts for **15 minutes** after **5 failed login attempts** using the `lockUntil` schema parameter.
- **CSRF Protection**: `@fastify/csrf-protection` requires `CSRF-Token` HTTP headers for state-changing HTTP methods (POST, PUT, DELETE).
- **Floating Promises**: Use the `void` operator for intentional unawaited async operations (e.g., `void reply.send()`).
- **Mongoose Transactions**: Use transaction sessions (`startTransaction()`) when executing atomic writes that touch multiple documents or collections to enforce ACID compliance.
