describe('Grocery List - Empty State', () => {
  beforeEach(() => {
    cy.loginOrSignUpByApi();
    cy.loadPage('groceryLists');
  });

  it('displays empty state message correctly', () => {
    cy.contains('h3', 'No grocery lists yet').should('be.visible');
    cy.checkPageLoadedCorrectly('groceryLists');
  });
});
