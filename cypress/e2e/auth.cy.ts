describe("auth", () => {
  it("signs in successfully", () => {
    cy.signIn(Cypress.env("testEmail"), Cypress.env("testPassword"));

    cy.get('[data-cy="sign-out"]').should("exist");
  });

  it("fails to signs in, incorrect email is provided", () => {
    cy.signIn("******", Cypress.env("testPassword"));

    cy.get('[data-cy="sign-out"]').should("not.exist");
  });

  it("fails to signs in, incorrect password is provided", () => {
    cy.signIn(Cypress.env("testEmail"), "******");

    cy.get('[data-cy="sign-out"]').should("not.exist");
  });

  it("fails to signs in, incorrect credentials are provided", () => {
    cy.signIn("******", "******");

    cy.get('[data-cy="sign-out"]').should("not.exist");
  });
});
