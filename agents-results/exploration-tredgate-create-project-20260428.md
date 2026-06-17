# App Discovery Report — Create Project (Happy-Day Flow)

- **Date**: 2026-04-28 14:42
- **App**: Tredgate QA Hub
- **Entry URL**: `TREDGATE_BASE_URL` → `https://tredgate-training-qa-hub-74e558f9052f.herokuapp.com`
- **Manager brief**: Discover all locators, form fields, and assertion targets for the happy-day path of creating a new project in the Tredgate QA Hub.

---

## Scope

Full create-project wizard from login through form submission to project detail page. Covers:

- Login page
- Projects list page
- 4-step Create Project wizard (Basic Info → Team Assignment → Environments → Review)
- Project detail page (post-submission success state)

## Out of Scope

- Negative / validation scenarios (missing required fields, duplicate project code, invalid URL format)
- Team Members multi-select interaction (optional field)
- Adding more than one environment
- Editing or deleting an existing project
- Any other section of the app (Defects, Test Plans, Reports, Settings)

---

## Flow Steps

| #  | Action                                      | Locator                                                                 | URL at this step                              | Notes                                                         |
|----|---------------------------------------------|-------------------------------------------------------------------------|-----------------------------------------------|---------------------------------------------------------------|
| 1  | Navigate to login page                      | n/a                                                                     | `/login`                                      | Loaded from `TREDGATE_BASE_URL/login`                         |
| 2  | Fill Username                               | `getByTestId('login-input-username')`                                   | `/login`                                      | Value: `TREDGATE_ADMIN_USERNAME`                              |
| 3  | Fill Password                               | `getByTestId('login-input-password')`                                   | `/login`                                      | Value: `TREDGATE_ADMIN_PASSWORD`                              |
| 4  | Click Sign In                               | `getByTestId('login-btn-submit')`                                       | `/login` → redirects to `/dashboard`          | Button text: "Sign In"                                        |
| 5  | Click Projects in sidebar                   | `getByTestId('sidebar-link-projects')`                                  | `/projects`                                   | Link text: "Projects"                                         |
| 6  | Click New Project button                    | `getByTestId('project-list-btn-new')`                                   | `/projects/new`                               | Link text: "New Project"; located in page header              |
| 7  | Fill Project Name (Step 1)                  | `getByTestId('project-form-input-name')`                                | `/projects/new`                               | Required; label "Project Name*"                               |
| 8  | Fill Project Code (Step 1)                  | `getByTestId('project-form-input-code')`                                | `/projects/new`                               | Required; label "Project Code*"; placeholder "e.g., PROJ001" |
| 9  | Fill Description (Step 1)                   | `getByTestId('project-form-input-description')`                         | `/projects/new`                               | Required; label "Description*"; `<textarea>`                  |
| 10 | Status is pre-set to "Planning" (Step 1)    | `getByTestId('project-form-select-status')`                             | `/projects/new`                               | Required; default value = "Planning"; options: Planning, Active, Archived |
| 11 | Click Next (Step 1 → Step 2)                | `getByTestId('project-form-wizard-btn-next')`                           | `/projects/new`                               | URL does not change; wizard is client-side                    |
| 12 | Select QA Lead (Step 2)                     | `getByTestId('project-form-select-lead')`                               | `/projects/new`                               | Required; label "QA Lead*"; option text "Laura Lead"          |
| 13 | Team Members left unset (Step 2)            | `getByTestId('project-form-select-members')`                            | `/projects/new`                               | Optional; label "Team Members" (no asterisk); skip for happy-day |
| 14 | Click Next (Step 2 → Step 3)                | `getByTestId('project-form-wizard-btn-next')`                           | `/projects/new`                               |                                                               |
| 15 | Click Add Environment (Step 3)              | `getByTestId('project-form-btn-add-env')`                               | `/projects/new`                               | **At least one environment is required** (error shown if skipped) |
| 16 | Fill Environment Name (Step 3)              | `getByTestId('project-form-env-name-0')`                                | `/projects/new`                               | Label "Name"; index-based suffix `-0` for first row           |
| 17 | Environment Type left as "Dev" (Step 3)     | `getByTestId('project-form-env-type-0')`                                | `/projects/new`                               | Label "Type"; default = "Dev"; options: Dev, Staging, Production |
| 18 | Fill Environment URL (Step 3)               | `getByTestId('project-form-env-url-0')`                                 | `/projects/new`                               | Label "URL"; no HTML `required` attribute but supply a value  |
| 19 | Click Next (Step 3 → Step 4 Review)         | `getByTestId('project-form-wizard-btn-next')`                           | `/projects/new`                               |                                                               |
| 20 | Verify review summary (Step 4)              | See review test IDs below                                               | `/projects/new`                               | All entered values are displayed for confirmation             |
| 21 | Click Submit (Step 4)                       | `getByTestId('project-form-wizard-btn-submit')`                         | `/projects/new` → redirects to `/projects/:id`| Button text: "Submit"; `:id` is a numeric ID assigned by backend |

