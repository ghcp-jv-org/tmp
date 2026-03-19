import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// generated-by-copilot: Updated to use /api/v1 versioning and handle paginated response
export const fetchFavorites = createAsyncThunk('favorites/fetchFavorites', async (token, { rejectWithValue }) => {
  try {
    const res = await fetch('http://localhost:4000/api/v1/favorites', {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error?.message || 'Failed to fetch favorites');
    }
    
    const data = await res.json();
    // generated-by-copilot: Handle paginated response format
    return data.data || data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// generated-by-copilot: clearAllFavorites - DELETE all favorites for the authenticated user
export const clearAllFavorites = createAsyncThunk('favorites/clearAllFavorites', async (token, { rejectWithValue }) => {
  try {
    const res = await fetch('http://localhost:4000/api/v1/favorites', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error?.message || 'Failed to clear favorites');
    }
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// generated-by-copilot: Updated to handle new error response format
export const addFavorite = createAsyncThunk('favorites/addFavorite', async ({ token, bookId }, { rejectWithValue }) => {
  try {
    const res = await fetch('http://localhost:4000/api/v1/favorites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ bookId }),
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error?.message || 'Failed to add favorite');
    }
    
    return bookId;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // generated-by-copilot: Synchronously clear favorites items from state
    clearFavorites: (state) => {
      state.items = [];
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchFavorites.pending, state => { 
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => { 
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addFavorite.pending, (state) => {
        state.error = null;
      })
      .addCase(addFavorite.fulfilled, (state) => {
        // After adding, the list will be refreshed by fetchFavorites
      })
      .addCase(addFavorite.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(clearAllFavorites.pending, (state) => {
        state.error = null;
      })
      .addCase(clearAllFavorites.fulfilled, (state) => {
        state.items = [];
      })
      .addCase(clearAllFavorites.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError, clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
