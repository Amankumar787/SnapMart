import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import orderService from "../../services/orderService";

export const fetchMyOrders = createAsyncThunk("orders/fetchMy", async (_, { rejectWithValue }) => {
  try {
    const data = await orderService.getMyOrders();
    return data.data.orders;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch orders");
  }
});

export const fetchOrder = createAsyncThunk("orders/fetchOne", async (id, { rejectWithValue }) => {
  try {
    const data = await orderService.getOrder(id);
    return data.data.order;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch order");
  }
});

export const createOrder = createAsyncThunk("orders/create", async (orderData, { rejectWithValue }) => {
  try {
    const data = await orderService.createOrder(orderData);
    return data.data.order;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to create order");
  }
});

const orderSlice = createSlice({
  name: "orders",
  initialState: { orders: [], order: null, loading: false, error: null },
  reducers: {
    clearOrder: (state) => { state.order = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyOrders.pending,   (state) => { state.loading = true; })
      .addCase(fetchMyOrders.fulfilled, (state, action) => { state.loading = false; state.orders = action.payload; })
      .addCase(fetchMyOrders.rejected,  (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchOrder.fulfilled,    (state, action) => { state.order = action.payload; })
      .addCase(createOrder.pending,     (state) => { state.loading = true; })
      .addCase(createOrder.fulfilled,   (state, action) => { state.loading = false; state.order = action.payload; })
      .addCase(createOrder.rejected,    (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;