import { deleteListIfExist } from '../../../support/test_utils.cy';

describe('Shopping List - Create', () => {
  beforeEach(() => {
    cy.loginOrSignUpByApi();
    cy.loadPage('shoppingLists');
  });

  afterEach(() => {
    deleteListIfExist();
  });

  it('shows no lists on first load', () => {
    cy.contains('h3', 'No shopping lists yet').should('be.visible');
  });

  it('creates default shopping list', () => {
    cy.contains('button', 'Create Your First List').click();
    cy.get('input[placeholder="Name Of Shopping List"]').should('have.value', 'Shopping 🛒');
  });

  it('creates custom-named shopping list', () => {
    const listName = 'Test List 🍹';
    cy.get('input[placeholder="New list name"]').type(listName);
    cy.contains('button', 'Create List').click();
    cy.get('input[placeholder="Name Of Shopping List"]').should('have.value', listName);
  });
});
