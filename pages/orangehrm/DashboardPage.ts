
import { expect, Locator, Page } from '@playwright/test';

export class DashboardPage {

    private readonly dashboardHeading: Locator;
    private readonly adminLink: Locator;
    private readonly myInfoLink: Locator;

    constructor(private readonly page: Page) {

        this.dashboardHeading = page.getByRole('heading', {
            name: 'Dashboard',
            exact: true
        });

        this.adminLink = page.getByRole('link', {
            name: 'Admin',
            exact: true
        });

        this.myInfoLink = page.getByRole('link', {
            name: 'My Info',
            exact: true
        });
    }

    // Verify Dashboard is loaded
    async expectLoaded(): Promise<void> {

        await expect(this.dashboardHeading).toBeVisible({
            timeout: 15000
        });

        await expect(this.page).toHaveURL(/dashboard/, {
            timeout: 10000
        });
    }

    // Navigate to Admin
    async openAdmin(): Promise<void> {
        await this.adminLink.click();
    }

    // Navigate to My Info
    async openMyInfo(): Promise<void> {
        await this.myInfoLink.click();
    }
}
