import { expect, Locator, Page } from '@playwright/test';

export class PersonalDetailsPage {
  private readonly personalDetailsHeading: Locator;
  private readonly firstNameField: Locator;
  private readonly middleNameField: Locator;
  private readonly lastNameField: Locator;
  private readonly maleRadio: Locator;
  private readonly saveButton: Locator;

  constructor(private readonly page: Page) {
    this.personalDetailsHeading = page.getByRole('heading', {
      name: 'Personal Details'
    });
    this.firstNameField = page.locator('input[name="firstName"]');
    this.middleNameField = page.locator('input[name="middleName"]');
    this.lastNameField = page.locator('input[name="lastName"]');
    this.maleRadio = page.getByRole('radio', { name: 'Male', exact: true });
    this.saveButton = page.getByRole('button', {
      name: 'Save',
      exact: true
    }).first();
  }

  private async waitForLoader(): Promise<void> {
    await this.page.locator('.oxd-form-loader').waitFor({
      state: 'hidden',
      timeout: 15000
    });
  }

  async expectLoaded(): Promise<void> {
    await expect(this.personalDetailsHeading).toBeVisible();
    await this.waitForLoader();
  }

  async fillName(
    field: 'firstName' | 'middleName' | 'lastName',
    value: string
  ): Promise<void> {
    const locator = {
      firstName: this.firstNameField,
      middleName: this.middleNameField,
      lastName: this.lastNameField
    }[field];

    await locator.fill(value);
    await expect(locator).toHaveValue(value);
  }

    async selectGender(): Promise<void> {
        await this.waitForLoader();

        await this.page.getByText('Male', { exact: true }).click();

        await expect(this.maleRadio).toBeChecked();
    }

  async clickSave(): Promise<void> {
    await this.waitForLoader();
    await this.saveButton.click();
  }

  async expectSaveSucceeded(): Promise<void> {
    await expect(
      this.page.getByText('Successfully Updated', { exact: false })
    ).toBeVisible({ timeout: 15000 });
    await this.waitForLoader();
  }

  async reload(): Promise<void> {
    await this.page.reload();
    await this.expectLoaded();
  }

  async expectName(
    field: 'firstName' | 'middleName' | 'lastName',
    value: string
  ): Promise<void> {
    const locator = {
      firstName: this.firstNameField,
      middleName: this.middleNameField,
      lastName: this.lastNameField
    }[field];
    await expect(locator).toHaveValue(value);
  }

  async expectMaleGenderSelected(): Promise<void> {
    await expect(this.maleRadio).toBeChecked();
  }
}
