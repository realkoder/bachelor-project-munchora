describe("Smoke test", () => {

    it("loads the home page", () => {
        cy.visit("/");

        cy.contains("Sign In").should("exist");

        cy.contains("Sign In").click();
    });
});