describe("auth", () => {
  it("signs in successfully", () => {
    cy.visit(Cypress.env("baseUrl") as string);
    cy.get('[data-cy="sign-in"]').click();

    cy.get("input[name=email]").type(Cypress.env("testEmail") as string);
    cy.get("input[name=password]").type(Cypress.env("testPassword") as string);
    cy.get('[data-cy="sign-in"]').click();

    cy.get('[data-cy="sign-out"]').click();
  });

  // it("fails to signs in if incorrect credentials are provided", () => {
  //   cy.visit("https://example.cypress.io");
  // });
});
