import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from './authService';

// Attempt to get the user from localStorage. This persists the session across browser refreshes.
const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
  user: user ? user : null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

// Async thunk for user registration
export const register = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    try {
      return await authService.register(userData);
    } catch (error) {
      const message = error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Async thunk for user login
export const login = createAsyncThunk('auth/login', async (userData, thunkAPI) => {
  try {
    return await authService.login(userData);
  } catch (error) {
    const message = error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

// Action for user logout
export const logout = createAsyncThunk('auth/logout', async () => {
  // This is an async thunk, but the operation itself is synchronous.
  // It removes the user data from browser's persistent storage.
  localStorage.removeItem('user');
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  // Standard reducers for synchronous state changes
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  // Extra reducers for handling the state changes from our async thunks
  extraReducers: (builder) => {
    builder
      // Register cases
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      // Login cases
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      // Logout case
      .addCase(logout.fulfilled, (state) => {
        // When logout is successful, we clear the user from our state.
        state.user = null;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;