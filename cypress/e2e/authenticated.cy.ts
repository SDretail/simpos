/// <reference types="cypress" />

describe('Authenticated Tests', () => {
  // Este hook ejecuta el login ANTES de todos los tests
  // cy.session cachea el resultado, así que solo se ejecuta una vez
  beforeEach(() => {
    cy.login()
  })

  it('should access POS after login', () => {
    cy.visit('/pos')
    // Verificar que estamos en la página de POS
    cy.url().should('include', '/pos')
  })

  it('should access inventory after login', () => {
    cy.visit('/inventory')
    // Verificar que estamos en la página de inventario
    cy.url().should('include', '/inventory')
  })

  it('should access purchase after login', () => {
    cy.visit('/purchase')
    cy.url().should('include', '/purchase')
  })
})

describe('Login via UI Tests', () => {
  it('should login successfully via UI', () => {
    cy.loginViaUI('jun@fibotree.com', '12345678')
    cy.visit('/')
    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })

  it('should fail with wrong credentials', () => {
    cy.visit('/login')
    cy.get('input[name="login"]').type('wrong@email.com')
    cy.get('input[name="password"]').type('wrongpassword')
    cy.get('button[type="submit"]').click()

    // Verificar que muestra un error
    cy.contains('Sign in failed').should('be.visible')
  })
})
