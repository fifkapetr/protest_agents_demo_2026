Create a test in Playwright.

Tested app: https://tredgate-training-qa-hub-74e558f9052f.herokuapp.com/login

## Credentials:

username: admin
password: admin123

## Steps:

1. Navigate to the login page.
2. Fill username and password.
3. Click the login button.
4. Assert sidebar is visible after login.
5. Click on team menu.
6. Assert teams page is visible (visible members table).
7. Logout

## Locators (CSS):

1. Username input: `[data-testid="login-input-username"]`
2. Password input: `[data-testid="login-input-password"]`
3. Login button: `[data-testid="login-btn-submit"]`
4. Sidebar: `[data-testid="sidebar-nav"]`
5. Team menu: `[data-testid="sidebar-link-team"]`
6. Members table: `[data-testid="team-list-table"]`
7. Logout button: `[data-testid="sidebar-btn-logout"]`
