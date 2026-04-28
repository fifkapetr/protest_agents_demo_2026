import { test } from "@playwright/test";
import { LoginPage } from "./pages/login.page";

test("login, navigate to team page, and logout", async ({ page }) => {
  await new LoginPage(page)
    .goto(`${process.env.TREDGATE_BASE_URL!}/login`)
    .then((p) => p.fillUsername(process.env.TREDGATE_USER_NAME!))
    .then((p) => p.fillPassword(process.env.TREDGATE_USER_PASSWORD!))
    .then((p) => p.submit())
    .then((p) => p.expectSidebarVisible())
    .then((p) => p.goToTeam())
    .then((p) => p.expectMembersTableVisible())
    .then((p) => p.logout());
});
