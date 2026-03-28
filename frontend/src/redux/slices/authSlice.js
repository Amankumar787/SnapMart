import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../services/authService";

// Register
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const data = await authService.register(userData);
      localStorage.setItem("accessToken", data.data.accessToken);
      localStorage.setItem("refreshToken", data.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.data.user));
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Registration failed");
    }
  }
);

// Login
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await authService.login(credentials);
      localStorage.setItem("accessToken", data.data.accessToken);
      localStorage.setItem("refreshToken", data.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.data.user));
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

// Logout
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Logout failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user:    JSON.parse(localStorage.getItem("user")) || null,
    token:   localStorage.getItem("accessToken") || null,
    loading: false,
    error:   null,
  },
  reducers: {
    clearError: (state) => { state.error = null; },
    clearUser: (state) => { state.user = null; state.token = null; },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending,   (state) => { state.loading = true;  state.error = null; })
      .addCase(registerUser.fulfilled, (state, action) => { state.loading = false; state.user = action.payload.user; state.token = action.payload.accessToken; })
      .addCase(registerUser.rejected,  (state, action) => { state.loading = false; state.error = action.payload; })
      // Login
      .addCase(loginUser.pending,      (state) => { state.loading = true;  state.error = null; })
      .addCase(loginUser.fulfilled,    (state, action) => { state.loading = false; state.user = action.payload.user; state.token = action.payload.accessToken; })
      .addCase(loginUser.rejected,     (state, action) => { state.loading = false; state.error = action.payload; })
      // Logout
      .addCase(logoutUser.fulfilled,   (state) => { state.user = null; state.token = null; });
  },
});

export const { clearError, clearUser } = authSlice.actions;
export default authSlice.reducer;