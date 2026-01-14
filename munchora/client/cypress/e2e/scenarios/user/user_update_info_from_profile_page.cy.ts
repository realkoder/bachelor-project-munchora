describe('User Update Info From Profile', () => {
  before(() => {
    cy.loginOrSignUpByApi();
  });

  it('should allow to update first_name and last_name info', () => {
    cy.loadPage('profile');

    cy.get('#first_name').clear().type('John');
    cy.get('#last_name').clear().type('Doe');
    cy.contains('button', 'Save Changes').click();

    cy.reload();

    cy.checkPageLoadedCorrectly('profile');

    cy.get('input#first_name').should('have.value', 'John');
    cy.get('input#last_name').should('have.value', 'Doe');
  });
});
