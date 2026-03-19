import React from 'react';
import { useAppSelector } from '../store/hooks';
import { 
  selectWantToRead, 
  selectCurrentlyReading, 
  selectFinishedBooks 
} from '../store/readingListSlice';

const ReadingStats = () => {
  const wantToRead = useAppSelector(selectWantToRead);
  const currentlyReading = useAppSelector(selectCurrentlyReading);
  const finishedBooks = useAppSelector(selectFinishedBooks);

  // generated-by-copilot: Calculate this year's reading progress
  const currentYear = new Date().getFullYear();
  const booksFinishedThisYear = finishedBooks.filter(book => {
    if (!book.dateFinished) return false;
    return new Date(book.dateFinished).getFullYear() === currentYear;
  }).length;

  // generated-by-copilot: Calculate reading goal progress (assuming 12 books per year)
  const yearlyGoal = 12;
  const goalProgress = Math.min((booksFinishedThisYear / yearlyGoal) * 100, 100);

  // generated-by-copilot: Calculate average reading time (simplified estimation)
  const avgBooksPerMonth = booksFinishedThisYear / (new Date().getMonth() + 1);

  // generated-by-copilot: Get recent finished books (last 5)
  const recentFinished = finishedBooks
    .sort((a, b) => new Date(b.dateFinished) - new Date(a.dateFinished))
    .slice(0, 5);

  return (
    <div style={{
      background: '#f8f9fa',
      padding: '20px',
      borderRadius: '8px',
      margin: '20px 0'
    }}>
      <h3 style={{ margin: '0 0 16px 0', color: '#495057' }}>📊 Reading Statistics</h3>
      
      {/* generated-by-copilot: Main stats grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '16px',
        marginBottom: '20px'
      }}>
        <div style={{
          background: 'white',
          padding: '16px',
          borderRadius: '6px',
          textAlign: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>
            {wantToRead.length}
          </div>
          <div style={{ fontSize: '14px', color: '#6c757d' }}>Want to Read</div>
        </div>
        
        <div style={{
          background: 'white',
          padding: '16px',
          borderRadius: '6px',
          textAlign: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#17a2b8' }}>
            {currentlyReading.length}
          </div>
          <div style={{ fontSize: '14px', color: '#6c757d' }}>Currently Reading</div>
        </div>
        
        <div style={{
          background: 'white',
          padding: '16px',
          borderRadius: '6px',
          textAlign: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
            {booksFinishedThisYear}
          </div>
          <div style={{ fontSize: '14px', color: '#6c757d' }}>Books This Year</div>
        </div>
        
        <div style={{
          background: 'white',
          padding: '16px',
          borderRadius: '6px',
          textAlign: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fd7e14' }}>
            {avgBooksPerMonth.toFixed(1)}
          </div>
          <div style={{ fontSize: '14px', color: '#6c757d' }}>Books/Month Avg</div>
        </div>
      </div>
      
      {/* generated-by-copilot: Reading goal progress */}
      <div style={{
        background: 'white',
        padding: '16px',
        borderRadius: '6px',
        marginBottom: '16px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px'
        }}>
          <span style={{ fontWeight: 'bold' }}>📚 {currentYear} Reading Goal</span>
          <span style={{ color: '#6c757d' }}>
            {booksFinishedThisYear} / {yearlyGoal} books
          </span>
        </div>
        
        <div style={{
          width: '100%',
          height: '8px',
          backgroundColor: '#e9ecef',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${goalProgress}%`,
            height: '100%',
            backgroundColor: goalProgress >= 100 ? '#28a745' : '#007bff',
            transition: 'width 0.3s ease'
          }}></div>
        </div>
        
        <div style={{ fontSize: '12px', color: '#6c757d', marginTop: '4px' }}>
          {goalProgress.toFixed(0)}% complete
          {goalProgress >= 100 && ' 🎉 Goal achieved!'}
        </div>
      </div>
      
      {/* generated-by-copilot: Recent finished books */}
      {recentFinished.length > 0 && (
        <div style={{
          background: 'white',
          padding: '16px',
          borderRadius: '6px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '12px' }}>🏆 Recently Finished</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {recentFinished.map(book => (
              <div key={book.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px',
                backgroundColor: '#f8f9fa',
                borderRadius: '4px'
              }}>
                <div>
                  <div style={{ fontWeight: '500', fontSize: '14px' }}>{book.title}</div>
                  <div style={{ fontSize: '12px', color: '#6c757d' }}>by {book.author}</div>
                </div>
                <div style={{ fontSize: '12px', color: '#6c757d' }}>
                  {book.dateFinished && new Date(book.dateFinished).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadingStats;