import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    include: ['**/*.e2e-spec.ts'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/data/**'],
    root: './',
    coverage: {
      enabled: true,
      include: ['src/**/*.e2e-spec.ts'],
    },
  }
})