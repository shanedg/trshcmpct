/// <reference types="cypress" />

describe('login', () => {
  it('displays login link if not authenticated', () => {
    const uriEncodedLocalhost = encodeURIComponent('http://localhost:53134/auth');
    const redirectUriMatcher = new RegExp(`redirect_uri=${uriEncodedLocalhost}`);

    cy.visit('/login');
    cy.get('#login')
      .should('have.text', 'sign in with discord')
      .invoke('attr', 'href')
      .should('match', redirectUriMatcher);
  });

  it('redirects to login if not authenticated', () => {
    cy.visit('/');
    cy.url().should('match', /\/login/);
  });
});
