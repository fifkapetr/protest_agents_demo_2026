Create a test in Playwright. Explore the app to get locators and how it behaves.

Tested app: https://tredgate-training-qa-hub-74e558f9052f.herokuapp.com/login

## Credentials:

username: admin
password: admin123

## Test:

User will login to the app, then navigate to the projects page. It will create a new project, then it will assert that the project is created successfully by checking the project detail page.

## Exploration Guidelines
1. **test only the assigned flow** — in this case, login and project creation. Do not explore other features or flows. Do not explore edge cases or negative paths. If some input is optional, do not fill it.