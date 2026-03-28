import { createSlice } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: { items: [] },
  reducers: {
    setWishlist:       (state, action) => { state.items = action.payload; },
    addToWishlist:     (state, action) => { state.items.push(action.payload); },
    removeFromWishlist:(state, action) => { state.items = state.items.filter((id) => id !== action.payload); },
  },
});

export const { setWishlist, addToWishlist, removeFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;