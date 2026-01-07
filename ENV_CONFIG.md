# 🔧 Configuración de Variables de Ambiente

Este proyecto usa variables de ambiente para configurar la URL de Odoo y otras opciones sensibles.

## 📁 Archivos de Configuración

### 1. `.env` - Configuración principal de la aplicación

**Ubicación:** Raíz del proyecto (`/home/leo/simpos/.env`)

**Propósito:** Configuración de la aplicación en desarrollo/producción

**Variables disponibles:**

```bash
# URL del servidor Odoo/Simpos API
VITE_ODOO_URL=http://192.168.1.220

# Credenciales de prueba (solo desarrollo - NO usar en producción)
VITE_TEST_EMAIL=jun@fibotree.com
VITE_TEST_PASSWORD=12345678
```

**Nota sobre Vite:** Todas las variables deben empezar con `VITE_` para ser accesibles en el frontend.

### 2. `cypress.env.json` - Configuración de tests

**Ubicación:** Raíz del proyecto (`/home/leo/simpos/cypress.env.json`)

**Propósito:** Variables específicas para Cypress tests

**Estructura:**

```json
{
  "TEST_EMAIL": "jun@fibotree.com",
  "TEST_PASSWORD": "12345678",
  "ODOO_URL": "http://192.168.1.220"
}
```

## 🚀 Inicio Rápido

### Primera vez configurando el proyecto

```bash
# 1. Copia los archivos de ejemplo
cp .env.example .env
cp cypress.env.example.json cypress.env.json

# 2. Edita .env con tu URL de Odoo
nano .env  # o usa tu editor favorito

# 3. Edita cypress.env.json si necesitas credenciales diferentes para tests
nano cypress.env.json
```

### Cambiar la URL de Odoo

Simplemente edita el archivo `.env`:

```bash
# Desarrollo local
VITE_ODOO_URL=http://localhost:8069

# Servidor de desarrollo
VITE_ODOO_URL=http://192.168.1.220

# Servidor de producción
VITE_ODOO_URL=https://odoo.tuempresa.com
```

Luego reinicia el servidor de desarrollo:

```bash
npm run dev
```

## 🔍 Cómo se usan las variables

### En el código de la aplicación

```typescript
// src/services/clients/api.ts
const ODOO_URL = import.meta.env.VITE_ODOO_URL || 'http://localhost:8069';

export const simApi = axios.create({
  baseURL: ODOO_URL,
});
```

### En Cypress tests

```typescript
// cypress/support/commands.ts
const odooUrl = Cypress.env('VITE_ODOO_URL') || 'http://192.168.1.220';

cy.request({
  method: 'POST',
  url: `${odooUrl}/simpos/v1/sign_in`,
  // ...
});
```

## 🌍 Diferentes Entornos

### Desarrollo Local

```bash
# .env
VITE_ODOO_URL=http://localhost:8069
```

### Desarrollo con Odoo remoto

```bash
# .env
VITE_ODOO_URL=http://192.168.1.220
```

### Producción

Puedes usar archivos `.env.production`:

```bash
# .env.production
VITE_ODOO_URL=https://odoo.tuempresa.com
```

Y construir con:

```bash
npm run build  # Usa .env.production automáticamente
```

## 🔒 Seguridad

### ⚠️ IMPORTANTE

1. **NUNCA** comitees archivos `.env` o `cypress.env.json` al repositorio
2. Estos archivos están en `.gitignore` por seguridad
3. Usa archivos `.example` para documentar las variables necesarias
4. En producción, configura las variables de ambiente en tu servidor/plataforma de hosting

### Variables sensibles

```bash
# ❌ MAL - No incluyas passwords reales en .env.example
VITE_TEST_PASSWORD=password123

# ✅ BIEN - Usa placeholders en .env.example
VITE_TEST_PASSWORD=tu-password-aqui
```

## 📝 Checklist para nuevos desarrolladores

- [ ] Copiar `.env.example` a `.env`
- [ ] Actualizar `VITE_ODOO_URL` con la URL correcta
- [ ] Copiar `cypress.env.example.json` a `cypress.env.json`
- [ ] Actualizar credenciales de test si es necesario
- [ ] Verificar que la aplicación se conecta correctamente: `npm run dev`
- [ ] Verificar que los tests funcionan: `npm run cypress`

## 🐛 Troubleshooting

### "Cannot connect to Odoo"

1. Verifica que la URL en `.env` es correcta
2. Verifica que el servidor Odoo está corriendo
3. Verifica conectividad de red: `ping 192.168.1.220`
4. Reinicia el servidor de desarrollo

### "Variables de ambiente no se cargan"

1. Asegúrate de que las variables empiecen con `VITE_`
2. Reinicia el servidor de desarrollo después de cambiar `.env`
3. Limpia la caché: `rm -rf node_modules/.vite`

### "Tests de Cypress fallan con error de autenticación"

1. Verifica que `ODOO_URL` en `cypress.env.json` es correcta
2. Verifica que las credenciales son válidas
3. Prueba el login manualmente en la UI primero

## 📚 Referencias

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Cypress Environment Variables](https://docs.cypress.io/guides/guides/environment-variables)
