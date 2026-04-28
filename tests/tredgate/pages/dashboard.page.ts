import { Page, expect } from "@playwright/test";
import { TeamPage } from "./team.page";
import { ProjectsListPage } from "./projects-list.page";

export class DashboardPage {
  private readonly sidebarNav;
  private readonly teamMenuLink;
  private readonly projectsMenuLink;

  constructor(private readonly page: Page) {
    this.sidebarNav = page.locator('[data-testid="sidebar-nav"]');
    this.teamMenuLink = page.locator('[data-testid="sidebar-link-team"]');
    this.projectsMenuLink = page.locator('[data-testid="sidebar-link-projects"]');
  }

  async expectSidebarVisible() {
    await expect(
      this.sidebarNav,
      "Dashboard sidebar navigation should be visible after login.",
    ).toBeVisible();
    return this;
  }

  async goToTeam() {
    await this.teamMenuLink.click();
    return new TeamPage(this.page);
  }

  async goToProjects() {
    await this.projectsMenuLink.click();
    await this.page.waitForURL(/\/projects$/);
    return new ProjectsListPage(this.page);
  }
}
