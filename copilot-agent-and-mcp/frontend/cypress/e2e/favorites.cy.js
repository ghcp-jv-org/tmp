// generated-by-copilot: E2E tests for the Clear All Favorites feature
describe('Favorites - Clear All', () => {
  const token = 'test-token';
  const mockFavorites = [
    { id: '1', title: 'Book One', author: 'Author A' },
    { id: '2', title: 'Book Two', author: 'Author B' },
  ];

  beforeEach(() => {
    // generated-by-copilot: Intercept the favorites fetch and return mock data
    cy.intercept('GET', '**/api/v1/favorites', {
      statusCode: 200,
      body: { data: mockFavorites, meta: { total: 2, page: 1, limit: 20 } },
    }).as('getFavorites');

    // generated-by-copilot: Set localStorage before page load so Redux store picks up the token
    cy.visit('/favorites', {
      onBeforeLoad(win) {
        win.localStorage.setItem('token', token);
        win.localStorage.setItem('username', 'user1');
      },
    });
    cy.wait('@getFavorites');
  });

  it('should display the Clear All button when favorites exist', () => {
    cy.get('[data-testid="clear-all-favorites"]').should('be.visible').and('contain', 'Clear All');
  });

  it('should show confirmation dialog when Clear All button is clicked', () => {
    cy.get('[data-testid="confirm-dialog"]').should('not.exist');
    cy.get('[data-testid="clear-all-favorites"]').click();
    cy.get('[data-testid="confirm-dialog"]').should('be.visible');
    cy.get('[data-testid="confirm-clear-btn"]').should('be.visible');
    cy.get('[data-testid="cancel-clear-btn"]').should('be.visible');
  });

  it('should close confirmation dialog without clearing when Cancel is clicked', () => {
    cy.get('[data-testid="clear-all-favorites"]').click();
    cy.get('[data-testid="confirm-dialog"]').should('be.visible');
    cy.get('[data-testid="cancel-clear-btn"]').click();
    cy.get('[data-testid="confirm-dialog"]').should('not.exist');
    // generated-by-copilot: Favorites list should remain intact after cancellation
    cy.contains('Book One').should('be.visible');
    cy.contains('Book Two').should('be.visible');
  });

  it('should clear all favorites when confirmed', () => {
    // generated-by-copilot: Intercept the DELETE call for clear-all
    cy.intercept('DELETE', '**/api/v1/favorites', {
      statusCode: 200,
      body: { message: 'All favorites cleared' },
    }).as('clearFavorites');

    cy.get('[data-testid="clear-all-favorites"]').click();
    cy.get('[data-testid="confirm-clear-btn"]').click();

    cy.wait('@clearFavorites');
    cy.get('[data-testid="confirm-dialog"]').should('not.exist');
    // generated-by-copilot: After clearing, show the empty-state message
    cy.contains('No favorite books yet').should('be.visible');
  });

  it('should not show Clear All button when favorites list is empty', () => {
    cy.intercept('GET', '**/api/v1/favorites', {
      statusCode: 200,
      body: { data: [], meta: { total: 0, page: 1, limit: 20 } },
    }).as('getEmptyFavorites');

    cy.visit('/favorites', {
      onBeforeLoad(win) {
        win.localStorage.setItem('token', token);
        win.localStorage.setItem('username', 'user1');
      },
    });
    cy.wait('@getEmptyFavorites');

    cy.get('[data-testid="clear-all-favorites"]').should('not.exist');
    cy.contains('No favorite books yet').should('be.visible');
  });
});
