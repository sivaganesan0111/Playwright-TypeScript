
import { expect, Locator, Page } from '@playwright/test';

export class AssignLeavePage {
    private readonly page: Page;
    private readonly leaveMenu: Locator;
    private readonly assignLeaveLink: Locator;
    private readonly pageHeading: Locator;
    private readonly employeeNameInput: Locator;
    private readonly leaveTypeDropdown: Locator;
    private readonly fromDateInput: Locator;
    private readonly toDateInput: Locator;
    private readonly commentsInput: Locator;
    private readonly assignButton: Locator;
    private readonly successToast: Locator;
    private readonly validationErrors: Locator;
    private readonly leaveBalance: Locator;

    constructor(page: Page) {
        this.page = page;

        // Navigation locators
        this.leaveMenu = page.getByRole('link', {
            name: 'Leave',
            exact: true
        });

        this.assignLeaveLink = page
            .getByRole('navigation', { name: 'Topbar Menu' })
            .getByRole('link', {
                name: 'Assign Leave',
                exact: true
            });

        // Page heading
        this.pageHeading = page.getByRole('heading', {
            name: 'Assign Leave',
            exact: true
        });

        // Employee field
        this.employeeNameInput = page.getByPlaceholder(
            'Type for hints...'
        );

        // Leave type dropdown
        this.leaveTypeDropdown = page
            .locator('.oxd-input-group')
            .filter({
                has: page.locator('label').getByText(
                    'Leave Type',
                    { exact: true }
                )
            })
            .locator('.oxd-select-text');

        // Date fields - two inputs share the same placeholder
        const dateInputs = page.getByPlaceholder('yyyy-dd-mm');

        this.fromDateInput = dateInputs.nth(0);
        this.toDateInput = dateInputs.nth(1);

        // Comments
        this.commentsInput = page.locator(
            'textarea.oxd-textarea'
        );

        // Assign button
        this.assignButton = page.getByRole('button', {
            name: 'Assign',
            exact: true
        });

        // Success and validation messages
        this.successToast = page.locator(
            '.oxd-toast--success'
        );

        this.validationErrors = page.locator(
            '.oxd-input-field-error-message'
        );

        this.leaveBalance = page.locator(
            '.orangehrm-leave-balance-text'
        );
    }

    async navigateToLeave(): Promise<void> {
        await this.leaveMenu.click();

        await expect(
            this.page.getByRole('navigation', {
                name: 'Topbar Menu'
            })
        ).toBeVisible();
    }

    async openAssignLeave(): Promise<void> {
        await this.assignLeaveLink.click();

        await expect(this.pageHeading).toBeVisible();
    }

    async expectRequiredFieldsVisible(): Promise<void> {
        await expect(this.employeeNameInput).toBeVisible();
        await expect(this.leaveTypeDropdown).toBeVisible();

        await expect(
            this.page.getByPlaceholder('yyyy-dd-mm')
        ).toHaveCount(2);

        await expect(this.fromDateInput).toBeVisible();
        await expect(this.toDateInput).toBeVisible();
        await expect(this.assignButton).toBeVisible();
    }

    async enterEmployeeName(
        searchText: string,
        employeeName: string
    ): Promise<void> {
        await this.employeeNameInput.fill(searchText);

        const employeeOption = this.page
            .locator('.oxd-autocomplete-option')
            .filter({
                hasText: employeeName
            });

        await expect(employeeOption).toBeVisible();
        await employeeOption.click();

        await expect(this.employeeNameInput).toHaveValue(
            employeeName
        );
    }

    async selectLeaveType(leaveType: string): Promise<void> {
        await this.leaveTypeDropdown.click();

        const leaveOption = this.page
            .getByRole('listbox')
            .getByText(leaveType, {
                exact: true
            });

        await expect(leaveOption).toBeVisible();
        await leaveOption.click();
    }

    async enterLeaveDates(
        fromDate: string,
        toDate: string
    ): Promise<void> {
        // Confirm that the two locators point to separate fields
        await expect(this.fromDateInput).not.toHaveValue(toDate);

        // Fill From Date
        await this.fromDateInput.fill(fromDate);
        await this.fromDateInput.press('Tab');

        await expect(this.fromDateInput).toHaveValue(
            fromDate
        );

        // Fill To Date
        await this.toDateInput.fill(toDate);
        await this.toDateInput.press('Tab');

        await expect(this.toDateInput).toHaveValue(
            toDate
        );
    }

    async enterComments(comments: string): Promise<void> {
        await this.commentsInput.fill(comments);
    }

    async fillForm(data: {
        employeeName: string;
        employeeSearchText: string;
        leaveType: string;
        fromDate: string;
        toDate: string;
        comments?: string;
    }): Promise<void> {

        await this.enterEmployeeName(
            data.employeeSearchText,
            data.employeeName
        );

        await this.selectLeaveType(data.leaveType);

        await this.enterLeaveDates(
            data.fromDate,
            data.toDate
        );

        if (data.comments) {
            await this.enterComments(data.comments);
        }
    }

    async verifyLeaveBalance(): Promise<void> {
        await expect(this.leaveBalance).toBeVisible();

        const balance = await this.leaveBalance.innerText();

        if (balance.includes('0.00')) {
            throw new Error(
                `Insufficient leave balance. Current balance: ${balance}`
            );
        }
    }

    async submitForm(): Promise<void> {
        await this.assignButton.click();
    }

    async expectAssignmentSucceeded(): Promise<void> {
        await expect(
            this.successToast.or(this.validationErrors.first())
        ).toBeVisible({ timeout: 15000 });

        const errors = await this.validationErrors.allTextContents();

        if (errors.length > 0) {
            throw new Error(
                `Assign Leave validation failed: ${errors.join(', ')}`
            );
        }

        await expect(this.successToast).toContainText(
            'Successfully Saved'
        );
    }
}
