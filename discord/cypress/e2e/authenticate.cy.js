/// <reference types="cypress" />

describe('no auth', () => {
  it('displays login link', () => {
    cy.visit('/');
    cy.get('#login')
      .should('have.text', 'sign in with discord');
  });
});
