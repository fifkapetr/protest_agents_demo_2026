import { Page, expect } from "@playwright/test";

export class TeamPage {
  private readonly membersTable;
  private readonly logoutButton;

  constructor(private readonly page: Page) {
    this.membersTable = page.locator('[data-testid="team-list-table"]');
    this.logoutButton = page.locator('[data-testid="sidebar-btn-logout"]');
  }

  async expectMembersTableVisible() {
    await expect(
      this.membersTable,
      "Team members table should be visible on the team page.",
    ).toBeVisible();
    return this;
  }

  async logout() {
    await this.logoutButton.click();
    // TODO: assert redirect to login
    return this;
  }
}
