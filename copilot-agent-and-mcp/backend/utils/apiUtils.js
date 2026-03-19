// generated-by-copilot: Utility functions for REST API best practices

/**
 * Create standardized error response
 * @param {string} code - Error code
 * @param {string} message - Error message
 * @param {Array} details - Optional error details array
 * @returns {Object} Standard error response object
 */
function createErrorResponse(code, message, details = []) {
  return {
    error: {
      code,
      message,
      details
    }
  };
}

/**
 * Create standardized success response
 * @param {string} message - Success message
 * @returns {Object} Standard success response object
 */
function createSuccessResponse(message) {
  return { message };
}

/**
 * Paginate array data
 * @param {Array} data - Data array to paginate
 * @param {number} page - Current page (1-based)
 * @param {number} limit - Items per page
 * @returns {Object} Paginated result with data, meta, and links
 */
function paginate(data, page = 1, limit = 20) {
  const total = data.length;
  const pages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  const paginatedData = data.slice(offset, offset + limit);
  
  const hasNext = page < pages;
  const hasPrev = page > 1;
  
  const meta = {
    page: parseInt(page),
    limit: parseInt(limit),
    total,
    pages,
    hasNext,
    hasPrev
  };
  
  const _links = {
    self: { href: `?page=${page}&limit=${limit}` },
    first: { href: `?page=1&limit=${limit}` },
    last: { href: `?page=${pages}&limit=${limit}` }
  };
  
  if (hasNext) {
    _links.next = { href: `?page=${page + 1}&limit=${limit}` };
  }
  
  if (hasPrev) {
    _links.prev = { href: `?page=${page - 1}&limit=${limit}` };
  }
  
  return {
    data: paginatedData,
    meta,
    _links
  };
}

/**
 * Filter books by query parameters
 * @param {Array} books - Books array
 * @param {Object} filters - Filter object {author, genre}
 * @returns {Array} Filtered books
 */
function filterBooks(books, filters) {
  let filtered = books;
  
  if (filters.author) {
    filtered = filtered.filter(book => 
      book.author.toLowerCase().includes(filters.author.toLowerCase())
    );
  }
  
  if (filters.genre) {
    filtered = filtered.filter(book => 
      book.genre.toLowerCase().includes(filters.genre.toLowerCase())
    );
  }
  
  return filtered;
}

/**
 * Sort books by field
 * @param {Array} books - Books array
 * @param {string} sortBy - Sort field (title, author, year) with optional - for desc
 * @returns {Array} Sorted books
 */
function sortBooks(books, sortBy = 'title') {
  const [field, direction] = sortBy.startsWith('-') 
    ? [sortBy.slice(1), 'desc'] 
    : [sortBy, 'asc'];
  
  return books.sort((a, b) => {
    let aVal = a[field];
    let bVal = b[field];
    
    // Handle string comparison
    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }
    
    if (direction === 'desc') {
      return bVal > aVal ? 1 : bVal < aVal ? -1 : 0;
    }
    return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
  });
}

/**
 * Validate pagination parameters
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Object} Validated and parsed parameters
 */
function validatePaginationParams(page, limit) {
  const parsedPage = parseInt(page) || 1;
  const parsedLimit = Math.min(parseInt(limit) || 20, 100); // Max 100 items per page
  
  return {
    page: Math.max(parsedPage, 1),
    limit: Math.max(parsedLimit, 1)
  };
}

module.exports = {
  createErrorResponse,
  createSuccessResponse,
  paginate,
  filterBooks,
  sortBooks,
  validatePaginationParams
};