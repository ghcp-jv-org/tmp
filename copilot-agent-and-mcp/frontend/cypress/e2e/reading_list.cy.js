describe('Reading List Feature', () => {
  // generated-by-copilot: Declare credentials at describe scope so login() helper can access them via closure
  let username;
  let password;

  // generated-by-copilot: Register a fresh user before each test to ensure a clean reading-list state
  beforeEach(() => {
    username = `e2euser${Math.floor(Math.random() * 100000)}`;
    password = `e2epass${Math.floor(Math.random() * 100000)}`;

    cy.visit('http://localhost:5173');
    cy.contains('Create Account').click();
    cy.get('input[name="username"]').type(username);
    cy.get('input[name="password"]').type(password);
    cy.get('button#register').click();
    cy.contains('Registration successful! You can now log in.').should('exist');
    // generated-by-copilot: Return to home so the Login button is visible for the test
    cy.visit('http://localhost:5173');
  });

  // generated-by-copilot: Helper function to login with the credentials created in beforeEach
  const login = () => {
    cy.contains('Login').click();
    cy.get('input[name="username"]').type(username);
    cy.get('input[name="password"]').type(password);
    cy.get('button#login').click();
    cy.contains(`Hi, ${username}`).should('exist');
  };

  it('should show reading list navigation after login', () => {
    login();
    cy.get('a#reading-list-link').should('exist').and('contain', 'Reading List');
  });

  it('should navigate to reading list page', () => {
    login();
    cy.get('a#reading-list-link').click();
    cy.contains('h2', 'My Reading List').should('exist');
    cy.url().should('include', '/reading-list');
  });

  it('should show empty reading list initially', () => {
    login();
    cy.get('a#reading-list-link').click();
    cy.contains('No books in this category yet').should('exist');
  });

  it('should add book to reading list from books page', () => {
    login();
    
    // generated-by-copilot: Go to books page
    cy.get('a#books-link').click();
    cy.contains('h2', 'Books').should('exist');
    
    // generated-by-copilot: Add first book to reading list as "want to read"
    cy.get('button').contains('Add to Reading List').first().click();
    cy.contains('button', 'Want to Read').click();
    
    // generated-by-copilot: Verify book shows as added
    cy.get('button').contains('In Reading List').should('exist');
    
    // generated-by-copilot: Check reading list page
    cy.get('a#reading-list-link').click();
    cy.get('button').contains('Want to Read (1)').should('exist');
  });

  it('should show books in different status tabs', () => {
    login();
    
    // generated-by-copilot: Add books with different statuses
    cy.get('a#books-link').click();
    
    // generated-by-copilot: Add first book as "want to read"
    cy.get('button').contains('Add to Reading List').first().click();
    cy.contains('button', 'Want to Read').click();
    
    // generated-by-copilot: Add second book as "currently reading" - use .first() since the previous book button changed
    cy.get('button').contains('Add to Reading List').first().click();
    cy.contains('button', 'Currently Reading').click();
    
    // generated-by-copilot: Add third book as "finished" - use .first() since previous buttons changed
    cy.get('button').contains('Add to Reading List').first().click();
    cy.contains('button', 'Finished').click();
    
    // generated-by-copilot: Check reading list page tabs
    cy.get('a#reading-list-link').click();
    
    // generated-by-copilot: Check tab counts
    cy.contains('Want to Read (1)').should('exist');
    cy.contains('Currently Reading (1)').should('exist');
    cy.contains('Finished (1)').should('exist');
    
    // generated-by-copilot: Test tab switching
    cy.contains('Want to Read (1)').click();
    cy.get('[data-testid="book-card"]').should('have.length', 1);
    
    cy.contains('Currently Reading (1)').click();
    cy.get('[data-testid="book-card"]').should('have.length', 1);
    
    cy.contains('Finished (1)').click();
    cy.get('[data-testid="book-card"]').should('have.length', 1);
  });

  it('should change book status within reading list', () => {
    login();
    
    // generated-by-copilot: Add a book as "want to read"
    cy.get('a#books-link').click();
    cy.get('button').contains('Add to Reading List').first().click();
    cy.contains('button', 'Want to Read').click();
    
    // generated-by-copilot: Go to reading list
    cy.get('a#reading-list-link').click();
    cy.contains('Want to Read (1)').click();
    
    // generated-by-copilot: Change status to "currently reading"
    cy.get('button').contains('Start Reading').click();
    
    // generated-by-copilot: Verify tab counts changed
    cy.contains('Want to Read (0)').should('exist');
    cy.contains('Currently Reading (1)').should('exist');
    
    // generated-by-copilot: Switch to currently reading tab
    cy.contains('Currently Reading (1)').click();
    cy.get('button').contains('Mark as Finished').should('exist');
    
    // generated-by-copilot: Mark as finished
    cy.get('button').contains('Mark as Finished').click();
    
    // generated-by-copilot: Verify final state
    cy.contains('Currently Reading (0)').should('exist');
    cy.contains('Finished (1)').should('exist');
  });

  it('should remove book from reading list', () => {
    login();
    
    // generated-by-copilot: Add a book to reading list
    cy.get('a#books-link').click();
    cy.get('button').contains('Add to Reading List').first().click();
    cy.contains('button', 'Want to Read').click();
    
    // generated-by-copilot: Go to reading list and remove book
    cy.get('a#reading-list-link').click();
    cy.contains('Want to Read (1)').click();
    cy.get('button').contains('Remove from List').click();
    
    // generated-by-copilot: Verify book is removed
    cy.contains('Want to Read (0)').should('exist');
    cy.contains('No books in this category yet').should('exist');
    
    // generated-by-copilot: Verify books page shows "Add to Reading List" again
    cy.get('a#books-link').click();
    cy.get('button').contains('Add to Reading List').should('exist');
    cy.get('button').contains('In Reading List').should('not.exist');
  });

  it('should show reading status badges on books page', () => {
    login();
    
    // generated-by-copilot: Add books with different statuses
    cy.get('a#books-link').click();
    
    // generated-by-copilot: Add first book as "currently reading"
    cy.get('button').contains('Add to Reading List').first().click();
    cy.contains('button', 'Currently Reading').click();
    
    // generated-by-copilot: Verify status badge appears
    cy.contains('Reading').should('exist');
    
    // generated-by-copilot: Add second book as "finished" - use .first() since previous button changed
    cy.get('button').contains('Add to Reading List').first().click();
    cy.contains('button', 'Finished').click();
    
    // generated-by-copilot: Verify finished badge appears
    cy.contains('Finished').should('exist');
  });

  it('should prevent duplicate additions to reading list', () => {
    login();
    
    // generated-by-copilot: Add a book to reading list
    cy.get('a#books-link').click();
    cy.get('button').contains('Add to Reading List').first().click();
    cy.contains('button', 'Want to Read').click();
    
    // generated-by-copilot: Verify button changes to "In Reading List"
    cy.get('button').contains('In Reading List').should('exist');
    cy.get('button').contains('In Reading List').should('be.disabled');
    
    // generated-by-copilot: Verify no dropdown is available for the book that was just added
    cy.get('[data-testid="book-card"]').first().within(() => {
      cy.get('button').contains('Add to Reading List').should('not.exist');
    });
  });

  it('should work with favorites integration', () => {
    login();
    
    cy.get('a#books-link').click();
    
    // generated-by-copilot: Add same book to both favorites and reading list
    cy.get('button').contains('Add to Favorites').first().click();
    cy.get('button').contains('Add to Reading List').first().click();
    cy.contains('button', 'Want to Read').click();
    
    // generated-by-copilot: Verify both features work
    cy.get('button').contains('In Favorites').should('exist');
    cy.get('button').contains('In Reading List').should('exist');
    
    // generated-by-copilot: Check both pages have the book
    cy.get('a#favorites-link').click();
    cy.get('ul li').should('have.length.at.least', 1);
    
    cy.get('a#reading-list-link').click();
    cy.contains('Want to Read (1)').click();
    cy.get('[data-testid="book-card"]').should('have.length', 1);
  });

  it('should protect reading list route when not logged in', () => {
    cy.visit('http://localhost:5173/reading-list');
    cy.url().should('eq', 'http://localhost:5173/');
    cy.contains('Login').should('exist');
  });

  it('should show date information in reading list', () => {
    login();
    
    // generated-by-copilot: Add and finish a book
    cy.get('a#books-link').click();
    cy.get('button').contains('Add to Reading List').first().click();
    cy.contains('button', 'Finished').click();
    
    // generated-by-copilot: Check reading list shows dates
    cy.get('a#reading-list-link').click();
    cy.contains('Finished (1)').click();
    
    // generated-by-copilot: Should show both added and finished dates
    cy.contains('Added:').should('exist');
    cy.contains('Finished:').should('exist');
  });
});
