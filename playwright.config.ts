
import { defineConfig } from '@playwright/test';

export default defineConfig({

    testDir: './tests',

    fullyParallel: true,

    forbidOnly: !!process.env.CI,

    retries: process.env.CI ? 2 : 0,

    workers: process.env.CI ? 1 : undefined,

    timeout: 90000,

    expect: {
        timeout: 15000
    },

    reporter: [
        ['list', { printSteps: true }],
        ['html', {
            outputFolder: 'playwright-report',
            open: 'never'
        }]
    ],

    use: {

        // Use Google Chrome locally and in GitHub Actions.
        channel: 'chrome',

        // Headed locally, headless in CI.
        headless: !!process.env.CI,

        // Keep viewport consistent across environments.
        viewport: {
            width: 1366,
            height: 768
        },

        screenshot: 'on',

        trace: 'retain-on-failure',

    },

    projects: [
        {
            name: 'orangehrm',
            testDir: './tests/orangehrm'
        },
        {
            name: 'amazon',
            testDir: './tests/amazon'
        }
    ]

});
