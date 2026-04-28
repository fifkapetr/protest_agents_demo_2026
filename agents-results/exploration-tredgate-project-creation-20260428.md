# App Discovery Report — Login + Project Creation

- **Date**: 2026-04-28 17:42
- **App**: Tredgate QA Hub
- **Entry URL**: `TREDGATE_BASE_URL` → `https://tredgate-training-qa-hub-74e558f9052f.herokuapp.com`
- **Manager brief**: Capture all locators and observable behavior for the login flow and the end-to-end project creation wizard on Tredgate QA Hub.

---

## Scope

- Login page: all interactive elements and post-login redirect
- Dashboard: sidebar navigation to reach Projects
- Projects list page: heading, "New Project" button
- Project creation wizard (all 4 steps): field locators, required fields, validation errors, submit
- Project detail page: URL pattern, assertable elements after successful creation

## Out of Scope

- Negative / error paths (invalid credentials, duplicate code, missing required fields edge cases)
- Team, Settings, Users, Reports, Defects, Test Plans pages
- Edit / delete project flows
- Pagination and filtering on the projects list

---

## Flow Steps

| #   | Action                                   | Locator / Selector                                                                | Notes                                                                              |
| --- | ---------------------------------------- | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| 1   | Navigate to login page                   | n/a                                                                               | URL: `/login`                                                                      |
| 2   | Fill username                            | `getByTestId('login-input-username')`                                             | `<input type="text" placeholder="Enter username">`, name attr: `username`          |
| 3   | Fill password                            | `getByTestId('login-input-password')`                                             | `<input type="password" placeholder="Enter password">`, name attr: `password`      |
| 4   | Click Sign In                            | `getByTestId('login-btn-submit')`                                                 | `<button type="submit">Sign In</button>`                                           |
| 5   | Wait for dashboard                       | `page.waitForURL(/dashboard/)`                                                    | Redirects to `/dashboard` on success                                               |
| 6   | Click Projects in sidebar                | `getByTestId('sidebar-link-projects')`                                            | `<a href="/projects">Projects</a>`                                                 |
| 7   | Wait for Projects page                   | `page.waitForURL(/\/projects$/)`                                                  | URL: `/projects`; heading h1 "Projects" appears                                    |
| 8   | Click New Project                        | `getByTestId('project-list-btn-new')`                                             | `<a href="/projects/new">New Project</a>`, link (not button)                       |
| 9   | Wait for Create Project page             | `page.waitForURL(/\/projects\/new/)`                                              | URL: `/projects/new`; heading h1 "Create Project" appears                          |
| 10  | **Step 1 — Basic Info**                  |                                                                                   |                                                                                    |
| 11  | Fill Project Name                        | `getByTestId('project-form-input-name')`                                          | `<input type="text" name="name">` — **required** (asterisk label)                 |
| 12  | Fill Project Code                        | `getByTestId('project-form-input-code')`                                          | `<input type="text" placeholder="e.g., PROJ001" name="code">` — **required**       |
| 13  | Fill Description                         | `getByTestId('project-form-input-description')`                                   | `<textarea name="description">` — **required**                                     |
| 14  | Set Status (default: Planning)           | `getByTestId('project-form-select-status')`                                       | `<select name="status">` — options: `Planning` (default), `Active`, `Archived`    |
| 15  | Click Next                               | `getByTestId('project-form-wizard-btn-next')`                                     | Advances to Step 2; URL stays `/projects/new`                                      |
| 16  | **Step 2 — Team Assignment**             |                                                                                   |                                                                                    |
| 17  | Select QA Lead                           | `getByTestId('project-form-select-lead')`                                         | `<select>` — options: `Select QA Lead` (placeholder), `Laura Lead`, `Alex Admin`   |
| 18  | (Optional) Select Team Members           | `getByTestId('project-form-select-members')`                                      | Custom multi-select rendered as `<button>Select options...</button>` — **optional** |
| 19  | Click Next                               | `getByTestId('project-form-wizard-btn-next')`                                     | Advances to Step 3                                                                 |
| 20  | **Step 3 — Environments** (≥ 1 required) |                                                                                   |                                                                                    |
| 21  | Click Add Environment                    | `getByTestId('project-form-btn-add-env')`                                         | Renders one environment row (index `0`)                                            |
| 22  | Fill environment Name                    | `getByTestId('project-form-env-name-0')`                                          | `<input type="text">` — no HTML `required` attr but validated by form logic        |
| 23  | Set environment Type                     | `getByTestId('project-form-env-type-0')`                                          | `<select>` — options: `Dev`, `Staging`, `Production`                               |
| 24  | Fill environment URL                     | `getByTestId('project-form-env-url-0')`                                           | `<input type="text">` — no HTML `required` attr                                    |
| 25  | Click Next                               | `getByTestId('project-form-wizard-btn-next')`                                     | Advances to Step 4 (Review); blocked if no environment added                       |
| 26  | **Step 4 — Review**                      |                                                                                   |                                                                                    |
| 27  | Verify summary fields                    | `getByTestId('project-form-text-review-name')`, `-code`, `-status`, `-lead`       | Readonly summary of all entered data                                               |
| 28  | Click Submit                             | `getByTestId('project-form-wizard-btn-submit')`                                   | `<button>Submit</button>`                                                          |
| 29  | Wait for project detail page             | `page.waitForURL(/\/projects\/\d+/)`                                              | Redirects to `/projects/{id}` where `{id}` is a numeric integer                   |

