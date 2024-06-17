describe('app', () => {
  it('visits home', () => {
    cy.visit('/');

    cy.get('#root h1').should('have.text', 'trshcmpctr');
    cy.get('#root p').should('have.text',
      'welcome to the trash compactor, <mocked_user_name>');
  });

  it('navigates to new', () => {
    cy.visit('/');
    cy.get('a[href="/new"]').click();

    cy.get('h2').should('have.text', 'new');
    cy.get('form').within(() => {
      cy.get('select').should('have.text', '1.20.1');
    });
  });

  it('navigates to worlds', () => {
    cy.visit('/');
    cy.get('a[href="/worlds"]').click();

    cy.get('h2').should('have.text', 'worlds');
    cy.get('thead > tr > td:first-child').should('have.text', 'name');
  });

  it('navigates to a world', () => {
    cy.visit('/');
    cy.get('a[href="/worlds"]').click();
    cy.get('a[href="/worlds/1"]').click();

    cy.get('h3').should('have.text', '1');
  });
});
