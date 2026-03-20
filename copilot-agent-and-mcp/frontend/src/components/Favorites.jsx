import React, { useEffect, useState } from 'react';
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
  // generated-by-copilot: Track confirmation dialog visibility
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }
    dispatch(fetchFavorites(token));
  }, [dispatch, token, navigate]);

  // generated-by-copilot: Show custom confirmation dialog before clearing all favorites
  const handleClearAll = () => {
    setShowConfirm(true);
  };

  const handleConfirmClear = () => {
    dispatch(clearAllFavorites(token));
    setShowConfirm(false);
  };

  const handleCancelClear = () => {
    setShowConfirm(false);
  };

  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'failed') return <div>Failed to load favorites.{error && ` ${error}`}</div>;

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
        <div>
          <ul>
            {favorites.map(book => (
              <li key={book.id}>
                <strong>{book.title}</strong> by {book.author}
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* generated-by-copilot: Confirmation dialog overlay */}
      {showConfirm && (
        <div
          data-testid="confirm-dialog"
          style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          }}
        >
          <div style={{
            background: '#fff', padding: '2rem', borderRadius: '8px', maxWidth: '380px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.18)', textAlign: 'center',
          }}>
            <p style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>
              Are you sure you want to clear all your favorite books? This action cannot be undone.
            </p>
            <button
              data-testid="confirm-clear-btn"
              onClick={handleConfirmClear}
              style={{ marginRight: '1rem', background: '#e53935', color: '#fff', border: 'none', padding: '0.5rem 1.2rem', borderRadius: '4px', cursor: 'pointer' }}
            >
              Yes, Clear All
            </button>
            <button
              data-testid="cancel-clear-btn"
              onClick={handleCancelClear}
              style={{ background: '#eee', color: '#333', border: 'none', padding: '0.5rem 1.2rem', borderRadius: '4px', cursor: 'pointer' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Favorites;