---

## Observable Assertions

### After Step 4 (login succeeded, on dashboard):
- `page.url()` matches `/dashboard`
- `getByTestId('page-header-title')` → h1 with text `"Dashboard"`

### After navigating to Projects page:
- `page.url()` matches `/projects`
- `getByTestId('page-header-title')` → h1 with text `"Projects"`
- `getByTestId('project-list-btn-new')` is visible

### After form submission (on project detail page):
- `page.url()` matches `/projects/<numeric-id>` — e.g. `/projects/4`
- `getByTestId('page-header-title')` → h1 with text equal to the submitted project name
- `getByTestId('project-detail-badge-status')` is visible with text matching the submitted status (e.g. `"Planning"`)
- `getByTestId('project-detail-text-description')` is visible with text matching the submitted description

---

## Detailed Locator Reference

### Login Page (`/login`)

| Element          | `data-testid`            | Tag / Type         | Accessible via                                     |
| ---------------- | ------------------------ | ------------------ | -------------------------------------------------- |
| Page heading     | `login-heading-title`    | `h1`               | `getByRole('heading', { name: 'Tredgate QA Hub' })` |
| Tagline          | `login-text-tagline`     | `p`                | text "Sign in to continue"                         |
| Username field   | `login-input-username`   | `input[type=text]` | `getByTestId` / `getByPlaceholder('Enter username')` |
| Password field   | `login-input-password`   | `input[type=password]` | `getByTestId` / `getByPlaceholder('Enter password')` |
| Remember me      | `login-checkbox-remember`| `input[type=checkbox]` | optional; `getByTestId`                        |
| Submit button    | `login-btn-submit`       | `button[type=submit]` | `getByTestId` / `getByRole('button', { name: 'Sign In' })` |

### Dashboard Page (`/dashboard`)

| Element               | `data-testid`            | Notes                           |
| --------------------- | ------------------------ | ------------------------------- |
| Page heading          | `page-header-title`      | h1 "Dashboard"                  |
| Projects nav link     | `sidebar-link-projects`  | `<a href="/projects">`          |
| Logout button         | `sidebar-btn-logout`     | triggers logout, redirects to `/login` |

### Projects List Page (`/projects`)

| Element               | `data-testid`                    | Notes                                  |
| --------------------- | -------------------------------- | -------------------------------------- |
| Page heading          | `page-header-title`              | h1 "Projects"                          |
| New Project button    | `project-list-btn-new`           | `<a href="/projects/new">New Project`  |
| Search field          | `project-list-input-search`      | optional, not needed for creation flow |
| Status filter         | `project-list-select-status-filter` | optional, not needed for creation flow |
| Table rows            | `project-list-row-{n}` (0-based) | clickable rows                         |
| Project name cell     | `project-list-cell-name-{n}`     | e.g. `project-list-cell-name-0`        |

### Project Creation Wizard (`/projects/new`)

#### Step 1 — Basic Info

