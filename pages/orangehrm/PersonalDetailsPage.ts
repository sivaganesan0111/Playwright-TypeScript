
import { expect, Locator, Page } from '@playwright/test';

export type PersonalNameField =
    | 'firstName'
    | 'middleName'
    | 'lastName';

export class PersonalDetailsPage {

    private readonly pageHeading: Locator;
    private readonly personalDetailsSection: Locator;
    private readonly personalDetailsForm: Locator;
    private readonly formLoader: Locator;
    private readonly saveButton: Locator;

    private readonly maleRadio: Locator;
    private readonly femaleRadio: Locator;

    constructor(private readonly page: Page) {

        this.pageHeading = page.getByRole('heading', {
            name: 'Personal Details',
            exact: true
        });

        // Locate the section using its heading.
        this.personalDetailsSection = page
            .locator('.orangehrm-horizontal-padding')
            .filter({ has: this.pageHeading });

        // Locate only the Personal Details form.
        this.personalDetailsForm =
            this.personalDetailsSection.locator('form.oxd-form');

        // Form loading overlay.
        this.formLoader =
            this.personalDetailsForm.locator('.oxd-form-loader');

        // Save button inside Personal Details form.
        this.saveButton = this.personalDetailsForm.getByRole(
            'button',
            {
                name: 'Save',
                exact: true
            }
        );

        // Exact radio button locators.
        this.maleRadio = this.personalDetailsForm.getByRole(
            'radio',
            {
                name: 'Male',
                exact: true
            }
        );

        this.femaleRadio = this.personalDetailsForm.getByRole(
            'radio',
            {
                name: 'Female',
                exact: true
            }
        );
    }

    // Wait until the form loader disappears.
    private async waitForFormReady(): Promise<void> {

        await expect(this.personalDetailsForm).toBeVisible();

        await this.formLoader.waitFor({
            state: 'hidden',
            timeout: 15000
        });
    }

    // Get employee name fields.
    private getNameField(
        fieldName: PersonalNameField
    ): Locator {

        const className: Record<PersonalNameField, string> = {
            firstName: 'orangehrm-firstname',
            middleName: 'orangehrm-middlename',
            lastName: 'orangehrm-lastname'
        };

        return this.personalDetailsForm.locator(
            `input.${className[fieldName]}`
        );
    }

    // Verify Personal Details page is loaded.
    async expectLoaded(): Promise<void> {

        await expect(this.page).toHaveURL(/viewPersonalDetails/);

        await expect(this.pageHeading).toBeVisible();

        await this.waitForFormReady();
    }

    // Enter employee name.
    async fillName(
        fieldName: PersonalNameField,
        value: string
    ): Promise<void> {

        await this.waitForFormReady();

        const field = this.getNameField(fieldName);

        await expect(field).toBeVisible();
        await expect(field).toBeEnabled();

        await field.fill(value);

        await expect(field).toHaveValue(value);
    }

    // Validate employee name.
    async expectName(
        fieldName: PersonalNameField,
        value: string
    ): Promise<void> {

        await this.waitForFormReady();

        await expect(
            this.getNameField(fieldName)
        ).toHaveValue(value);
    }

    // Select Male gender.
    async selectGender(): Promise<void> {

        await this.waitForFormReady();

        await expect(this.maleRadio).toBeVisible();

        // Click the associated label to handle the custom radio UI.
        await this.maleRadio.locator('xpath=..').click();

        await expect(this.maleRadio).toBeChecked();
    }

    // Select Female gender.
    async selectFemaleGender(): Promise<void> {

        await this.waitForFormReady();

        await expect(this.femaleRadio).toBeVisible();

        await this.femaleRadio.locator('xpath=..').click();

        await expect(this.femaleRadio).toBeChecked();
    }

    // Validate Male selection.
    async expectMaleGenderSelected(): Promise<void> {

        await expect(this.maleRadio).toBeChecked();
    }

    // Validate Female selection.
    async expectFemaleGenderSelected(): Promise<void> {

        await expect(this.femaleRadio).toBeChecked();
    }

    // Click Personal Details Save button.
    async clickSave(): Promise<void> {

        await this.waitForFormReady();

        await expect(this.saveButton).toBeVisible();
        await expect(this.saveButton).toBeEnabled();

        await this.saveButton.click();
    }

    // Validate successful update.
    async expectSaveSucceeded(): Promise<void> {

        await expect(
            this.page.getByText('Successfully Updated', {
                exact: false
            }).first()
        ).toBeVisible({
            timeout: 15000
        });
    }

    // Reload Personal Details page.
    async reload(): Promise<void> {

        await this.page.reload();

        await this.expectLoaded();
    }
}
