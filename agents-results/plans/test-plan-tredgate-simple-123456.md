# Test Plan — Tredgate QA Hub: Login → Team Navigation → Logout

- **Date**: 2026-04-28 00:00
- **Brief**: Verify that a user can log in to Tredgate QA Hub, assert the sidebar is visible, navigate to the team page, assert the members table is visible, and log out.
- **Source**: user prompt
- **App**: Tredgate QA Hub

---

## Scope

A single happy-path end-to-end flow covering authentication, sidebar visibility, team page navigation, and logout. No negative or edge-case scenarios are in scope.

---

## Affected & New Files

| Path                                          | Status | Purpose                                                    |
| --------------------------------------------- | ------ | ---------------------------------------------------------- |
| `src/pages/tredgate/login.page.ts`            | NEW    | Page object for the login screen                           |
| `src/pages/tredgate/dashboard.page.ts`        | NEW    | Page object for the post-login dashboard (sidebar + nav)   |
| `src/pages/tredgate/team.page.ts`             | NEW    | Page object for the team page (members table + logout)     |
| `tests/tredgate/login-team-flow.spec.ts`      | NEW    | End-to-end test case                                       |
| `.env.example`                                | MODIFY | Add `TREDGATE_USER_NAME` and `TREDGATE_USER_PASSWORD` keys |
| `playwright.config.ts`                        | MODIFY | Uncomment `dotenv` import and `dotenv.config()` call       |

> No `tests/i18n/` changes are required — all assertions in this plan are visibility checks, not text comparisons.

---

## Test Scenarios

### Scenario 1 — Login, navigate to team page, and logout

- **Given** the user navigates to the Tredgate QA Hub login page (`TREDGATE_BASE_URL + '/login'`)
- **When** they fill the username field with `process.env.TREDGATE_USER_NAME!` and the password field with `process.env.TREDGATE_USER_PASSWORD!`, then click the login button
- **Then** the sidebar navigation element is visible (post-login dashboard is loaded)
- **When** they click the team menu link in the sidebar
- **Then** the members table is visible (team page is loaded)
- **When** they click the logout button in the sidebar
- **Then** the action completes without error (no post-logout assertion is specified in the brief)

**Page object methods needed**:

| Page object    | Methods                                          |
| -------------- | ------------------------------------------------ |
| `LoginPage`    | `goto()`, `fillUsername(v)`, `fillPassword(v)`, `submit()` → returns `DashboardPage` |
| `DashboardPage`| `expectSidebarVisible()`, `goToTeam()` → returns `TeamPage` |
| `TeamPage`     | `expectMembersTableVisible()`, `logout()`        |

---

## Locator Strategy

All locators are supplied verbatim from the brief. Use `page.locator(selector)` for `data-testid` CSS selectors — do **not** convert them to `getByTestId` (the project convention is `page.locator('[data-testid="..."]')`).

| Element         | Locator                                        | Page object    |
| --------------- | ---------------------------------------------- | -------------- |
| Username input  | `[data-testid="login-input-username"]`         | `LoginPage`    |
| Password input  | `[data-testid="login-input-password"]`         | `LoginPage`    |
| Login button    | `[data-testid="login-btn-submit"]`             | `LoginPage`    |
| Sidebar nav     | `[data-testid="sidebar-nav"]`                  | `DashboardPage`|
| Team menu link  | `[data-testid="sidebar-link-team"]`            | `DashboardPage`|
| Members table   | `[data-testid="team-list-table"]`              | `TeamPage`     |
| Logout button   | `[data-testid="sidebar-btn-logout"]`           | `TeamPage`     |

---

## Data Strategy

| Input             | Source                            |
| ----------------- | --------------------------------- |
| Base URL          | `process.env.TREDGATE_BASE_URL!`  |
| Username          | `process.env.TREDGATE_USER_NAME!` |
| Password          | `process.env.TREDGATE_USER_PASSWORD!` |

Add both new keys to `.env.example` with empty values. The `.env` file (not committed) should hold the actual values `admin` / `admin123`.

---

## Prerequisites for the Engineer

1. **`playwright.config.ts`** — Uncomment the two `dotenv` lines so that `.env` is loaded before tests run. No `baseURL` change is needed; `LoginPage.goto()` will use the full URL.
2. **`.env.example`** — Append `TREDGATE_USER_NAME=` and `TREDGATE_USER_PASSWORD=` (keeping the existing `TREDGATE_BASE_URL=` entry).
3. **`src/pages/tredgate/`** directory does not exist yet — create it as part of this work.

---

## Risks & Open Questions

- No post-logout assertion is defined in the brief. The engineer should implement only the logout click and leave a `// TODO: assert redirect to login` comment so a future task can add it without changing the plan.
