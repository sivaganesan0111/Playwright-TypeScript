
import { defineConfig } from '@playwright/test';

export default defineConfig({

  testDir: './tests',

  fullyParallel: true,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,

  workers: process.env.CI ? 1 : undefined,

  timeout: 90000,

  expect: {
    timeout: 10000
  },

  reporter: [
    ['html', {
      outputFolder: 'playwright-report',
      open: 'never'
    }]
  ],

  use: {
    channel: process.env.CI ? undefined : 'chrome',
    headless: !!process.env.CI,
    viewport: null,
    screenshot: 'on',
    trace: 'retain-on-failure',
    launchOptions: {
      args: ['--start-maximized']
    }
  },

  projects: [
    {
      name: 'Google Chrome'
    }
  ]

});
