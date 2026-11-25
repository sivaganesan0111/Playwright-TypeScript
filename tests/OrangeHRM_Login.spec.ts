import { test } from '../fixtures/testFixtures';
import { loginData, personalDetailsData } from '../test-data/loginData';
import { ScreenshotUtil } from '../utils/ScreenshotUtil';

const loginUrl =
  'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login';

test('OrangeHRM Login and Update Personal Details', async (
  {
    page,
    loginPage,
    dashboardPage,
    personalDetailsPage,
    testLogger
  },
  testInfo
) => {
  test.setTimeout(90000);

  await testLogger.step(
    '01 - Open OrangeHRM Login Page',
    'Login page and username field are visible.',
    async () => {
      await loginPage.navigate(loginUrl);
      await loginPage.expectLoaded();
      await ScreenshotUtil.capture(page, testInfo, '01-OrangeHRM-Login-Page.png');
      return `Login page loaded at ${page.url()}.`;
    }
  );

  await testLogger.step(
    '02 - Log in and verify Dashboard',
    'Dashboard is displayed after a successful login.',
    async () => {
      await loginPage.logIn(loginData.username, loginData.password);
      await dashboardPage.expectLoaded();
      await ScreenshotUtil.capture(
        page,
        testInfo,
        '02-Dashboard-After-Login.png'
      );
      return `Dashboard is visible at ${page.url()}.`;
    }
  );

  await testLogger.step(
    '03 - Navigate to Personal Details',
    'Personal Details page is displayed and ready.',
    async () => {
      await dashboardPage.openMyInfo();
      await personalDetailsPage.expectLoaded();
      await ScreenshotUtil.capture(
        page,
        testInfo,
        '03-Personal-Details-Before-Update.png'
      );
      return 'Personal Details page loaded successfully.';
    }
  );

  await testLogger.step(
    '04 - Update personal details',
    'Name fields contain the existing test values.',
    async () => {
      await personalDetailsPage.fillName(
        'firstName',
        personalDetailsData.firstName
      );
      await personalDetailsPage.fillName(
        'middleName',
        personalDetailsData.middleName
      );
      await personalDetailsPage.fillName(
        'lastName',
        personalDetailsData.lastName
      );
      await personalDetailsPage.selectGender();
      return 'First name, middle name, last name, and gender were set.';
    }
  );

  await testLogger.step(
    '05 - Save personal details',
    'One save completes successfully with before/after screenshots attached.',
    async () => {
      await ScreenshotUtil.capture(
        page,
        testInfo,
        '04_Before_Clicking_Save.png'
      );
      await personalDetailsPage.clickSave();
      await ScreenshotUtil.capture(
        page,
        testInfo,
        '05_After_Clicking_Save.png'
      );
      await personalDetailsPage.expectSaveSucceeded();
      return 'Personal details were saved and the success notification appeared.';
    }
  );

  await testLogger.step(
    '06 - Reload and verify persisted personal details',
    'All four test values persist after reload.',
    async () => {
      await personalDetailsPage.reload();
      await personalDetailsPage.expectName(
        'firstName',
        personalDetailsData.firstName
      );
      await personalDetailsPage.expectName(
        'middleName',
        personalDetailsData.middleName
      );
      await personalDetailsPage.expectName(
        'lastName',
        personalDetailsData.lastName
      );
      await personalDetailsPage.expectMaleGenderSelected();
      await ScreenshotUtil.capture(
        page,
        testInfo,
        '05-Final-Saved-Personal-Details.png'
      );
      return 'All personal detail values persisted after reload.';
    }
  );
});
