describe('Shopping List - Empty State', () => {
  beforeEach(() => {
    cy.loginOrSignUpByApi();
    cy.loadPage('shoppingLists');
  });

  it('displays empty state message correctly', () => {
    cy.contains('h3', 'No shopping lists yet').should('be.visible');
    cy.checkPageLoadedCorrectly('shoppingLists');
  });
});