| Element          | `data-testid`                       | Required | Notes                                              |
| ---------------- | ----------------------------------- | -------- | -------------------------------------------------- |
| Step container   | `project-form-step-1`               | —        |                                                    |
| Project Name     | `project-form-input-name`           | **Yes**  | `<input type="text" name="name">` — no placeholder |
| Project Code     | `project-form-input-code`           | **Yes**  | `<input placeholder="e.g., PROJ001" name="code">` |
| Description      | `project-form-input-description`    | **Yes**  | `<textarea name="description">`                    |
| Status select    | `project-form-select-status`        | **Yes**  | `<select>` — defaults to `planning`; label values: `Planning`, `Active`, `Archived` |
| Cancel button    | `project-form-wizard-btn-cancel`    | —        | navigates back to `/projects`                      |
| Next button      | `project-form-wizard-btn-next`      | —        | `<button>Next</button>`                            |

#### Step 2 — Team Assignment

| Element          | `data-testid`                       | Required | Notes                                                              |
| ---------------- | ----------------------------------- | -------- | ------------------------------------------------------------------ |
| Step container   | `project-form-step-2`               | —        |                                                                    |
| QA Lead select   | `project-form-select-lead`          | **Yes*** | `<select>` — options: `Select QA Lead` (placeholder), `Laura Lead`, `Alex Admin` |
| Team Members     | `project-form-select-members`       | No       | Custom multi-select component rendered as `<button>` — **optional** |
| Back button      | `project-form-wizard-btn-back`      | —        |                                                                    |
| Next button      | `project-form-wizard-btn-next`      | —        |                                                                    |

> **\* Risk note**: QA Lead is labeled with an asterisk indicating "required", but during exploration the form advanced to Step 3 even when `selectOption` failed due to a timing issue. The first available option (`Laura Lead`) appeared pre-selected in the review. Analyst should verify whether the form enforces this validation or defaults to the first option.

#### Step 3 — Environments

| Element                 | `data-testid`                      | Required | Notes                                              |
| ----------------------- | ---------------------------------- | -------- | -------------------------------------------------- |
| Step container          | `project-form-step-3`              | —        |                                                    |
| Validation error        | `project-form-envs-error`          | —        | Text: "At least one environment is required"; appears on premature Next click |
| No environments text    | `project-form-text-no-environments`| —        | Text: "No environments added yet."                 |
| Add Environment button  | `project-form-btn-add-env`         | —        | Adds a new environment row (indexed from 0)        |
| Env row (n)             | `project-form-env-row-{n}`         | —        |                                                    |
| Env Name (n)            | `project-form-env-name-{n}`        | **Yes**  | `<input type="text">` — no placeholder             |
| Env Type (n)            | `project-form-env-type-{n}`        | **Yes**  | `<select>` — options: `Dev`, `Staging`, `Production`|
| Env URL (n)             | `project-form-env-url-{n}`         | **Yes**  | `<input type="text">` — no placeholder             |
| Remove env (n)          | `project-form-btn-remove-env-{n}`  | —        | `<button>` with icon, no text                      |
| Back button             | `project-form-wizard-btn-back`     | —        |                                                    |
| Next button             | `project-form-wizard-btn-next`     | —        |                                                    |

> **Note on environment fields**: `required` HTML attribute is absent on env inputs; validation is enforced at the step level (must have ≥ 1 row). Individual field-level validation (e.g. Name blank) was not tested — out of scope.

#### Step 4 — Review (Read-only summary)

| Element                  | `data-testid`                          | Notes                                          |
| ------------------------ | -------------------------------------- | ---------------------------------------------- |
| Step container           | `project-form-step-4`                  |                                                |
| Review name value        | `project-form-text-review-name`        | `<span>` — asserts entered name is correct     |
| Review code value        | `project-form-text-review-code`        | `<span>`                                       |
| Review status value      | `project-form-text-review-status`      | `<span>`                                       |
| Review description value | `project-form-text-review-description` | `<span>`                                       |
| Review lead value        | `project-form-text-review-lead`        | `<span>` — displays selected QA Lead name      |
| Review members count     | `project-form-text-review-members`     | `<span>` — displays integer count              |
| Env summary row (n)      | `project-form-review-env-name-{n}`     | `<span>` — "Name (type)" format, e.g. "Production (production)" |
| Env URL row (n)          | `project-form-review-env-url-{n}`      | `<span>`                                       |
| Back button              | `project-form-wizard-btn-back`         |                                                |
| Submit button            | `project-form-wizard-btn-submit`       | `<button>Submit</button>`                      |

