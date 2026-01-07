import { defineConfig } from 'cypress'
import { config as dotenvConfig } from 'dotenv'

// Cargar variables de ambiente desde .env
dotenvConfig()

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    // Variables de entorno por defecto
    env: {
      TEST_EMAIL: process.env.VITE_TEST_EMAIL || 'jun@fibotree.com',
      TEST_PASSWORD: process.env.VITE_TEST_PASSWORD || '12345678',
      // URL del servidor Odoo
      ODOO_URL: process.env.VITE_ODOO_URL || 'http://192.168.1.220',
    },
    setupNodeEvents(_on, config) {
      // implement node event listeners here
      return config
    },
  },
})
