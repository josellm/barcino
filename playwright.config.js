import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    baseURL: 'http://localhost:8080',
  },
  testDir: 'tests',
  webServer: {
    command: 'npx serve . -p 8080',
    port: 8080,
    timeout: 120000,
    reuseExistingServer: false,
  },
});

