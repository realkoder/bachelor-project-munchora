export function deleteListIfExist() {
  cy.document().then((doc) => {
    const deleteBtns = doc.querySelectorAll('button[cy-data="delete-list-btn"]');

    if (deleteBtns.length) {
      const btn = deleteBtns[0];
      cy.wrap(btn).click({force: true});

      cy.get('[role="dialog"]').should('be.visible').within(() => {
        cy.contains('button', 'Delete').click({force: true});
      });

      cy.wait(500);
      cy.reload(); // This is not pretty but faced a lot of issues - now it works xD
      if (doc.querySelectorAll('button[cy-data="delete-list-btn"]').length > 0) deleteListIfExist();
    }
  });
}