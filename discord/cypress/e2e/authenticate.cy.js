/// <reference types="cypress" />

describe('no auth', () => {
  it('displays login link', () => {
    cy.visit('http://localhost:53134');
    cy.get('#login')
      // FIXME: html element formatting in index.html
      .should('have.text', '\n      sign in with discord\n    ');
  });
});
