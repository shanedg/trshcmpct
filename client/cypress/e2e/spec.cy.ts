describe('client', () => {
  it('renders', () => {
    cy.visit('/');
    cy.get('#root h1')
      .should('have.text', 'trshcmpctr');
  });
});
