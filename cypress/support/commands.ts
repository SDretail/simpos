// ***********************************************
// Custom commands for Simpos tests
// ***********************************************

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to login via API
       * @example cy.login('user@example.com', 'password123')
       */
      login(email?: string, password?: string): Chainable<void>

      /**
       * Custom command to login via UI
       * @example cy.loginViaUI('user@example.com', 'password123')
       */
      loginViaUI(email: string, password: string): Chainable<void>
    }
  }
}
/* eslint-enable @typescript-eslint/no-namespace */

// Opción 1: Login vía API (más rápido)
Cypress.Commands.add('login', (
  email = Cypress.env('TEST_EMAIL') || 'admin',
  password = Cypress.env('TEST_PASSWORD') || 'del1al8'
) => {
  const odooUrl = Cypress.env('VITE_ODOO_URL') || 'http://localhost'

  cy.session([email, password], () => {
    cy.request({
      method: 'POST',
      url: `${odooUrl}/simpos/v1/sign_in`,
      body: {
        params: {
          login: email,
          password: password,
        },
      },
    }).then((response) => {
      expect(response.status).to.eq(200)

      // Guardar los datos de autenticación en IndexedDB
      cy.visit('/')
      cy.window().then((win) => {
        // Simular el comportamiento de authService.saveAuthMeta
        const authData = response.body

        // Guardar en IndexedDB
        return new Cypress.Promise<void>((resolve) => {
          const request = win.indexedDB.open('simposDB')

          request.onsuccess = () => {
            const db = request.result
            const transaction = db.transaction(['authUserMeta'], 'readwrite')
            const store = transaction.objectStore('authUserMeta')

            store.put({
              id: 1,
              ...authData,
            })

            transaction.oncomplete = () => {
              db.close()
              resolve()
            }
          }

          request.onerror = () => {
            throw new Error('Failed to open IndexedDB')
          }
        })
      })
    })
  })
})

// Opción 2: Login vía UI (prueba el flujo completo)
Cypress.Commands.add('loginViaUI', (email: string, password: string) => {
  cy.session([email, password], () => {
    cy.visit('/login')
    cy.get('input[name="login"]').clear().type(email)
    cy.get('input[name="password"]').clear().type(password)
    cy.get('button[type="submit"]').click()

    // Esperar a que redirija al home
    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })
})

export {}
