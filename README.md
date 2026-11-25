# Playwright TypeScript Automation Framework

A UI test automation framework built using **Playwright, TypeScript, and the Page Object Model (POM)**. This project demonstrates reusable test architecture, test data management, automated screenshots, HTML reporting, and GitHub Actions integration.

## Technology Stack

- **Language:** TypeScript
- **Automation:** Playwright
- **Runtime:** Node.js
- **Design Pattern:** Page Object Model (POM)
- **Test Runner:** Playwright Test
- **Reporting:** Playwright HTML Reporter
- **CI/CD:** GitHub Actions
- **IDE:** IntelliJ IDEA

## Project Structure

```text
Playwright-TypeScript/
│
├── .github/
│   └── workflows/
│       └── playwright.yml
│
├── fixtures/
│   └── testFixtures.ts
│
├── pages/
│   ├── AdminPage.ts
│   ├── DashboardPage.ts
│   ├── LoginPage.ts
│   ├── OrganizationGeneralInformationPage.ts
│   └── PersonalDetailsPage.ts
│
├── test-data/
│   ├── loginData.ts
│   └── organizationData.ts
│
├── tests/
│   ├── OrangeHRM_Login.spec.ts
│   ├── OrangeHRM_Organization_GeneralInformation.spec.ts
│   └── example.spec.ts
│
├── utils/
│   ├── ScreenshotUtil.ts
│   └── TestLogger.ts
│
├── playwright.config.ts
├── package.json
└── package-lock.json
```

## Application Under Test

OrangeHRM Demo Application:

https://opensource-demo.orangehrmlive.com/web/index.php/auth/login

Demo credentials:

- Username: `Admin`
- Password: `admin123`

## Installation and Setup

**1. Clone the repository**

```bash
git clone https://github.com/sivaganesan0111/Playwright-TypeScript.git
```

**2. Navigate to the project**

```bash
cd Playwright-TypeScript
```

**3. Install dependencies**

```bash
npm install
```

**4. Install Playwright browsers**

```bash
npx playwright install
```

## Execute Tests

Run all tests:

```bash
npx playwright test
```

Run the login test:

```bash
npx playwright test tests/OrangeHRM_Login.spec.ts --project="Google Chrome"
```

Run tests in headed mode:

```bash
npx playwright test --headed
```

## Test Reports

Generate and view the Playwright HTML report:

```bash
npx playwright show-report
```

The framework is configured to capture screenshots and retain traces on test failures.

## CI/CD Integration

This project includes a GitHub Actions workflow:

`.github/workflows/playwright.yml`

The workflow is configured to execute Playwright tests on pushes and pull requests targeting the `main` and `master` branches. It also uploads the HTML test report as a workflow artifact.

## Key Framework Features

- Page Object Model architecture
- Reusable page classes and test fixtures
- Centralized test data management
- Reusable screenshot utility
- Test execution logging
- Playwright HTML reporting
- Screenshot and trace configuration
- GitHub Actions CI/CD integration

## Author

**Sivaganesan**

GitHub: https://github.com/sivaganesan0111

---

*This project is maintained as a practical learning and portfolio project for modern web UI test automation using Playwright and TypeScript.*
