import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    // Variables de entorno por defecto
    env: {
      TEST_EMAIL: 'admin',
      TEST_PASSWORD: 'del1al8',
      // URL de tu API backend si es diferente
      API_URL: 'http://localhost:5173',
    },
    setupNodeEvents(_on, config) {
      // implement node event listeners here
      return config
    },
  },
})
