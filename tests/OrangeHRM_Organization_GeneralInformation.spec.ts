
import { test, expect } from '../fixtures/testFixtures';

import { loginData } from '../test-data/loginData';
import { organizationData } from '../test-data/organizationData';

import { ScreenshotUtil } from '../utils/ScreenshotUtil';

const loginUrl =
    'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login';

test('OrangeHRM - Update Organization General Information', async ({
                                                                       page,
                                                                       loginPage,
                                                                       dashboardPage,
                                                                       adminPage,
                                                                       organizationGeneralInformationPage
                                                                   }, testInfo) => {

    test.setTimeout(120000);

    // Prevent accidental changes to shared demo data
    test.skip(
        process.env.ORANGEHRM_ALLOW_SHARED_DEMO_UPDATE !== 'true',
        'Set ORANGEHRM_ALLOW_SHARED_DEMO_UPDATE=true to authorize updating shared demo data.'
    );

    // STEP 01 - Open OrangeHRM
    await test.step('01 - Open OrangeHRM Login Page', async () => {

        await loginPage.navigate(loginUrl);
        await loginPage.expectLoaded();

        await ScreenshotUtil.capture(
            page,
            testInfo,
            '01-login-page.png'
        );
    });

    // STEP 02 - Login
    await test.step('02 - Login and Verify Dashboard', async () => {

        await loginPage.logIn(
            loginData.username,
            loginData.password
        );

        await dashboardPage.expectLoaded();

        await ScreenshotUtil.capture(
            page,
            testInfo,
            '02-dashboard.png'
        );
    });

    // STEP 03 - Open Admin
    await test.step('03 - Navigate to Admin Module', async () => {

        await dashboardPage.openAdmin();
        await adminPage.expectLoaded();

        await ScreenshotUtil.capture(
            page,
            testInfo,
            '03-admin-page.png'
        );
    });

    // STEP 04 - Open General Information
    await test.step(
        '04 - Navigate to Organization General Information',
        async () => {

            await adminPage.openGeneralInformation();
            await organizationGeneralInformationPage.expectLoaded();

            await ScreenshotUtil.capture(
                page,
                testInfo,
                '04-general-information.png'
            );
        }
    );

    // STEP 05 - Capture existing values
    await test.step('05 - Capture Existing Organization Details', async () => {

        const existingValues =
            await organizationGeneralInformationPage.readFieldValues(organizationData);

        await testInfo.attach('existing-organization-values.json', {
            body: JSON.stringify(existingValues, null, 2),
            contentType: 'application/json'
        });

        await ScreenshotUtil.capture(
            page,
            testInfo,
            '05-before-edit.png'
        );
    });

    // STEP 06 - Enable edit mode
    await test.step('06 - Enable Organization Edit Mode', async () => {

        await organizationGeneralInformationPage.enableEditMode();
    });

    // STEP 07 - Update organization fields
    await test.step('07 - Update All 13 Organization Fields', async () => {

        await organizationGeneralInformationPage.updateFields(
            organizationData
        );

        await organizationGeneralInformationPage.expectFieldValues(
            organizationData
        );

        await testInfo.attach('expected-organization-values.json', {
            body: JSON.stringify(organizationData, null, 2),
            contentType: 'application/json'
        });

        await ScreenshotUtil.capture(
            page,
            testInfo,
            '06-updated-details-before-save.png'
        );
    });

    // STEP 08 - Save organization information
    await test.step('08 - Save Organization Information', async () => {

        const notification =
            organizationGeneralInformationPage.expectSuccessNotification();

        await organizationGeneralInformationPage.clickSave();

        await notification;

        await organizationGeneralInformationPage.waitForLoader();

        await ScreenshotUtil.capture(
            page,
            testInfo,
            '07-save-completed.png'
        );
    });

    // STEP 09 - Reload and validate persisted values
    await test.step(
        '09 - Verify Organization Details After Reload',
        async () => {

            await organizationGeneralInformationPage.reload();

            await organizationGeneralInformationPage.expectFieldValues(
                organizationData
            );

            const finalValues =
                await organizationGeneralInformationPage.readFieldValues(organizationData);

            expect(finalValues).toEqual(organizationData);

            await testInfo.attach('final-organization-values.json', {
                body: JSON.stringify(finalValues, null, 2),
                contentType: 'application/json'
            });

            await ScreenshotUtil.capture(
                page,
                testInfo,
                '08-final-verified-details.png'
            );
        }
    );

});
