import api from "./api";

const adminService = {
  // Products
  getProducts:   async (params) => { const { data } = await api.get("/products", { params }); return data; },
  createProduct: async (productData) => { const { data } = await api.post("/products", productData); return data; },
  updateProduct: async (id, productData) => { const { data } = await api.put(`/products/${id}`, productData); return data; },
  deleteProduct: async (id) => { const { data } = await api.delete(`/products/${id}`); return data; },

  // Orders
  getAllOrders:      async (params) => { const { data } = await api.get("/orders", { params }); return data; },
  updateOrderStatus: async (id, status) => { const { data } = await api.put(`/orders/${id}/status`, { status }); return data; },

  // Users
  getAllUsers: async () => { const { data } = await api.get("/users"); return data; },

  // Coupons
  getCoupons:    async () => { const { data } = await api.get("/coupons"); return data; },
  createCoupon:  async (couponData) => { const { data } = await api.post("/coupons", couponData); return data; },
  deleteCoupon:  async (id) => { const { data } = await api.delete(`/coupons/${id}`); return data; },
};

export default adminService;