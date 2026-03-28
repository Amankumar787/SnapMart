import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import cartService from "../../services/cartService";

export const fetchCart = createAsyncThunk("cart/fetch", async (_, { rejectWithValue }) => {
  try {
    const data = await cartService.getCart();
    return data.data.cart;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch cart");
  }
});

export const addToCart = createAsyncThunk("cart/add", async ({ productId, quantity }, { rejectWithValue }) => {
  try {
    const data = await cartService.addToCart(productId, quantity);
    return data.data.cart;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to add to cart");
  }
});

export const removeFromCart = createAsyncThunk("cart/remove", async (itemId, { rejectWithValue }) => {
  try {
    const data = await cartService.removeFromCart(itemId);
    return data.data.cart;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to remove from cart");
  }
});

export const updateCartItem = createAsyncThunk("cart/update", async ({ itemId, quantity }, { rejectWithValue }) => {
  try {
    const data = await cartService.updateCartItem(itemId, quantity);
    return data.data.cart;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to update cart");
  }
});

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [], totalPrice: 0, loading: false, error: null },
  reducers: {
    clearCart: (state) => { state.items = []; state.totalPrice = 0; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending,        (state) => { state.loading = true; })
      .addCase(fetchCart.fulfilled,      (state, action) => { state.loading = false; state.items = action.payload?.items || []; state.totalPrice = action.payload?.totalPrice || 0; })
      .addCase(fetchCart.rejected,       (state) => { state.loading = false; })
      .addCase(addToCart.fulfilled,      (state, action) => { state.items = action.payload?.items || []; state.totalPrice = action.payload?.totalPrice || 0; })
      .addCase(removeFromCart.fulfilled, (state, action) => { state.items = action.payload?.items || []; state.totalPrice = action.payload?.totalPrice || 0; })
      .addCase(updateCartItem.fulfilled, (state, action) => { state.items = action.payload?.items || []; state.totalPrice = action.payload?.totalPrice || 0; });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;