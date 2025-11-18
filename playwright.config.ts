const { defineConfig } = require('@playwright/test');
const path = require('path');

// Point dotenv to the .env file in the tests directory
require('dotenv').config({ path: path.resolve(__dirname, 'tests', '.env') });

module.exports = defineConfig({
  testDir: './tests',
  timeout: 120000,
  retries: 0,
  reporter: [['list']],
  use: {
    headless: true,
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    viewport: null,
    launchOptions: {
        args: ['--start-maximized']
    }
  }
});
