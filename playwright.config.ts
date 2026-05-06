import { existsSync } from 'fs';
import { defineConfig, devices } from '@playwright/test';

const systemChrome =
  process.env.PLAYWRIGHT_CHROME_PATH ||
  (existsSync('/usr/bin/google-chrome') ? '/usr/bin/google-chrome' : undefined);
const serverPort = Number(process.env.PLAYWRIGHT_PORT || 3000);
const baseURL = `http://127.0.0.1:${serverPort}`;

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  fullyParallel: true,
  reporter: process.env.CI ? [['github'], ['html']] : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: serverPort === 3000 ? 'npm run dev:e2e' : `npx next dev -H 127.0.0.1 -p ${serverPort}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: systemChrome ? { executablePath: systemChrome } : undefined,
      },
    },
  ],
});
