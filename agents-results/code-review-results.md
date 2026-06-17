## Code Review — 2026-04-28

### Summary

- Files reviewed: 6 (`playwright.config.ts`, `.env.example`, `tests/i18n/index.ts`, `tests/tredgate/pages/login.page.ts`, `tests/tredgate/pages/team.page.ts`, `tests/tredgate/tredgate-team-nav.spec.ts`)
- Critical: 0 | Major: 7 | Minor: 4 | Info: 1

---

### `playwright.config.ts`

| ID  | Severity | Line(s) | Description                                                                                                                                                                         |
| --- | -------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| —   | INFO     | 30      | No `baseURL` is configured for the Tredgate project. The URL is consumed inside the Page Object directly. Centralising it here would make project-wide URL changes a one-line edit. |

---

### `.env.example`

| ID   | Severity | Line(s) | Description                                                                                                                                                                                  |
| ---- | -------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R4.4 | MAJOR    | 1–3     | Env var names `TREDGATE_BASE_URL`, `TREDGATE_USER_EMAIL`, `TREDGATE_USER_PASSWORD` deviate from the project convention. Convention requires `QA_HUB_URL`, `QA_HUB_EMAIL`, `QA_HUB_PASSWORD`. |

---

### `tests/i18n/index.ts`

| ID   | Severity | Line(s) | Description                                                                                                                                                                                                                                            |
| ---- | -------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| R6.4 | MINOR    | 1–3     | File is named `index.ts` and exports as `strings`. Convention requires the file be named `<app>Text.ts` (e.g. `tredgateText.ts`) and exported as `tredgateText`. The `tredgate` namespace is also empty — no assertion strings have been recorded yet. |

---

### `tests/tredgate/pages/login.page.ts`

| ID   | Severity | Line(s) | Description                                                                                                                                                                              |
| ---- | -------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R1.1 | MAJOR    | 1       | Page Object is located in `tests/tredgate/pages/` — rule requires `src/pages/<app>/`.                                                                                                    |
| R1.4 | MINOR    | 4       | Class is named `LoginPage`; convention requires an app-prefix to prevent collisions: `TredgateLoginPage`.                                                                                |
| R2.3 | MAJOR    | 20      | `goto()` reads `process.env.TREDGATE_BASE_URL!` internally. Rule requires the URL be passed as an argument: `async goto(url: string)`. Page Objects should not reach into `process.env`. |
| R4.4 | MAJOR    | 20      | References non-standard env var `TREDGATE_BASE_URL`; should be `QA_HUB_URL`.                                                                                                             |

---

### `tests/tredgate/pages/team.page.ts`

| ID   | Severity | Line(s) | Description                                                                                                                                                                                                            |
| ---- | -------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R1.1 | MAJOR    | 1       | Page Object is located in `tests/tredgate/pages/` — rule requires `src/pages/<app>/`.                                                                                                                                  |
| R1.4 | MINOR    | 4       | Class is named `TeamPage`; convention requires an app-prefix: `TredgateTeamPage`.                                                                                                                                      |
| R2.5 | MAJOR    | 21      | `logout()` is a transition method (it navigates away from the team page back to login) but returns `Promise<this>` instead of `new TredgateLoginPage(this.page)`. Transition methods must return the next Page Object. |

---

### `tests/tredgate/tredgate-team-nav.spec.ts`

| ID   | Severity | Line(s) | Description                                                                                                                                                                                       |
| ---- | -------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R4.4 | MAJOR    | 9–10    | References `TREDGATE_USER_EMAIL` and `TREDGATE_USER_PASSWORD`; convention requires `QA_HUB_EMAIL` and `QA_HUB_PASSWORD`.                                                                          |
| R6.3 | MINOR    | 4       | Test description `"login, navigate to team page, verify members table, and logout"` reads as a step list, not user intent. Prefer: `"authenticated user can navigate to team page and sign out"`. |

---

### Verdict

**Overall health: NEEDS WORK**

Top 3 actions to take:

1. **Rename env vars** throughout `.env.example`, `login.page.ts`, and the spec to `QA_HUB_URL` / `QA_HUB_EMAIL` / `QA_HUB_PASSWORD` (fixes R4.4 — the single most widespread inconsistency).
2. **Fix `goto()`** in `LoginPage` to accept the URL as a parameter (R2.3), and fix `logout()` in `TeamPage` to return `new TredgateLoginPage(this.page)` (R2.5) — both are structural Page Object violations that will cause maintenance pain.
3. **Add app-prefix to class names** (`TredgateLoginPage`, `TredgateTeamPage`) and **move files to `src/pages/tredgate/`** to align with R1.4 and R1.1.
