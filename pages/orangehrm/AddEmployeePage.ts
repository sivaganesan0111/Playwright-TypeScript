
import { expect, Locator, Page } from '@playwright/test';

export class AddEmployeePage {
    private readonly firstNameField: Locator;
    private readonly middleNameField: Locator;
    private readonly lastNameField: Locator;
    private readonly employeeIdField: Locator;
    private readonly saveButton: Locator;
    private readonly successNotification: Locator;

    constructor(private readonly page: Page) {
        this.firstNameField = page.locator('input[name="firstName"]');

        this.middleNameField = page.locator('input[name="middleName"]');

        this.lastNameField = page.locator('input[name="lastName"]');

        this.employeeIdField = page
            .locator('.oxd-input-group')
            .filter({
                has: page.getByText('Employee Id', {
                    exact: true
                })
            })
            .locator('input');

        this.saveButton = page.getByRole('button', {
            name: 'Save',
            exact: true
        });

        this.successNotification = page.locator('.oxd-toast--success');
    }

    // Verify Add Employee page
    async expectLoaded(): Promise<void> {
        await expect(
            this.page.getByRole('heading', {
                name: 'Add Employee'
            })
        ).toBeVisible();
    }

    // Enter employee information
    async enterEmployeeDetails(
        firstName: string,
        middleName: string,
        lastName: string,
        employeeId: string
    ): Promise<void> {
        await this.firstNameField.fill(firstName);
        await this.middleNameField.fill(middleName);
        await this.lastNameField.fill(lastName);
        await this.employeeIdField.fill(employeeId);
    }

    // Save employee
    async clickSave(): Promise<void> {
        await this.saveButton.click();
    }

    // Verify successful employee creation
    async verifyEmployeeSaved(): Promise<void> {
        await expect(this.successNotification).toBeVisible();

        await expect(this.successNotification).toContainText(
            'Successfully Saved'
        );
    }
}
