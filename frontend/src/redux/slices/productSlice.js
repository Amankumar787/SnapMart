import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import productService from "../../services/productService";

export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (params, { rejectWithValue }) => {
    try {
      const data = await productService.getProducts(params);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch products");
    }
  }
);

export const fetchProduct = createAsyncThunk(
  "products/fetchOne",
  async (id, { rejectWithValue }) => {
    try {
      const data = await productService.getProduct(id);
      return data.data.product;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch product");
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: { products: [], product: null, loading: false, error: null, pagination: {} },
  reducers: {
    clearProduct: (state) => { state.product = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending,   (state) => { state.loading = true; state.error = null; })
      .addCase(fetchProducts.fulfilled, (state, action) => { state.loading = false; state.products = action.payload.products; state.pagination = action.payload.pagination; })
      .addCase(fetchProducts.rejected,  (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchProduct.pending,    (state) => { state.loading = true; state.error = null; })
      .addCase(fetchProduct.fulfilled,  (state, action) => { state.loading = false; state.product = action.payload; })
      .addCase(fetchProduct.rejected,   (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { clearProduct } = productSlice.actions;
export default productSlice.reducer;