// playwright.config.ts
import { defineConfig } from 'playwright/test';

export default defineConfig({
  use: {
    baseURL: 'http://localhost:8100', // update this to match your dev server
    headless: false, // optional, runs test with visible browser
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  testDir: './tests', // where your E2E tests live
});
