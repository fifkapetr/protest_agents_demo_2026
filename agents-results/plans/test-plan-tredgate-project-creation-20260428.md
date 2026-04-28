# Test Plan — Tredgate Project Creation (Happy Path)

- **Date**: 2026-04-28 17:55
- **Brief**: Login then create a new project through the 4-step wizard and assert the project detail page displays the generated project name.
- **Source**: user prompt, exploration report at `agents-results/exploration-tredgate-project-creation-20260428.md`
- **App**: Tredgate QA Hub

---

## Scope

Single happy-path flow: authenticated user navigates from dashboard → projects list → project creation wizard (all 4 steps) → project detail page assertion. No negative paths, optional fields, or secondary features.

---

## Affected & New Files

| Path                                          | Status | Purpose                                             |
| --------------------------------------------- | ------ | --------------------------------------------------- |
| `tests/tredgate/pages/dashboard.page.ts`      | MODIFY | Add `goToProjects()` method                         |
| `tests/tredgate/pages/projects-list.page.ts`  | NEW    | Page object for `/projects`                         |
| `tests/tredgate/pages/project-create.page.ts` | NEW    | Page object for `/projects/new` wizard (all 4 steps)|
| `tests/tredgate/pages/project-detail.page.ts` | NEW    | Page object for `/projects/{id}`                    |
| `tests/i18n/index.ts`                         | NEW    | i18n string literals (file does not yet exist)      |
| `tests/tredgate/project-creation.spec.ts`     | NEW    | Test spec                                           |

---

## Test Scenarios

### Scenario 1 — Create a new project and verify the detail page

- **Given** a user navigates to the Tredgate QA Hub login page and signs in with valid credentials (`TREDGATE_USER` / `TREDGATE_PASSWORD`)
- **When** they navigate to the Projects list, click "New Project", fill all 4 wizard steps, and submit
- **Then** the browser redirects to `/projects/{numeric-id}` and the `page-header-title` h1 text matches the generated project name

**Page object methods needed across the flow:**
- `LoginPage`: `goto(url)`, `fillUsername(value)`, `fillPassword(value)`, `submit()` → returns `DashboardPage`
- `DashboardPage` *(extended)*: `goToProjects()` → returns `ProjectsListPage`
- `ProjectsListPage`: `waitForLoaded()`, `clickNewProject()` → returns `ProjectCreatePage`
- `ProjectCreatePage`:
  - Step 1: `fillName(value)`, `fillCode(value)`, `fillDescription(value)`, `selectStatus(value)`, `clickNext()` → returns `this`
  - Step 2: `selectLead(value)`, `clickNext()` → returns `this`
  - Step 3: `clickAddEnvironment()`, `fillEnvName(index, value)`, `selectEnvType(index, value)`, `fillEnvUrl(index, value)`, `clickNext()` → returns `this`
  - Step 4: `clickSubmit()` → returns `ProjectDetailPage`
- `ProjectDetailPage`: `waitForLoaded()`, `assertProjectName(name)`

---

## Wizard Step Details

### Step 1 — Basic Info

Fill the three required text fields and change the status dropdown.

| Field       | Action                             | Value                                                     |
| ----------- | ---------------------------------- | --------------------------------------------------------- |
| Name        | `fill`                             | `projectName` (faker-generated)                           |
| Code        | `fill`                             | `projectName.slice(0, 3).toUpperCase()` (derived)         |
| Description | `fill`                             | `projectDescription` (faker-generated)                    |
| Status      | `selectOption('Active')`           | `"Active"` (fixed; option exists alongside Planning/Archived)|
| Advance     | click Next button; wait for Step 2 container | `getByTestId('project-form-step-2')` to be visible |

### Step 2 — Team Assignment

Select the first real QA Lead option. Team Members is optional — skip it.

| Field   | Action                           | Value          |
| ------- | -------------------------------- | -------------- |
| QA Lead | `selectOption('Laura Lead')`     | `"Laura Lead"` (fixed; first non-placeholder option) |
| Advance | click Next; wait for Step 3 container | `getByTestId('project-form-step-3')` to be visible |

### Step 3 — Environments

Add exactly one environment row (index `0`).

| Field    | Action                            | Value                               |
| -------- | --------------------------------- | ----------------------------------- |
| —        | click Add Environment button      | triggers row 0 to appear            |
| Name     | `fill`                            | `envName` (faker-generated word)    |
| Type     | `selectOption('Dev')`             | `"Dev"` (first option)              |
| URL      | `fill`                            | `envUrl` (faker-generated URL)      |
| Advance  | click Next; wait for Step 4 container | `getByTestId('project-form-step-4')` to be visible |

### Step 4 — Review

No data entry. Click Submit and wait for redirect.

| Action  | Wait condition                            |
| ------- | ----------------------------------------- |
| Submit  | `page.waitForURL(/\/projects\/\d+/)` — numeric project ID |

