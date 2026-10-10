import { defineConfig, devices } from '@playwright/test'

const port = 3300

// Against next dev rather than a build: Vercel builds every preview, so CI
// does not, and dev runs Strict Mode, which is where #1604 surfaced
export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  // A run that cannot finish fails rather than holding the job open
  globalTimeout: process.env.CI ? 10 * 60_000 : undefined,
  reporter: process.env.CI ? 'github' : 'list',
  // Dev compiles each chunk the first time it is asked for
  expect: { timeout: 15_000 },
  use: { baseURL: `http://localhost:${port}`, trace: 'retain-on-failure' },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // The installed Chrome locally, so a run downloads no browser; CI
        // installs Playwright's own
        channel: process.env.CI ? undefined : 'chrome',
      },
    },
  ],
  webServer: {
    command: `npx next dev -p ${port}`,
    url: `http://localhost:${port}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
