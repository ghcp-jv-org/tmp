import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// generated-by-copilot: Fetch all reviews for a specific book
export const fetchReviews = createAsyncThunk(
  'reviews/fetchReviews',
  async (bookId, { rejectWithValue }) => {
    try {
      const res = await fetch(`http://localhost:4000/api/v1/reviews/${bookId}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error?.message || 'Failed to fetch reviews');
      }
      const data = await res.json();
      return { bookId: String(bookId), reviews: data.data || [] };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// generated-by-copilot: Submit a review for a book (auth required)
export const submitReview = createAsyncThunk(
  'reviews/submitReview',
  async ({ token, bookId, rating, reviewText }, { rejectWithValue }) => {
    try {
      const res = await fetch('http://localhost:4000/api/v1/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bookId, rating, reviewText }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error?.message || 'Failed to submit review');
      }
      const data = await res.json();
      return { bookId: String(bookId), review: data.review };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const reviewsSlice = createSlice({
  name: 'reviews',
  // generated-by-copilot: byBookId maps bookId -> { items, status, error }
  initialState: { byBookId: {}, submitStatus: 'idle', submitError: null },
  reducers: {
    clearSubmitError: (state) => {
      state.submitError = null;
      state.submitStatus = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state, action) => {
        const bookId = action.meta.arg;
        state.byBookId[bookId] = { items: [], status: 'loading', error: null };
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        const { bookId, reviews } = action.payload;
        state.byBookId[bookId] = { items: reviews, status: 'succeeded', error: null };
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        const bookId = action.meta.arg;
        state.byBookId[bookId] = { items: [], status: 'failed', error: action.payload };
      })
      .addCase(submitReview.pending, (state) => {
        state.submitStatus = 'loading';
        state.submitError = null;
      })
      .addCase(submitReview.fulfilled, (state, action) => {
        const { bookId, review } = action.payload;
        state.submitStatus = 'succeeded';
        if (!state.byBookId[bookId]) {
          state.byBookId[bookId] = { items: [], status: 'succeeded', error: null };
        }
        state.byBookId[bookId].items.push(review);
      })
      .addCase(submitReview.rejected, (state, action) => {
        state.submitStatus = 'failed';
        state.submitError = action.payload;
      });
  },
});

export const { clearSubmitError } = reviewsSlice.actions;
export default reviewsSlice.reducer;