---

## Form Fields — Complete Reference

### Step 1: Basic Info

| Field label     | Test ID                            | Element     | Required | Default   | Options / Notes                          |
|-----------------|-------------------------------------|-------------|----------|-----------|------------------------------------------|
| Project Name*   | `project-form-input-name`          | `<input>`   | Yes      | —         | Plain text                               |
| Project Code*   | `project-form-input-code`          | `<input>`   | Yes      | —         | Placeholder: "e.g., PROJ001"; uppercase convention observed in existing data |
| Description*    | `project-form-input-description`   | `<textarea>`| Yes      | —         | Free text                                |
| Status*         | `project-form-select-status`       | `<select>`  | Yes      | Planning  | Options: Planning, Active, Archived      |

### Step 2: Team Assignment

| Field label   | Test ID                           | Element    | Required | Default          | Options / Notes                          |
|---------------|-----------------------------------|------------|----------|------------------|------------------------------------------|
| QA Lead*      | `project-form-select-lead`        | `<select>` | Yes      | — (placeholder)  | Options: "Laura Lead", "Alex Admin"      |
| Team Members  | `project-form-select-members`     | `<button>` | No       | — (none selected)| Multi-select widget; button label "Select options..." |

### Step 3: Environments

> **Constraint**: At least one environment row must be added before proceeding. Validation error text: "At least one environment is required" (test ID: none observed — identify by text).

| Field label   | Test ID                         | Element    | Required         | Default | Options / Notes                          |
|---------------|---------------------------------|------------|------------------|---------|------------------------------------------|
| Name          | `project-form-env-name-0`       | `<input>`  | Yes (implicitly) | —       | Row index suffix: `-0`, `-1`, … for additional rows |
| Type          | `project-form-env-type-0`       | `<select>` | No               | Dev     | Options: Dev, Staging, Production        |
| URL           | `project-form-env-url-0`        | `<input>`  | No               | —       | No HTML `required`; provide a value for realism |

Additional rows use the same test ID pattern with incrementing suffix (`-1`, `-2`, …).  
Remove-row button: `project-form-btn-remove-env-0`

### Step 4: Review

Read-only summary. No input fields. Submit button: `project-form-wizard-btn-submit`.

---

## Wizard Navigation Controls

| Button  | Test ID                            | Visible on steps     |
|---------|------------------------------------|----------------------|
| Cancel  | `project-form-wizard-btn-cancel`   | All steps            |
| Back    | `project-form-wizard-btn-back`     | Steps 2, 3, 4        |
| Next    | `project-form-wizard-btn-next`     | Steps 1, 2, 3        |
| Submit  | `project-form-wizard-btn-submit`   | Step 4 only          |

Step indicator containers (read-only): `project-form-wizard-step-1` … `project-form-wizard-step-4`.  
Completed steps show a checkmark icon instead of a number.

---

## Test Data Used (Happy-Day Set)

