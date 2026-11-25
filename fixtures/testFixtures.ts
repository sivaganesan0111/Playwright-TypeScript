import { test as base, expect } from '@playwright/test';
import { AdminPage } from '../pages/AdminPage';
import { DashboardPage } from '../pages/DashboardPage';
import { LoginPage } from '../pages/LoginPage';
import { OrganizationGeneralInformationPage } from '../pages/OrganizationGeneralInformationPage';
import { PersonalDetailsPage } from '../pages/PersonalDetailsPage';
import { ScreenshotUtil } from '../utils/ScreenshotUtil';
import { TestLogger } from '../utils/TestLogger';

type PageFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  adminPage: AdminPage;
  organizationGeneralInformationPage: OrganizationGeneralInformationPage;
  personalDetailsPage: PersonalDetailsPage;
  testLogger: TestLogger;
};

export const test = base.extend<PageFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
  adminPage: async ({ page }, use) => {
    await use(new AdminPage(page));
  },
  organizationGeneralInformationPage: async ({ page }, use) => {
    await use(new OrganizationGeneralInformationPage(page));
  },
  personalDetailsPage: async ({ page }, use) => {
    await use(new PersonalDetailsPage(page));
  },
  testLogger: async ({}, use, testInfo) => {
    await use(new TestLogger(testInfo));
  }
});

test.afterEach(async ({ page, testLogger }, testInfo) => {
  const failed =
    testInfo.status !== testInfo.expectedStatus && testInfo.status !== 'skipped';

  if (failed && !page.isClosed()) {
    try {
      await ScreenshotUtil.capture(page, testInfo, 'failure-page.png');
    } catch (error) {
      testLogger.error(
        `Could not attach the failure screenshot: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  await testLogger.attachExecutionSummary();
});

export { expect };
