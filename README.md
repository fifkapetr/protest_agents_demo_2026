# 139. \[pro:\]TEST! Agents Demo

This is a demo repository for using GitHub Agents in Test Automation with Playwright.

Focus is on:

1. Using GitHub Agents
2. Agents orchestration (sub-agents)
3. Using GitHub Copilot SKILLS
4. Using MCP servers with agents

## Application Under Test

- This repository is testing Tredgate QA Hub App: https://tredgate-training-qa-hub-74e558f9052f.herokuapp.com/login
- The application if frontend DEMO only, with no backend, all data are stored in the browser local storage, so it is not a real application, but it is good for training and demo purposes.

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the Playwright UI Mode:
   ```bash
   npx playwright test --ui
   ```

## Demo Scenarios

This repository contains two concrete agent-driven Playwright scenarios created for the meetup demo. Each scenario left behind the source prompt, generated artifacts, and implementation files so the full workflow can be reviewed afterward.

### 1. Simple Prompt — Test Manager

- Prompt: [prompts/simple_test.md](prompts/simple_test.md)
- Goal: log in, verify the sidebar, navigate to Team, verify the members table, and log out
- Plan: [agents-results/plans/test-plan-tredgate-simple-123456.md](agents-results/plans/test-plan-tredgate-simple-123456.md)
- Spec: [tests/tredgate/login-team-flow.spec.ts](tests/tredgate/login-team-flow.spec.ts)
- Page objects: [tests/tredgate/pages/login.page.ts](tests/tredgate/pages/login.page.ts), [tests/tredgate/pages/dashboard.page.ts](tests/tredgate/pages/dashboard.page.ts), [tests/tredgate/pages/team.page.ts](tests/tredgate/pages/team.page.ts)
- Review report: [agents-results/code-review-results.md](agents-results/code-review-results.md)

### 2. Exploration Prompt — Test Manager + Explorer

- Prompt: [prompts/exploration_test.md](prompts/exploration_test.md)
- Goal: explore the app just enough to implement login + project creation, then create a project and assert the project detail page
- Exploration report: [agents-results/exploration-tredgate-project-creation-20260428.md](agents-results/exploration-tredgate-project-creation-20260428.md)
- Plan: [agents-results/plans/test-plan-tredgate-project-creation-20260428.md](agents-results/plans/test-plan-tredgate-project-creation-20260428.md)
- Spec: [tests/tredgate/project-creation.spec.ts](tests/tredgate/project-creation.spec.ts)
- Supporting files: [tests/tredgate/pages/projects-list.page.ts](tests/tredgate/pages/projects-list.page.ts), [tests/tredgate/pages/project-create.page.ts](tests/tredgate/pages/project-create.page.ts), [tests/tredgate/pages/project-detail.page.ts](tests/tredgate/pages/project-detail.page.ts), [tests/tredgate/pages/dashboard.page.ts](tests/tredgate/pages/dashboard.page.ts), [tests/i18n/index.ts](tests/i18n/index.ts)

## Reports

- [agents-results/e2e-engineer-results.md](agents-results/e2e-engineer-results.md) collects the implementation summary for both scenarios.
- [agents-results/code-review-results.md](agents-results/code-review-results.md) contains the review findings for the simple login → team flow.
- [agents-results/exploration-tredgate-project-creation-20260428.md](agents-results/exploration-tredgate-project-creation-20260428.md) is the live app discovery report used before the project-creation implementation.

## Agents Overview

The agents are orchestrated by the **Test Manager** in a strict pipeline. The Manager never writes code itself — it delegates and synthesizes results.

```
"Write new tests"  →  [Explorer?] → Test Analyst → E2E Engineer → Code Review
"Fix failing test" →  Playwright Triage → E2E Engineer → Code Review
"Review only"      →  Code Review
```

- **Test Manager** ([test_manager.agent.md](.github/agents/test_manager.agent.md)): Orchestrates the full pipeline, decides whether the Explorer is needed, enforces handoff protocols, and guarantees every coding task ends with a Code Review. Restricts allowed sub-agents via the `agents:` whitelist.

- **Explorer** ([explorer.agent.md](.github/agents/explorer.agent.md)): Discovers the live application via Playwright MCP and Chrome DevTools MCP when the user prompt lacks URL, flow steps, locators, or data inputs. Produces an **App Discovery Report** at `agents-results/exploration-<slug>-<timestamp>.md`. Read-only — never edits code.

- **Test Analyst** ([test_analyst.agent.md](.github/agents/test_analyst.agent.md)): Translates the brief (plus optional Explorer report) into a written engineering plan at `agents-results/plans/test-plan-<slug>-<timestamp>.md` covering scope, file paths, scenarios, locator strategy, and data strategy. Always runs before the Engineer; never writes code.

- **E2E Engineer** ([e2e_engineer.agent.md](.github/agents/e2e_engineer.agent.md)): Implements the Test Analyst's plan (or applies a Triage diagnosis) following project conventions — Page Object Model with Fluent API, assertions inside page objects, no hardcoded URLs/credentials. **Cannot use Playwright MCP or Chrome DevTools MCP** — those tools are not in its allow-list. Escalates back to the Manager if the plan is missing.

- **Playwright Triage** ([playwright_triage.agent.md](.github/agents/playwright_triage.agent.md)): Diagnoses failing or flaky tests, classifies root cause (locator, timing, data, page object, flake, env), and recommends a minimal surgical fix. Hands off to the E2E Engineer (or, for larger fixes, back through the Test Analyst).

- **Code Reviewer** ([code_review.agent.md](.github/agents/code_review.agent.md)): Audits test files, page objects, test data files, and config files against the project's strict conventions (R1–R8). Produces structured findings at `agents-results/code-review-results.md` without modifying any source files. Always invoked last in any pipeline that produces code changes.

## MCP Servers

- Context7 - https://github.com/upstash/context7 - MUST have MCP which is used for getting current documentation avoiding hallucinations caused by outdated documentation in training data of LLM.
- Playwright MCP - https://github.com/microsoft/playwright-mcp - Access to a Browser for agents
- Chrome DevTools MCP - https://github.com/ChromeDevTools/chrome-devtools-mcp - Similar to Playwright MCP but with more direct access to Chrome DevTools.