| Field              | Value                                          |
|--------------------|------------------------------------------------|
| Project Name       | `Playwright Test Project`                      |
| Project Code       | `PWTEST01`                                     |
| Description        | `A project created by automated exploration testing` |
| Status             | `Planning` *(default, not changed)*            |
| QA Lead            | `Laura Lead`                                   |
| Team Members       | *(none — optional field skipped)*              |
| Env Name           | `Testing`                                      |
| Env Type           | `Dev` *(default, not changed)*                 |
| Env URL            | `https://testing.example.com`                  |

---

## Observable Assertions

### After Step 1 → Next (wizard advances)

- Step 1 indicator shows a checkmark icon (number "1" replaced by `<img>`)
- Step 2 content area becomes visible (label "QA Lead*" present)

### After Step 2 → Next (wizard advances)

- Step 2 indicator shows a checkmark icon
- Step 3 content area visible; text "No environments added yet."

### After Step 3: attempting Next with no environments

- Validation message visible: `getByText('At least one environment is required')`

### After Step 3 → Next with one environment added (wizard advances to Review)

- Step 3 indicator shows a checkmark icon
- Step 4 Review shows summary:
  - `getByTestId('project-form-text-review-name')` → `"Playwright Test Project"`
  - `getByTestId('project-form-text-review-code')` → `"PWTEST01"`
  - `getByTestId('project-form-text-review-status')` → `"Planning"`
  - `getByTestId('project-form-text-review-description')` → `"A project created by automated exploration testing"`
  - `getByTestId('project-form-text-review-lead')` → `"Laura Lead"`
  - `getByTestId('project-form-review-env-name-0')` → `"Testing (dev)"`
  - `getByTestId('project-form-review-env-url-0')` → `"https://testing.example.com"`

### After Submit — Project Detail Page

- **URL pattern**: `/projects/:id` where `:id` is a positive integer (e.g. `/projects/5`)
  - Use: `expect(page).toHaveURL(/\/projects\/\d+$/)`
- `getByTestId('page-header-title')` (H1) → project name e.g. `"Playwright Test Project"`
- `getByText('PWTEST01')` → project code (no dedicated test ID; rendered as `<p>`)
- `getByTestId('project-detail-badge-status')` → `"Planning"`
- `getByTestId('project-detail-text-description')` → `"A project created by automated exploration testing"`
- `getByTestId('project-detail-lead-avatar-role')` → `"Lead"` (role suffix of QA lead)
- `getByTestId('project-detail-heading-environments')` (H3) → `"Environments"`
- `getByTestId('project-detail-env-cell-name-1')` → `"Testing"` (1-indexed in detail table)
- `getByTestId('project-detail-env-cell-type-1')` → `"dev"`
- `getByTestId('project-detail-env-cell-url-1')` → `"https://testing.example.com"`
- `getByTestId('project-detail-stat-members-value')` → `"1"`

---

## Key Test IDs — Quick Reference

