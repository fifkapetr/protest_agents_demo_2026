import { Page, expect } from "@playwright/test";

export class ProjectDetailPage {
  private readonly pageHeading;

  constructor(private readonly page: Page) {
    this.pageHeading = page.getByTestId("page-header-title");
  }

  async waitForLoaded() {
    await expect(
      this.pageHeading,
      "Project detail page heading should be visible after creation.",
    ).toBeVisible();
    return this;
  }

  async assertProjectName(name: string) {
    await expect(
      this.pageHeading,
      "Project detail heading should display the generated project name.",
    ).toHaveText(name);
    return this;
  }
}
