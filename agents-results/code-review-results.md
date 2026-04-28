## Code Review — 2026-04-28

**Task:** Implement simple Tredgate QA Hub login → team navigation → logout E2E test  
**Plan ref:** `agents-results/plans/test-plan-tredgate-simple-123456.md`

### Summary

- Files reviewed: 6 (`login.page.ts`, `dashboard.page.ts`, `team.page.ts`, `login-team-flow.spec.ts`, `playwright.config.ts`, `.env.example`)
- Critical: 0 | Major: 1 | Minor: 5 | Info: 1

---

### tests/tredgate/pages/login.page.ts

| ID   | Severity | Line(s) | Description                                                                                                                                      |
| ---- | -------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| R1.4 | MINOR    | 4       | Class name `LoginPage` has no app prefix. Collisions are possible if a TEG#B login page is added. Rename to `TredgateLoginPage`.                  |

---

### tests/tredgate/pages/dashboard.page.ts

| ID   | Severity | Line(s) | Description                                                                                                                                      |
| ---- | -------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| R1.4 | MINOR    | 4       | Class name `DashboardPage` has no app prefix. Rename to `TredgateDashboardPage`.                                                                 |

---

### tests/tredgate/pages/team.page.ts

| ID   | Severity | Line(s) | Description                                                                                                                                                                                              |
| ---- | -------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R1.4 | MINOR    | 4       | Class name `TeamPage` has no app prefix. Rename to `TredgateTeamPage`.                                                                                                                                   |
| R2.5 | MINOR    | 23      | `logout()` is a navigation/transition action (it redirects back to the login page) but returns `this` (`TeamPage`) instead of a new `LoginPage` instance. The in-code TODO acknowledges this is deferred. |

---

### tests/tredgate/login-team-flow.spec.ts

| ID   | Severity | Line(s) | Description                                                                                                                                                                                                          |
| ---- | -------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R6.3 | MINOR    | 4       | Test description `"login, navigate to team page, and logout"` reads as a technical procedure, not user intent. Prefer `"user can log in, navigate to the team page, and log out"` per R6.3 naming convention.        |
| R4.4 | MAJOR    | 7       | `process.env.TREDGATE_USER_NAME` deviates from the established credential naming pattern. The analogous TEGB var is `TEGB_USER_EMAIL`; the Tredgate credential should follow the same pattern: `TREDGATE_USER_EMAIL`. |

---

### .env.example

| ID   | Severity | Line(s) | Description                                                                                                                                                                            |
| ---- | -------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R4.4 | MAJOR    | 6       | `TREDGATE_USER_NAME=` should be `TREDGATE_USER_EMAIL=` to be consistent with the `TEGB_USER_EMAIL` credential naming convention already present in this file. Update both files together. |

---

### playwright.config.ts

| ID   | Severity | Line(s) | Description                                                  |
| ---- | -------- | ------- | ------------------------------------------------------------ |
| —    | —        | —       | No violations found. `dotenv.config()` is correctly wired.   |

---

### Info

| ID   | Severity | File / Location                          | Description                                                                                                                                                                                                                                               |
| ---- | -------- | ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| —    | INFO     | `login-team-flow.spec.ts` L6             | The `/login` path suffix is concatenated as a string literal inside the `.goto()` call. This is acceptable (the host is env-driven), but if the login path ever changes it must be updated in the test. Consider making it a constant in the page object. |
| —    | INFO     | `agents-results/plans/test-plan-tredgate-simple-123456.md` | The plan specifies `src/pages/tredgate/` as the file location, which conflicts with the project structure defined in `copilot-instructions.md` (`tests/<app>/pages/`). The engineer correctly followed `copilot-instructions.md`. The plan contains a typo and should be corrected. |

---

### Verdict

Overall health: **NEEDS WORK**

Top 3 actions to take:

1. **(MAJOR — R4.4)** Rename `TREDGATE_USER_NAME` → `TREDGATE_USER_EMAIL` in both `.env.example` and `login-team-flow.spec.ts`, and update your local `.env` accordingly. This aligns with the existing `TEGB_USER_EMAIL` naming pattern.

2. **(MINOR — R1.4)** Add the `Tredgate` prefix to all three class names (`LoginPage` → `TredgateLoginPage`, `DashboardPage` → `TredgateDashboardPage`, `TeamPage` → `TredgateTeamPage`) to prevent future naming collisions when TEGB pages are added to the same project.

3. **(MINOR — R2.5 + R6.3)** Fix the two remaining polish items: have `logout()` return `new LoginPage(this.page)` (and add a post-logout URL assertion), and rephrase the test description to express user intent.
