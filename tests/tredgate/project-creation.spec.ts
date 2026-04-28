import { test } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { LoginPage } from "./pages/login.page";
import { strings } from "../i18n";

test("happy path: create project and assert detail page", async ({ page }) => {
  const projectName = faker.commerce.productName();
  const projectCode = projectName.slice(0, 3).toUpperCase();
  const projectDescription = faker.lorem.sentence();
  const envName = faker.word.sample();
  const envUrl = faker.internet.url();

  await new LoginPage(page)
    .goto(`${process.env.TREDGATE_BASE_URL!}/login`)
    .then((p) => p.fillUsername(process.env.TREDGATE_USER_NAME!))
    .then((p) => p.fillPassword(process.env.TREDGATE_USER_PASSWORD!))
    .then((p) => p.submit())
    .then((p) => p.goToProjects())
    .then((p) => p.waitForLoaded())
    .then((p) => p.clickNewProject())
    .then((p) => p.fillName(projectName))
    .then((p) => p.fillCode(projectCode))
    .then((p) => p.fillDescription(projectDescription))
    .then((p) => p.selectStatus(strings.tredgate.createProject.statusActive))
    .then((p) => p.clickNext())
    .then((p) =>
      p.selectLead(strings.tredgate.createProject.qaLeadLauraLead),
    )
    .then((p) => p.clickNext())
    .then((p) => p.clickAddEnvironment())
    .then((p) => p.fillEnvName(0, envName))
    .then((p) =>
      p.selectEnvType(0, strings.tredgate.createProject.envTypeDev),
    )
    .then((p) => p.fillEnvUrl(0, envUrl))
    .then((p) => p.clickNext())
    .then((p) => p.clickSubmit())
    .then((p) => p.waitForLoaded())
    .then((p) => p.assertProjectName(projectName));
});
