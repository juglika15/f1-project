describe("auth", () => {
  it("signs in successfully", () => {
    cy.visit("http://localhost:3000/en");
    cy.get('[data-cy="sign-in"]').click();
    // cy.get('[data-cy="sign-in2"]').click();

    // cy.get("input[name=email]").type("lashajugeli96@gmail.com");
    // cy.get("input[name=password]").type("123456");
    // cy.get('[data-cy="sign-in"]').click();
  });

  // it("fails to signs in if incorrect credentials are provided", () => {
  //   cy.visit("https://example.cypress.io");
  // });
});
