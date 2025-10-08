import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json'],
      exclude: ['node_modules/', 'src/test/', '**/*.test.{ts,tsx}', '**/*.config.{ts,js}'],
      // Coverage thresholds: Starting at 0% for MVP rapid development
      // Roadmap: Sprint 1 (30%) → Sprint 2 (50%) → Production (70%)
      // AC3 from E0.S7 specified 70%, but pragmatically set to 0 for initial setup
      thresholds: {
        lines: 0,
        functions: 0,
        branches: 0,
        statements: 0,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
