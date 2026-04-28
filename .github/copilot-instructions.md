# QA Agents Demo — Playwright Test Suite

## Overview

This repository contains end-to-end and API tests written in **Playwright + TypeScript** for two frontend web applications and one REST API. The primary goals are **readability**, **easy maintenance**, and **high reusability** of test code.

### Applications Under Test

| Alias            | URL                                                               |
| ---------------- | ----------------------------------------------------------------- |
| TEG#B (Frontend) | https://tegb-frontend-88542200c6db.herokuapp.com/                 |
| TEG#B API        | https://tegb-backend-877a0b063d29.herokuapp.com                   |
| Tredgate QA Hub  | https://tredgate-training-qa-hub-74e558f9052f.herokuapp.com/login |

---

## Repository Structure

```
.github/
  copilot-instructions.md   # This file
tests/
  tegb/                     # TEG#B frontend tests
    pages/                  # Page Object classes for TEG#B
  tredgate/                 # Tredgate QA Hub frontend tests
    pages/                  # Page Object classes for Tredgate QA Hub
  api/                      # API tests (TEG#B API)
  fixtures/                 # Shared Playwright fixtures
  data/                     # Test data helpers and factories
  i18n/                     # Assertion string literals (all text used in expects)
playwright.config.ts        # Playwright configuration
tsconfig.json
.env                        # Secret/environment variables (never commit)
.env.example                # Template with required env variable keys
```

---

## Tech Stack

| Tool                              | Version      | Purpose                                      |
| --------------------------------- | ------------ | -------------------------------------------- |
| Playwright                        | ^1.59        | Test runner, browser automation, API testing |
| TypeScript                        | via tsconfig | Type safety                                  |
| ESLint + eslint-plugin-playwright | ^10 / ^2.10  | Linting                                      |
| @faker-js/faker                   | ^10          | Dynamic test data generation                 |
| dotenv                            | —            | Loading secrets from `.env`                  |

---

## Architecture Principles

### 1. Page Object Model with Fluent API

Every page or component gets its own class in `tests/<app>/pages/`. Methods must return `this` (or the next page object) to enable async chaining in tests.

```ts
// tests/tegb/pages/login.page.ts
import { Page, expect } from "@playwright/test";

export class LoginPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto("/");
    return this;
  }

  async fillEmail(email: string) {
    await this.page.getByLabel("Email").fill(email);
    return this;
  }

  async fillPassword(password: string) {
    await this.page.getByLabel("Password").fill(password);
    return this;
  }

  async submit() {
    await this.page.getByRole("button", { name: "Log in" }).click();
    return this;
  }
}
```

### 2. Async Chaining in Tests

Use the fluent API to write tests that read like structured prose.

```ts
// tests/tegb/login.spec.ts
import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/login.page";
import { strings } from "../i18n";

test("successful login redirects to dashboard", async ({ page }) => {
  await new LoginPage(page)
    .goto()
    .then((p) => p.fillEmail(process.env.TEGB_USER_EMAIL!))
    .then((p) => p.fillPassword(process.env.TEGB_USER_PASSWORD!))
    .then((p) => p.submit());

  await expect(page).toHaveURL(/dashboard/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    strings.dashboard.heading,
  );
});
```

### 3. Sensitive Data — dotenv

- Store all credentials and base URLs in `.env`.
- Never hard-code secrets in test files or page objects.
- Commit only `.env.example` with placeholder values.
- Access values via `process.env.VARIABLE_NAME!` (non-null assertion is acceptable in tests).

```
# .env.example
TEGB_BASE_URL=https://tegb-frontend-88542200c6db.herokuapp.com
TEGB_API_BASE_URL=https://tegb-backend-877a0b063d29.herokuapp.com
TREDGATE_BASE_URL=https://tredgate-training-qa-hub-74e558f9052f.herokuapp.com
TEGB_USER_EMAIL=
TEGB_USER_PASSWORD=
```

Load in `playwright.config.ts`:

```ts
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, ".env") });
```

### 4. i18n Approach for Assertion Strings

Keep all human-readable strings used in `expect()` assertions in a single object literal at `tests/i18n/index.ts`. This makes copy changes a one-file update and keeps test files free of string literals.

```ts
// tests/i18n/index.ts
export const strings = {
  login: {
    errorInvalidCredentials: "Invalid email or password.",
    title: "Sign in",
  },
  dashboard: {
    heading: "Dashboard",
  },
  api: {
    errorUnauthorized: "Unauthorized",
  },
} as const;
```

```ts
// Usage in a test
await expect(page.getByRole("alert")).toHaveText(
  strings.login.errorInvalidCredentials,
);
```

---

## Running Tests

```bash
# Run all tests (headless)
npm test

# Run tests in headed mode
npm run test:headed

# Open interactive UI mode
npm run test:ui

# Show last HTML report
npm run report

# Lint
npm run lint

# Type-check without emitting
npm run typecheck
```

---

## Process Rules

### Git & Commits

- Use **conventional commits**: `feat:`, `fix:`, `test:`, `refactor:`, `chore:`, `docs:`.
- Keep commits focused — one logical change per commit.
- Never commit `.env`. The `.gitignore` must exclude it.
- Never use `--no-verify` to bypass pre-commit hooks.

### Documentation

- **Update `copilot-instructions.md`** whenever you:
  - Add a new application under test or a new test directory.
  - Change the project structure.
  - Introduce a new architectural pattern.
  - Add or remove a significant dependency.
- Update `.env.example` whenever a new environment variable is introduced.

### Adding Dependencies

- **Ask before adding** any new `npm` package. Prefer built-in Playwright capabilities (e.g., `APIRequestContext`) over additional libraries.
- If a library is needed, add it to `devDependencies` only (it is a test-only project).
- After adding a package, run `npm run lint` and `npm run typecheck` to verify compatibility.

### Code Quality

- All new code must pass `npm run lint` and `npm run typecheck` with zero errors.
- Do not use `test.only` in committed code — CI (`forbidOnly`) will catch this, but avoid it proactively.
- Avoid `page.waitForTimeout()` — prefer locator-based waits and `expect()` assertions with auto-retry.
- Do not use `any` in TypeScript — use proper types or `unknown`.
