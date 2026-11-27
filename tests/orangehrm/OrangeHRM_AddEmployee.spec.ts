
import { test, expect } from '../../fixtures/orangehrmFixtures';

import { PIMPage } from '../../pages/orangehrm/PIMPage';
import { AddEmployeePage } from '../../pages/orangehrm/AddEmployeePage';

import { loginData } from '../../test-data/orangehrm/loginData';
import { ScreenshotUtil } from '../../utils/ScreenshotUtil';

test('OrangeHRM Add New Employee', async ({
    page,
    loginPage,
    dashboardPage,
    testLogger
}, testInfo) => {

    const pimPage = new PIMPage(page);
    const addEmployeePage = new AddEmployeePage(page);

    // Employee test data
    const employeeDetails = {
        firstName: 'Siva',
        middleName: 'Kumar',
        lastName: 'Test',
        employeeId: Math.floor(1000000000 + Math.random() * 9000000000).toString()
    };

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

    // STEP 02: Navigate to PIM menu
    await testLogger.step(
        '02 - Navigate to PIM menu',
        'PIM module should be opened successfully.',
        async () => {

            await pimPage.clickPIM();

            await pimPage.expectPIMLoaded();

            return 'PIM module opened successfully.';
        }
    );

    // STEP 03: Open Add Employee page
    await testLogger.step(
        '03 - Open Add Employee page',
        'Add Employee form should be displayed successfully.',
        async () => {

            await pimPage.clickAddEmployee();

            await addEmployeePage.expectLoaded();

            return 'Add Employee page opened successfully.';
        }
    );

    // STEP 04: Enter employee details
    await testLogger.step(
        '04 - Enter employee details',
        'First Name, Middle Name, Last Name and Employee ID should be entered.',
        async () => {

            await addEmployeePage.enterEmployeeDetails(
                employeeDetails.firstName,
                employeeDetails.middleName,
                employeeDetails.lastName,
                employeeDetails.employeeId
            );

            await ScreenshotUtil.capture(
                page,
                testInfo,
                'add-employee-before-save.png'
            );

            return `Employee details entered successfully. Employee ID: ${employeeDetails.employeeId}`;
        }
    );

    // STEP 05: Save employee and verify success notification
    await testLogger.step(
        '05 - Save employee and verify success notification',
        'Employee should be saved successfully and success notification should be displayed.',
        async () => {

            await addEmployeePage.clickSave();

            await addEmployeePage.verifyEmployeeSaved();

            return 'Employee saved successfully. Success notification displayed.';
        }
    );

    // STEP 06: Verify Personal Details page
    await testLogger.step(
        '06 - Verify employee Personal Details page',
        'After saving, Personal Details page should be displayed.',
        async () => {

            await expect(page).toHaveURL(
                /pim\/viewPersonalDetails/
            );

            await expect(
                page.getByRole('heading', {
                    name: 'Personal Details'
                })
            ).toBeVisible();

            return 'Personal Details page displayed successfully.';
        }
    );

    // STEP 07: Capture final screenshot
    await testLogger.step(
        '07 - Capture final employee details screenshot',
        'Final employee details page screenshot should be captured.',
        async () => {

            await ScreenshotUtil.capture(
                page,
                testInfo,
                'add-employee-final.png'
            );

            return 'Final employee details screenshot captured successfully.';
        }
    );

    console.log('SUCCESS: Employee created successfully');
    console.log('Employee ID:', employeeDetails.employeeId);

});
