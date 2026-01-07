/// <reference types="cypress" />

describe('Home Page', () => {
  it('successfully loads', () => {
    cy.visit('/')
    // Verificar que el contenedor root existe
    cy.get('#root').should('exist')
  })
})