---

## Locator Strategy

| Element                  | Locator                                                        |
| ------------------------ | -------------------------------------------------------------- |
| Projects sidebar link    | `getByTestId('sidebar-link-projects')`                         |
| Projects page heading    | `getByTestId('page-header-title')`                             |
| New Project link         | `getByTestId('project-list-btn-new')`                          |
| Step 1 container         | `getByTestId('project-form-step-1')`                           |
| Name input               | `getByTestId('project-form-input-name')`                       |
| Code input               | `getByTestId('project-form-input-code')`                       |
| Description textarea     | `getByTestId('project-form-input-description')`                |
| Status select            | `getByTestId('project-form-select-status')`                    |
| Step 2 container         | `getByTestId('project-form-step-2')`                           |
| QA Lead select           | `getByTestId('project-form-select-lead')`                      |
| Step 3 container         | `getByTestId('project-form-step-3')`                           |
| Add Environment button   | `getByTestId('project-form-btn-add-env')`                      |
| Env row (0)              | `getByTestId('project-form-env-row-0')`                        |
| Env Name input (0)       | `getByTestId('project-form-env-name-0')`                       |
| Env Type select (0)      | `getByTestId('project-form-env-type-0')`                       |
| Env URL input (0)        | `getByTestId('project-form-env-url-0')`                        |
| Step 4 container         | `getByTestId('project-form-step-4')`                           |
| Next button (all steps)  | `getByTestId('project-form-wizard-btn-next')`                  |
| Submit button            | `getByTestId('project-form-wizard-btn-submit')`                |
| Detail page heading      | `getByTestId('page-header-title')` → h1                        |

---

## Data Strategy

| Input            | Source                                                              |
| ---------------- | ------------------------------------------------------------------- |
| Login username   | `process.env.TREDGATE_USER!`                                        |
| Login password   | `process.env.TREDGATE_PASSWORD!`                                    |
| Base URL         | `process.env.TREDGATE_BASE_URL!` (used in `goto()`)                |
| Project name     | `faker.commerce.productName()` — unique per run                     |
| Project code     | `projectName.slice(0, 3).toUpperCase()` — derived, no faker call    |
| Description      | `faker.lorem.sentence()`                                            |
| Status           | `"Active"` — fixed string constant; stored in `strings.tredgate`   |
| QA Lead          | `"Laura Lead"` — fixed string constant; stored in `strings.tredgate`|
| Env name         | `faker.word.sample()` — single word, unique per run                 |
| Env type         | `"Dev"` — fixed string constant; stored in `strings.tredgate`      |
| Env URL          | `faker.internet.url()`                                              |
| Assertion string | `strings.tredgate.createProject.pageTitle` → `"Create Project"`     |

---

## i18n Additions (`tests/i18n/index.ts`)

This file does not exist yet. Create it with the following shape. The engineer must add a `tredgate` namespace:

```ts
export const strings = {
  tredgate: {
    createProject: {
      pageTitle: "Create Project",
      statusActive: "Active",
      qaLeadLauraLead: "Laura Lead",
      envTypeDev: "Dev",
    },
  },
} as const;
```

If a `strings` export already exists when the engineer opens the file, they must merge `tredgate` into the existing object without replacing other namespaces.

---

## `DashboardPage` Modification

Add to the existing `DashboardPage` class in `tests/tredgate/pages/dashboard.page.ts`:

- A new private locator: `projectsMenuLink = page.locator('[data-testid="sidebar-link-projects"]')`
- A new method `goToProjects()` that clicks the locator, waits for `page.waitForURL(/\/projects$/)`, and returns `new ProjectsListPage(this.page)`

The existing `sidebarNav`, `teamMenuLink`, `expectSidebarVisible()`, and `goToTeam()` members must not be altered.

---

## Spec File Structure (`tests/tredgate/project-creation.spec.ts`)

```
test('happy path: create project and assert detail page', async ({ page }) => {
  // 1. Generate test data
  // 2. Login via LoginPage
  // 3. Navigate to Projects via DashboardPage
  // 4. Click New Project via ProjectsListPage
  // 5. Fill Step 1 via ProjectCreatePage (name, code, description, status)
  // 6. Fill Step 2 (QA Lead)
  // 7. Fill Step 3 (one environment row)
  // 8. Submit Step 4
  // 9. Assert detail page heading equals projectName
});
```

Fluent `.then()` chaining must be used throughout, consistent with the login-team-flow pattern in `tests/tredgate/login-team-flow.spec.ts`.

---

## Risks & Open Questions

- **QA Lead validation ambiguity**: The exploration report notes the wizard advanced without a confirmed selection during exploration (Step 2). The plan uses an explicit `selectOption('Laura Lead')` call. If the select element requires the engineer to first dismiss a placeholder option, they must wait for the `<select>` to be enabled before calling `selectOption`. No plan change needed — this is an implementation detail.
