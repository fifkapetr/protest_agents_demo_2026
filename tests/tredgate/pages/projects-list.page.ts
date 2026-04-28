import { Page, expect } from "@playwright/test";
import { ProjectCreatePage } from "./project-create.page";

export class ProjectsListPage {
  private readonly pageHeading;
  private readonly newProjectLink;

  constructor(private readonly page: Page) {
    this.pageHeading = page.getByTestId("page-header-title");
    this.newProjectLink = page.getByTestId("project-list-btn-new");
  }

  async waitForLoaded() {
    await expect(
      this.pageHeading,
      "Projects list heading should be visible after navigation.",
    ).toBeVisible();
    return this;
  }

  async clickNewProject() {
    await this.newProjectLink.click();
    await this.page.waitForURL(/\/projects\/new/);
    return new ProjectCreatePage(this.page);
  }
}
