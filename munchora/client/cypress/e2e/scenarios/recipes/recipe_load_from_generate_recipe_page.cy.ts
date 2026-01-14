// Scenario: User can open a recipe from recipesPage

// Given the user is on GenerateRecipePage
// And the user is logged in
// When the user click on first recipe card
// Then the recipe page should display

describe('Load recipe from recipes', () => {
  beforeEach(() => {
    cy.loginOrSignUpByApi();
  });

  // it('should create pancake recipe from recipeGenerator', () => {
  //   cy.loadPage('recipes');
  //
  //   cy.contains('span', 'AI Create').click();
  //
  //   cy.get('textarea').type(
  //     'Generate a simple, easy-to-make pancake recipe that is fluffy and delicious, including suggested toppings such as fruits, syrup, chocolate, or nuts, with clear step-by-step instructions suitable for beginners.'
  //   );
  //
  //   cy.get('button[cy-data="generate-recipe"]').click();
  //
  //   cy.wait(20_000); // AI generation does take some time
  //
  //   cy.checkPageLoadedCorrectly('recipeUpdate');
  // });
  //
  // it('should display recipe when first recipeCard is clicked', () => {
  //   cy.loadPage('recipes');
  //
  //   cy.get('[data-cy="recipe-card-link"]').first().click();
  //
  //   cy.checkPageLoadedCorrectly('recipe');
  // });
});
