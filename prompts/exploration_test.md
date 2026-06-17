Create a test in Playwright. Explore the app to get locators and how it behaves.

Tested app: https://tredgate-training-qa-hub-74e558f9052f.herokuapp.com/login

## Credentials:

username: admin
password: admin123

## Test:

This test is happy day scenario for creating a new project in the app.

### Steps:

User will login to the app, then navigate to the projects page. It will create a new project, then it will assert that the project is created successfully by checking the project detail page.

### Additional Instructions:

- Explore only positive flow for creating a project, no need to explore edge cases or negative scenarios.
- DO NOT explore all combinations of inputs, just one valid set of inputs for the happy day scenario.
- If there is an optional field, leave it blank to keep the flow simple.
