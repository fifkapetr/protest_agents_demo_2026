import { Page, expect } from "@playwright/test";
import { ProjectDetailPage } from "./project-detail.page";

export class ProjectCreatePage {
  // Step containers
  private readonly step2Container;
  private readonly step3Container;
  private readonly step4Container;
  // Step 1 fields
  private readonly nameInput;
  private readonly codeInput;
  private readonly descriptionInput;
  private readonly statusSelect;
  // Step 2 fields
  private readonly leadSelect;
  // Step 3 controls
  private readonly addEnvironmentButton;
  // Shared navigation
  private readonly nextButton;
  private readonly submitButton;

  private currentStep = 1;

  constructor(private readonly page: Page) {
    this.step2Container = page.getByTestId("project-form-step-2");
    this.step3Container = page.getByTestId("project-form-step-3");
    this.step4Container = page.getByTestId("project-form-step-4");
    this.nameInput = page.getByTestId("project-form-input-name");
    this.codeInput = page.getByTestId("project-form-input-code");
    this.descriptionInput = page.getByTestId("project-form-input-description");
    this.statusSelect = page.getByTestId("project-form-select-status");
    this.leadSelect = page.getByTestId("project-form-select-lead");
    this.addEnvironmentButton = page.getByTestId("project-form-btn-add-env");
    this.nextButton = page.getByTestId("project-form-wizard-btn-next");
    this.submitButton = page.getByTestId("project-form-wizard-btn-submit");
  }

  async fillName(value: string) {
    await this.nameInput.fill(value);
    return this;
  }

  async fillCode(value: string) {
    await this.codeInput.fill(value);
    return this;
  }

  async fillDescription(value: string) {
    await this.descriptionInput.fill(value);
    return this;
  }

  async selectStatus(value: string) {
    await this.statusSelect.selectOption(value);
    return this;
  }

  async selectLead(value: string) {
    await this.leadSelect.selectOption(value);
    return this;
  }

  async clickAddEnvironment() {
    await this.addEnvironmentButton.click();
    return this;
  }

  async fillEnvName(index: number, value: string) {
    await this.page.getByTestId(`project-form-env-name-${index}`).fill(value);
    return this;
  }

  async selectEnvType(index: number, value: string) {
    await this.page
      .getByTestId(`project-form-env-type-${index}`)
      .selectOption(value);
    return this;
  }

  async fillEnvUrl(index: number, value: string) {
    await this.page.getByTestId(`project-form-env-url-${index}`).fill(value);
    return this;
  }

  async clickNext() {
    const nextStep = this.currentStep + 1;
    const stepContainers = [
      this.step2Container,
      this.step3Container,
      this.step4Container,
    ];
    await this.nextButton.click();
    await expect(
      stepContainers[nextStep - 2],
      `Wizard should advance to step ${nextStep}.`,
    ).toBeVisible();
    this.currentStep = nextStep;
    return this;
  }

  async clickSubmit() {
    await this.submitButton.click();
    await this.page.waitForURL(/\/projects\/\d+/);
    return new ProjectDetailPage(this.page);
  }
}
