const express = require('express');
const { createErrorResponse } = require('../utils/apiUtils');

// generated-by-copilot: Staff picks curated from the book-database MCP server
const STAFF_PICKS = [
  {
    title: '1984',
    author: 'George Orwell',
    isbn: '0451524935',
    publicationDate: '1949-06-08',
    summary: 'A dystopian social science fiction that follows Winston Smith as he rebels against the totalitarian regime of Oceania. The novel explores themes of surveillance, censorship, and the manipulation of truth.'
  },
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    isbn: '0743273565',
    publicationDate: '1925-04-10',
    summary: 'Set in the Jazz Age on Long Island, the novel depicts narrator Nick Carraway\'s interactions with mysterious millionaire Jay Gatsby and Gatsby\'s obsession to reunite with his former lover, Daisy Buchanan.'
  },
  {
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    isbn: '0141439518',
    publicationDate: '1813-01-28',
    summary: 'A romantic novel following Elizabeth Bennet as she deals with issues of manners, upbringing, morality, education, and marriage in the society of the landed gentry of early 19th-century England.'
  },
  {
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    isbn: '0547928227',
    publicationDate: '1937-09-21',
    summary: 'The adventures of home-loving hobbit Bilbo Baggins, who is convinced by the wizard Gandalf to join a group of dwarves in their quest to reclaim their mountain home from a dragon.'
  },
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    isbn: '0446310789',
    publicationDate: '1960-07-11',
    summary: 'Set in the American South during the 1930s, this Pulitzer Prize-winning novel follows the story of Scout Finch and her father Atticus as he defends a black man accused of rape, exploring themes of racial injustice, moral growth, and the loss of innocence.'
  }
];

function createStaffPicksRouter() {
  const router = express.Router();

  // generated-by-copilot: GET /staff-picks - Return curated staff pick recommendations
  router.get('/', (req, res) => {
    try {
      const picks = STAFF_PICKS.map(book => ({
        ...book,
        _links: {
          self: { href: '/api/v1/staff-picks' }
        }
      }));

      res.json({
        success: true,
        data: picks,
        total: picks.length
      });
    } catch (error) {
      res.status(500).json(
        createErrorResponse('INTERNAL_ERROR', 'Failed to retrieve staff picks')
      );
    }
  });

  return router;
}

module.exports = createStaffPicksRouter;
