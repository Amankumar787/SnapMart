import { configureStore } from "@reduxjs/toolkit";
import authReducer    from "./slices/authSlice";
import cartReducer    from "./slices/cartSlice";
import productReducer from "./slices/productSlice";
import orderReducer   from "./slices/orderSlice";
import wishlistReducer from "./slices/wishlistSlice";

const store = configureStore({
  reducer: {
    auth:     authReducer,
    cart:     cartReducer,
    products: productReducer,
    orders:   orderReducer,
    wishlist: wishlistReducer,
  },
});

export default store;