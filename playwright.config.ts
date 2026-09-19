import { defineConfig, devices } from '@playwright/test'

const port = 4321

export default defineConfig({
  testDir: './a11y',
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',

  use: {
    baseURL: `http://localhost:${port}`,
    // Scanning while the suggestions and car tiles are still fading in from
    // opacity-0 reports contrast failures that do not exist once they land.
    // This settles them by exercising the reduced-motion path the site ships,
    // and the end state it leaves behind is the one worth auditing.
    reducedMotion: 'reduce',
    // Containers and sandboxes often carry a Chromium that does not match the
    // pinned Playwright build. Point CHROMIUM_PATH at it rather than
    // downloading a second one; CI installs the matching build and ignores it.
    launchOptions: process.env.CHROMIUM_PATH
      ? { executablePath: process.env.CHROMIUM_PATH }
      : {},
  },

  projects: [{ name: 'chromium', use: devices['Desktop Chrome'] }],

  webServer: {
    // Contrast, focus order and modality only exist in a real browser against
    // a real build, which is the whole reason this suite is not in Vitest
    command: `npm run build && npx next start --port ${port}`,
    url: `http://localhost:${port}`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
})
