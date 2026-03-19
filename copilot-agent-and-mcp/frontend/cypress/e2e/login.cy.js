// generated-by-copilot: Cypress E2E test for login flow
describe('Login Flow', () => {
  // generated-by-copilot: Generate random credentials for test isolation
  const username = `e2euser${Math.floor(Math.random() * 10000)}`;
  const password = `e2epass${Math.floor(Math.random() * 10000)}`;

  beforeEach(() => {
    cy.visit('http://localhost:5173');
  });

  // --- Registration ---

  describe('Registration', () => {
    // generated-by-copilot: Test that register form is displayed
    it('should display the registration form when Create Account is clicked', () => {
      cy.contains('Create Account').click();
      cy.url().should('include', '/register');
      cy.get('h2').should('contain', 'Register');
      cy.get('input[name="username"]').should('be.visible');
      cy.get('input[name="password"]').should('be.visible');
      cy.get('button#register').should('be.visible');
    });

    // generated-by-copilot: Test successful registration
    it('should register a new user successfully', () => {
      cy.contains('Create Account').click();
      cy.get('input[name="username"]').type(username);
      cy.get('input[name="password"]').type(password);
      cy.get('button#register').click();
      cy.contains('Registration successful! You can now log in.').should('be.visible');
    });

    // generated-by-copilot: Test duplicate registration shows error
    it('should show error when registering duplicate username', () => {
      cy.contains('Create Account').click();
      cy.get('input[name="username"]').type(username);
      cy.get('input[name="password"]').type(password);
      cy.get('button#register').click();
      cy.get('div').filter(':contains("already")').should('exist');
    });
  });

  // --- Login ---

  describe('Login', () => {
    // generated-by-copilot: Test that login form is displayed
    it('should display the login form', () => {
      cy.contains('Login').click();
      cy.url().should('include', '/login');
      cy.get('h2').should('contain', 'Login');
      cy.get('input[name="username"]').should('be.visible');
      cy.get('input[name="password"]').should('be.visible');
      cy.get('button#login').should('be.visible');
    });

    // generated-by-copilot: Test show error on invalid credentials
    it('should show error on invalid credentials', () => {
      cy.contains('Login').click();
      cy.get('input[name="username"]').type('nonexistentuser999');
      cy.get('input[name="password"]').type('wrongpassword');
      cy.get('button#login').click();
      cy.get('div[style*="color: red"]').should('be.visible');
    });

    // generated-by-copilot: Test successful login with valid credentials
    it('should login with valid credentials and show greeting', () => {
      cy.contains('Login').click();
      cy.get('input[name="username"]').type(username);
      cy.get('input[name="password"]').type(password);
      cy.get('button#login').click();
      cy.contains(`Hi, ${username}`).should('be.visible');
    });

    // generated-by-copilot: Test that nav links appear after login
    it('should show navigation links after login', () => {
      cy.contains('Login').click();
      cy.get('input[name="username"]').type(username);
      cy.get('input[name="password"]').type(password);
      cy.get('button#login').click();
      cy.get('a#books-link').should('be.visible');
      cy.get('a#favorites-link').should('be.visible');
      cy.get('button#logout').should('be.visible');
    });
  });

  // --- Logout ---

  describe('Logout', () => {
    // generated-by-copilot: Test successful logout
    it('should logout and return to welcome page', () => {
      cy.contains('Login').click();
      cy.get('input[name="username"]').type(username);
      cy.get('input[name="password"]').type(password);
      cy.get('button#login').click();
      cy.contains(`Hi, ${username}`).should('be.visible');
      cy.get('button#logout').click();
      cy.contains('Welcome to Book Favorites!').should('be.visible');
      cy.get('button#logout').should('not.exist');
    });

    // generated-by-copilot: Test that protected routes redirect after logout
    it('should redirect to home when visiting /books after logout', () => {
      cy.contains('Login').click();
      cy.get('input[name="username"]').type(username);
      cy.get('input[name="password"]').type(password);
      cy.get('button#login').click();
      cy.get('button#logout').click();
      cy.visit('http://localhost:5173/books');
      cy.url().should('eq', 'http://localhost:5173/');
    });
  });

  // --- Edge cases ---

  describe('Edge cases', () => {
    // generated-by-copilot: Test that empty form submission is prevented by required attributes
    it('should not submit login form with empty fields', () => {
      cy.contains('Login').click();
      cy.get('button#login').click();
      // generated-by-copilot: HTML5 required validation prevents submission
      cy.url().should('include', '/login');
    });

    // generated-by-copilot: Test that empty register form is prevented
    it('should not submit register form with empty fields', () => {
      cy.contains('Create Account').click();
      cy.get('button#register').click();
      cy.url().should('include', '/register');
    });
  });
});
