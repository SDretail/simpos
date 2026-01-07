# 🚀 Guía Rápida de Configuración - Simpos

## Configuración en 3 pasos

### 1️⃣ Configurar variables de ambiente

La URL de Odoo ahora se configura mediante variables de ambiente:

```bash
# Verifica tu configuración actual
npm run check-env
```

Si necesitas cambiar la URL de Odoo, edita el archivo `.env`:

```bash
nano .env
```

Cambia esta línea:
```bash
VITE_ODOO_URL=http://192.168.1.220  # <-- Cambia esta URL
```

### 2️⃣ Iniciar la aplicación

```bash
npm run dev
```

La aplicación ahora se conectará automáticamente a la URL configurada en `.env`.

### 3️⃣ Ejecutar tests (opcional)

```bash
# Verificar configuración de tests
npm run check-env

# Abrir Cypress
npm run cypress

# Ejecutar tests
npm run cypress:run
```

---

## 📝 Archivos importantes

| Archivo | Propósito |
|---------|-----------|
| `.env` | Configuración principal (URL de Odoo, etc.) |
| `.env.example` | Template con valores de ejemplo |
| `cypress.env.json` | Configuración para tests de Cypress |
| `ENV_CONFIG.md` | Documentación completa de variables |
| `SETUP_GUIDE.md` | Esta guía rápida |

---

## 🔄 Cambiar entre servidores

### Servidor de desarrollo (red local)
```bash
# .env
VITE_ODOO_URL=http://192.168.1.220
```

### Servidor local
```bash
# .env
VITE_ODOO_URL=http://localhost:8069
```

### Servidor de producción
```bash
# .env
VITE_ODOO_URL=https://odoo.tuempresa.com
```

**Importante:** Reinicia el servidor después de cambiar el `.env`:
```bash
# Ctrl+C para detener
npm run dev  # Reiniciar
```

---

## 🆘 Solución de problemas

### Error: "Cannot connect to Odoo"

1. Verifica la URL: `npm run check-env`
2. Verifica que Odoo está corriendo: `ping 192.168.1.220`
3. Reinicia el servidor: `Ctrl+C` y luego `npm run dev`

### Error: "VITE_ODOO_URL is not defined"

1. Asegúrate de que existe el archivo `.env`
2. Verifica que la variable empieza con `VITE_`
3. Reinicia el servidor de desarrollo

### Tests de Cypress fallan

1. Verifica: `npm run check-env`
2. Asegúrate de que `cypress.env.json` tiene la URL correcta
3. Verifica las credenciales de prueba

---

## 📚 Más información

- **Variables de ambiente completas:** Lee `ENV_CONFIG.md`
- **Testing con Cypress:** Lee `cypress/README.md`
- **Estructura del proyecto:** Lee el README principal

---

## ✅ Checklist de configuración inicial

- [ ] Archivo `.env` existe y tiene la URL correcta
- [ ] `npm run check-env` pasa sin errores
- [ ] `npm run dev` inicia sin problemas
- [ ] La aplicación se conecta a Odoo exitosamente
- [ ] (Opcional) Tests de Cypress funcionan

---

**¿Listo?** Ejecuta `npm run dev` y empieza a trabajar! 🎉
