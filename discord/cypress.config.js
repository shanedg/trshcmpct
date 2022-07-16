import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:53134',
    setupNodeEvents(_on, _config) {
      // implement node event listeners here
    },
  },
  video: false,
});
