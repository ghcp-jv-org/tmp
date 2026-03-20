import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// generated-by-copilot: Updated to support sort parameters for book list sorting
export const fetchBooks = createAsyncThunk('books/fetchBooks', async (sortParams = {}) => {
  const { field = 'title', direction = 'asc' } = sortParams;
  const sortQuery = direction === 'desc' ? `-${field}` : field;
  const res = await fetch(`http://localhost:4000/api/v1/books?sort=${sortQuery}`);
  const data = await res.json();
  // generated-by-copilot: Handle paginated response format
  return data.data || data; // Use data.data for paginated response, fallback to data for backward compatibility
});

const booksSlice = createSlice({
  name: 'books',
  initialState: { items: [], status: 'idle', sortField: 'title', sortDirection: 'asc' },
  reducers: {
    // generated-by-copilot: Set sort field and direction, maintains sort state across navigation
    setSortBy: (state, action) => {
      state.sortField = action.payload.field;
      state.sortDirection = action.payload.direction;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchBooks.pending, state => { state.status = 'loading'; })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchBooks.rejected, state => { state.status = 'failed'; });
  },
});

export const { setSortBy } = booksSlice.actions;
export default booksSlice.reducer;
