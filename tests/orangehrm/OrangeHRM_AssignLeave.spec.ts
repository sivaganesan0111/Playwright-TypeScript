
import { test, expect } from '../../fixtures/orangehrmFixtures';

import { AssignLeavePage } from '../../pages/orangehrm/AssignLeavePage';
import { assignLeaveData } from '../../test-data/orangehrm/assignLeaveData';
import { loginData } from '../../test-data/orangehrm/loginData';
import { ScreenshotUtil } from '../../utils/ScreenshotUtil';

test('OrangeHRM Assign Leave', async ({
    page,
    loginPage,
    dashboardPage,
    testLogger
}, testInfo) => {

    const assignLeavePage = new AssignLeavePage(page);

    // STEP 01: Login and verify Dashboard
    await testLogger.step(
        '01 - Login and verify Dashboard',
        'User should successfully log in and reach Dashboard.',
        async () => {

            await loginPage.navigate(
                'https://opensource-demo.orangehrmlive.com/'
            );

            await loginPage.expectLoaded();

            await loginPage.logIn(
                loginData.username,
                loginData.password
            );

            await dashboardPage.expectLoaded();

            return 'Login successful. Dashboard displayed.';
        }
    );

    // STEP 02: Navigate to Leave menu
    await testLogger.step(
        '02 - Navigate to Leave menu',
        'Leave module should be opened successfully.',
        async () => {

            await assignLeavePage.navigateToLeave();

            await expect(
                page.getByRole('heading', {
                    name: 'Leave',
                    exact: true
                })
            ).toBeVisible();

            return 'Leave menu opened successfully.';
        }
    );

    // STEP 03: Open Assign Leave page
    await testLogger.step(
        '03 - Open Assign Leave page',
        'Assign Leave form and mandatory fields should be visible.',
        async () => {

            await assignLeavePage.openAssignLeave();

            // Validate all mandatory fields using the Page Object method
            await assignLeavePage.expectRequiredFieldsVisible();

            return 'Assign Leave page and all mandatory fields displayed successfully.';
        }
    );

    // STEP 04: Enter employee and leave details
    await testLogger.step(
        '04 - Enter employee and leave details',
        'Employee, leave type, From Date and To Date should be entered.',
        async () => {

            await assignLeavePage.fillForm({
                employeeName: assignLeaveData.employeeName,
                employeeSearchText: assignLeaveData.employeeSearchText,
                leaveType: assignLeaveData.leaveType,
                fromDate: assignLeaveData.fromDate,
                toDate: assignLeaveData.toDate,
                comments: assignLeaveData.comments
            });

            return `Leave details entered for ${assignLeaveData.employeeName}.`;
        }
    );

    // STEP 05: Submit and handle confirmation popup
    await testLogger.step(
        '05 - Assign leave and verify confirmation',
        'Confirmation popup should appear, OK should be clicked, and popup should close successfully.',
        async () => {

            const result = await assignLeavePage.submitForm();
``
            await ScreenshotUtil.capture(
                page,
                testInfo,
                'assign-leave-final.png'
            );

            return result;
        }
    );
});
