import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchReadingList,
  updateReadingStatus,
  removeFromReadingList,
  selectWantToRead,
  selectCurrentlyReading,
  selectFinishedBooks,
  selectReadingListStatus,
  selectReadingListError,
  clearError
} from '../store/readingListSlice';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/BookList.module.css';
import ReadingStats from './ReadingStats';

const ReadingList = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const token = useAppSelector(state => state.user.token);
  
  // generated-by-copilot: Reading list data by status
  const wantToRead = useAppSelector(selectWantToRead);
  const currentlyReading = useAppSelector(selectCurrentlyReading);
  const finishedBooks = useAppSelector(selectFinishedBooks);
  
  const status = useAppSelector(selectReadingListStatus);
  const error = useAppSelector(selectReadingListError);
  
  // generated-by-copilot: Active tab state
  const [activeTab, setActiveTab] = useState('currently-reading');

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }
    dispatch(fetchReadingList(token));
  }, [dispatch, token, navigate]);

  // generated-by-copilot: Clear error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // generated-by-copilot: Handle status change
  const handleStatusChange = async (bookId, newStatus) => {
    if (!token) return;
    await dispatch(updateReadingStatus({ token, bookId, status: newStatus }));
    dispatch(fetchReadingList(token)); // Refresh the list
  };

  // generated-by-copilot: Handle remove from reading list
  const handleRemoveFromList = async (bookId) => {
    if (!token) return;
    await dispatch(removeFromReadingList({ token, bookId }));
  };

  // generated-by-copilot: Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  // generated-by-copilot: Get current books based on active tab
  const getCurrentBooks = () => {
    switch (activeTab) {
      case 'want-to-read':
        return wantToRead;
      case 'currently-reading':
        return currentlyReading;
      case 'finished':
        return finishedBooks;
      default:
        return [];
    }
  };

  const currentBooks = getCurrentBooks();

  // generated-by-copilot: Render book card with status-specific actions
  const renderBookCard = (book) => {
    return (
      <div key={book.id} className={styles.bookCard}>
        <div className={styles.bookTitle}>{book.title}</div>
        <div className={styles.bookAuthor}>by {book.author}</div>
        
        {/* generated-by-copilot: Display dates */}
        <div style={{ fontSize: '0.8em', color: '#666', margin: '8px 0' }}>
          Added: {formatDate(book.dateAdded)}
          {book.dateFinished && (
            <><br />Finished: {formatDate(book.dateFinished)}</>
          )}
        </div>
        
        {/* generated-by-copilot: Status-specific action buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {book.readingStatus === 'want-to-read' && (
            <>
              <button 
                className={styles.simpleBtn}
                onClick={() => handleStatusChange(book.id, 'currently-reading')}
              >
                Start Reading
              </button>
              <button 
                className={styles.simpleBtn}
                onClick={() => handleStatusChange(book.id, 'finished')}
                style={{ backgroundColor: '#28a745' }}
              >
                Mark as Finished
              </button>
            </>
          )}
          
          {book.readingStatus === 'currently-reading' && (
            <>
              <button 
                className={styles.simpleBtn}
                onClick={() => handleStatusChange(book.id, 'finished')}
                style={{ backgroundColor: '#28a745' }}
              >
                Mark as Finished
              </button>
              <button 
                className={styles.simpleBtn}
                onClick={() => handleStatusChange(book.id, 'want-to-read')}
                style={{ backgroundColor: '#6c757d' }}
              >
                Back to Want to Read
              </button>
            </>
          )}
          
          {book.readingStatus === 'finished' && (
            <>
              <button 
                className={styles.simpleBtn}
                onClick={() => handleStatusChange(book.id, 'currently-reading')}
                style={{ backgroundColor: '#17a2b8' }}
              >
                Read Again
              </button>
              <button 
                className={styles.simpleBtn}
                onClick={() => handleStatusChange(book.id, 'want-to-read')}
                style={{ backgroundColor: '#6c757d' }}
              >
                Move to Want to Read
              </button>
            </>
          )}
          
          {/* generated-by-copilot: Remove button for all statuses */}
          <button 
            className={styles.simpleBtn}
            onClick={() => handleRemoveFromList(book.id)}
            style={{ backgroundColor: '#dc3545' }}
          >
            Remove from List
          </button>
        </div>
      </div>
    );
  };

  if (status === 'loading') return <div>Loading your reading list...</div>;

  return (
    <div>
      <h2>My Reading List</h2>
      
      {/* generated-by-copilot: Reading statistics */}
      <ReadingStats />
      
      {/* generated-by-copilot: Error display */}
      {error && (
        <div style={{ 
          background: '#f8d7da', 
          color: '#721c24', 
          padding: '12px', 
          borderRadius: '4px', 
          margin: '16px 0' 
        }}>
          {error}
        </div>
      )}
      
      {/* generated-by-copilot: Tab navigation */}
      <div style={{ 
        display: 'flex', 
        borderBottom: '2px solid #dee2e6', 
        marginBottom: '24px',
        gap: '0'
      }}>
        {[
          { key: 'want-to-read', label: `Want to Read (${wantToRead.length})` },
          { key: 'currently-reading', label: `Currently Reading (${currentlyReading.length})` },
          { key: 'finished', label: `Finished (${finishedBooks.length})` }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '12px 20px',
              border: 'none',
              borderBottom: activeTab === tab.key ? '3px solid #007bff' : '3px solid transparent',
              background: activeTab === tab.key ? '#f8f9fa' : 'transparent',
              cursor: 'pointer',
              fontWeight: activeTab === tab.key ? 'bold' : 'normal',
              color: activeTab === tab.key ? '#007bff' : '#495057',
              transition: 'all 0.2s'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* generated-by-copilot: Books display */}
      {currentBooks.length === 0 ? (
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
          <p>No books in this category yet.</p>
          <p>Visit the <a href="/books" style={{ color: '#007bff' }}>Books page</a> to add some books to your reading list!</p>
        </div>
      ) : (
        <div className={styles.bookGrid}>
          {currentBooks.map(renderBookCard)}
        </div>
      )}
    </div>
  );
};

export default ReadingList;