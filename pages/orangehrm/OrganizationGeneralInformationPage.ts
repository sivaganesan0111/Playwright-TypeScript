import { expect, Locator, Page } from '@playwright/test';
import { OrganizationGeneralInformationData } from '../../test-data/orangehrm/organizationData';

export class OrganizationGeneralInformationPage {
  private readonly pageHeading: Locator;
  private readonly editToggle: Locator;
  private readonly saveButton: Locator;

  constructor(private readonly page: Page) {
    this.pageHeading = page.getByRole('heading', {
      name: 'General Information'
    });
    this.editToggle = page.getByRole('checkbox', { name: 'Edit' });
    this.saveButton = page.getByRole('button', {
      name: 'Save',
      exact: true
    });
  }

  private getFieldGroup(fieldName: string): Locator {
    const escapedFieldName = fieldName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const label = this.page.locator('.oxd-label').filter({
      hasText: new RegExp(`^${escapedFieldName}\\s*\\*?$`)
    });

    return this.page.locator('.oxd-input-group').filter({ has: label });
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/viewOrganizationGeneralInformation/);
    await expect(this.pageHeading).toBeVisible();
    await this.waitForLoader();
    await expect(this.page.locator('.oxd-form')).toBeVisible();
  }

  async waitForLoader(): Promise<void> {
    await this.page.locator('.oxd-form-loader').waitFor({
      state: 'hidden',
      timeout: 15000
    });
  }

  async enableEditMode(): Promise<void> {
    await this.editToggle.check();
    await expect(this.editToggle).toBeChecked();
  }

  async fillField(fieldName: string, value: string): Promise<void> {
    const group = this.getFieldGroup(fieldName);
    await expect(group).toHaveCount(1);

    const field = group.locator('input, textarea');
    await expect(field).toBeVisible();
    await expect(field).toBeEnabled();
    await field.fill(value);
    await expect(field).toHaveValue(value);
  }

  async selectDropdownValue(
    fieldName: string,
    optionName: string
  ): Promise<void> {
    const group = this.getFieldGroup(fieldName);
    await expect(group).toHaveCount(1);

    await group.locator('.oxd-select-text').click();
    const option = this.page.getByRole('option', {
      name: optionName,
      exact: true
    });
    await expect(option).toBeVisible();
    await option.click();
    await expect(group.locator('.oxd-select-text-input')).toHaveText(
      optionName
    );
  }

  async updateFields(
    values: OrganizationGeneralInformationData
  ): Promise<void> {
    for (const fieldName of Object.keys(values) as Array<
      keyof OrganizationGeneralInformationData
    >) {
      const value = values[fieldName];
      if (fieldName === 'Country') {
        await this.selectDropdownValue(fieldName, value);
      } else {
        await this.fillField(fieldName, value);
      }
    }
  }

  async readFieldValue(fieldName: string): Promise<string> {
    const group = this.getFieldGroup(fieldName);
    await expect(group).toHaveCount(1);

    if (fieldName === 'Country') {
      return (await group.locator('.oxd-select-text-input').innerText()).trim();
    }

    return group.locator('input, textarea').inputValue();
  }

  async readFieldValues(
    expectedFields: OrganizationGeneralInformationData
  ): Promise<OrganizationGeneralInformationData> {
    const values = {} as OrganizationGeneralInformationData;

    for (const fieldName of Object.keys(expectedFields) as Array<
      keyof OrganizationGeneralInformationData
    >) {
      values[fieldName] = await this.readFieldValue(fieldName);
    }

    return values;
  }

  async expectFieldValues(
    expectedValues: OrganizationGeneralInformationData
  ): Promise<void> {
    for (const [fieldName, expectedValue] of Object.entries(expectedValues)) {
      const actualValue = await this.readFieldValue(fieldName);
      expect(actualValue, `${fieldName} should match its expected value`).toBe(
        expectedValue
      );
    }
  }

  async clickSave(): Promise<void> {
    await this.saveButton.click();
  }

  async expectSuccessNotification(): Promise<void> {
    await expect(
      this.page.getByText('Successfully Updated', { exact: false })
    ).toBeVisible({ timeout: 15000 });
  }

  async reload(): Promise<void> {
    await this.page.reload();
    await this.expectLoaded();
  }
}
