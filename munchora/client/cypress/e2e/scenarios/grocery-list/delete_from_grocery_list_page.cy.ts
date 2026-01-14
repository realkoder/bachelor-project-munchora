import { deleteListIfExist } from '../../../support/test_utils.cy';

describe('Grocery List - Delete', () => {
  beforeEach(() => {
    cy.loginOrSignUpByApi();
    cy.loadPage('groceryLists');
    cy.contains('button', 'Create Your First List').click();
  });

  it('deletes grocery list successfully', () => {
    deleteListIfExist();
    cy.contains('h3', 'No grocery lists yet').should('be.visible');
  });
});
