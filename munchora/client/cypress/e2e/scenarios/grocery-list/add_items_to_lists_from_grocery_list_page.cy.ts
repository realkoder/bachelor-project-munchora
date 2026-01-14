import { deleteListIfExist } from '../../../support/test_utils.cy';

describe('Grocery List - Add Items', () => {
  beforeEach(() => {
    cy.loginOrSignUpByApi();
    cy.loadPage('groceryLists');
    cy.contains('button', 'Create Your First List').click();
  });

  afterEach(() => {
    deleteListIfExist();
  });

  it('adds and deletes a single item', () => {
    addItem('Chicken', 'Meat');
    deleteItem('Chicken');
    cy.get('div[cy-data="list-item"]').should('not.exist');
  });

  it('adds multiple categorized items', () => {
    const items = [
      { name: 'Banana', category: 'Fruit' },
      { name: 'Carrot', category: 'Vegetable' },
      { name: 'Milk', category: 'Dairy' },
    ];
    items.forEach(({ name, category }) => addItem(name, category));
    cy.get('div[cy-data="list-item"]').should('have.length', items.length);
  });

  function addItem(name: string, category: string) {
    cy.get('input[placeholder="Add item..."]').clear().type(name);
    cy.get('button[role="combobox"]').click();
    cy.contains('[role="option"]', category).click();
    cy.get('button[cy-data="add-item"]').click();
  }

  function deleteItem(name: string) {
    cy.contains('div[cy-data="list-item"]', name).find('button[cy-data="delete-item-btn"]').click();
    cy.get('button[cy-data="confirm-delete-item-btn"]').click();
  }
});
