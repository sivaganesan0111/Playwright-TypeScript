import { test, expect } from '../fixtures/testFixtures';
import { loginData } from '../test-data/loginData';
import { organizationData } from '../test-data/organizationData';
import { ScreenshotUtil } from '../utils/ScreenshotUtil';

const loginUrl =
  'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login';

test('OrangeHRM_Organization_GeneralInformation', async (
  {
    page,
    loginPage,
    dashboardPage,
    adminPage,
    organizationGeneralInformationPage,
    testLogger
  },
  testInfo
) => {
  test.setTimeout(120000);

  // Shared demo mutations are opt-in. The default isolated run is safely skipped.
  test.skip(
    process.env.ORANGEHRM_ALLOW_SHARED_DEMO_UPDATE !== 'true',
    'Set ORANGEHRM_ALLOW_SHARED_DEMO_UPDATE=true to authorize updating all 13 shared-demo organization fields.'
  );

  await testLogger.step(
    '01 - Open OrangeHRM login page',
    'Login page and credential fields are visible.',
    async () => {
      await loginPage.navigate(loginUrl);
      await loginPage.expectLoaded();
      await ScreenshotUtil.capture(page, testInfo, '01-login-page.png');
      return `Login page loaded at ${page.url()}.`;
    }
  );

  await testLogger.step(
    '02 - Login and verify Dashboard',
    'Dashboard is displayed after a successful login.',
    async () => {
      await loginPage.logIn(loginData.username, loginData.password);
      await dashboardPage.expectLoaded();
      await ScreenshotUtil.capture(page, testInfo, '02-dashboard.png');
      return `Dashboard is visible at ${page.url()}.`;
    }
  );

  await testLogger.step(
    '03 - Open Admin module',
    'Admin System Users page is displayed.',
    async () => {
      await dashboardPage.openAdmin();
      await adminPage.expectLoaded();
      await ScreenshotUtil.capture(page, testInfo, '03-admin-page.png');
      return `Admin System Users page is visible at ${page.url()}.`;
    }
  );

  await testLogger.step(
    '04 - Navigate to Organization General Information',
    'General Information page is loaded.',
    async () => {
      await adminPage.openGeneralInformation();
      await organizationGeneralInformationPage.expectLoaded();
      await ScreenshotUtil.capture(
        page,
        testInfo,
        '04-general-information-page.png'
      );
      return `General Information page is visible at ${page.url()}.`;
    }
  );

  await testLogger.step(
    '05 - Capture current organization values',
    'Existing values are recorded before any modification.',
    async () => {
      const existingValues =
        await organizationGeneralInformationPage.readFieldValues(
          organizationData
        );
      await testInfo.attach('existing-organization-values.json', {
        body: JSON.stringify(existingValues, null, 2),
        contentType: 'application/json'
      });
      await ScreenshotUtil.capture(page, testInfo, '05-before-edit.png');
      return JSON.stringify(existingValues, null, 2);
    }
  );

  await testLogger.step(
    '06 - Enable Edit mode',
    'Edit mode is enabled and editable fields are available.',
    async () => {
      await organizationGeneralInformationPage.enableEditMode();
      await ScreenshotUtil.capture(
        page,
        testInfo,
        '06-edit-mode-enabled.png'
      );
      return 'Edit mode is enabled.';
    }
  );

  await testLogger.step(
    '07 - Enter all 13 organization values',
    'Editable fields contain the test-data values.',
    async () => {
      await organizationGeneralInformationPage.updateFields(organizationData);
      await organizationGeneralInformationPage.expectFieldValues(
        organizationData
      );
      await testInfo.attach('expected-organization-values.json', {
        body: JSON.stringify(organizationData, null, 2),
        contentType: 'application/json'
      });
      return JSON.stringify(
        await organizationGeneralInformationPage.readFieldValues(
          organizationData
        ),
        null,
        2
      );
    }
  );

  await testLogger.step(
    '08 - Validate all organization fields before saving',
    'All 13 field values match the expected test data.',
    async () => {
      await organizationGeneralInformationPage.expectFieldValues(
        organizationData
      );
      expect(
        await organizationGeneralInformationPage.readFieldValues(
          organizationData
        )
      ).toEqual(organizationData);
      await ScreenshotUtil.capture(
        page,
        testInfo,
        '07-all-updated-details-before-save.png'
      );
      return 'All 13 organization fields match the expected values.';
    }
  );

  await testLogger.step(
    '09 - Save and verify success',
    'Save completes and a success notification appears.',
    async () => {
      const notification = organizationGeneralInformationPage.expectSuccessNotification();
      await organizationGeneralInformationPage.clickSave();
      await ScreenshotUtil.capture(
        page,
        testInfo,
        '08-immediately-after-save-click.png'
      );
      await notification;
      await organizationGeneralInformationPage.waitForLoader();
      await ScreenshotUtil.capture(page, testInfo, '09-save-completed.png');
      return 'Save completed and the success notification appeared.';
    }
  );

  await testLogger.step(
    '10 - Reload and verify persisted organization values',
    'All 13 saved field values persist after reloading the page.',
    async () => {
      await organizationGeneralInformationPage.reload();
      await organizationGeneralInformationPage.expectFieldValues(
        organizationData
      );
      expect(
        await organizationGeneralInformationPage.readFieldValues(
          organizationData
        )
      ).toEqual(organizationData);
      await ScreenshotUtil.capture(
        page,
        testInfo,
        '10-final-verified-organization-details.png'
      );
      return 'All 13 organization values persisted after reload.';
    }
  );
});
