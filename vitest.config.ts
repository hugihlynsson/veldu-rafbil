import { defineConfig } from 'vitest/config'

// For the @/ imports, which Next reads from tsconfig.json on its own
export default defineConfig({ resolve: { tsconfigPaths: true } })
