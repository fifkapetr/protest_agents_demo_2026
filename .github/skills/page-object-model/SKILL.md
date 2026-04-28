---
name: page-object-model
description: "Create or update Playwright Page Object classes for this project. Use when: adding a new page object, extending an existing page, modeling a UI component, writing locators for a page, or creating fluent-API test helpers. Covers file location, class structure, locator strategy, fluent chaining, assertion methods, and i18n string wiring."
argument-hint: 'Describe the page or component to model (e.g. "registration page for TEG#B")'
---

# Page Object Model Skill

## Project Conventions at a Glance

| Concern               | Convention                                                             |
| --------------------- | ---------------------------------------------------------------------- |
| Page Objects location | `src/pages/<app>/<name>.page.ts`                                       |
| Test location         | `tests/<app>/<name>.spec.ts`                                           |
| i18n strings          | `tests/i18n/index.ts`                                                  |
| Locator strategy      | `data-testid` attributes first; semantic roles/labels as fallback      |
| Fluent API            | Every action method returns `this` (or the next page object)           |
| Assertion methods     | Named `expect<State>()`, embedded in the page object, return `this`    |
| Env vars              | All base URLs and credentials via `process.env.VAR!` — never hard-code |

---

## Step-by-Step Procedure

### 1. Identify the Target App and Page

Determine which app is being tested:

| App alias       | Env var for base URL | Folder                |
| --------------- | -------------------- | --------------------- |
| TEG#B           | `TEGB_BASE_URL`      | `src/pages/tegb/`     |
| Tredgate QA Hub | `TREDGATE_BASE_URL`  | `src/pages/tredgate/` |

Name the file `<kebab-case-page-name>.page.ts`.

### 2. Explore the UI (if needed)

Before writing locators, inspect the real page to discover `data-testid` attributes.  
Use a browser snapshot or Playwright codegen output — never guess attribute names.

### 3. Write the Page Object Class

Follow this exact skeleton:

```ts
// src/pages/<app>/<name>.page.ts
import { Page, expect } from "@playwright/test";

export class <PageName>Page {
  // --- Locators (private, initialised in constructor) ---
  private readonly someInput;
  private readonly submitButton;
  // ... add all interactive elements and key observable elements

  constructor(private readonly page: Page) {
    this.someInput    = page.locator('[data-testid="some-input"]');
    this.submitButton = page.locator('[data-testid="submit-button"]');
  }

  // --- Navigation ---
  async goto() {
    await this.page.goto(process.env.<APP>_BASE_URL!);
    return this;
  }

  // --- Actions (one per meaningful user interaction) ---
  async fillSomeField(value: string) {
    await this.someInput.fill(value);
    return this;
  }

  async submit() {
    await this.submitButton.click();
    return this;
  }

  // --- Assertions (named expectXxx, always return this) ---
  async expectSuccessState(expectedText: string) {
    await expect(
      this.submitButton,
      "Descriptive failure message for this assertion.",
    ).not.toBeVisible();
    // add more expects as needed
    return this;
  }
}
```

#### Key Rules

- **All locators declared at the top** as `private readonly` fields; assign in constructor — never inline in methods.
- **Locator priority**: `data-testid` → `getByRole` → `getByLabel` → `getByText`. Avoid CSS/XPath.
- **One action per method** — keep methods small and single-purpose.
- **Every method returns `this`** (or the next page object after navigation). This enables fluent chaining.
- **Assertion methods** use `expect(..., "human-readable failure message")` — the second argument is mandatory.
- **No string literals in tests** — all displayed text goes in `tests/i18n/index.ts` and is imported as `strings.<app>.<page>.<key>`.

### 4. Update i18n Strings

If assertions compare visible text, add the strings to `tests/i18n/index.ts`:

```ts
export const strings = {
  <app>: {
    <pageName>: {
      title: "Exact page title text",
      successHeading: "Welcome!",
      // ...
    },
  },
} as const;
```

### 5. Write the Spec File

