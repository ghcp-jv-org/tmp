import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// generated-by-copilot: Updated to use /api/v1 versioning and handle paginated response
export const fetchBooks = createAsyncThunk('books/fetchBooks', async () => {
  const res = await fetch('http://localhost:4000/api/v1/books');
  const data = await res.json();
  // generated-by-copilot: Handle paginated response format
  return data.data || data; // Use data.data for paginated response, fallback to data for backward compatibility
});

const booksSlice = createSlice({
  name: 'books',
  initialState: { items: [], status: 'idle' },
  reducers: {},
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

export default booksSlice.reducer;
