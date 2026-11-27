
import { expect, Locator, Page } from '@playwright/test';

export class PIMPage {
    private readonly pimMenu: Locator;
    private readonly addEmployeeMenu: Locator;

    constructor(private readonly page: Page) {
        this.pimMenu = page.getByText('PIM', {
            exact: true
        });

        this.addEmployeeMenu = page.getByRole('link', {
            name: 'Add Employee',
            exact: true
        });
    }

    // Click PIM menu
    async clickPIM(): Promise<void> {
        await this.pimMenu.click();
    }

    // Verify PIM page is displayed
    async expectPIMLoaded(): Promise<void> {
        await expect(this.page).toHaveURL(/pim/);
    }

    // Click Add Employee
    async clickAddEmployee(): Promise<void> {
        await this.addEmployeeMenu.click();
    }

    // Verify Add Employee page
    async expectAddEmployeeLoaded(): Promise<void> {
        await expect(
            this.page.getByRole('heading', {
                name: 'Add Employee'
            })
        ).toBeVisible();
    }
}
