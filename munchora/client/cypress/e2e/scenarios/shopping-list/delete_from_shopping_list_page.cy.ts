import { deleteListIfExist } from '../../../support/test_utils.cy';

describe('Shopping List - Delete', () => {
  beforeEach(() => {
    cy.loginOrSignUpByApi();
    cy.loadPage('shoppingLists');
    cy.contains('button', 'Create Your First List').click();
  });

  it('deletes shopping list successfully', () => {
    deleteListIfExist();
    cy.contains('h3', 'No shopping lists yet').should('be.visible');
  });
});
