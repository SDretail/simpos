#!/usr/bin/env node

/**
 * Script para verificar que las variables de ambiente están configuradas correctamente
 */

import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

console.log('🔍 Verificando configuración de variables de ambiente...\n');

let hasErrors = false;

// Verificar .env
const envPath = join(rootDir, '.env');
if (!existsSync(envPath)) {
  console.error('❌ Archivo .env no encontrado');
  console.log('   Copia .env.example a .env: cp .env.example .env\n');
  hasErrors = true;
} else {
  console.log('✅ Archivo .env encontrado');

  try {
    const envContent = readFileSync(envPath, 'utf-8');

    // Verificar VITE_ODOO_URL
    const odooUrlMatch = envContent.match(/VITE_ODOO_URL=(.+)/);
    if (odooUrlMatch) {
      const url = odooUrlMatch[1].trim();
      if (url.includes('tu-servidor-odoo')) {
        console.warn('⚠️  VITE_ODOO_URL todavía tiene el valor de ejemplo');
        console.log('   Actualiza la URL en .env con tu servidor Odoo\n');
        hasErrors = true;
      } else {
        console.log(`✅ VITE_ODOO_URL configurado: ${url}`);
      }
    } else {
      console.error('❌ VITE_ODOO_URL no encontrado en .env');
      hasErrors = true;
    }
  } catch (error) {
    console.error('❌ Error al leer .env:', error.message);
    hasErrors = true;
  }
}

// Verificar cypress.env.json
const cypressEnvPath = join(rootDir, 'cypress.env.json');
if (!existsSync(cypressEnvPath)) {
  console.error('\n❌ Archivo cypress.env.json no encontrado');
  console.log('   Copia cypress.env.example.json a cypress.env.json:');
  console.log('   cp cypress.env.example.json cypress.env.json\n');
  hasErrors = true;
} else {
  console.log('\n✅ Archivo cypress.env.json encontrado');

  try {
    const cypressEnvContent = readFileSync(cypressEnvPath, 'utf-8');
    const cypressEnv = JSON.parse(cypressEnvContent);

    if (cypressEnv.ODOO_URL) {
      if (cypressEnv.ODOO_URL.includes('tu-servidor-odoo')) {
        console.warn('⚠️  ODOO_URL en cypress.env.json todavía tiene el valor de ejemplo');
        hasErrors = true;
      } else {
        console.log(`✅ ODOO_URL configurado: ${cypressEnv.ODOO_URL}`);
      }
    } else {
      console.error('❌ ODOO_URL no encontrado en cypress.env.json');
      hasErrors = true;
    }

    if (cypressEnv.TEST_EMAIL && cypressEnv.TEST_PASSWORD) {
      console.log('✅ Credenciales de prueba configuradas');
    }
  } catch (error) {
    console.error('❌ Error al leer cypress.env.json:', error.message);
    hasErrors = true;
  }
}

console.log('\n' + '='.repeat(60));

if (hasErrors) {
  console.log('\n❌ Hay problemas con la configuración');
  console.log('\n📚 Lee ENV_CONFIG.md para más información');
  process.exit(1);
} else {
  console.log('\n✅ Configuración correcta! Todo listo para empezar');
  console.log('\n🚀 Puedes ejecutar:');
  console.log('   npm run dev      - Iniciar servidor de desarrollo');
  console.log('   npm run cypress  - Abrir Cypress para tests');
}
