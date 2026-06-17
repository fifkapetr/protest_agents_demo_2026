# Test Plan — Tredgate QA Hub: Login → Team Navigation → Logout

- **Date**: 2026-04-28 00:00
- **Brief**: Write a Playwright E2E test covering login, navigation to the team page, and logout on the Tredgate QA Hub application.
- **Source**: user prompt (fully specified — no exploration report)
- **App**: Tredgate QA Hub (`https://tredgate-training-qa-hub-74e558f9052f.herokuapp.com`)

---

## Scope

Single happy-path flow: authenticate via the login form, verify post-login sidebar, navigate to the team page, verify the members table, then log out.

---

## Affected & New Files

| Path                                       | Status | Purpose                                                                                                                      |
| ------------------------------------------ | ------ | ---------------------------------------------------------------------------------------------------------------------------- |
| `tests/tredgate/pages/login.page.ts`       | NEW    | Page object: login form + sidebar assertion + team nav                                                                       |
| `tests/tredgate/pages/team.page.ts`        | NEW    | Page object: team page assertion + logout                                                                                    |
| `tests/tredgate/tredgate-team-nav.spec.ts` | NEW    | Spec: login → team nav → logout                                                                                              |
| `tests/i18n/index.ts`                      | NEW    | i18n strings file (Tredgate section; no text assertions required for this test, but file must exist per project conventions) |
| `.env.example`                             | NEW    | Template env vars for Tredgate credentials and base URL                                                                      |
| `playwright.config.ts`                     | MODIFY | Uncomment dotenv loading so `process.env.*` is populated at runtime                                                          |

---

## Prerequisite: Enable dotenv in `playwright.config.ts`

The current `playwright.config.ts` has dotenv loading commented out. The engineer **must** uncomment those lines before `process.env.TREDGATE_*` will be populated:

```ts
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, ".env") });
```

This is a **blocker** — without it all `process.env.*` references in page objects and specs will be `undefined` at runtime.

---

## Test Scenarios

### Scenario 1 — Happy path: login → team page → logout

- **Given** the user navigates to the Tredgate QA Hub login page
- **When** they fill in valid credentials (`TREDGATE_USER_EMAIL`, `TREDGATE_USER_PASSWORD`) and submit
- **Then** the sidebar navigation is visible
- **When** they click the team menu item in the sidebar
- **Then** the members table on the team page is visible
- **When** they click the logout button
- **Then** the logout action completes (navigation away from authenticated area)

**Page object methods needed:**

| Step                         | Page object | Method                                         |
| ---------------------------- | ----------- | ---------------------------------------------- |
| Navigate to login            | `LoginPage` | `goto()`                                       |
| Fill username                | `LoginPage` | `fillUsername(username: string)`               |
| Fill password                | `LoginPage` | `fillPassword(password: string)`               |
| Submit login                 | `LoginPage` | `submit()` → returns `LoginPage`               |
| Assert sidebar visible       | `LoginPage` | `expectSidebarVisible()` → returns `this`      |
| Click team menu              | `LoginPage` | `navigateToTeam()` → returns `TeamPage`        |
| Assert members table visible | `TeamPage`  | `expectMembersTableVisible()` → returns `this` |
| Logout                       | `TeamPage`  | `logout()`                                     |

---

## Page Object Design

### `LoginPage` — `tests/tredgate/pages/login.page.ts`

**Private locator fields** (declare all in constructor):

| Field name      | Locator                                                |
| --------------- | ------------------------------------------------------ |
| `usernameInput` | `page.locator('[data-testid="login-input-username"]')` |
| `passwordInput` | `page.locator('[data-testid="login-input-password"]')` |
| `submitButton`  | `page.locator('[data-testid="login-btn-submit"]')`     |
| `sidebarNav`    | `page.locator('[data-testid="sidebar-nav"]')`          |
| `teamLink`      | `page.locator('[data-testid="sidebar-link-team"]')`    |

**Methods:**

- `goto()` — `page.goto(process.env.TREDGATE_BASE_URL!)` → returns `this`
- `fillUsername(username: string)` — fills `usernameInput` → returns `this`
- `fillPassword(password: string)` — fills `passwordInput` → returns `this`
- `submit()` — clicks `submitButton` → returns `this`
- `expectSidebarVisible()` — `expect(sidebarNav, "Sidebar should be visible after login").toBeVisible()` → returns `this`
- `navigateToTeam()` — clicks `teamLink`, returns `new TeamPage(this.page)`

### `TeamPage` — `tests/tredgate/pages/team.page.ts`

**Private locator fields:**

| Field name     | Locator                                              |
| -------------- | ---------------------------------------------------- |
| `membersTable` | `page.locator('[data-testid="team-list-table"]')`    |
| `logoutButton` | `page.locator('[data-testid="sidebar-btn-logout"]')` |

**Methods:**

- `expectMembersTableVisible()` — `expect(membersTable, "Members table should be visible on team page").toBeVisible()` → returns `this`
- `logout()` — clicks `logoutButton` → returns `this`

---

## Locator Strategy

| Element        | Locator (verbatim from brief)          |
| -------------- | -------------------------------------- |
| Username input | `[data-testid="login-input-username"]` |
| Password input | `[data-testid="login-input-password"]` |
| Login button   | `[data-testid="login-btn-submit"]`     |
| Sidebar nav    | `[data-testid="sidebar-nav"]`          |
| Team menu link | `[data-testid="sidebar-link-team"]`    |
| Members table  | `[data-testid="team-list-table"]`      |
| Logout button  | `[data-testid="sidebar-btn-logout"]`   |

All locators use `page.locator(selector)` with the `data-testid` CSS selector strings above.

---

## Data Strategy

| Input          | Source                                |
| -------------- | ------------------------------------- |
| Username       | `process.env.TREDGATE_USER_EMAIL!`    |
| Password       | `process.env.TREDGATE_USER_PASSWORD!` |
| Login page URL | `process.env.TREDGATE_BASE_URL!`      |

`.env.example` must include:

```
TREDGATE_BASE_URL=https://tredgate-training-qa-hub-74e558f9052f.herokuapp.com
TREDGATE_USER_EMAIL=
TREDGATE_USER_PASSWORD=
```

---

## i18n Notes

This test contains **no text-content assertions** — all assertions are visibility checks on locators. The `tests/i18n/index.ts` file must still be created (project convention requires it), with an empty `tredgate` section ready for future string additions:

```ts
export const strings = {
  tredgate: {},
} as const;
```

---

## Risks & Open Questions

1. **dotenv not loaded in `playwright.config.ts`** — The engineer must uncomment the dotenv block before `process.env.TREDGATE_*` is available. Without this change the test will fail at runtime with `undefined` credentials.
2. **`TREDGATE_BASE_URL` env var not yet defined** — The project's `.env.example` does not exist yet. The engineer must create it and document the three Tredgate env vars listed above.
