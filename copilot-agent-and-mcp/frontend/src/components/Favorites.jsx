import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchFavorites, clearAllFavorites } from '../store/favoritesSlice';
import { useNavigate } from 'react-router-dom';

const Favorites = () => {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector(state => state.favorites.items);
  const status = useAppSelector(state => state.favorites.status);
  const error = useAppSelector(state => state.favorites.error);
  const token = useAppSelector(state => state.user.token);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }
    dispatch(fetchFavorites(token));
  }, [dispatch, token, navigate]);

  // generated-by-copilot: Handle clearing all favorites with confirmation dialog
  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to remove all favorite books?')) {
      dispatch(clearAllFavorites(token));
    }
  };

  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'failed') return <div>Failed to load favorites.</div>;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h2 style={{ margin: 0 }}>My Favorite Books</h2>
        {favorites.length > 0 && (
          <button
            data-testid="clear-all-favorites"
            onClick={handleClearAll}
            style={{
              background: '#e53e3e',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              padding: '0.5rem 1.2rem',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Clear All
          </button>
        )}
      </div>
      {error && <div style={{ color: '#e53e3e', marginBottom: '0.5rem' }}>{error}</div>}
      {favorites.length === 0 ? (
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
          <p>No favorite books yet.</p>
          <p>
            Go to the <a href="/books" onClick={e => { e.preventDefault(); navigate('/books'); }}>book list</a> to add some!
          </p>
        </div>
      ) : (
        <ul>
          {favorites.map(book => (
            <li key={book.id}>
              <strong>{book.title}</strong> by {book.author}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Favorites;
