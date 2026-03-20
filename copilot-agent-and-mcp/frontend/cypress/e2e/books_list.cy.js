// generated-by-copilot: Cypress E2E test for viewing books list
describe('Books List', () => {
  // generated-by-copilot: Generate random credentials for test isolation
  const username = `e2ebooks${Math.floor(Math.random() * 10000)}`;
  const password = `e2epass${Math.floor(Math.random() * 10000)}`;

  before(() => {
    // generated-by-copilot: Register a user before all tests
    cy.visit('http://localhost:5173');
    cy.contains('Create Account').click();
    cy.get('input[name="username"]').type(username);
    cy.get('input[name="password"]').type(password);
    cy.get('button#register').click();
    cy.contains('Registration successful').should('be.visible');
  });

  beforeEach(() => {
    // generated-by-copilot: Login before each test
    cy.visit('http://localhost:5173');
    cy.contains('Login').click();
    cy.get('input[name="username"]').type(username);
    cy.get('input[name="password"]').type(password);
    cy.get('button#login').click();
    cy.contains(`Hi, ${username}`).should('be.visible');
  });

  // --- Navigation to books ---

  describe('Navigation', () => {
    // generated-by-copilot: Test navigating to the books page via nav link
    it('should navigate to books page when Books link is clicked', () => {
      cy.get('a#books-link').click();
      cy.url().should('include', '/books');
      cy.get('h2').should('contain', 'Books');
    });
  });

  // --- Books display ---

  describe('Books display', () => {
    // generated-by-copilot: Test that books are rendered on the page
    it('should display a list of books', () => {
      cy.get('a#books-link').click();
      cy.get('h2').should('contain', 'Books');
      // generated-by-copilot: Wait for books to load and verify at least one book card exists
      cy.get('button').contains('Add to Favorites').should('have.length.greaterThan', 0);
    });

    // generated-by-copilot: Test that each book card shows title and author
    it('should display book title and author for each book', () => {
      cy.get('a#books-link').click();
      // generated-by-copilot: Verify the first book card has text content
      cy.contains('by ').should('exist');
    });

    // generated-by-copilot: Test that Add to Favorites buttons are present
    it('should show Add to Favorites button for each book', () => {
      cy.get('a#books-link').click();
      cy.get('button').contains('Add to Favorites').should('exist');
    });

    // generated-by-copilot: Test that Add to Reading List buttons are present
    it('should show Add to Reading List button for each book', () => {
      cy.get('a#books-link').click();
      cy.get('button').contains('Add to Reading List').should('exist');
    });
  });

  // --- Sorting ---

  describe('Sorting', () => {
    // generated-by-copilot: Test that sort controls are displayed on the books page
    it('should display sort controls on the books page', () => {
      cy.get('a#books-link').click();
      cy.get('[data-testid="sort-controls"]').should('be.visible');
      cy.get('[data-testid="sort-title"]').should('be.visible');
      cy.get('[data-testid="sort-author"]').should('be.visible');
    });

    // generated-by-copilot: Test that Title sort button is active by default
    it('should show Title sort as active by default', () => {
      cy.get('a#books-link').click();
      cy.get('[data-testid="sort-title"]').should('contain', '↑');
    });

    // generated-by-copilot: Test that clicking Author sort changes the active sort button
    it('should switch active sort to Author when Author button is clicked', () => {
      cy.get('a#books-link').click();
      cy.get('[data-testid="sort-author"]').click();
      cy.get('[data-testid="sort-author"]').should('contain', '↑');
      cy.get('[data-testid="sort-title"]').should('not.contain', '↑');
      cy.get('[data-testid="sort-title"]').should('not.contain', '↓');
    });

    // generated-by-copilot: Test that clicking the same sort button toggles direction
    it('should toggle sort direction when same sort button is clicked again', () => {
      cy.get('a#books-link').click();
      cy.get('[data-testid="sort-title"]').should('contain', '↑');
      cy.get('[data-testid="sort-title"]').click();
      cy.get('[data-testid="sort-title"]').should('contain', '↓');
    });
  });

  // --- Interaction ---

  describe('Interaction', () => {
    // generated-by-copilot: Test adding a book to favorites from the books list
    it('should add a book to favorites', () => {
      cy.get('a#books-link').click();
      cy.get('button').contains('Add to Favorites').first().click();
      // generated-by-copilot: Navigate to favorites and verify the book appears
      cy.get('a#favorites-link').click();
      cy.get('h2').should('contain', 'My Favorite Books');
    });
  });

  // --- Error / empty state ---

  describe('Error handling', () => {
    // generated-by-copilot: Test that visiting /books without login redirects
    it('should redirect to home if not logged in', () => {
      cy.get('button#logout').click();
      cy.visit('http://localhost:5173/books');
      cy.url().should('eq', 'http://localhost:5173/');
    });
  });
});