```ts
// tests/<app>/<name>.spec.ts
import { test } from "@playwright/test";
import { <PageName>Page } from "../../src/pages/<app>/<name>.page";
import { strings } from "../i18n";

test("<descriptive test name>", async ({ page }) => {
  await new <PageName>Page(page)
    .goto()
    .then((p) => p.fillSomeField("value"))
    .then((p) => p.submit())
    .then((p) => p.expectSuccessState(strings.<app>.<pageName>.successHeading));
});
```

#### Test Rules

- Use `test("plain description", ...)` — no `test.only` or `test.skip` in committed code.
- All credentials via `process.env.VAR!`.
- No `page.waitForTimeout()` — rely on Playwright's built-in auto-wait and locator assertions.

### 6. Validate

Run in this order and fix all issues before finishing:

```bash
npm run typecheck   # zero TypeScript errors
npm run lint        # zero ESLint errors
```

If tests are also ready to run:

```bash
npm test            # headless run
```

---

## Real-World Example (TEG#B Login)

### Page Object — `src/pages/tegb/login.page.ts`

```ts
import { Page, expect } from "@playwright/test";

export class LoginPage {
  private readonly usernameInput;
  private readonly passwordInput;
  private readonly submitButton;
  private readonly logoutButton;
  private readonly dashboardHeader;
  private readonly loginTitle;

  constructor(private readonly page: Page) {
    this.usernameInput = page.locator('[data-testid="username-input"]');
    this.passwordInput = page.locator('[data-testid="password-input"]');
    this.submitButton = page.locator('[data-testid="submit-button"]');
    this.logoutButton = page.locator('[data-testid="logout-button"]');
    this.dashboardHeader = page.locator('[data-testid="dashboard-header"]');
    this.loginTitle = page.locator('[data-testid="login-title"]');
  }

  async goto() {
    await this.page.goto(process.env.TEGB_BASE_URL!);
    return this;
  }

  async fillUsername(username: string) {
    await this.usernameInput.fill(username);
    return this;
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
    return this;
  }

  async submit() {
    await this.submitButton.click();
    return this;
  }

  async logout() {
    await this.logoutButton.click();
    return this;
  }

  async expectDashboard(expectedHeading: string) {
    await expect(
      this.logoutButton,
      "Logout button should be visible after successful login.",
    ).toBeVisible();
    await expect(
      this.dashboardHeader,
      "Dashboard header should display the expected heading.",
    ).toHaveText(expectedHeading);
    return this;
  }

  async expectLoginPage(expectedTitle: string) {
    await expect(
      this.usernameInput,
      "Username input should be visible after logout.",
    ).toBeVisible();
    await expect(
      this.loginTitle,
      "Login title should display the expected text after logout.",
    ).toHaveText(expectedTitle);
    return this;
  }
}
```

### Spec — `tests/tegb/login_logout.spec.ts`

```ts
import { test } from "@playwright/test";
import { LoginPage } from "../../src/pages/tegb/login.page";
import { strings } from "../i18n";

test("login and logout", async ({ page }) => {
  await new LoginPage(page)
    .goto()
    .then((p) => p.fillUsername(process.env.TEGB_USER_EMAIL!))
    .then((p) => p.fillPassword(process.env.TEGB_USER_PASSWORD!))
    .then((p) => p.submit())
    .then((p) => p.expectDashboard(strings.tegb.dashboard.heading))
    .then((p) => p.logout())
    .then((p) => p.expectLoginPage(strings.tegb.login.title));
});
```

---

## Common Mistakes to Avoid

| Mistake                                | Correct Approach                                            |
| -------------------------------------- | ----------------------------------------------------------- |
| Inline locators inside action methods  | Always declare as `private readonly` fields in constructor  |
| Hard-coded strings in `expect()` calls | Use `strings.<app>.<page>.<key>` from `tests/i18n/index.ts` |
| `page.waitForTimeout()`                | Use locator assertions — Playwright auto-waits              |
| Forgetting `return this;`              | Every action and assertion method must return `this`        |
| Multiple actions in one method         | One user action per method for maximum reusability          |
| Hard-coded URLs or credentials         | Use `process.env.VAR!` exclusively                          |
| Guessing `data-testid` values          | Inspect the real page before writing locators               |