### Project Detail Page (`/projects/{id}`)

| Element            | `data-testid`                        | Notes                                                     |
| ------------------ | ------------------------------------ | --------------------------------------------------------- |
| Page container     | `project-detail-page`                |                                                           |
| Page heading       | `page-header-title`                  | h1 — project name (e.g. "Exploration Project")            |
| Edit link          | `project-detail-btn-edit`            | `<a>Edit</a>`                                             |
| Delete button      | `project-detail-btn-delete`          | `<button>` with icon, no text                             |
| Status badge       | `project-detail-badge-status`        | `<span>` — e.g. "Planning"                                |
| QA Lead avatar     | `project-detail-lead-avatar`         | `<div>` — initials + name                                 |
| Description text   | `project-detail-text-description`    | `<p>` — matches submitted description                     |
| Created date       | `project-detail-text-created-at`     | `<p>` — date string e.g. "4/28/2026"                     |
| Environments table | `project-detail-env-table`           | `<table>`                                                 |
| Env name cell      | `project-detail-env-cell-name-{n}`   | 1-based index, e.g. `project-detail-env-cell-name-1`      |
| Env type cell      | `project-detail-env-cell-type-{n}`   | lowercase type value, e.g. "production"                   |
| Env URL cell       | `project-detail-env-cell-url-{n}`    | URL as entered                                            |

---

## Page Transitions & Loading States

| Transition                               | What to wait for                                                    |
| ---------------------------------------- | ------------------------------------------------------------------- |
| Login → Dashboard                        | `page.waitForURL(/\/dashboard/)` after clicking Sign In             |
| Dashboard → Projects                     | `page.waitForURL(/\/projects$/)` or heading "Projects" to be visible|
| Projects → New Project form              | `page.waitForURL(/\/projects\/new/)` or heading "Create Project"    |
| Wizard step advance (Next click)         | URL does not change; wait for next step's container to appear, e.g. `getByTestId('project-form-step-2')` |
| Step 3 "Add Environment" click           | `getByTestId('project-form-env-row-0')` to appear                  |
| Submit → Project Detail                  | `page.waitForURL(/\/projects\/\d+/)` — redirects to numeric ID     |

---

## Risks & Open Questions

1. **QA Lead required validation**: The form label shows `QA Lead*`, but the wizard advanced without an explicit selection during exploration (the first non-placeholder option `Laura Lead` appeared in the Review). **Analyst should confirm**: is a valid selection enforced, or does the form default to the first option?

2. **Environment field validation**: The Name, Type, and URL fields within an environment row have no HTML `required` attribute. It's unknown whether submitting a row with a blank Name or URL produces a validation error. Not tested (out of scope).

3. **Team Members multi-select**: `project-form-select-members` renders as a `<button>` (custom component), not a native `<select>`. Interacting with it requires clicking the button and then selecting items from a custom dropdown. Since Team Members is optional, this was not explored further.

4. **Project Code uniqueness**: The existing projects use codes `PHOENIX`, `ATLAS`, `NEBULA`. Tests should generate unique codes (e.g. via `faker`) to avoid conflicts with pre-seeded data. A `Reset Data` button exists in the footer (`footer-btn-reset`) that appears to restore seeded state.

5. **Numeric project ID**: The project ID in the URL is assigned by the backend (`/projects/4` was created during this session). Tests must capture the ID from the redirected URL rather than asserting a hardcoded value.

---

## Suggested Page Objects

- `tests/tredgate/pages/login.page.ts` — already exists; verify testid-based locators match above
- `tests/tredgate/pages/projects-list.page.ts` — new; covers `/projects`
- `tests/tredgate/pages/project-create.page.ts` — new; covers `/projects/new` wizard (all 4 steps)
- `tests/tredgate/pages/project-detail.page.ts` — new; covers `/projects/{id}`
