describe('Book Favorites App', () => {
  // generate a random username and password for the e2e tests
  const username = `e2euser${Math.floor(Math.random() * 1000)}`;
  const password = `e2epass${Math.floor(Math.random() * 1000)}`;
  const user = { username, password };

  beforeEach(() => {
    cy.visit('http://localhost:5173');
  });

  it('should allow a new user to register and login', () => {
    cy.contains('Create Account').click();
    cy.get('input[name="username"]').type(user.username);
    cy.get('input[name="password"]').type(user.password);
    cy.get('button#register').click();
    cy.contains('Registration successful! You can now log in.').should('exist');
    // wait for a bit to ensure the success message is visible
    cy.wait(2000);
    cy.get('input[name="username"]').type(user.username);
    cy.get('input[name="password"]').type(user.password);
    cy.get('button#login').click();
    cy.contains(`Hi, ${user.username}`).should('exist');
    cy.contains('Favorites').should('exist');
  });

  it('should show books and allow adding to favorites', () => {
    // Login first
    cy.contains('Login').click();
    cy.get('input[name="username"]').type(user.username);
    cy.get('input[name="password"]').type(user.password);
    cy.get('button#login').click();
    cy.contains('Books').click();
    cy.contains('h2', 'Books').should('exist');
    cy.get('button').contains('Add to Favorites').first().click();
    cy.get('a#favorites-link').click();
    cy.get('h2').contains('My Favorite Books').should('exist');
  });

  it('should allow clearing all favorites with confirmation', () => {
    // Login first
    cy.contains('Login').click();
    cy.get('input[name="username"]').type(user.username);
    cy.get('input[name="password"]').type(user.password);
    cy.get('button#login').click();
    // Add a book to favorites
    cy.contains('Books').click();
    cy.contains('h2', 'Books').should('exist');
    cy.get('button').contains('Add to Favorites').first().click();
    // Navigate to favorites
    cy.get('a#favorites-link').click();
    cy.get('h2').contains('My Favorite Books').should('exist');
    // Click Clear All Favorites button
    cy.get('[data-testid="clear-all-favorites-btn"]').should('exist').click();
    // Confirmation dialog should appear
    cy.get('[data-testid="confirm-dialog"]').should('be.visible');
    // Click confirm to clear
    cy.get('[data-testid="confirm-clear-btn"]').click();
    // Favorites list should be empty
    cy.contains('No favorite books yet.').should('exist');
  });

  it('should cancel clearing favorites when cancel is clicked', () => {
    // Login first
    cy.contains('Login').click();
    cy.get('input[name="username"]').type(user.username);
    cy.get('input[name="password"]').type(user.password);
    cy.get('button#login').click();
    // Add a book to favorites
    cy.contains('Books').click();
    cy.get('button').contains('Add to Favorites').first().click();
    // Navigate to favorites
    cy.get('a#favorites-link').click();
    cy.get('h2').contains('My Favorite Books').should('exist');
    // Click Clear All Favorites button
    cy.get('[data-testid="clear-all-favorites-btn"]').should('exist').click();
    // Confirmation dialog should appear
    cy.get('[data-testid="confirm-dialog"]').should('be.visible');
    // Click cancel - favorites should remain
    cy.get('[data-testid="cancel-clear-btn"]').click();
    cy.get('[data-testid="confirm-dialog"]').should('not.exist');
    cy.get('[data-testid="clear-all-favorites-btn"]').should('exist');
  });
});
