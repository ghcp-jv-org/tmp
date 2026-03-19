import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// generated-by-copilot: Updated to use /api/v1/reading-lists and handle paginated response
export const fetchReadingList = createAsyncThunk(
  'readingList/fetchReadingList',
  async (token, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:4000/api/v1/reading-lists', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to fetch reading list');
      }
      
      const data = await response.json();
      // generated-by-copilot: Handle paginated response format
      return data.data || data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// generated-by-copilot: Updated to use new endpoint and error handling
export const addToReadingList = createAsyncThunk(
  'readingList/addToReadingList',
  async ({ token, bookId, status }, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:4000/api/v1/reading-lists', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ bookId, status })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to add book to reading list');
      }
      
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// generated-by-copilot: Updated to use new endpoint and error handling
export const updateReadingStatus = createAsyncThunk(
  'readingList/updateReadingStatus',
  async ({ token, bookId, status }, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:4000/api/v1/reading-lists/${bookId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to update reading status');
      }
      
      const result = await response.json();
      return { bookId, status, ...result };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// generated-by-copilot: Updated to use new endpoint and handle 204 response
export const removeFromReadingList = createAsyncThunk(
  'readingList/removeFromReadingList',
  async ({ token, bookId }, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:4000/api/v1/reading-lists/${bookId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to remove book from reading list');
      }
      
      // generated-by-copilot: Handle 204 No Content response
      return { bookId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// generated-by-copilot: Initial state
const initialState = {
  items: [],
  status: 'idle', // idle, loading, succeeded, failed
  error: null
};

// generated-by-copilot: Reading list slice
const readingListSlice = createSlice({
  name: 'readingList',
  initialState,
  reducers: {
    // generated-by-copilot: Clear reading list state
    clearReadingList: (state) => {
      state.items = [];
      state.status = 'idle';
      state.error = null;
    },
    // generated-by-copilot: Clear error state
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // generated-by-copilot: Fetch reading list cases
      .addCase(fetchReadingList.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchReadingList.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchReadingList.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // generated-by-copilot: Add to reading list cases
      .addCase(addToReadingList.pending, (state) => {
        state.error = null;
      })
      .addCase(addToReadingList.fulfilled, (state, action) => {
        // generated-by-copilot: Add new book to local state
        if (action.payload.book) {
          state.items.push(action.payload.book);
        }
      })
      .addCase(addToReadingList.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // generated-by-copilot: Update reading status cases
      .addCase(updateReadingStatus.pending, (state) => {
        state.error = null;
      })
      .addCase(updateReadingStatus.fulfilled, (state, action) => {
        // generated-by-copilot: Update book status in local state
        const { bookId, status } = action.payload;
        const bookIndex = state.items.findIndex(item => String(item.id) === String(bookId));
        if (bookIndex !== -1) {
          state.items[bookIndex].readingStatus = status;
          // generated-by-copilot: Update dateFinished
          if (status === 'finished') {
            state.items[bookIndex].dateFinished = new Date().toISOString();
          } else {
            state.items[bookIndex].dateFinished = null;
          }
        }
      })
      .addCase(updateReadingStatus.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // generated-by-copilot: Remove from reading list cases
      .addCase(removeFromReadingList.pending, (state) => {
        state.error = null;
      })
      .addCase(removeFromReadingList.fulfilled, (state, action) => {
        // generated-by-copilot: Remove book from local state
        const { bookId } = action.payload;
        state.items = state.items.filter(item => String(item.id) !== String(bookId));
      })
      .addCase(removeFromReadingList.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

// generated-by-copilot: Export actions and reducer
export const { clearReadingList, clearError } = readingListSlice.actions;
export default readingListSlice.reducer;

// generated-by-copilot: Selectors
export const selectReadingListItems = (state) => state.readingList.items;
export const selectReadingListStatus = (state) => state.readingList.status;
export const selectReadingListError = (state) => state.readingList.error;

// generated-by-copilot: Status-specific selectors
export const selectWantToRead = (state) => 
  state.readingList.items.filter(book => book.readingStatus === 'want-to-read');

export const selectCurrentlyReading = (state) => 
  state.readingList.items.filter(book => book.readingStatus === 'currently-reading');

export const selectFinishedBooks = (state) => 
  state.readingList.items.filter(book => book.readingStatus === 'finished');

// generated-by-copilot: Selector to check if a book is in reading list
export const selectIsBookInReadingList = (state, bookId) => 
  state.readingList.items.some(book => book.id === bookId);

// generated-by-copilot: Selector to get reading status of a specific book
export const selectBookReadingStatus = (state, bookId) => {
  const book = state.readingList.items.find(book => book.id === bookId);
  return book ? book.readingStatus : null;
};