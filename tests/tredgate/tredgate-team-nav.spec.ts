import { test } from "@playwright/test";
import { LoginPage } from "./pages/login.page";

test("login, navigate to team page, verify members table, and logout", async ({
  page,
}) => {
  await new LoginPage(page)
    .goto()
    .then((p) => p.fillUsername(process.env.TREDGATE_USER_EMAIL!))
    .then((p) => p.fillPassword(process.env.TREDGATE_USER_PASSWORD!))
    .then((p) => p.submit())
    .then((p) => p.expectSidebarVisible())
    .then((p) => p.navigateToTeam())
    .then((p) => p.expectMembersTableVisible())
    .then((p) => p.logout());
});
