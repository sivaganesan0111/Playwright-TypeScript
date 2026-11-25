import { Page, TestInfo } from '@playwright/test';

export class ScreenshotUtil {
  static async capture(
    page: Page,
    testInfo: TestInfo,
    filename: string
  ): Promise<void> {
    const screenshot = await page.screenshot({
      fullPage: true,
      animations: 'disabled',
      timeout: 20000
    });

    await testInfo.attach(filename, {
      body: screenshot,
      contentType: 'image/png'
    });
  }
}
