/// <reference types="cypress" />

describe('no auth', () => {
  it('displays login link', () => {
    cy.visit('http://localhost:53134');
    cy.get('#login')
      .should('have.text', 'sign in with discord');
  });
});
