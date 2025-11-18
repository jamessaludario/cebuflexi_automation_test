# Cebuflexi Automation Tests

![Playwright Tests](https://github.com/jamessaludario/cebuflexi_automation_test/actions/workflows/playwright.yml/badge.svg)

This project contains automated end-to-end tests for the Cebuflexi web application, written using Playwright.

## Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher is recommended)
- [npm](https://www.npmjs.com/) (which comes with Node.js)

## Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd cebuflexi_automation_test
    ```

2.  **Install dependencies:**
    Run the following command in your terminal to install all the necessary packages from `package.json`:
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    The tests require credentials to log in. You need to create an environment file to store them securely.

    -   Create a new file named `.env` inside the `tests/` directory.
    -   Add the following content to the `tests/.env` file, replacing the placeholder values with your actual test credentials:

    ```shell
    TEST_USER_EMAIL=your_test_email@example.com
    TEST_USER_PASSWORD=your_test_password
    ```
    *Note: This `.env` file is already listed in `.gitignore`, so your credentials will not be committed to the repository.*

## Running Tests

### Run all tests (headless)

To execute all tests in headless mode (without a visible browser window), run:

```bash
npx playwright test
```

### Run tests in headed mode

To watch the tests run in a visible browser window, use the `--headed` flag:

```bash
npx playwright test --headed
```

### View the Test Report

After the tests have finished, a `playwright-report` directory will be generated. To view the detailed HTML report, run:

```bash
npx playwright show-report
```

This will open the report in your browser, where you can inspect test results, traces, and screenshots.