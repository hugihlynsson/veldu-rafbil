import { configDefaults, defineConfig } from 'vitest/config'

// For the @/ imports, which Next reads from tsconfig.json on its own
export default defineConfig({
  resolve: { tsconfigPaths: true },
  // Agents check other branches out under .claude/worktrees, and their tests
  // are not this checkout's
  test: { exclude: [...configDefaults.exclude, '.claude/**'] },
})
