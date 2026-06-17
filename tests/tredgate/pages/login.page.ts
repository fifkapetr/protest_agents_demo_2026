import { Page, expect } from "@playwright/test";
import { TeamPage } from "./team.page";

export class LoginPage {
  private readonly usernameInput;
  private readonly passwordInput;
  private readonly submitButton;
  private readonly sidebarNav;
  private readonly teamLink;

  constructor(private readonly page: Page) {
    this.usernameInput = page.locator('[data-testid="login-input-username"]');
    this.passwordInput = page.locator('[data-testid="login-input-password"]');
    this.submitButton = page.locator('[data-testid="login-btn-submit"]');
    this.sidebarNav = page.locator('[data-testid="sidebar-nav"]');
    this.teamLink = page.locator('[data-testid="sidebar-link-team"]');
  }

  async goto() {
    await this.page.goto(process.env.TREDGATE_BASE_URL!);
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

  async expectSidebarVisible() {
    await expect(
      this.sidebarNav,
      "Sidebar should be visible after login.",
    ).toBeVisible();
    return this;
  }

  async navigateToTeam() {
    await this.teamLink.click();
    return new TeamPage(this.page);
  }
}
