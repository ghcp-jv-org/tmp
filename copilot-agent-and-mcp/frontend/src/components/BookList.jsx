
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchBooks, setSortBy } from '../store/booksSlice';
import { addFavorite, fetchFavorites } from '../store/favoritesSlice';
import { 
  addToReadingList, 
  fetchReadingList, 
  selectReadingListItems
} from '../store/readingListSlice';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/BookList.module.css';

const BookList = () => {
  const dispatch = useAppDispatch();
  const books = useAppSelector(state => state.books.items);
  const status = useAppSelector(state => state.books.status);
  const token = useAppSelector(state => state.user.token);
  const navigate = useNavigate();
  const favorites = useAppSelector(state => state.favorites.items);
  // generated-by-copilot: Select reading list items at component level to avoid hooks inside map
  const readingListItems = useAppSelector(selectReadingListItems);
  // generated-by-copilot: Select sort state from Redux to maintain sort across navigation
  const sortField = useAppSelector(state => state.books.sortField);
  const sortDirection = useAppSelector(state => state.books.sortDirection);

  // generated-by-copilot: State for reading list dropdown
  const [showReadingListDropdown, setShowReadingListDropdown] = useState({});

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }
    dispatch(fetchBooks({ field: sortField, direction: sortDirection }));
    dispatch(fetchFavorites(token));
    dispatch(fetchReadingList(token));
  }, [dispatch, token, navigate, sortField, sortDirection]);

  // generated-by-copilot: Handle sort button click - toggle direction if same field, reset to asc for new field
  const handleSort = (field) => {
    const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    dispatch(setSortBy({ field, direction }));
  };

  const handleAddFavorite = async (bookId) => {
    if (!token) {
      navigate('/');
      return;
    }
    await dispatch(addFavorite({ token, bookId }));
    dispatch(fetchFavorites(token));
  };

  // generated-by-copilot: Handle adding book to reading list
  const handleAddToReadingList = async (bookId, status) => {
    if (!token) {
      navigate('/');
      return;
    }
    await dispatch(addToReadingList({ token, bookId, status }));
    dispatch(fetchReadingList(token));
    setShowReadingListDropdown({ ...showReadingListDropdown, [bookId]: false });
  };

  // generated-by-copilot: Toggle reading list dropdown
  const toggleReadingListDropdown = (bookId) => {
    setShowReadingListDropdown({ 
      ...showReadingListDropdown, 
      [bookId]: !showReadingListDropdown[bookId] 
    });
  };

  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'failed') return <div>Failed to load books.</div>;

  return (
    <div>
      <h2>Books</h2>
      {/* generated-by-copilot: Sort controls with visual indication of active sort */}
      <div className={styles.sortControls} data-testid="sort-controls">
        <span className={styles.sortLabel}>Sort by:</span>
        <button
          data-testid="sort-title"
          className={`${styles.sortBtn}${sortField === 'title' ? ` ${styles.sortBtnActive}` : ''}`}
          onClick={() => handleSort('title')}
        >
          Title {sortField === 'title' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
        </button>
        <button
          data-testid="sort-author"
          className={`${styles.sortBtn}${sortField === 'author' ? ` ${styles.sortBtnActive}` : ''}`}
          onClick={() => handleSort('author')}
        >
          Author {sortField === 'author' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
        </button>
      </div>
      {books.length === 0 ? (
        <div style={{
          background: '#fff',
          padding: '2rem',
          borderRadius: '8px',
          maxWidth: '400px',
          margin: '2rem auto',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          textAlign: 'center',
          color: '#888',
        }}>
          <p>No books available.</p>
          <p>Check back later or add a new book if you have permission.</p>
        </div>
      ) : (
        <div className={styles.bookGrid}>
          {books.map(book => {
            const isFavorite = favorites.some(fav => fav.id === book.id);
            // generated-by-copilot: Derive reading list state from component-level selector
            const isInReadingList = readingListItems.some(item => item.id === book.id);
            const readingListEntry = readingListItems.find(item => item.id === book.id);
            const readingStatus = readingListEntry ? readingListEntry.readingStatus : null;
            
            return (
              <div className={styles.bookCard + ' ' + styles.bookCardWithHeart} key={book.id}>
                {isFavorite && (
                  <span className={styles.favoriteHeart} title="In Favorites">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="#e25555" stroke="#e25555" strokeWidth="1.5">
                      <path d="M12 21s-6.2-5.2-8.4-7.4C1.2 11.2 1.2 8.1 3.1 6.2c1.9-1.9 5-1.9 6.9 0l2 2 2-2c1.9-1.9 5-1.9 6.9 0 1.9 1.9 1.9 5 0 6.9C18.2 15.8 12 21 12 21z"/>
                    </svg>
                  </span>
                )}
                
                {/* generated-by-copilot: Reading status badge */}
                {isInReadingList && (
                  <span style={{
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    background: readingStatus === 'finished' ? '#28a745' : 
                               readingStatus === 'currently-reading' ? '#007bff' : '#6c757d',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '0.7em',
                    fontWeight: 'bold'
                  }}>
                    {readingStatus === 'want-to-read' ? 'Want to Read' : 
                     readingStatus === 'currently-reading' ? 'Reading' : 'Finished'}
                  </span>
                )}
                
                <div className={styles.bookTitle}>{book.title}</div>
                <div className={styles.bookAuthor}>by {book.author}</div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button
                    className={styles.simpleBtn}
                    onClick={() => handleAddFavorite(book.id)}
                  >
                    {isFavorite ? 'In Favorites' : 'Add to Favorites'}
                  </button>
                  
                  {/* generated-by-copilot: Reading list button with dropdown */}
                  <div style={{ position: 'relative' }}>
                    {isInReadingList ? (
                      <button
                        className={styles.simpleBtn}
                        style={{ backgroundColor: '#28a745' }}
                        disabled
                      >
                        In Reading List
                      </button>
                    ) : (
                      <>
                        <button
                          className={styles.simpleBtn}
                          onClick={() => toggleReadingListDropdown(book.id)}
                          style={{ backgroundColor: '#17a2b8' }}
                        >
                          Add to Reading List ▼
                        </button>
                        
                        {showReadingListDropdown[book.id] && (
                          <div style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            background: 'white',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            zIndex: 1000
                          }}>
                            <button
                              onClick={() => handleAddToReadingList(book.id, 'want-to-read')}
                              style={{
                                display: 'block',
                                width: '100%',
                                padding: '8px 12px',
                                border: 'none',
                                background: 'white',
                                textAlign: 'left',
                                cursor: 'pointer'
                              }}
                            >
                              Want to Read
                            </button>
                            <button
                              onClick={() => handleAddToReadingList(book.id, 'currently-reading')}
                              style={{
                                display: 'block',
                                width: '100%',
                                padding: '8px 12px',
                                border: 'none',
                                background: 'white',
                                textAlign: 'left',
                                cursor: 'pointer'
                              }}
                            >
                              Currently Reading
                            </button>
                            <button
                              onClick={() => handleAddToReadingList(book.id, 'finished')}
                              style={{
                                display: 'block',
                                width: '100%',
                                padding: '8px 12px',
                                border: 'none',
                                background: 'white',
                                textAlign: 'left',
                                cursor: 'pointer'
                              }}
                            >
                              Finished
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BookList;
