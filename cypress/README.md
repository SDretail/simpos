# Guía de Testing con Cypress + Autenticación

## 🔧 Configuración

### 1. Variables de Entorno Globales (.env)

Copia el archivo de ejemplo en la raíz del proyecto:

```bash
cp .env.example .env
```

Edita `.env` con tu configuración:

```bash
# URL del servidor Odoo
VITE_ODOO_URL=http://192.168.1.220

# Credenciales de prueba (opcional)
VITE_TEST_EMAIL=tu-email@ejemplo.com
VITE_TEST_PASSWORD=tu-password
```

### 2. Variables de Entorno para Cypress

Copia el archivo de ejemplo de Cypress:

```bash
cp cypress.env.example.json cypress.env.json
```

Edita `cypress.env.json`:

```json
{
  "TEST_EMAIL": "tu-email@ejemplo.com",
  "TEST_PASSWORD": "tu-password",
  "VITE_ODOO_URL": "http://192.168.1.220"
}
```

**Nota:** Ambos archivos están en `.gitignore` para no exponer credenciales.

## 🚀 Ejecutar Tests

```bash
# Abrir Cypress UI
npm run cypress

# Ejecutar todos los tests
npm run cypress:run

# Ejecutar tests en modo headless
npm run cypress:headless

# Ejecutar E2E completo (levanta el servidor y ejecuta tests)
npm run e2e
```

## 🔐 Comandos de Autenticación

### 1. `cy.login()` - Login vía API (Recomendado)

**Ventajas:**

- ⚡ Más rápido (no carga la UI de login)
- 🔄 Usa `cy.session()` para cachear el estado
- 📦 Configura IndexedDB automáticamente

**Uso:**

```typescript
beforeEach(() => {
  cy.login(); // Usa credenciales del env por defecto
});

// O con credenciales específicas
cy.login('otro@email.com', 'otroPassword');
```

### 2. `cy.loginViaUI()` - Login vía Interfaz

**Ventajas:**

- ✅ Prueba el flujo completo de login
- 🎯 Útil para tests del componente Login

**Uso:**

```typescript
cy.loginViaUI('email@ejemplo.com', 'password123');
```

## 📝 Ejemplos de Tests

### Test básico con autenticación

```typescript
describe('Mi Feature', () => {
  beforeEach(() => {
    cy.login(); // Login automático antes de cada test
  });

  it('debería hacer algo', () => {
    cy.visit('/pos');
    // Tu test aquí
  });
});
```

### Test del flujo de Login

```typescript
describe('Login', () => {
  it('debería hacer login correctamente', () => {
    cy.loginViaUI('email@test.com', 'password');
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

  it('debería fallar con credenciales incorrectas', () => {
    cy.visit('/login');
    cy.get('input[name="login"]').type('wrong@email.com');
    cy.get('input[name="password"]').type('wrongpass');
    cy.get('button[type="submit"]').click();

    cy.contains('Sign in failed').should('be.visible');
  });
});
```

## 🎯 Buenas Prácticas

### 1. Usar `cy.session()` para performance

El comando `cy.login()` ya usa `cy.session()` internamente, que:

- Cachea el estado de autenticación
- Solo hace login UNA vez por suite de tests
- Restaura el estado entre tests

### 2. No hacer login en cada test

❌ **Malo:**

```typescript
it('test 1', () => {
  cy.visit('/login');
  // llenar form...
});

it('test 2', () => {
  cy.visit('/login');
  // llenar form otra vez...
});
```

✅ **Bueno:**

```typescript
beforeEach(() => {
  cy.login(); // Solo se ejecuta una vez gracias a cy.session
});

it('test 1', () => {
  cy.visit('/pos');
});

it('test 2', () => {
  cy.visit('/inventory');
});
```

### 3. Tests sin autenticación

Si necesitas probar páginas públicas, simplemente no llames `cy.login()`:

```typescript
describe('Páginas públicas', () => {
  it('debería mostrar el login', () => {
    cy.visit('/login');
    cy.contains('Sign in').should('be.visible');
  });
});
```

### 4. Limpiar sesión si es necesario

```typescript
it('debería hacer logout', () => {
  cy.clearAllSessionStorage();
  cy.clearAllLocalStorage();
  // Limpiar IndexedDB si es necesario
  cy.window().then((win) => {
    win.indexedDB.deleteDatabase('simposDB');
  });
});
```

## 🔍 Debugging

### Ver qué está en IndexedDB

```typescript
cy.window().then((win) => {
  const request = win.indexedDB.open('simposDB');
  request.onsuccess = () => {
    const db = request.result;
    const transaction = db.transaction(['authUserMeta'], 'readonly');
    const store = transaction.objectStore('authUserMeta');
    const getRequest = store.getAll();

    getRequest.onsuccess = () => {
      console.log('Auth data:', getRequest.result);
    };
  };
});
```

### Ver las cookies/storage

En Cypress UI, puedes ver:

- Application tab → IndexedDB
- Network tab → Ver requests de login
- Console → Logs de la app

## 📚 Recursos

- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Cypress Session API](https://docs.cypress.io/api/commands/session)
- [Testing Authentication](https://docs.cypress.io/guides/end-to-end-testing/testing-your-app#Logging-in)
