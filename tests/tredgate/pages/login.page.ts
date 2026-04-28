import { Page } from "@playwright/test";
import { DashboardPage } from "./dashboard.page";

export class LoginPage {
  private readonly usernameInput;
  private readonly passwordInput;
  private readonly submitButton;

  constructor(private readonly page: Page) {
    this.usernameInput = page.locator('[data-testid="login-input-username"]');
    this.passwordInput = page.locator('[data-testid="login-input-password"]');
    this.submitButton = page.locator('[data-testid="login-btn-submit"]');
  }

  async goto(url: string) {
    await this.page.goto(url);
    return this;
  }

  async fillUsername(value: string) {
    await this.usernameInput.fill(value);
    return this;
  }

  async fillPassword(value: string) {
    await this.passwordInput.fill(value);
    return this;
  }

  async submit() {
    await this.submitButton.click();
    return new DashboardPage(this.page);
  }
}
