import { expect, Locator, Page } from '@playwright/test';

export class DashboardPage {
  private readonly dashboardHeading: Locator;
  private readonly adminLink: Locator;
  private readonly myInfoLink: Locator;

  constructor(private readonly page: Page) {
    this.dashboardHeading = page.getByRole('heading', { name: 'Dashboard' });
    this.adminLink = page.getByRole('link', { name: 'Admin', exact: true });
    this.myInfoLink = page.getByRole('link', { name: 'My Info', exact: true });
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/dashboard/);
    await expect(this.dashboardHeading).toBeVisible();
  }

  async openAdmin(): Promise<void> {
    await this.adminLink.click();
  }

  async openMyInfo(): Promise<void> {
    await this.myInfoLink.click();
  }
}
