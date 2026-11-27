import { expect, Locator, Page } from '@playwright/test';

export class AdminPage {
  private readonly systemUsersHeading: Locator;
  private readonly organizationMenu: Locator;
  private readonly generalInformationMenuItem: Locator;

  constructor(private readonly page: Page) {
    this.systemUsersHeading = page.getByRole('heading', {
      name: 'System Users'
    });
    this.organizationMenu = page.getByText('Organization', { exact: true });
    this.generalInformationMenuItem = page.getByRole('menuitem', {
      name: 'General Information',
      exact: true
    });
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/admin\/viewSystemUsers/);
    await expect(this.systemUsersHeading).toBeVisible();
  }

  async openGeneralInformation(): Promise<void> {
    await this.organizationMenu.click();
    await this.generalInformationMenuItem.click();
  }
}
