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
      "Members table should be visible on team page.",
    ).toBeVisible();
    return this;
  }

  async logout() {
    await this.logoutButton.click();
    return this;
  }
}
