declare type PageName = 'indexNoAuth' | 'indexAuth' | 'recipe' | 'recipes' | 'recipeUpdate' | 'groceryLists' | 'profile' | 'signIn';

declare namespace Cypress {
  interface Chainable {
    // signUpByApi(first_name: string, last_name: string, email: string, password: string): Chainable<void>;

    loginOrSignUpByApi(): Chainable<void>;

    // loginByApi(): Chainable<void>;

    loadPage(pageName: PageName): Chainable<void>;

    checkPageLoadedCorrectly(pageName: PageName): Chainable<void>;
  }
}
