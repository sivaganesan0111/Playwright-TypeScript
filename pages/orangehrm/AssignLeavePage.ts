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

    // Confirmation popup locators
    private readonly confirmationDialog: Locator;
    private readonly confirmationOkButton: Locator;

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

        // Locate date fields by label to avoid locale-dependent placeholders
        this.fromDateInput = page
            .locator('.oxd-input-group')
            .filter({ hasText: 'From Date' })
            .locator('input');

        this.toDateInput = page
            .locator('.oxd-input-group')
            .filter({ hasText: 'To Date' })
            .locator('input');

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

        // Confirmation popup
        this.confirmationDialog = page.locator(
            'div.oxd-dialog-sheet'
        );

        // OK button inside confirmation popup
        this.confirmationOkButton =
            this.confirmationDialog.locator(
                'button.oxd-button--secondary'
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
        if (!(await this.assignLeaveLink.isVisible())) {
            const moreMenu = this.page
                .getByRole('navigation', { name: 'Topbar Menu' })
                .getByText('More', { exact: true });

            await moreMenu.click();
            await expect(this.assignLeaveLink).toBeVisible();
        }

        await this.assignLeaveLink.click();

        await expect(this.pageHeading).toBeVisible();
    }

    async expectRequiredFieldsVisible(): Promise<void> {
        await expect(this.employeeNameInput).toBeVisible();
        await expect(this.leaveTypeDropdown).toBeVisible();
        await expect(this.fromDateInput).toHaveCount(1);
        await expect(this.toDateInput).toHaveCount(1);

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

    private async formatDateForInput(
        date: string,
        input: Locator
    ): Promise<string> {
        const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);

        if (!dateMatch) {
            throw new Error(`Invalid date '${date}'. Expected yyyy-mm-dd.`);
        }

        const [, year, month, day] = dateMatch;

        if (await input.getAttribute('type') === 'date') {
            return date;
        }

        const placeholder = await input.getAttribute('placeholder');
        const formatMatch = /^(yyyy|mm|dd)([-/.])(yyyy|mm|dd)\2(yyyy|mm|dd)$/i.exec(
            placeholder ?? ''
        );

        if (!formatMatch) {
            throw new Error(
                `Unsupported date input format '${placeholder ?? 'none'}'.`
            );
        }

        const [, first, separator, second, third] = formatMatch;
        const tokens = [first, second, third].map((token) => token.toLowerCase());

        if (new Set(tokens).size !== 3) {
            throw new Error(`Invalid date input format '${placeholder}'.`);
        }

        const dateParts: Record<string, string> = {
            yyyy: year,
            mm: month,
            dd: day
        };

        return tokens
            .map((token) => dateParts[token])
            .join(separator);
    }

    async enterLeaveDates(
        fromDate: string,
        toDate: string
    ): Promise<void> {
        const formattedFromDate = await this.formatDateForInput(
            fromDate,
            this.fromDateInput
        );
        const formattedToDate = await this.formatDateForInput(
            toDate,
            this.toDateInput
        );

        await this.fromDateInput.fill(formattedFromDate);
        await this.fromDateInput.press('Tab');

        await expect(this.fromDateInput).toHaveValue(
            formattedFromDate
        );

        await this.toDateInput.fill(formattedToDate);
        await this.toDateInput.press('Tab');

        await expect(this.toDateInput).toHaveValue(
            formattedToDate
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

    // Submit Assign Leave and handle confirmation popup
    async submitForm(): Promise<string> {
        // Click Assign
        await this.assignButton.click();

        // Wait for confirmation popup
        await expect(this.confirmationDialog).toBeVisible({
            timeout: 15000
        });

        // Validate popup title
        await expect(this.confirmationDialog).toContainText(
            'Confirm Leave Assignment'
        );

        // Validate popup message
        await expect(this.confirmationDialog).toContainText(
            'Employee does not have sufficient leave balance'
        );

        // Verify OK button
        await expect(this.confirmationOkButton).toBeVisible();
        await expect(this.confirmationOkButton).toBeEnabled();

        // Click OK
        await this.confirmationOkButton.click();

        // Verify popup is closed
        await expect(this.confirmationDialog).toBeHidden({
            timeout: 10000
        });

        return 'Confirmation popup verified. OK button clicked and popup closed successfully.';
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