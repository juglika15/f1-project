describe("auth", () => {
  // sign in
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

  // sign up
  it("signs up successfully", () => {
    cy.visit("/");
    cy.get('[data-cy="sign-in"]').click();
    cy.get('[data-cy="sign-up"]').click();
    cy.get('[data-cy="sign-up-name"]').type("test name");
    cy.get('[data-cy="sign-up-email"]').type(Cypress.env("testEmail_signup"));
    cy.get('[data-cy="sign-up-password"]').type(
      Cypress.env("testPassword_signup")
    );
    cy.get('[data-cy="sign-up-password-confirm"]').type(
      Cypress.env("testPassword_signup")
    );
    cy.get('[data-cy="sign-up-button"]').click();
    cy.get('[data-cy="sign-out"]').should("exist");

    // delete created account
    cy.get('[data-cy="profile"]').click();
    cy.url().should("include", "/profile");
    cy.get('[data-cy="delete-account-button"]').click();
    cy.get('[data-cy="delete-confirm-button"]').click();
  });

  it("failed to signs up with existing email", () => {
    cy.visit("/");
    cy.get('[data-cy="sign-in"]').click();
    cy.get('[data-cy="sign-up"]').click();
    cy.get('[data-cy="sign-up-name"]').type("test name");
    cy.get('[data-cy="sign-up-email"]').type(Cypress.env("testEmail"));
    cy.get('[data-cy="sign-up-password"]').type(
      Cypress.env("testPassword_signup")
    );
    cy.get('[data-cy="sign-up-password-confirm"]').type(
      Cypress.env("testPassword_signup")
    );
    cy.get('[data-cy="sign-up-button"]').click();
    cy.get('[data-cy="sign-out"]').should("not.exist");
  });

  it("failed to signs up with mismatched passwords", () => {
    cy.visit("/");
    cy.get('[data-cy="sign-in"]').click();
    cy.get('[data-cy="sign-up"]').click();
    cy.get('[data-cy="sign-up-name"]').type("test name");
    cy.get('[data-cy="sign-up-email"]').type(Cypress.env("testEmail_signup"));
    cy.get('[data-cy="sign-up-password"]').type(
      Cypress.env("testPassword_signup")
    );
    cy.get('[data-cy="sign-up-password-confirm"]').type("******");
    cy.get('[data-cy="sign-up-button"]').click();
    cy.get('[data-cy="sign-out"]').should("not.exist");
  });

  it("failed to signs up without providing nececery credentials", () => {
    cy.visit("/");
    cy.get('[data-cy="sign-in"]').click();
    cy.get('[data-cy="sign-up"]').click();
    cy.get('[data-cy="sign-up-name"]').type("test name");
    cy.get('[data-cy="sign-up-email"]').type("******");
    cy.get('[data-cy="sign-up-password"]').type("11");
    cy.get('[data-cy="sign-up-password-confirm"]').type("11");
    cy.get('[data-cy="sign-up-button"]').click();
    cy.get('[data-cy="sign-out"]').should("not.exist");
  });

  // sign out
  it("signs out successfully", () => {
    cy.signIn(Cypress.env("testEmail"), Cypress.env("testPassword"));
    cy.get('[data-cy="sign-out"]').click();
    cy.get('[data-cy="sign-in-button"]').should("not.exist");
  });
});
