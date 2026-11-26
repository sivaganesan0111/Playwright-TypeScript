
import { test } from '../fixtures/testFixtures';
import { AssignLeavePage } from '../pages/AssignLeavePage';
import {
    assignLeaveData,
    getUpcomingWeekday
} from '../test-data/assignLeaveData';
import { loginData } from '../test-data/loginData';
import { ScreenshotUtil } from '../utils/ScreenshotUtil';

const loginUrl =
    'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login';

// OrangeHRM date input format: yyyy-dd-mm
function formatLeaveDate(date: Date): string {
    const year = date.getFullYear();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');

    return `${year}-${day}-${month}`;
}

test('OrangeHRM Assign Leave', async (
    { page, loginPage, dashboardPage, testLogger },
    testInfo
) => {
    test.setTimeout(90000);

    const assignLeavePage = new AssignLeavePage(page);

    const leaveDate = getUpcomingWeekday();
    const formattedDate = formatLeaveDate(leaveDate);

    // STEP 01 - Login
    await testLogger.step(
        '01 - Login and verify Dashboard',
        'User should successfully log in and reach Dashboard.',
        async () => {
            await loginPage.navigate(loginUrl);
            await loginPage.expectLoaded();

            await loginPage.logIn(
                loginData.username,
                loginData.password
            );

            await dashboardPage.expectLoaded();

            return 'Login successful. Dashboard displayed.';
        }
    );

    // STEP 02 - Navigate to Leave
    await testLogger.step(
        '02 - Navigate to Leave menu',
        'Leave module should be opened successfully.',
        async () => {
            await assignLeavePage.navigateToLeave();

            return 'Leave menu opened successfully.';
        }
    );

    // STEP 03 - Open Assign Leave
    await testLogger.step(
        '03 - Open Assign Leave page',
        'Assign Leave form and mandatory fields should be visible.',
        async () => {
            await assignLeavePage.openAssignLeave();

            await assignLeavePage.expectRequiredFieldsVisible();

            return 'Assign Leave page displayed successfully.';
        }
    );

    // STEP 04 - Fill Assign Leave form
    await testLogger.step(
        '04 - Enter employee and leave details',
        'Employee, leave type, From Date and To Date should be entered.',
        async () => {
            await assignLeavePage.fillForm({
                employeeName: assignLeaveData.employeeName,
                employeeSearchText: assignLeaveData.employeeSearchText,
                leaveType: assignLeaveData.leaveType,
                fromDate: formattedDate,
                toDate: formattedDate,
                comments: 'Automated leave assignment test'
            });

            return `Leave details entered for ${assignLeaveData.employeeName}.`;
        }
    );

    // STEP 05 - Submit and validate
    await testLogger.step(
        '05 - Assign leave and verify confirmation',
        'Application should confirm successful leave assignment.',
        async () => {
            await assignLeavePage.submitForm();

            await assignLeavePage.expectAssignmentSucceeded();

            await ScreenshotUtil.capture(
                page,
                testInfo,
                'OrangeHRM_AssignLeave_Success.png'
            );

            return 'Leave assignment successful. Screenshot captured and attached.';
        }
    );
});
