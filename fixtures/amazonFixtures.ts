import { test as base, expect } from '@playwright/test';
import { ScreenshotUtil } from '../utils/ScreenshotUtil';
import { TestLogger } from '../utils/TestLogger';

type AmazonFixtures = {
    testLogger: TestLogger;
};

export const test = base.extend<AmazonFixtures>({
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