```
Login page
  login-input-username
  login-input-password
  login-btn-submit

Sidebar
  sidebar-link-projects

Projects list
  project-list-btn-new

Create Project wizard
  project-form-page
  project-form-wizard
  project-form-wizard-step-indicator
  project-form-wizard-step-{1..4}
  project-form-wizard-content

  Step 1 — Basic Info
    project-form-step-1
    project-form-input-name-label / project-form-input-name
    project-form-input-code-label / project-form-input-code
    project-form-input-description-label / project-form-input-description
    project-form-select-status-label / project-form-select-status

  Step 2 — Team Assignment
    project-form-step-2
    project-form-select-lead-label / project-form-select-lead
    project-form-select-members-label / project-form-select-members

  Step 3 — Environments
    project-form-step-3
    project-form-text-no-environments
    project-form-btn-add-env
    project-form-env-row-{i}
    project-form-env-name-{i}-label / project-form-env-name-{i}
    project-form-env-type-{i}-label / project-form-env-type-{i}
    project-form-env-url-{i}-label / project-form-env-url-{i}
    project-form-btn-remove-env-{i}

  Step 4 — Review
    project-form-step-4
    project-form-heading-review-details
    project-form-label-review-name / project-form-text-review-name
    project-form-label-review-code / project-form-text-review-code
    project-form-label-review-status / project-form-text-review-status
    project-form-label-review-description / project-form-text-review-description
    project-form-heading-review-team
    project-form-label-review-lead / project-form-text-review-lead
    project-form-label-review-members / project-form-text-review-members
    project-form-heading-review-environments
    project-form-review-env-name-{i}
    project-form-review-env-url-{i}

  Wizard navigation
    project-form-wizard-btn-cancel
    project-form-wizard-btn-back
    project-form-wizard-btn-next
    project-form-wizard-btn-submit

Project Detail page (post-creation)
  project-detail-page
  page-header / page-header-title / page-header-btn-back
  project-detail-btn-edit / project-detail-btn-delete
  project-detail-tabs
  project-detail-tab-overview / project-detail-tab-defects / project-detail-tab-plans / project-detail-tab-team
  project-detail-tab-badge-defects / project-detail-tab-badge-plans / project-detail-tab-badge-team
  project-detail-heading-project-info
  project-detail-label-status / project-detail-badge-status
  project-detail-label-qa-lead / project-detail-lead-avatar / project-detail-lead-avatar-role
  project-detail-label-description / project-detail-text-description
  project-detail-label-created-at / project-detail-text-created-at
  project-detail-label-updated-at / project-detail-text-updated-at
  project-detail-heading-environments
  project-detail-env-table
  project-detail-env-header-name / project-detail-env-header-url
  project-detail-env-row-{i}       (1-indexed in detail table)
  project-detail-env-cell-name-{i}
  project-detail-env-cell-type-{i}
  project-detail-env-cell-url-{i}
  project-detail-stat-defects / project-detail-stat-defects-value
  project-detail-stat-plans / project-detail-stat-plans-value
  project-detail-stat-members / project-detail-stat-members-value
```

---

## Risks & Open Questions

1. **Project code uniqueness**: Existing data already contains codes like `PHOENIX`, `ATLAS`, `NEBULA`, `EXPTEST`, `PWTEST01`. The app may reject duplicate codes — tests should generate a unique code per run (e.g. via `faker.string.alphanumeric(6).toUpperCase()`).
2. **QA Lead options are data-dependent**: "Laura Lead" and "Alex Admin" are the only available options. If the test dataset is reset, these options should remain; but if the team members are removed from the system, the select options will change. Test should select by visible text rather than numeric value.
3. **Environment index is 0-based in the form, 1-based in the detail table**: Form uses `-0`, `-1`, …; detail table rows use `-1`, `-2`, …. Analyst should be aware when writing assertions.
4. **No toast / confirmation message observed**: After submit the app navigates directly to the detail page with no explicit success notification visible in the a11y tree. The URL change and heading are the primary assertions.
5. **Project code display on detail page lacks a test ID**: The `<p>PWTEST01</p>` element in the page header has no `data-testid`. Use `getByText` scoped to `[data-testid="page-header"]`, or request a test ID from the dev team.
6. **"At least one environment is required" validation message**: No `data-testid` observed on the error paragraph. The Analyst may need to use `getByText('At least one environment is required')` for the negative test.
7. **Wizard URL does not change across steps**: All 4 steps remain at `/projects/new`. Cannot assert the current step via URL; use step-indicator test IDs or visible field presence instead.

---

## Suggested Page Objects

- `tests/tredgate/pages/create-project.page.ts` — multi-step wizard; could expose one method per step or a single `fillAndSubmit(data)` method
- `tests/tredgate/pages/project-detail.page.ts` — detail view assertions post-creation
- `tests/tredgate/pages/projects-list.page.ts` — already partially implied; should expose `clickNewProject()`
- `tests/tredgate/pages/login.page.ts` — already exists; verify it covers `TREDGATE_ADMIN_USERNAME/PASSWORD` env vars
