describe('Reading List Feature', () => {
  // generated-by-copilot: Generate random user credentials for isolation
  const username = `e2euser${Math.floor(Math.random() * 1000)}`;
  const password = `e2epass${Math.floor(Math.random() * 1000)}`;
  const user = { username, password };

  beforeEach(() => {
    cy.visit('http://localhost:5173');
  });

  // generated-by-copilot: Helper function to register and login
  const registerAndLogin = () => {
    cy.contains('Create Account').click();
    cy.get('input[name="username"]').type(user.username);
    cy.get('input[name="password"]').type(user.password);
    cy.get('button#register').click();
    cy.contains('Registration successful! You can now log in.').should('exist');
    cy.wait(2000);
    cy.get('input[name="username"]').type(user.username);
    cy.get('input[name="password"]').type(user.password);
    cy.get('button#login').click();
    cy.contains(`Hi, ${user.username}`).should('exist');
  };

  // generated-by-copilot: Helper function to login existing user
  const login = () => {
    cy.contains('Login').click();
    cy.get('input[name="username"]').type(user.username);
    cy.get('input[name="password"]').type(user.password);
    cy.get('button#login').click();
    cy.contains(`Hi, ${user.username}`).should('exist');
  };

  it('should show reading list navigation after login', () => {
    registerAndLogin();
    cy.get('a#reading-list-link').should('exist').and('contain', 'Reading List');
  });

  it('should navigate to reading list page', () => {
    registerAndLogin();
    cy.get('a#reading-list-link').click();
    cy.contains('h2', 'My Reading List').should('exist');
    cy.url().should('include', '/reading-list');
  });

  it('should show empty reading list initially', () => {
    registerAndLogin();
    cy.get('a#reading-list-link').click();
    cy.contains('No books in this category yet').should('exist');
  });

  it('should add book to reading list from books page', () => {
    registerAndLogin();
    
    // generated-by-copilot: Go to books page
    cy.get('a#books-link').click();
    cy.contains('h2', 'Books').should('exist');
    
    // generated-by-copilot: Add first book to reading list as "want to read"
    cy.get('button').contains('Add to Reading List').first().click();
    cy.contains('Want to Read').click();
    
    // generated-by-copilot: Verify book shows as added
    cy.get('button').contains('In Reading List').should('exist');
    
    // generated-by-copilot: Check reading list page
    cy.get('a#reading-list-link').click();
    cy.get('button').contains('Want to Read (1)').should('exist');
  });

  it('should show books in different status tabs', () => {
    registerAndLogin();
    
    // generated-by-copilot: Add books with different statuses
    cy.get('a#books-link').click();
    
    // generated-by-copilot: Add first book as "want to read"
    cy.get('button').contains('Add to Reading List').first().click();
    cy.contains('Want to Read').click();
    
    // generated-by-copilot: Add second book as "currently reading"
    cy.get('button').contains('Add to Reading List').eq(1).click();
    cy.contains('Currently Reading').click();
    
    // generated-by-copilot: Add third book as "finished"
    cy.get('button').contains('Add to Reading List').eq(2).click();
    cy.contains('Finished').click();
    
    // generated-by-copilot: Check reading list page tabs
    cy.get('a#reading-list-link').click();
    
    // generated-by-copilot: Check tab counts
    cy.contains('Want to Read (1)').should('exist');
    cy.contains('Currently Reading (1)').should('exist');
    cy.contains('Finished (1)').should('exist');
    
    // generated-by-copilot: Test tab switching
    cy.contains('Want to Read (1)').click();
    cy.get('.bookCard').should('have.length', 1);
    
    cy.contains('Currently Reading (1)').click();
    cy.get('.bookCard').should('have.length', 1);
    
    cy.contains('Finished (1)').click();
    cy.get('.bookCard').should('have.length', 1);
  });

  it('should change book status within reading list', () => {
    registerAndLogin();
    
    // generated-by-copilot: Add a book as "want to read"
    cy.get('a#books-link').click();
    cy.get('button').contains('Add to Reading List').first().click();
    cy.contains('Want to Read').click();
    
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
    registerAndLogin();
    
    // generated-by-copilot: Add a book to reading list
    cy.get('a#books-link').click();
    cy.get('button').contains('Add to Reading List').first().click();
    cy.contains('Want to Read').click();
    
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
    registerAndLogin();
    
    // generated-by-copilot: Add books with different statuses
    cy.get('a#books-link').click();
    
    // generated-by-copilot: Add first book as "currently reading"
    cy.get('button').contains('Add to Reading List').first().click();
    cy.contains('Currently Reading').click();
    
    // generated-by-copilot: Verify status badge appears
    cy.contains('Reading').should('exist');
    
    // generated-by-copilot: Add second book as "finished"
    cy.get('button').contains('Add to Reading List').eq(1).click();
    cy.contains('Finished').click();
    
    // generated-by-copilot: Verify finished badge appears
    cy.contains('Finished').should('exist');
  });

  it('should prevent duplicate additions to reading list', () => {
    registerAndLogin();
    
    // generated-by-copilot: Add a book to reading list
    cy.get('a#books-link').click();
    cy.get('button').contains('Add to Reading List').first().click();
    cy.contains('Want to Read').click();
    
    // generated-by-copilot: Verify button changes to "In Reading List"
    cy.get('button').contains('In Reading List').should('exist');
    cy.get('button').contains('In Reading List').should('be.disabled');
    
    // generated-by-copilot: Verify no dropdown is available
    cy.get('button').contains('Add to Reading List').should('not.exist');
  });

  it('should work with favorites integration', () => {
    registerAndLogin();
    
    cy.get('a#books-link').click();
    
    // generated-by-copilot: Add same book to both favorites and reading list
    cy.get('button').contains('Add to Favorites').first().click();
    cy.get('button').contains('Add to Reading List').first().click();
    cy.contains('Want to Read').click();
    
    // generated-by-copilot: Verify both features work
    cy.get('button').contains('In Favorites').should('exist');
    cy.get('button').contains('In Reading List').should('exist');
    
    // generated-by-copilot: Check both pages have the book
    cy.get('a#favorites-link').click();
    cy.get('.bookCard').should('have.length.at.least', 1);
    
    cy.get('a#reading-list-link').click();
    cy.contains('Want to Read (1)').click();
    cy.get('.bookCard').should('have.length', 1);
  });

  it('should protect reading list route when not logged in', () => {
    cy.visit('http://localhost:5173/reading-list');
    cy.url().should('eq', 'http://localhost:5173/');
    cy.contains('Login').should('exist');
  });

  it('should show date information in reading list', () => {
    registerAndLogin();
    
    // generated-by-copilot: Add and finish a book
    cy.get('a#books-link').click();
    cy.get('button').contains('Add to Reading List').first().click();
    cy.contains('Finished').click();
    
    // generated-by-copilot: Check reading list shows dates
    cy.get('a#reading-list-link').click();
    cy.contains('Finished (1)').click();
    
    // generated-by-copilot: Should show both added and finished dates
    cy.contains('Added:').should('exist');
    cy.contains('Finished:').should('exist');
  });
});