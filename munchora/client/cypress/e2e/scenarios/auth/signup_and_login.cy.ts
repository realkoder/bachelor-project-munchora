describe('Signup and login', () => {
  const email = 'cypress-user2@example.com';
  const password = 'SuperSecret123!';

  it('should signup new user', () => {
    cy.loadPage('signIn');

    cy.contains('Create account').click();

    cy.get('[data-state="active"][data-orientation="horizontal"]').should('contain.text', 'Create account');

    // Now assert that the form is visible
    cy.get('input[name="first_name"]', { timeout: 10000 }).should('be.visible').type('Random');
    cy.get('input[name="last_name"]').type('User');
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('input[name="confirmPassword"]').type(password);

    cy.contains('button', 'Create Account').click();

    cy.checkPageLoadedCorrectly('indexAuth');
  });

  it('should login user when signed up', () => {
    cy.loadPage('signIn');

    cy.contains('Sign in').click();

    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('button[name="signinbtn"]').click();

    cy.checkPageLoadedCorrectly('indexAuth');
  });

  describe('login required', () => {
    before(() => cy.loginOrSignUpByApi());

    it('logs out from the account', () => {
      cy.loadPage('indexAuth');

      cy.get('div[data-cy="user-menu"]:visible')
        .should('exist')
        .find('button[data-slot="dropdown-menu-trigger"]')
        .click();

      cy.contains('div[role="menuitem"]', 'Sign Out').click();

      cy.checkPageLoadedCorrectly('indexNoAuth');
    });
  });
});
