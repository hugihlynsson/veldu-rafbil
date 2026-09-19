import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // The accessibility suite needs a real browser and runs under Playwright.
    // Without this, Vitest picks up its specs and fails on the import.
    include: ['modules/**/*.test.ts'],
  },
})
